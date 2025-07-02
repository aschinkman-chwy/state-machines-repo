# Checkout State Machine with Cart Items Transformation

This directory contains the AWS Step Functions state machine definition and a Lambda function for transforming cart items.

## Files

- `checkout-SM-basic.asl.json` - The main state machine definition
- `transform-cart-items.js` - Lambda function to transform cart items
- `deploy-lambda.sh` - Deployment script for the Lambda function

## Cart Items Transformation

The Lambda function transforms cart items from the original format:
```json
{
  "partNumber": 111111,
  "recurring": true,
  "quantity": 2
}
```

To the required allocation format:
```json
{
  "partNumber": 111111,
  "autoshipOrder": true,
  "networkQuantity": 2
}
```

## Deployment Steps

### 1. Deploy the Lambda Function

```bash
# Make the deployment script executable
chmod +x deploy-lambda.sh

# Run the deployment script
./deploy-lambda.sh
```

**Note:** Make sure you have:
- AWS CLI configured with appropriate permissions
- An IAM role with Lambda execution permissions
- Node.js 18.x runtime available

### 2. Update the State Machine

After deploying the Lambda function, update your state machine using the AWS CLI or console:

```bash
aws stepfunctions update-state-machine \
    --state-machine-arn "arn:aws:states:us-east-1:243249644484:stateMachine:checkout-sm-basic" \
    --definition file://checkout-SM-basic.asl.json
```

## Lambda Function Details

- **Function Name:** `transform-cart-items`
- **Runtime:** Node.js 18.x
- **Handler:** `transform-cart-items.handler`
- **Timeout:** 30 seconds
- **Memory:** 128 MB

## Input/Output Format

### Input
The Lambda function expects the full state machine event containing:
```json
{
  "UserCartInfo": [
    {...},
    {
      "CartInfo": {
        "Output": {
          "ResponseBody": {
            "items": [
              {
                "partNumber": 111111,
                "recurring": true,
                "quantity": 2
              }
            ]
          }
        }
      }
    }
  ]
}
```

### Output
The Lambda function returns:
```json
{
  "allocationPartNumbers": [
    {
      "partNumber": 111111,
      "autoshipOrder": true,
      "networkQuantity": 2
    }
  ]
}
```

## Error Handling

The Lambda function includes comprehensive error handling and logging:
- Input validation
- Error logging with context
- Graceful error propagation

## Testing

You can test the Lambda function locally or in AWS:

```bash
# Test with sample input
aws lambda invoke \
    --function-name transform-cart-items \
    --payload file://test-input.json \
    response.json
```

Create a `test-input.json` file with sample cart data for testing. 