import chalk from "chalk";

export const info = {
  warning: chalk.yellowBright,
  error: chalk.redBright,
  succeed: chalk.greenBright,
  info: chalk.blueBright,
  gray: chalk.grayBright,
};

export const taskPre = (logInfo: string, type: "start" | "end" = "start") => {
  if (type === "start") {
    return `${info.info("开始任务")}: ${logInfo} \r\n`;
  }
  return `${info.info("任务结束")}: ${logInfo} \r\n`;
};
