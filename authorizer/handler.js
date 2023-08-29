const authorize = async (event, context, callback) => {
    try {
        
        let date = new Date();
        let minutes = date.getMinutes()
        let hour = date.getHours()
        
        if (event.authorizationToken === `Bearer ${process.env.SECRET_EGG}-${hour}-${minutes}`) {
            return generatePolicy('user', 'Allow', event.methodArn);
        }
    
        return generatePolicy('user', 'Deny', event.methodArn);
        
    }catch(e) {
        console.error(e);
    }
}

// Help function to generate an IAM policy
const generatePolicy = function(principalId, effect, resource) {
    let authResponse = {};
    
    if (effect && resource) {
        authResponse = {
            principalId: principalId,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: effect,
                        Resource: resource
                    },
                ],
            },
        }
    }
    
    return authResponse;
}

module.exports = { authorize }