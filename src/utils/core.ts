/* export function compose(middleware) {
  const _otherOptions = {};

  function dispatch(index, ctx) {
    const curMiddleware = middleware[index];
    const next = (addOptions) => {
      dispatch(index + 1, { ...ctx, ...addOptions });
    };
    return Promise.resolve(curMiddleware(next, ctx)).catch((error) => {
      console.log("发布失败，失败原因", error);
    });
  }
  dispatch(0, _otherOptions);
} */

export function compose(middleware, defaultCtx) {
  const _ctx = defaultCtx || {};

  function dispatch(index, ctx) {
    const curMiddleware = middleware[index];
    /* 构造 next 函数，支持对 ctx 的修改 */
    const next = () => {
      dispatch(index + 1, ctx);
    };
    return Promise.resolve(curMiddleware(next, ctx)).catch((error) => {
      console.log("发布失败，失败原因", error);
    });
  }
  dispatch(0, _ctx);
}
