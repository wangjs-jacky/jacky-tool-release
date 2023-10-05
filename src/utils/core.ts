import cp from "child_process";
import ora, { promise } from "ora";
import { failCallbacks } from "./AsyncSeriresHook";
import { info } from "./info";
const { execSync } = cp;

const util = require("util");
const exec = util.promisify(cp.exec);

const basicCatchError = (err) => {
  console.log("发布失败，失败原因\n", err);
  failCallbacks.promise().then(() => console.log("clean"));
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

export const runAsync = async (command: stirng, isShowLog = false) => {
  const log = isShowLog ? console.log : () => {};

  try {
    log(info.info("\t执行命令:"), info.warning(command));
    const { stdout, stderr } = await exec(command, {
      cwd: process.cwd(),
      encoding: "utf-8",
    });
    return {
      stdout,
      stderr,
    };
  } catch (error) {
    console.log("error\n", error);
  }
};
