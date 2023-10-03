import { join } from "path";

/* 应用根路径 */
export const PROJECT_ROOT = join(__dirname, "..");

/* package.json 文件 */
export const PACKAGE_ROOT = join(PROJECT_ROOT, "package.json");

/* .git 文件夹 */
export const DOT_GIT_DIR = join(PROJECT_ROOT, ".git");

export const COMMIT_REEOR_MESSAGE = "提交格式不符合angular提交规范";
