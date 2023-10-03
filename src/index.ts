/* 内置 middleware */

import { currentVersion, getOriginPackageJson } from "./steps/packageJson";
import { selectNextVersion } from "./steps/selectNextVersion";
import { updateVersion } from "./steps/updateVersion";
import { compose } from "./utils/core";

/**
 * 注入全局所需读取的静态资源信息，如 package.json 内容
 */
const env = (next, ctx) => {
  const originPackageJson = getOriginPackageJson();

  process.on("SIGINT", function () {
    console.log("收到 SIGINT 信号，准备退出...");
    console.log("aaa", ctx);

    // 在这里执行清理操作或其他逻辑
    process.exit(0);
  });

  next({
    originVersion: currentVersion,
    originPackageJson: originPackageJson,
  });
};

const getNextVersion = async (next, ctx) => {
  const nextVersion = await selectNextVersion();
  ctx["abc"] = 123;
  console.log("ctx", ctx);

  next({
    nextVersion,
  });
};

const _updateVersion = async (next, ctx) => {
  const backVersionFn = await updateVersion(
    ctx.nextVersion,
    ctx.originPackageJson,
  );
  console.log("ctx", ctx);

  next({ backVersionFn });
};

const gitPush = async (next, ctx) => {
  await new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      reject();
    }, 2000);
  }).catch(() => {
    ctx?.backVersionFn?.();
  });
};

const middleware = [env, getNextVersion, _updateVersion, gitPush];

compose(middleware);

process.on("exit", (code) => {
  console.log("进程即将退出，退出码为：", code);
  // 在这里执行清理操作或其他逻辑
});
