export class AsyncSeriesHooks {
  name: string;
  tasks: any[];
  constructor(name) {
    this.tasks = [];
    this.name = name;
  }

  tapPromise(task) {
    this.tasks.push(task);
  }

  promise() {
    return new Promise<void>((resolve, reject) => {
      const main = async () => {
        for (let i = 0; i < this.tasks.length; i++) {
          try {
            await this.tasks[i]();
          } catch (error) {
            reject();
            return;
          }
        }
      };
      main().then(() => resolve());
    });
  }

  clear() {
    this.tasks = [];
  }

  show() {
    console.log("tasks", this.tasks);
  }
}

export const failCallbacks = new AsyncSeriesHooks("failcallbacks");
