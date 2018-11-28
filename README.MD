# DEMO Lambda Node.js

0. Création de la table DynamoDB **"speakers"** dans la console AWS
Item 1 :
```
{
  "id": "103843c6-efe3-4e46-8d3d-858ad725f6fd",
  "firstName": "Abdellatif",
  "lastName": "BOUCHAMA",
  "company": "Red Hat",
  "twitter": "@a_bouchama"
}
```

Item 2 :
```
{
  "id": "6289ed11-40e8-475e-8a54-4fe75e6108de",
  "firstName": "Bruno",
  "lastName": "Borges",
  "company": "Microsoft",
  "twitter": "@brunoborges"
}
```

1. Présentation **package.json**

2. Création **repositories/SpeakersRepository.js**
```javascript
const dynamo = require('./dynamodbsdk').DocumentClient;

module.exports.list = function () {
  return dynamo.scan({TableName : 'speakers'})
    .promise()
    .then(result => result.Items);
};

module.exports.get = function (id) {
  return dynamo.get({
    TableName : 'attendees',
    Key: { id: id }}
    )
    .promise()
    .then(result => result.Item);
};
```

3. Création **handlers/SpeakersHandler.js**
```javascript
const repo = require('../repositories/SpeakersRepository');

module.exports.list = function (event, context, callback) {
  repo.list().then(result => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(result)
    });
  });
};

module.exports.get = function (event, context, callback) {
  repo.get(event.pathParameters.id).then(result => {
    let response;
    if (!result) {
      response = {
        statusCode: 404,
        body: undefined
      };
    } else {
      response = {
        statusCode: 200,
        body: JSON.stringify(result)
      };
    }

    callback(null, response);
  });
};
```
4. Création **serverless.yml**
```yaml
service: devoxx-2018-speakers-api

provider:
  name: aws
  runtime: nodejs6.10
  region: us-east-1
  tracing: true

  iamRoleStatements:
    - Effect: Allow
      Action:
        - xray:PutTraceSegments
        - xray:PutTelemetryRecords
      Resource: "*"
    - Effect: Allow
      Action: "dynamodb:*"
      Resource: "arn:aws:dynamodb:us-east-1:*:table/speakers"

plugins:
  # APM
  - serverless-plugin-tracing
  # Run local API gateway
  - serverless-offline

functions:

  attendee-list:
    handler: handlers/SpeakersHandler.list
    name: devoxx-2018-speakers-api-list
    events:
      - http:
          path: /speakers
          method: get

  attendee-get:
    handler: handlers/SpeakersHandler.get
    name: devoxx-2018-speakers-api-get
    events:
      - http:
          path: /speakers/{id}
          method: get

```

5. Ajouter les plugins
```yaml
plugins:
  # Run local API gateway
  - serverless-offline
```

6. Deployer en local
```bash
serverless offline start
```

7. Deployer sur AWS
```bash
serverless deploy
```
