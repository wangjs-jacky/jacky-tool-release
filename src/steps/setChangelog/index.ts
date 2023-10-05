import ora from "ora";
import { taskPre } from "../../utils/info";
import { runAsync } from "../../utils/core";
import fse from "fs-extra";
import { CHANGELOG_PATH } from "../../constants";

export const setChangelog = async () => {
  const spinner = ora(taskPre("生成 CHANGELOG.md")).start();

  await runAsync(`conventional-changelog -p angular -i "CHANGELOG.md" -s`);

  spinner.succeed(taskPre("生成 CHANGELOG.md", "end"));

  return true;
};

export const getOldChangelog = async () => {
  /* 确保存在 changelog.md 文件 */
  await fse.ensureFile(CHANGELOG_PATH);

  const oldChangeLog = fse.readFileSync(CHANGELOG_PATH, "utf-8");

  return () => {
    fse.outputFileSync(CHANGELOG_PATH, oldChangeLog);
  };
};
