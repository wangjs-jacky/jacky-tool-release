import { PACKAGE_ROOT } from "../../constants";
import fse from "fs-extra";
/**
 * 获取当前package.json的版本号
 */
export const getOriginPackageJson = () => {
  const pkgJson = fse.readJsonSync(PACKAGE_ROOT, { throws: false });
  return pkgJson;
};

export const currentVersion = getOriginPackageJson()?.version;
