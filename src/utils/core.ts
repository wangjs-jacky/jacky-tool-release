import cp from "child_process";
import ora, { promise } from "ora";
import { failCallbacks } from "./AsyncSeriresHook";
const { execSync } = cp;

const util = require("util");
const exec = util.promisify(cp.exec);

const basicCatchError = (err) => {
  console.log("发布失败，失败原因\n", err);
};

interface OptsType {
  ctx?: Record<"string", any>;
  cachError?: (err: Error) => boolean;
}

export function compose(middleware, opts: OptsType = {}) {
  let { ctx = {}, cachError = basicCatchError } = opts;

  const ctxRef = { current: ctx };

  function dispatch(index) {
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

export const runSync = (command: stirng) => {
  try {
    return execSync(command, { cwd: process.cwd(), encoding: "utf-8" });
  } catch (error) {}
};

export const runAsync = async (command: stirng, isShowSpin = false) => {
  let spinner;

  if (isShowSpin) {
    spinner = ora(`开启执行 ${command} 命令`).start();
  }

  try {
    const { stdout, stderr } = await exec(command, {
      cwd: process.cwd(),
      encoding: "utf-8",
    });
    return {
      stdout,
      stderr,
    };
  } catch (error) {
    console.log("error", error);
    spinner?.fail("task fail");
  }

  spinner?.stop();
};
