/* 内置 middleware */

import { currentVersion, getOriginPackageJson } from "./steps/packageJson";
import { selectNextVersion } from "./steps/selectNextVersion";
import { updateVersion } from "./steps/updateVersion";

import { compose } from "./utils/core";

/* 使用回调去注册事件 */
import { failCallbacks } from "./utils/AsyncSeriresHook";
import { gitPush } from "./steps/gitPush";

/**
 * 注入全局所需读取的静态资源信息，如 package.json 内容
 */
const middleware_init = (next, ctxRef) => {
  const originPackageJson = getOriginPackageJson();

  /* 监听 ctrl + c 事件 */
  process.on("SIGINT", async function () {
    await failCallbacks.promise().then(() => {
      console.log("clean");
    });
    process.exit(0);
  });

  /* process.on 只能触发同步任务 */
  process.on("exit", (code) => {
    /* 1 - 异常退出时 */
    if (code === 1) {
      /* failCallbacks.promise(); */
      /* const main = async () => {
        await failCallbacks.promise();
        process.exit(1);
      };
      main(); */
    }
  });

  ctxRef.current = {
    ...ctxRef.current,
    originVersion: currentVersion,
    originPackageJson: originPackageJson,
  };

  next();
};

const middleware_getNextVersion = async (next, ctxRef) => {
  const nextVersion = await selectNextVersion();

  ctxRef.current = {
    ...ctxRef.current,
    nextVersion,
  };

  next();
};

const middleware_updateVersion = async (next, ctxRef) => {
  const { nextVersion, originPackageJson } = ctxRef.current;

  const backVersionFn = await updateVersion(nextVersion, originPackageJson);

  /* 注册失败回调 */
  failCallbacks.tapPromise(backVersionFn);

  next();
};

const middleware_gitPush = async (next, ctxRef) => {
  await gitPush();
};

const middleware = [
  middleware_init,
  middleware_getNextVersion,
  middleware_updateVersion,
  middleware_gitPush,
];

compose(middleware);
