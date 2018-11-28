const dynamo = require('./dynamodbsdk').DocumentClient;
const TableName = "speakers";

module.exports.list = function () {
  return dynamo.scan({TableName})
    .promise()
    .then(result => result.Items);
};

module.exports.get = function (id) {
  return dynamo.get({
    TableName,
    Key: { id: id }}
    )
    .promise()
    .then(result => result.Item);
};
