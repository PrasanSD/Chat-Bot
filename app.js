const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;

const sessionId = uuid.v4();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.post("/send-msg", (req, res) => {
  runSample(req.body.MSG).then((data) => {
    res.send({ Reply: data });
  });
});


//project id from google-service
async function runSample(msg, projectId = "") {

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    //location of the json file
    keyFilename:
      "",
  });
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: msg,
        languageCode: "en-US",
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log("Detected intent");
  const result = responses[0].queryResult;
  console.log(`Query: ${result.queryText}`);
  console.log(`Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`Intent: ${result.intent.displayName}`);
  } else {
    console.log(`No intent matched.`);
  }
  return result.fulfillmentText;
}

app.listen(port, () => {
  console.log("Running on Port " + port);
});
