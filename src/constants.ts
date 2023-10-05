import { join } from "path";

/* 应用根路径 */
export const PROJECT_ROOT = join(__dirname, "..");

/* package.json 文件 */
export const PACKAGE_ROOT = join(PROJECT_ROOT, "package.json");

/* .git 文件夹 */
export const DOT_GIT_DIR = join(PROJECT_ROOT, ".git");

/* changelog 文件 */
export const CHANGELOG_PATH = join(PROJECT_ROOT, "CHANGELOG.md");

/* eslintrc.js 文件*/
export const ESLINT_PATH = join(PROJECT_ROOT, "./.eslintrc.js");

/* src */
export const SRC_PATH = join(PROJECT_ROOT, "./src");

export const COMMIT_REEOR_MESSAGE = "提交格式不符合angular提交规范";
