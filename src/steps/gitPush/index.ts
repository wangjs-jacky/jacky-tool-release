import inquirer from "inquirer";
import { COMMIT_REEOR_MESSAGE, DOT_GIT_DIR } from "../../constants";
import { runAsync, runSync } from "../../utils/core";
import ora from "ora";
import fse from "fs-extra";
import { taskPre } from "../../utils/info";
/* import InterruptedPrompt from "inquirer-interrupted-prompt";

InterruptedPrompt.fromAll(inquirer); */

/**
 * 通过 inquirer 获取 message 信息
 * @async
 * @returns {Promise<string>}
 */
const getCommitMessage = async (): Promise<string> => {
  const { commitMsg } = await inquirer.prompt([
    {
      type: "input",
      name: "commitMsg",
      message: "请输入 git commit 信息",
      interruptedKeyName: "ctrl+c",
    },
  ]);

  return commitMsg;
};

/**
 * 校验commit信息是否正确
 * @param message
 */
const checkCommitLint = (message) => {
  const regrex =
    /^(feat|fix|docs|style|refactor|test|chore|perf)(\(.+\))?:\s.+/;

  if (!regrex.test(message)) {
    console.log(COMMIT_REEOR_MESSAGE);
    return false;
  }

  return true;
};

const checkGit = async () => {
  /* 是否存在 .git 文件 */

  const dotGitExists = await fse.pathExists(DOT_GIT_DIR);

  if (!dotGitExists) {
    console.log(".git 文件不存在,请执行 git init");
    process.exit(1);
  }
};

export const gitPush = async () => {
  await checkGit();

  let isValid;
  let commitMsg;
  do {
    commitMsg = await getCommitMessage();
    isValid = checkCommitLint(commitMsg);
  } while (!isValid);

  const spinner = ora(taskPre("准备推送代码至git仓库")).start();

  /* 获取当前 branch */
  const curBranchName = runSync("git symbolic-ref --short HEAD");
  /* 当前分支是否存在远端分支 */
  const isExistCurBranch = runSync(
    `git branch -r | grep -w "origin/${curBranchName}"`,
  );

  await runAsync(`git add .`, true);

  await runAsync(`git commit -m "${commitMsg}"`, true);
  if (!isExistCurBranch) {
    await runAsync(`git push --set-upstream origin ${curBranchName}`, true);
  } else {
    await runAsync(`git push`, true);
  }

  spinner.succeed(taskPre("已推送代码至git仓库", "end"));
};

export const gitSoftReset = () => {
  /* 获取当前 commit id */
  const curCommitId = runSync("git rev-parse HEAD");
  return () => {
    runSync(`git reset --soft ${curCommitId}`, true);
  };
};
