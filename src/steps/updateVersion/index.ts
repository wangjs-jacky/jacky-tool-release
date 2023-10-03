import { PACKAGE_ROOT } from "../../constants";
import fse from "fs-extra";
import ora from "ora";

export const updateVersion = async (nextVersion, originPackageJson) => {
  const content = { ...originPackageJson, version: nextVersion };
  const spinner = ora("Loading unicorns").start();

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });

  await fse.writeJson(PACKAGE_ROOT, content, { spaces: 2 });
  spinner.stop();

  return async () => {
    await fse.writeJson(PACKAGE_ROOT, originPackageJson, { spaces: 2 });
    console.log(
      "There was an error and version is being rolled back.(流程出现错误，正在回退版本)",
    );
  };
};
