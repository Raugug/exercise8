const http = require("http");
const express = require("express");
//const handleRequest = require("./src/queue/queue")
//const handleGetCredit = require("./src/creditQueue/creditQueue")
//const worker = require("./src/queue/worker")
const bodyParser = require("body-parser");
const {
  Validator,
  ValidationError
} = require("express-json-validator-middleware");
const getMessages = require("./src/controllers/getMessages");
const getMessageStatus = require("./src/controllers/getMessageStatus");
const { checkCredit } = require("./src/queue/queue");

//const updateCredit = require("./src/controllers/updateCredit");
//const payedReqWorker = require("./src/controllers/payedReqWorker");

const app = express();


const validator = new Validator({ allErrors: true });
const { validate } = validator;

const messageSchema = {
  type: "object",
  required: ["destination", "body"],
  properties: {
    destination: {
      type: "string"
    },
    body: {
      type: "string"
    },
    location: {
      name: {
        type: "string"
      },
      cost: {
        type: "number"
      }
    }
  }
};

app.post(
  "/messages",
  bodyParser.json(),
  validate({ body: messageSchema }),
  checkCredit
);

app.get("/messages", getMessages);
app.get("/message/:messageId/status", getMessageStatus);

app.use(function(err, req, res, next) {
  console.log(res.body);
  if (err instanceof ValidationError) {
    res.sendStatus(400);
  } else {
    res.sendStatus(500);
  }
});

app.listen(9007, function() {
  console.log("App message started on PORT 9007");
});
