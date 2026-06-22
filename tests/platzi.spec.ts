import { test, expect } from '@playwright/test';

type Product = {
    id?: number;
    title: string;
    slug?: string;
    price: number;
    description: string;
    categoryId?: number;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    images: string[];
};

test.describe('Get All Products', () => {
    test('should return 200 status code', async ({ request }) => {
        const response = await request.get('/api/v1/products');
        expect(response.status()).toBe(200);
    });

    test('response time should be less than 1000ms', async ({ request }) => {
        const startTime = Date.now();
        await request.get('/api/v1/products', { failOnStatusCode: true });
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        expect(responseTime).toBeLessThan(1000);
    });

    test('content-Type header should be application/json', async ({ request }) => {
        const response = await request.get('/api/v1/products', { failOnStatusCode: true });
        expect(response.headers()['content-type']).toContain('application/json');
    });

    test('should return an array of products', async ({ request }) => {
        const response = await request.get('/api/v1/products', { failOnStatusCode: true });
        const products: Product[] = await response.json();
        expect(Array.isArray(products)).toBe(true);
    });

    test('response body should not be empty', async ({ request }) => {
        const response = await request.get('/api/v1/products', { failOnStatusCode: true });
        const products: Product[] = await response.json();
        expect(products.length).toBeGreaterThan(0);
    });

    test('each product should have required fields', async ({ request }) => {
        const response = await request.get('/api/v1/products', { failOnStatusCode: true });
        const products: Product[] = await response.json();
        expect(products[0]).toHaveProperty('id');
        expect(products[0]).toHaveProperty('title');
        expect(products[0]).toHaveProperty('price');
        expect(products[0]).toHaveProperty('description');
        expect(products[0]).toHaveProperty('category');
        expect(products[0]).toHaveProperty('images');
    });

    test('all products should have a non-empty title', async ({ request }) => {
        const response = await request.get('/api/v1/products', { failOnStatusCode: true });
        const products: Product[] = await response.json();
        products.forEach((product: Product) => {
            expect(product.title).toBeTruthy();
        });
    });

    test('all products should have a non-empty description', async ({ request }) => {
        const response = await request.get('/api/v1/products', { failOnStatusCode: true });
        const products: Product[] = await response.json();
        products.forEach((product: Product) => {
            expect(product.description).toBeTruthy();
        });
    });

    test('all products should have a price greater than 0', async ({ request }) => {
        const response = await request.get('/api/v1/products', { failOnStatusCode: true });
        const products: Product[] = await response.json();
        products.forEach((product: Product) => {
            expect(product.price).toBeGreaterThan(0);
        });
    });

    test('all products should have an array of images', async ({ request }) => {
        const response = await request.get('/api/v1/products', { failOnStatusCode: true });
        const products: Product[] = await response.json();
        products.forEach((product: Product) => {
            expect(Array.isArray(product.images)).toBe(true);
        });
    });

    test('all products should have at least one image', async ({ request }) => {
        const response = await request.get('/api/v1/products', { failOnStatusCode: true });
        const products: Product[] = await response.json();
        products.forEach((product: Product) => {
            expect(product.images.length).toBeGreaterThan(0);
        });
    });

    test('product images should be valid URLs', async ({ request }) => {
        const response = await request.get('/api/v1/products', { failOnStatusCode: true });
        const products: Product[] = await response.json();
        products.forEach((product: Product) => {
            product.images.forEach((image: string) => {
                expect(image).toMatch(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i);
            });
        });
    });

    test('all products should have a valid category with id and name', async ({ request }) => {
        const response = await request.get('/api/v1/products', { failOnStatusCode: true });
        const products: Product[] = await response.json();
        products.forEach((product: Product) => {
            expect(product.category).toBeTruthy();
            expect(product.category!.id).toBeTruthy();
            expect(product.category!.name).toBeTruthy();
        });
    });
});

test.describe('Get Product by ID', () => {
    test('should return 200 status code for valid product ID', async ({ request }) => {
        const response = await request.get('/api/v1/products/13');
        expect(response.status()).toBe(200);
    });

    test('response time should be less than 1000ms for valid product ID', async ({ request }) => {
        const startTime = Date.now();
        await request.get('/api/v1/products/13', { failOnStatusCode: true });
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        expect(responseTime).toBeLessThan(1000);
    });

    test('content-Type header should be application/json for valid product ID', async ({
        request,
    }) => {
        const response = await request.get('/api/v1/products/13', { failOnStatusCode: true });
        expect(response.headers()['content-type']).toContain('application/json');
    });

    test('response should be an object for valid product ID', async ({ request }) => {
        const response = await request.get('/api/v1/products/13', { failOnStatusCode: true });
        const product = await response.json();
        expect(typeof product).toBe('object');
    });

    test('product has all required properties', async ({ request }) => {
        const response = await request.get('/api/v1/products/13', { failOnStatusCode: true });
        const product: Product = await response.json();
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('title');
        expect(product).toHaveProperty('slug');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('images');
    });

    test('product details are correct for valid product ID', async ({ request }) => {
        const response = await request.get('/api/v1/products/13', { failOnStatusCode: true });
        const product: Product = await response.json();
        expect(product.id).toBe(13);
        expect(product.title).toBe('Classic Olive Chino Shorts');
        expect(product.price).toBe(84);
        expect(product.description).toBe(
            'Elevate your casual wardrobe with these classic olive chino shorts. ' +
                'Designed for comfort and versatility, they feature a smooth waistband, ' +
                'practical pockets, and a tailored fit that makes them perfect for both relaxed ' +
                'weekends and smart-casual occasions. The durable fabric ensures they hold up ' +
                'throughout your daily activities while maintaining a stylish look.',
        );
        expect(product.category!.id).toBe(1);
        expect(product.category!.name).toBe('Clothes');
        expect(Array.isArray(product.images)).toBe(true);
        expect(product.images.length).toBeGreaterThan(0);
    });

    test('product images are valid URLs for valid product ID', async ({ request }) => {
        const response = await request.get('/api/v1/products/13', { failOnStatusCode: true });
        const product: Product = await response.json();
        product.images.forEach((image: string) => {
            expect(image).toMatch(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i);
        });
    });

    test('product images is an array for valid product ID', async ({ request }) => {
        const response = await request.get('/api/v1/products/13', { failOnStatusCode: true });
        const product: Product = await response.json();
        expect(Array.isArray(product.images)).toBe(true);
    });

    test('should return 400 status code for non-existent product ID', async ({ request }) => {
        const response = await request.get('/api/v1/products/1500');
        expect(response.status()).toBe(400);
    });
});

test.describe('Create Product', () => {
    test('should create a new product and return 201 status code', async ({ request }) => {
        const newProduct: Product = {
            title: 'Test Product' + Math.floor(Math.random() * 1000),
            price: 99.99,
            description: 'This is a test product',
            categoryId: 1,
            images: ['https://example.com/image.jpg'],
        };
        const response = await request.post('/api/v1/products', {
            data: newProduct,
            failOnStatusCode: false,
        });
        expect(response.status()).toBe(201);
    });

    test('should return the created product with correct details', async ({ request }) => {
        const newProduct: Product = {
            title: 'Test Product' + Math.floor(Math.random() * 1000),
            price: 99.99,
            description: 'This is a test product',
            categoryId: 1,
            images: ['https://example.com/image.jpg'],
        };
        const response = await request.post('/api/v1/products', {
            data: newProduct,
            failOnStatusCode: true,
        });
        const createdProduct: Product = await response.json();
        expect(createdProduct).toHaveProperty('id');
        expect(createdProduct.title).toBe(newProduct.title);
        expect(createdProduct.price).toBe(newProduct.price);
        expect(createdProduct.description).toBe(newProduct.description);
        expect(createdProduct.category!.id).toBe(newProduct.categoryId);
        expect(createdProduct.images).toEqual(newProduct.images);
    });

    test('should return 500 status code when required fields are missing', async ({ request }) => {
        const incompleteProduct = {
            name: 'Incomplete Product',
            // price: 99.99,
            description: 'This product is missing a price',
            categoryId: 1,
            images: ['https://example.com/image.jpg'],
        };
        const response = await request.post('/api/v1/products', {
            data: incompleteProduct,
            failOnStatusCode: false,
        });
        expect(response.status()).toBe(500);
    });

    const invalidPriceCases = [
        { description: 'negative price', price: -10 },
        { description: 'zero price', price: 0 },
        { description: 'non-numeric price', price: 'abc' as unknown as number },
    ];

    for (const { description, price } of invalidPriceCases) {
        test(`should return 400 status code when price is invalid (${description})`, async ({
            request,
        }) => {
            const invalidProduct = {
                title: 'Invalid Product',
                price,
                description: 'This product has an invalid price',
                categoryId: 1,
                images: ['https://example.com/image.jpg'],
            };
            const response = await request.post('/api/v1/products', {
                data: invalidProduct,
                failOnStatusCode: false,
            });
            expect(response.status()).toBe(400);
        });
    }
});

test.describe('Update Product', () => {
    test('should update an existing product and return 200 status code', async ({ request }) => {
        const updatedProduct: Product = {
            title: 'Updated Test Product' + Math.floor(Math.random() * 1000),
            price: 79.99,
            description: 'This is an updated test product',
            categoryId: 1,
            images: ['https://example.com/updated-image.jpg'],
        };
        const response = await request.put('/api/v1/products/13', {
            data: updatedProduct,
            failOnStatusCode: false,
        });
        expect(response.status()).toBe(200);
    });

    test('should return 404 status code when updating a non-existent product', async ({
        request,
    }) => {
        const updatedProduct: Product = {
            title: 'Non-existent Product',
            price: 79.99,
            description: 'Trying to update a non-existent product',
            categoryId: 1,
            images: ['https://example.com/non-existent-image.jpg'],
        };
        const response = await request.put('/api/v1/products/9999', {
            data: updatedProduct,
            failOnStatusCode: false,
        });
        expect(response.status()).toBe(404);
    });

    test('should return 400 status code when updating with invalid data', async ({ request }) => {
        const invalidProduct = {
            title: 'Invalid Update Product',
            price: -50,
            description: 'Trying to update with invalid data',
            categoryId: 1,
            images: ['https://example.com/invalid-update-image.jpg'],
        };
        const response = await request.put('/api/v1/products/13', {
            data: invalidProduct,
            failOnStatusCode: false,
        });
        expect(response.status()).toBe(400);
    });
});
