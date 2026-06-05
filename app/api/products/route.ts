// API route to handle product operations
// File: app/api/products/route.ts

import { productFunctions, handleProductFunction } from '@/lib/ai/productFunctions';

export async function GET(request: Request) {
  try {
    // Get all products
    const result = await handleProductFunction('get_all_products', {});
    const parsedResult = JSON.parse(result);
    
    return Response.json(parsedResult, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, ...args } = body;

    // Validate action
    const validActions = [
      'add_product',
      'update_product',
      'delete_product',
      'add_to_cart',
    ];

    if (!validActions.includes(action)) {
      return Response.json(
        { error: `Invalid action: ${action}` },
        { status: 400 }
      );
    }

    // Execute the product function
    const result = await handleProductFunction(action, args);
    const parsedResult = JSON.parse(result);

    return Response.json(parsedResult, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return Response.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
