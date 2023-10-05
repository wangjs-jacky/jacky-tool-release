/* 内置 middleware */

import { currentVersion, getOriginPackageJson } from "./steps/packageJson";
import { selectNextVersion } from "./steps/selectNextVersion";
import { updateVersion } from "./steps/updateVersion";

import { compose } from "./utils/core";

/* 使用回调去注册事件 */
import { failCallbacks } from "./utils/AsyncSeriresHook";
import { gitPush, gitSoftReset } from "./steps/gitPush";
import { getOldChangelog, setChangelog } from "./steps/setChangelog";
import { ESLINT_PATH, SRC_PATH } from "./constants";
import { eslint } from "./steps/eslint";

/**
 * 注入全局所需读取的静态资源信息，如 package.json 内容
 */
const middleware_init = (next, ctxRef) => {
  const originPackageJson = getOriginPackageJson();

  /* 监听 ctrl + c 事件 */
  process.on("SIGINT", async function () {
    await failCallbacks.promise();
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

/* 使用 semver 获取下一个版本信息 */
const middleware_getNextVersion = async (next, ctxRef) => {
  const nextVersion = await selectNextVersion();

  ctxRef.current = {
    ...ctxRef.current,
    nextVersion,
  };

  next();
};

/**
 * 修改 package.json 版本更新
 */
const middleware_updateVersion = async (next, ctxRef) => {
  const { nextVersion, originPackageJson } = ctxRef.current;

  const backVersionFn = await updateVersion(nextVersion, originPackageJson);

  /* 注册失败回调 */
  failCallbacks.tapPromise(backVersionFn);

  next();
};

const middleware_gitPush = async (next, ctxRef) => {
  const resetGitFn = gitSoftReset();

  /* 注册失败回调 */
  failCallbacks.tapPromise(resetGitFn);

  await gitPush();

  next();
};

const middleware_changeLog = async (next) => {
  const resetChangelogFn = await getOldChangelog();

  /* 注册失败回调 */
  failCallbacks.tapPromise(resetChangelogFn);

  await setChangelog();

  next();
};

const middleware_eslint = async () => {
  await eslint(SRC_PATH, ESLINT_PATH);
};

const middleware = [
  middleware_init,
  middleware_getNextVersion,
  middleware_updateVersion,
  middleware_gitPush,
  middleware_changeLog,
  middleware_eslint,
];

compose(middleware);
