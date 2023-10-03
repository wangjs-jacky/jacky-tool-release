import path, { join } from "path";

import semver, { inc } from "semver";
import type { ReleaseType } from "semver";
import inquirer from "inquirer";
import { currentVersion, getOriginPackageJson } from "../packageJson";

/**
 * 使用 semver 根据当前 package.json 版本号计算出待发布版本号的列表
 * @async
 * @returns {Promise<{
  [key in ReleaseType]: string | null;
}>}
 */
const getNextVersion = async (): Promise<{
  [key in ReleaseType]: string | null;
}> => {
  const isValidVersion = semver.valid(currentVersion);

  if (!isValidVersion) {
    return Promise.reject("package.json 有问题");
  }

  return {
    major: inc(currentVersion, "major"),
    minor: inc(currentVersion, "minor"),
    patch: inc(currentVersion, "patch"),
    premajor: inc(currentVersion, "premajor"),
    preminor: inc(currentVersion, "preminor"),
    prepatch: inc(currentVersion, "prepatch"),
    prerelease: inc(currentVersion, "prerelease"),
  };
};

export const selectNextVersion = async (): Promise<string> => {
  const nextVersions = await getNextVersion();

  const { nextVersion } = await inquirer.prompt([
    {
      type: "list",
      name: "nextVersion",
      message: `请选择版即将发布的版本号 ${currentVersion}`,
      choices: Object.keys(nextVersions).map((level) => ({
        name: `${level} → ${nextVersions[level]}`,
        value: nextVersions[level],
      })),
    },
  ]);

  return nextVersion;
};
