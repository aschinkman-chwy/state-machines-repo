require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const { POWERUSER_PROFILE, STEP_FUNCTION_ARN, PORT = 4000 } = process.env;

// For SSO profiles, we need to set the profile in the AWS_PROFILE environment variable
// and let the SDK use the default credential provider chain
process.env.AWS_PROFILE = POWERUSER_PROFILE;

// Configure AWS SDK to use the default credential provider chain
AWS.config.update({ 
  region: 'us-east-1',
  // The SDK will automatically use the AWS_PROFILE environment variable
  // to load credentials from the SSO profile
});

const sfn = new AWS.StepFunctions();
const app = express();

app.use(cors());
app.use(express.json());

// POST /start-step
app.post('/start-step', async (req, res) => {
  try {
    // Forward anything in req.body as the input to your state machine:
    const params = {
      stateMachineArn: STEP_FUNCTION_ARN,
      input: JSON.stringify(req.body),
    };
    // You can choose startExecution vs startSyncExecution:
    const result = await sfn.startExecution(params).promise();
    return res.json({ executionArn: result.executionArn });
  } catch (err) {
    console.error('Error starting SFN:', err);
    return res.status(500).json({ error: err.message || err });
  }
});

app.listen(PORT, () =>
  console.log(`SFN proxy listening on http://localhost:${PORT}`)
);