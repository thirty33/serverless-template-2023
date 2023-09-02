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

const dynamoDB = new aws.DynamoDB.DocumentClient(dynamoDBClientParams);

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}
const likeuser = async (event, context) => {
    const body = event.Records[0].body
    const userid = JSON.parse(body).id
    console.log(userid)
    const params = {
        TableName: 'usersTable',
        Key: { pk: userid },
        UpdateExpression: "ADD likes :inc",
        ExpressionAttributeValues: {
            ':inc': 1
        },
        ReturnValues: 'ALL_NEW'
    }
    const result = await dynamoDB.update(params).promise()
    await sleep(4000)
    console.log(result)
}
module.exports = { likeuser }