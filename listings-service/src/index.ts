import { RequestHandler, send } from "micro";
import { router, get } from "microrouter";

import { IncomingMessage, ServerResponse } from "http";

const archer = require("../listings/archer.json");
const gish = require("../listings/gish.json");
const triton = require("../listings/triton.json");

const service: RequestHandler = (req, res) => {
  const data = {
    status: "ok",
    listings: [triton, gish, archer]
  };
  send(res, 200, data);
};

module.exports = router(get("/", service));
