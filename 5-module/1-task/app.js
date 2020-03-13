const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const waitForMessage = [];

router.get('/subscribe', async (ctx, next) => {
  const promise = new Promise((res, rej) => {
    waitForMessage.push(res);
  });
  ctx.body = await promise;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (message !== undefined && message !== '') {
    waitForMessage.forEach((awaiting) => {
      awaiting(message);
    });
  }
  ctx.status = 200;
  ctx.res.end();
});

app.use(router.routes());

module.exports = app;
