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
    console.log("123");

    await failCallbacks.promise().then(() => {
      console.log("clean");
    });
    process.exit(0);
  });

  process.on("exit", (code) => {
    /* console.log("进程即将退出，退出码为：", code); */
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
