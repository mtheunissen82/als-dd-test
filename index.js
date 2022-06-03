require("dd-trace").init();

const { AsyncLocalStorage } = require("async_hooks");
const fastify = require("fastify");

const als = new AsyncLocalStorage();
const app = fastify();

app.addHook("onRequest", (request, reply, done) => {
  const requestContext = { path: request.url };
  als.run(requestContext, done);
});

app.get("/", (request, reply) => {
  const store = als.getStore();
  if (!store) {
    throw new Error("ALS store is undefined");
  }

  return reply.send(store);
});

app.listen(3000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
