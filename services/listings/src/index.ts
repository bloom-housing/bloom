import Application from "koa";
// import helmet from "koa-helmet";
// import cors from "@koa/cors";

const config = {
  port: parseInt(process.env.NODE_PORT || "3001", 10)
};

const archer = require("../listings/archer.json");
const gish = require("../listings/gish.json");
const triton = require("../listings/triton.json");
const data = { status: "ok", listings: [triton, gish, archer] };

const app = new Application();

// TODO: app.use(logger(winston));
//

// app.use(helmet());
// app.use(cors());

app.use(ctx => {
  ctx.body = data;
});

export const server = app.listen(config.port);
console.log(`Server running on port ${config.port}`);
