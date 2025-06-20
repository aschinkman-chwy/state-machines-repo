import { SFNClient } from "@aws-sdk/client-sfn";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import React from "react";
import { StartExecutionCommand } from "@aws-sdk/client-sfn";

export interface HelloWorldInput {
    IsHelloWorldExample: boolean;
    feedback_comment: string;
}

export const sfnClient = new SFNClient({
  region: "us-east-1", 
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: "us-east-1" },
    identityPoolId: "us-east-1:657fd0f0-e424-4e72-b976-54cb7a8e5ca6", 
  }),
});
  
export const SendInfoButton: React.FC = () => {
    const handleClick = async () => {
        const input: HelloWorldInput = {
            IsHelloWorldExample: true,
            feedback_comment: "Hello, I love Step Functions!!",
        };

        try {
            const cmd = new StartExecutionCommand({
                stateMachineArn:
                    "arn:aws:states:us-east-1:243249644484:stateMachine:HelloWorldSMTest", 
                input: JSON.stringify(input),
            });
            const resp = await sfnClient.send(cmd);
            alert(`Started execution: ${resp.executionArn}`);
        } catch (err: any) {
            console.error(err);
            alert(`ERROR: ${err.message || err}`);
        }
    };

    return (
        <button onClick={handleClick}>
            Send Info
        </button>
    );
};