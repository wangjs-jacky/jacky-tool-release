"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PACKAGE_ROOT = exports.PROJECT_ROOT = void 0;
const path_1 = require("path");
/* 应用根路径 */
exports.PROJECT_ROOT = (0, path_1.join)(__dirname, "..");
exports.PACKAGE_ROOT = (0, path_1.join)(exports.PROJECT_ROOT, "package.json");
