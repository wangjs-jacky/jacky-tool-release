import { PACKAGE_ROOT } from "../../constants";
import fse from "fs-extra";
import ora from "ora";

export const updateVersion = async (nextVersion, originPackageJson) => {
  const content = { ...originPackageJson, version: nextVersion };
  const spinner = ora("Loading unicorns").start();
  await fse.writeJson(PACKAGE_ROOT, content, { spaces: 2 });
  spinner.stop();

  return async () => {
    console.log("流程出现错误，正在回退版本");
    /* fse.writeFileSync(PACKAGE_ROOT, JSON.stringify(originPackageJson, null, 2)); */
    await fse.outputJson(PACKAGE_ROOT, { name: "123" }, { space: 2 });
  };
};
