import ora from "ora";
import { info, taskPre } from "../../utils/info";
import { runAsync } from "../../utils/core";
import fse from "fs-extra";

export const eslint = async (srcPath, eslintConifg) => {
  const spinner = ora(taskPre("eslint校验中...", "start")).start();

  const isEslintExists = await fse.pathExists(eslintConifg);
  if (!isEslintExists) {
    spinner.fail(info.gray("不存在" + eslintConifg + "文件, 跳过 eslint 校验"));
    return;
  }

  await runAsync(
    `eslint ${srcPath} --ext .ts,.tsx,.js,.jsx --config ${eslintConifg}`,
    true,
    spinner,
  );

  spinner.succeed();
};
