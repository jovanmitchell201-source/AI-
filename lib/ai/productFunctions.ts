// Mock in-memory database for products (we'll replace this with real DB later)
let products: Map<string, any> = new Map();
let orders: Map<string, any> = new Map();

// Initialize with sample products
products.set('prod-1', {
  id: 'prod-1',
  name: 'Premium T-Shirt',
  description: 'High-quality cotton t-shirt',
  price: 29.99,
  category: 'clothing',
  stock: 50,
  image: '/images/tshirt.jpg',
  createdAt: new Date(),
  updatedAt: new Date(),
});

products.set('prod-2', {
  id: 'prod-2',
  name: 'Coffee Mug',
  description: 'Ceramic coffee mug with custom design',
  price: 12.99,
  category: 'accessories',
  stock: 100,
  image: '/images/mug.jpg',
  createdAt: new Date(),
  updatedAt: new Date(),
});

// AI Functions for product management
export const productFunctions = [
  {
    name: 'add_product',
    description: 'Add a new product to the marketplace. Use this when users want to add items to sell.',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Product name',
        },
        description: {
          type: 'string',
          description: 'Product description',
        },
        price: {
          type: 'number',
          description: 'Product price in dollars',
        },
        category: {
          type: 'string',
          description: 'Product category (e.g., clothing, accessories, electronics)',
        },
        stock: {
          type: 'number',
          description: 'Initial stock quantity',
        },
      },
      required: ['name', 'price', 'category', 'stock'],
    },
  },
  {
    name: 'update_product',
    description: 'Update an existing product details or stock.',
    parameters: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'The ID of the product to update',
        },
        name: {
          type: 'string',
          description: 'New product name (optional)',
        },
        price: {
          type: 'number',
          description: 'New product price (optional)',
        },
        stock: {
          type: 'number',
          description: 'New stock quantity (optional)',
        },
      },
      required: ['productId'],
    },
  },
  {
    name: 'get_all_products',
    description: 'Get all products available in the marketplace',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_product',
    description: 'Get details of a specific product',
    parameters: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'The ID of the product',
        },
      },
      required: ['productId'],
    },
  },
  {
    name: 'delete_product',
    description: 'Delete a product from the marketplace',
    parameters: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'The ID of the product to delete',
        },
      },
      required: ['productId'],
    },
  },
  {
    name: 'add_to_cart',
    description: 'Add a product to the shopping cart',
    parameters: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'User ID',
        },
        productId: {
          type: 'string',
          description: 'Product ID',
        },
        quantity: {
          type: 'number',
          description: 'Quantity to add',
        },
      },
      required: ['userId', 'productId', 'quantity'],
    },
  },
];

// Handler functions for AI to execute
export async function handleProductFunction(
  functionName: string,
  functionArgs: Record<string, any>
): Promise<string> {
  switch (functionName) {
    case 'add_product': {
      const productId = `prod-${Date.now()}`;
      const newProduct = {
        id: productId,
        name: functionArgs.name,
        description: functionArgs.description || 'No description provided',
        price: functionArgs.price,
        category: functionArgs.category,
        stock: functionArgs.stock,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      products.set(productId, newProduct);
      return JSON.stringify({
        success: true,
        message: `Product "${functionArgs.name}" added successfully!`,
        product: newProduct,
      });
    }

    case 'get_all_products': {
      const allProducts = Array.from(products.values());
      return JSON.stringify({
        success: true,
        count: allProducts.length,
        products: allProducts,
      });
    }

    case 'get_product': {
      const product = products.get(functionArgs.productId);
      if (!product) {
        return JSON.stringify({
          success: false,
          message: `Product with ID ${functionArgs.productId} not found`,
        });
      }
      return JSON.stringify({
        success: true,
        product,
      });
    }

    case 'update_product': {
      const product = products.get(functionArgs.productId);
      if (!product) {
        return JSON.stringify({
          success: false,
          message: `Product with ID ${functionArgs.productId} not found`,
        });
      }
      if (functionArgs.name) product.name = functionArgs.name;
      if (functionArgs.price) product.price = functionArgs.price;
      if (functionArgs.stock !== undefined) product.stock = functionArgs.stock;
      product.updatedAt = new Date();
      products.set(functionArgs.productId, product);
      return JSON.stringify({
        success: true,
        message: 'Product updated successfully!',
        product,
      });
    }

    case 'delete_product': {
      if (!products.has(functionArgs.productId)) {
        return JSON.stringify({
          success: false,
          message: `Product with ID ${functionArgs.productId} not found`,
        });
      }
      products.delete(functionArgs.productId);
      return JSON.stringify({
        success: true,
        message: 'Product deleted successfully!',
      });
    }

    case 'add_to_cart': {
      const product = products.get(functionArgs.productId);
      if (!product) {
        return JSON.stringify({
          success: false,
          message: `Product not found`,
        });
      }
      if (product.stock < functionArgs.quantity) {
        return JSON.stringify({
          success: false,
          message: `Insufficient stock. Available: ${product.stock}`,
        });
      }
      return JSON.stringify({
        success: true,
        message: `${functionArgs.quantity}x ${product.name} added to cart!`,
        item: {
          productId: functionArgs.productId,
          quantity: functionArgs.quantity,
          price: product.price,
          total: product.price * functionArgs.quantity,
        },
      });
    }

    default:
      return JSON.stringify({
        success: false,
        message: `Unknown function: ${functionName}`,
      });
  }
}
