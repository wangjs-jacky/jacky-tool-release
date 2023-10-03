"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectNextVersion = void 0;
const semver_1 = __importStar(require("semver"));
const inquirer_1 = __importDefault(require("inquirer"));
const packageJson_1 = require("../packageJson");
/**
 * 使用 semver 根据当前 package.json 版本号计算出待发布版本号的列表
 * @async
 * @returns {Promise<{
  [key in ReleaseType]: string | null;
}>}
 */
const getNextVersion = async () => {
    const isValidVersion = semver_1.default.valid(packageJson_1.currentVersion);
    if (!isValidVersion) {
        return Promise.reject("package.json 有问题");
    }
    return {
        major: (0, semver_1.inc)(packageJson_1.currentVersion, "major"),
        minor: (0, semver_1.inc)(packageJson_1.currentVersion, "minor"),
        patch: (0, semver_1.inc)(packageJson_1.currentVersion, "patch"),
        premajor: (0, semver_1.inc)(packageJson_1.currentVersion, "premajor"),
        preminor: (0, semver_1.inc)(packageJson_1.currentVersion, "preminor"),
        prepatch: (0, semver_1.inc)(packageJson_1.currentVersion, "prepatch"),
        prerelease: (0, semver_1.inc)(packageJson_1.currentVersion, "prerelease"),
    };
};
const selectNextVersion = async () => {
    const nextVersions = await getNextVersion();
    const { nextVersion } = await inquirer_1.default.prompt([
        {
            type: "list",
            name: "nextVersion",
            message: `请选择版即将发布的版本号 ${packageJson_1.currentVersion}`,
            choices: Object.keys(nextVersions).map((level) => ({
                name: `${level} → ${nextVersions[level]}`,
                value: nextVersions[level],
            })),
        },
    ]);
    return nextVersion;
};
exports.selectNextVersion = selectNextVersion;
