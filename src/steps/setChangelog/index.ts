import ora from "ora";
import { taskPre } from "../../utils/info";
import { runAsync } from "../../utils/core";

export const setChangelog = async () => {
  const spinner = ora(taskPre("生成 CHANGELOG.md")).start();

  await runAsync(`conventional-changelog -p angular -i "CHANGELOG.md" -s`);

  spinner.succeed(taskPre("生成CHANGELOG.md", "end"));

  return true;
};
