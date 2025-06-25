import React, { useState } from 'react';
import axios from 'axios';

export interface HelloWorldInput {
  IsHelloWorldExample: boolean;
  feedback_comment: string;
}

export const SendInfoButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string|null>(null);
  const [arn, setArn]         = useState<string|null>(null);
  const [output, setOutput]     = useState<any>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    setArn(null);
    setOutput(null);

    const payload: HelloWorldInput = {
      IsHelloWorldExample: false,
      feedback_comment: "Hello, I love Step Functions!!",
    };

    try {
      const res = await axios.post<{ executionArn: string; output: any }>(
        'http://localhost:4000/start-step',
        payload
      );
      setArn(res.data.executionArn);
      setOutput(res.data.output);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Starting...' : 'Send Info'}
      </button>
      {arn && (
        <p>
            Started execution: <code>{arn}</code>
        </p>
      )}
      {error && (
        <p style={{ color: 'red' }}>
            Error: {error}
        </p>
      )}
      {output && (
        <p>
            Output: <code>{JSON.stringify(output)}</code>
        </p>
      )}
    </div>
  );
};