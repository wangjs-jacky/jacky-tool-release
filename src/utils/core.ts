import cp from "child_process";
import ora from "ora";

const basicCatchError = (err) => {
  console.log("发布失败，失败原因\n", err);
};

interface OptsType {
  ctx?: Record<"string", any>;
  cachError?: (err: Error) => boolean;
}

const { execSync, exec } = cp;

/* export function compose(middleware, opts: OptsType = {}) {
  let { ctx = {}, cachError = basicCatchError } = opts;

  function dispatch(index, ctx) {
    const curMiddleware = middleware[index];
    const next = (addOptions) => {
      dispatch(index + 1, { ...ctx, ...addOptions });
    };
    return Promise.resolve(curMiddleware(next, ctx)).catch(cachError);
  }
  dispatch(0, ctx);
} */

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

export const runSync = (command: stirng, isShowSpin = false) => {
  let spinner;
  if (isShowSpin) {
    spinner = ora(`开启执行 ${command} 命令`).start();
  }

  try {
    return execSync(command, { cwd: process.cwd(), encoding: "utf-8" });
  } catch (error) {
    console.log("error", error);
    spinner?.fail("task fail");
  }

  spinner?.stop();
};

export const runAsync = async (command: stirng, isShowSpin = false) => {
  let spinner;
  let res;
  if (isShowSpin) {
    spinner = ora(`开启执行 ${command} 命令`).start();
  }

  try {
    res = await exec(command, { cwd: process.cwd(), encoding: "utf-8" });
  } catch (error) {
    console.log("error", error);
    spinner?.fail("task fail");
  }
  spinner?.stop();
  return res;
};
