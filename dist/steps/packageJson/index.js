"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentVersion = exports.getOriginPackageJson = void 0;
const constants_1 = require("../../constants");
const fs_extra_1 = __importDefault(require("fs-extra"));
/**
 * 获取当前package.json的版本号
 */
const getOriginPackageJson = () => {
    const pkgJson = fs_extra_1.default.readJsonSync(constants_1.PACKAGE_ROOT, { throws: false });
    return pkgJson;
};
exports.getOriginPackageJson = getOriginPackageJson;
exports.currentVersion = (0, exports.getOriginPackageJson)()?.version;
