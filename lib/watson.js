const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const apikey = "JCMtUweoP7ejUkfUI_QEHLmWiDo_gbJ6HIIKPtFmJ-xJ";
const version = '2020-06-01';
const url = "https://api.us-south.assistant.watson.cloud.ibm.com/instances/c1e26152-fcca-47fb-9ece-7b293cd4024c";
var assistant_id = '7b514536-ce08-4103-8c72-f30feca0086c';
var session_id = '';

const assistant = new AssistantV2({
    version: '2020-06-01',
    authenticator: new IamAuthenticator({
        apikey: 'JCMtUweoP7ejUkfUI_QEHLmWiDo_gbJ6HIIKPtFmJ-xJ',
    }),
    url: 'https://api.us-south.assistant.watson.cloud.ibm.com/instances/c1e26152-fcca-47fb-9ece-7b293cd4024c',
});

module.exports = assistant;