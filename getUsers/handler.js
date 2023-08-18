const aws = require("aws-sdk");

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

const getUsers = async (event, context) => {

  let userId = event.pathParameters.id;
  
  const params = {
    ExpressionAttributeValues: {
        ':pk': userId
    },
    KeyConditionExpression: 'pk = :pk',
    TableName: "usersTable",
  };

  return dynamodb.query(params)
    .promise()
    .then(res => {
        console.log('res', res);
        return {
            statusCode: 200,
            body: JSON.stringify(res.Items),
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
  getUsers,
};
