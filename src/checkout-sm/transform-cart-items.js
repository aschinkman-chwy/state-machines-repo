exports.handler = async (event) => {
    console.log('Input event:', JSON.stringify(event, null, 2));
    
    try {
        // Extract cart items from the event
        const cartItems = event.UserCartInfo[1].CartInfo.Output.ResponseBody.items;
        
        // Transform each item to the required format
        const allocationPartNumbers = cartItems.map(item => ({
            partNumber: parseInt(item.partNumber, 10),
            autoshipOrder: item.recurring,
            networkQuantity: item.quantity
        }));
        
        const result = {
            allocationPartNumbers: allocationPartNumbers
        };
        
        console.log('Transformed result:', JSON.stringify(result, null, 2));
        
        return result;
        
    } catch (error) {
        console.error('Error transforming cart items:', error);
        throw new Error(`Failed to transform cart items: ${error.message}`);
    }
}; 