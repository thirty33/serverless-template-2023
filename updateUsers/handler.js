const aws = require("aws-sdk");
const { randomUUID } = require("crypto");

let dynamoDBClientParams = {}

if (process.env.IS_OFFLINE) {
    dynamoDBClientParams =  {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,  // needed if you don't have aws credentials at all in env
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY 
    }
}

const dynamodb = new aws.DynamoDB.DocumentClient(dynamoDBClientParams);

const updateUsers = async (event, context) => {

  const id = randomUUID();

  let userId = event.pathParameters.id;

  let body = JSON.parse(event.body);

  const params = {
    TableName: "usersTable",
    Key: {
      pk: userId
    },
    UpdateExpression: 'set #name = :name',
    ExpressionAttributeNames: { '#name': 'name'},
    ExpressionAttributeValues: {
        ':name': body.name
    },
    ReturnValues: 'ALL_NEW'
  };

  console.log(params.Item);

  return dynamodb.update(params)
    .promise()
    .then(res => {
        console.log('res', res);
        return {
            statusCode: 200,
            body: JSON.stringify({ 'user': res.Attributes }),
        }
    })
    .catch(err => {
        return {
            statusCode: 400,
            body: JSON.stringify(
              { error: err }
            ),
        }
    })
};

module.exports = {
  updateUsers,
};
