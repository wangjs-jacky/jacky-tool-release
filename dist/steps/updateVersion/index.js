"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVersion = void 0;
const constants_1 = require("../../constants");
const fs_extra_1 = __importDefault(require("fs-extra"));
const ora_1 = __importDefault(require("ora"));
const updateVersion = async (nextVersion, originPackageJson) => {
    const content = { ...originPackageJson, version: nextVersion };
    const spinner = (0, ora_1.default)("Loading unicorns").start();
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 2000);
    });
    await fs_extra_1.default.writeJson(constants_1.PACKAGE_ROOT, content, { spaces: 2 });
    spinner.stop();
    return async () => {
        await fs_extra_1.default.writeJson(constants_1.PACKAGE_ROOT, originPackageJson, { spaces: 2 });
        console.log("There was an error and version is being rolled back.(流程出现错误，正在回退版本)");
    };
};
exports.updateVersion = updateVersion;
