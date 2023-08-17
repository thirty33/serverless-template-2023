const aws = require("aws-sdk");
const { randomUUID } = require("crypto");

let dynamoDBClientParams = {}

if (process.env.IS_OFFLINE) {
    dynamoDBClientParams =  {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,  // needed if you don't have aws credentials at all in env
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY // needed if you don't have aws credentials at all in env
    }
}

const dynamodb = new aws.DynamoDB.DocumentClient(dynamoDBClientParams);

const createUsers = async (event, context) => {

  const id = randomUUID();

  let userBody = JSON.parse(event.body);

  userBody.pk = id;

  const params = {
    TableName: "usersTable",
    Item: userBody
  };

  console.log('test pull to actions',params.Item);

  return dynamodb.put(params)
    .promise()
    .then(res => {
        console.log('res', res);
        return {
            statusCode: 200,
            body: JSON.stringify({ 'user': params.Item }),
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
  createUsers,
};
