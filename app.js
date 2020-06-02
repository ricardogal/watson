//const AssistantV1 = require('watson-developer-cloud/assistant/v1');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const port = 3000;


const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const assistant = new AssistantV2({
  version: '2020-06-01',
  authenticator: new IamAuthenticator({
    apikey: 'JCMtUweoP7ejUkfUI_QEHLmWiDo_gbJ6HIIKPtFmJ-xJ',
  }),
  url: 'https://api.us-south.assistant.watson.cloud.ibm.com/instances/c1e26152-fcca-47fb-9ece-7b293cd4024c',
});

assistant.createSession({
    assistantId: '7b514536-ce08-4103-8c72-f30feca0086c'
}).then(res => {
    console.log(JSON.stringify(res.result, null, 2));
}).catch(err => {
    console.log(err);
});


/*
assistant.message({
    assistantId: '{assistant_id}',
    sessionId: '{session_id}',
    input: {
      'message_type': 'text',
      'text': 'Hello'
      }
    }
).then(res => {
    console.log(JSON.stringify(res.result, null, 2));
}).catch(err => {
    console.log(err);
});

app.post('/conversation/', (req, res) => {
  const { text, context = {} } = req.body;

  const params = {
    input: { text },
    workspace_id:'<workspace_id>',
    context,
  };

  assistant.message(params, (err, response) => {
    if (err) {
      console.error(err);
      res.status(500).json(err);
    } else {
      res.json(response);
    }
  });
});
*/
app.listen(port, () => console.log(`Running on port ${port}`));