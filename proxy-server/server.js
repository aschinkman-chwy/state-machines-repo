require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const { POWERUSER_PROFILE, STEP_FUNCTION_ARN, PORT = 4000 } = process.env;
process.env.AWS_PROFILE = POWERUSER_PROFILE;

AWS.config.update({ 
  region: 'us-east-1',
});

const sfn = new AWS.StepFunctions();
const app = express();

app.use(cors());
app.use(express.json());

app.post('/start-step', async (req, res) => {
  try {
    const params = {
      stateMachineArn: STEP_FUNCTION_ARN,
      input: JSON.stringify(req.body),
    };

    const { executionArn } = await sfn.startExecution(params).promise();

    let desc;
    do {
        await new Promise(r => setTimeout(r, 500));
        desc = await sfn.describeExecution({ executionArn }).promise();
    } while (desc.status === 'RUNNING');

    const output = JSON.parse(desc.output || '{}');
    return res.json({ executionArn, output });

  } catch (err) {
    console.error('Error starting SFN:', err);
    return res.status(500).json({ error: err.message || err });
  }
});

app.listen(PORT, () =>
  console.log(`SFN proxy listening on http://localhost:${PORT}`)
);