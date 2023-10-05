import cp from "child_process";
import { failCallbacks } from "./AsyncSeriresHook";
import { info } from "./info";
import ora from "ora";
const { execSync, exec } = cp;

/* const util = require("util");
const exec = util.promisify(cp.exec); */

const basicCatchError = async (err) => {
  const spinner = ora(info.error("发布失败，失败原因:" + err)).start();
  await failCallbacks.promise().then(() => {
    spinner.fail();
  });
};

interface OptsType {
  ctx?: Record<"string", any>;
  cachError?: (err: Error) => boolean;
}

export function compose(middleware, opts: OptsType = {}) {
  let { ctx = {}, cachError = basicCatchError } = opts;

  const ctxRef = { current: ctx };

  function dispatch(index) {
    if (index === middleware.length) return;
    const curMiddleware = middleware[index];
    // 构造延时执行函数
    const next = (addOptions) => {
      ctxRef.current = { ...ctxRef.current, ...addOptions };
      dispatch(index + 1);
    };
    return Promise.resolve(curMiddleware(next, ctxRef)).catch(cachError);
  }
  dispatch(0);
}

export const runSync = (command: stirng, isShowLog = false) => {
  const log = isShowLog ? console.log : () => {};
  try {
    log(info.info("\t执行命令:"), info.warning(command));
    return execSync(command, { cwd: process.cwd(), encoding: "utf-8" });
  } catch (error) {}
};

export const runAsync = (command: stirng, isShowLog = false, spinner?) => {
  const log = isShowLog ? console.log : () => {};
  log(info.info("\t执行命令:"), info.warning(command));

  return new Promise((resolve, reject) => {
    exec(
      command,
      {
        cwd: process.cwd(),
        encoding: "utf-8",
      },
      (error, stdout, stderr) => {
        if (error) {
          spinner?.fail();
          reject(error);
          return;
        }
        resolve({
          stdout,
          stderr,
        });

        console.log(stdout, stderr);
      },
    );
  });

  /* try {
    await 
  } catch (error) {
    console.log("error\n", error);
    spinner?.fail();
    return;
  } */
};
