"use strict";
/* 内置 middleware */
Object.defineProperty(exports, "__esModule", { value: true });
const packageJson_1 = require("./steps/packageJson");
const selectNextVersion_1 = require("./steps/selectNextVersion");
const updateVersion_1 = require("./steps/updateVersion");
const core_1 = require("./utils/core");
/**
 * 注入全局所需读取的静态资源信息，如 package.json 内容
 */
const env = (next, ctx) => {
    const originPackageJson = (0, packageJson_1.getOriginPackageJson)();
    process.on("SIGINT", function () {
        console.log("收到 SIGINT 信号，准备退出...");
        console.log("aaa", ctx);
        // 在这里执行清理操作或其他逻辑
        process.exit(0);
    });
    next({
        originVersion: packageJson_1.currentVersion,
        originPackageJson: originPackageJson,
    });
};
const getNextVersion = async (next, ctx) => {
    const nextVersion = await (0, selectNextVersion_1.selectNextVersion)();
    ctx["abc"] = 123;
    console.log("ctx", ctx);
    next({
        nextVersion,
    });
};
const _updateVersion = async (next, ctx) => {
    const backVersionFn = await (0, updateVersion_1.updateVersion)(ctx.nextVersion, ctx.originPackageJson);
    console.log("ctx", ctx);
    next({ backVersionFn });
};
const gitPush = async (next, ctx) => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            reject();
        }, 2000);
    }).catch(() => {
        ctx?.backVersionFn?.();
    });
};
const middleware = [env, getNextVersion, _updateVersion, gitPush];
(0, core_1.compose)(middleware);
process.on("exit", (code) => {
    console.log("进程即将退出，退出码为：", code);
    // 在这里执行清理操作或其他逻辑
});
