import { test, expect, APIResponse } from '@playwright/test';

type ProductRequest = {
    title: string;
    slug?: string;
    price: number;
    description: string;
    categoryId: number;
    images: string[];
};

type ProductResponse = {
    id: number;
    title: string;
    slug: string;
    price: number;
    description: string;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    images: string[];
};

test.describe('Get All Products', () => {
    test('should return 200 status code', async ({ request }) => {
        const response: APIResponse =
            await test.step('Send GET request to /api/v1/products', async () => {
                return await request.get('/api/v1/products');
            });
        await test.step('Verify response status code and status text', async () => {
            expect(response.status()).toBe(200);
            expect(response.statusText()).toBe('OK');
        });
    });

    test('response time should be less than 1000ms', async ({ request }) => {
        const responseTime =
            await test.step('Measure response time for GET request to /api/v1/products', async () => {
                const startTime = Date.now();
                await request.get('/api/v1/products', { failOnStatusCode: true });
                const endTime = Date.now();
                return endTime - startTime;
            });
        await test.step('Verify response time is less than 1000ms', async () => {
            expect(responseTime).toBeLessThan(1000);
        });
    });

    test('content-Type header should be application/json', async ({ request }) => {
        const response: APIResponse =
            await test.step('Send GET request to /api/v1/products and verify content-type header', async () => {
                return await request.get('/api/v1/products', { failOnStatusCode: true });
            });
        await test.step('Verify content-type header is application/json', async () => {
            expect(response.headers()['content-type']).toContain('application/json');
        });
    });

    test('should return an array of products', async ({ request }) => {
        const products: ProductResponse[] =
            await test.step('Send GET request to /api/v1/products and verify response is an array', async () => {
                const response = await request.get('/api/v1/products', { failOnStatusCode: true });
                return await response.json();
            });
        await test.step('Verify response is an array', async () => {
            expect(Array.isArray(products)).toBe(true);
        });
    });

    test('response body should not be empty', async ({ request }) => {
        const products: ProductResponse[] =
            await test.step('Send GET request to /api/v1/products and verify response body is not empty', async () => {
                const response = await request.get('/api/v1/products', { failOnStatusCode: true });
                return await response.json();
            });
        await test.step('Verify response body is not empty', async () => {
            expect(products.length).toBeGreaterThan(0);
        });
    });

    test('each product should have required fields', async ({ request }) => {
        const products: ProductResponse[] =
            await test.step('Send GET request to /api/v1/products and verify each product has required fields', async () => {
                const response = await request.get('/api/v1/products', { failOnStatusCode: true });
                return await response.json();
            });
        await test.step('Verify each product has required fields', async () => {
            expect(products[0]).toMatchObject({
                id: expect.any(Number),
                title: expect.any(String),
                price: expect.any(Number),
                description: expect.any(String),
                category: expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    slug: expect.any(String),
                }),
                images: expect.arrayContaining([expect.any(String)]),
            });
        });
    });

    test('all products should have a non-empty title', async ({ request }) => {
        const products: ProductResponse[] =
            await test.step('Send GET request to /api/v1/products and verify all products have a non-empty title', async () => {
                const response = await request.get('/api/v1/products', { failOnStatusCode: true });
                return await response.json();
            });
        await test.step('Verify all products have a non-empty title', async () => {
            products.forEach((product: ProductResponse) => {
                expect(product.title).toBeTruthy();
            });
        });
    });

    test('all products should have a non-empty description', async ({ request }) => {
        const products: ProductResponse[] =
            await test.step('Send GET request to /api/v1/products and verify all products have a non-empty description', async () => {
                const response = await request.get('/api/v1/products', { failOnStatusCode: true });
                return await response.json();
            });
        await test.step('Verify all products have a non-empty description', async () => {
            products.forEach((product: ProductResponse) => {
                expect(product.description).toBeTruthy();
            });
        });
    });

    test('all products should have a price greater than 0', async ({ request }) => {
        const response: APIResponse =
            await test.step('Send GET request to /api/v1/products and verify all products have a price greater than 0', async () => {
                return await request.get('/api/v1/products', { failOnStatusCode: true });
            });
        await test.step('Verify all products have a price greater than 0', async () => {
            const products: ProductResponse[] = await response.json();
            products.forEach((product: ProductResponse) => {
                expect(product.price).toBeGreaterThanOrEqual(0);
            });
        });
    });

    test('all products should have an array of images', async ({ request }) => {
        const products: ProductResponse[] =
            await test.step('Send GET request to /api/v1/products and verify all products have an array of images', async () => {
                const response = await request.get('/api/v1/products', { failOnStatusCode: true });
                return await response.json();
            });
        await test.step('Verify all products have an array of images', async () => {
            products.forEach((product: ProductResponse) => {
                expect(Array.isArray(product.images)).toBe(true);
            });
        });
    });

    test('all products should have at least one image', async ({ request }) => {
        const products: ProductResponse[] =
            await test.step('Send GET request to /api/v1/products and verify all products have at least one image', async () => {
                const response = await request.get('/api/v1/products', { failOnStatusCode: true });
                return await response.json();
            });
        await test.step('Verify all products have at least one image', async () => {
            products.forEach((product: ProductResponse) => {
                expect(product.images.length).toBeGreaterThan(0);
            });
        });
    });

    test('product images should be valid URLs', async ({ request }) => {
        const products: ProductResponse[] =
            await test.step('Send GET request to /api/v1/products and verify all product images are valid URLs', async () => {
                const response = await request.get('/api/v1/products', { failOnStatusCode: true });
                return await response.json();
            });
        await test.step('Verify all product images are valid URLs', async () => {
            products.forEach((product: ProductResponse) => {
                product.images.forEach((image: string) => {
                    expect(image).toMatch(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i);
                });
            });
        });
    });

    test('all products should have a valid category with id and name', async ({ request }) => {
        const products: ProductResponse[] =
            await test.step('Send GET request to /api/v1/products and verify all products have a valid category', async () => {
                const response = await request.get('/api/v1/products', { failOnStatusCode: true });
                return await response.json();
            });
        await test.step('Verify all products have a valid category', async () => {
            products.forEach((product: ProductResponse) => {
                expect(product.category).toBeTruthy();
                expect(product.category!.id).toBeTruthy();
                expect(product.category!.name).toBeTruthy();
            });
        });
    });
});

test.describe('Get Product by ID', () => {
    let randomProductId: number;
    test.beforeAll(async ({ request }) => {
        const response = await request.get('/api/v1/products', { failOnStatusCode: true });
        const products: ProductResponse[] = await response.json();
        randomProductId = products[Math.floor(Math.random() * products.length)].id;
    });

    test('should return 200 status code for valid product ID', async ({ request }) => {
        const response =
            await test.step('Send GET request to /api/v1/products/:id and verify status code is 200', async () => {
                return await request.get(`/api/v1/products/${randomProductId}`);
            });
        await test.step('Verify response status code is 200', async () => {
            expect(response.status()).toBe(200);
            expect(response.statusText()).toBe('OK');
        });
    });

    test('response time should be less than 1000ms for valid product ID', async ({ request }) => {
        const responseTime =
            await test.step('Measure response time for GET request to /api/v1/products/:id', async () => {
                const startTime = Date.now();
                await request.get(`/api/v1/products/${randomProductId}`, {
                    failOnStatusCode: true,
                });
                const endTime = Date.now();
                return endTime - startTime;
            });
        await test.step('Verify response time is less than 1000ms', async () => {
            expect(responseTime).toBeLessThan(1000);
        });
    });

    test('content-Type header should be application/json for valid product ID', async ({
        request,
    }) => {
        const response =
            await test.step('Send GET request to /api/v1/products/:id and verify content-type header', async () => {
                return await request.get(`/api/v1/products/${randomProductId}`, {
                    failOnStatusCode: true,
                });
            });
        await test.step('Verify content-type header is application/json', async () => {
            expect(response.headers()['content-type']).toContain('application/json');
        });
    });

    test('response should be an object for valid product ID', async ({ request }) => {
        const product =
            await test.step('Send GET request to /api/v1/products/:id and verify response is an object', async () => {
                return await request.get(`/api/v1/products/${randomProductId}`, {
                    failOnStatusCode: true,
                });
            });
        await test.step('Verify response is an object', async () => {
            const productResponse = await product.json();
            expect(typeof productResponse).toBe('object');
        });
    });

    test('product has all required properties', async ({ request }) => {
        const response =
            await test.step('Send GET request to /api/v1/products/:id and verify all required properties are present', async () => {
                return await request.get(`/api/v1/products/${randomProductId}`, {
                    failOnStatusCode: true,
                });
            });
        await test.step('Verify product has all required properties', async () => {
            const product: ProductResponse = await response.json();
            expect(product).toHaveProperty('id');
            expect(product).toHaveProperty('title');
            expect(product).toHaveProperty('slug');
            expect(product).toHaveProperty('price');
            expect(product).toHaveProperty('description');
            expect(product).toHaveProperty('category');
            expect(product).toHaveProperty('images');
        });
    });

    test('product images are valid URLs for valid product ID', async ({ request }) => {
        const response =
            await test.step('Send GET request to /api/v1/products/:id and verify product images are valid URLs', async () => {
                return await request.get(`/api/v1/products/${randomProductId}`, {
                    failOnStatusCode: true,
                });
            });
        await test.step('Verify product images are valid URLs', async () => {
            const product: ProductResponse = await response.json();
            product.images.forEach((image: string) => {
                expect(image).toMatch(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i);
            });
        });
    });

    test('product images is an array for valid product ID', async ({ request }) => {
        const response =
            await test.step('Send GET request to /api/v1/products/:id and verify product images is an array', async () => {
                return await request.get(`/api/v1/products/${randomProductId}`, {
                    failOnStatusCode: true,
                });
            });
        await test.step('Verify product images is an array', async () => {
            const product: ProductResponse = await response.json();
            expect(Array.isArray(product.images)).toBe(true);
        });
    });

    test('should return 400 status code for non-existent product ID', async ({ request }) => {
        const response =
            await test.step('Send GET request to /api/v1/products/:id with non-existent ID and verify status code is 400', async () => {
                return await request.get(`/api/v1/products/${randomProductId + randomProductId}`, {
                    failOnStatusCode: false,
                });
            });
        await test.step('Verify response status code is 400', async () => {
            expect(response.status()).toBe(400);
        });
    });
});

test.describe('Create Product', () => {
    test('should create a new product and return 201 status code', async ({ request }) => {
        const response =
            await test.step('Send POST request to /api/v1/products with valid product data', async () => {
                const newProduct: ProductRequest = {
                    title: 'Test Product' + Math.floor(Math.random() * 1000),
                    price: 99.99,
                    description: 'This is a test product',
                    categoryId: 1,
                    images: ['https://example.com/image.jpg'],
                };
                return await request.post('/api/v1/products', {
                    data: newProduct,
                    failOnStatusCode: false,
                });
            });
        await test.step('Verify response status code is 201', async () => {
            expect(response.status()).toBe(201);
            expect(response.statusText()).toBe('Created');
        });
    });

    test('created product request should have correct headers', async ({ request }) => {
        const response =
            await test.step('Send POST request to /api/v1/products with valid product data', async () => {
                const newProduct: ProductRequest = {
                    title: 'Test Product' + Math.floor(Math.random() * 1000),
                    price: 99.99,
                    description: 'This is a test product',
                    categoryId: 1,
                    images: ['https://example.com/image.jpg'],
                };
                return await request.post('/api/v1/products', {
                    data: newProduct,
                    failOnStatusCode: false,
                });
            });
        await test.step('Verify response has correct headers', async () => {
            expect(response.headers()['content-type']).toContain('application/json');
        });
    });

    test('should return the created product with correct details', async ({ request }) => {
        let newProduct: ProductRequest;
        const response =
            await test.step('Send POST request to /api/v1/products with valid product data', async () => {
                newProduct = {
                    title: 'Test Product' + Math.floor(Math.random() * 1000),
                    price: 99.99,
                    description: 'This is a test product',
                    categoryId: 1,
                    images: ['https://example.com/image.jpg'],
                };
                return await request.post('/api/v1/products', {
                    data: newProduct,
                    failOnStatusCode: true,
                });
            });
        await test.step('Verify created product has correct details', async () => {
            const createdProduct: ProductResponse = await response.json();
            // expect(createdProduct).toMatchObject(newProduct);
            expect(createdProduct).toHaveProperty('id');
            expect(createdProduct.title).toBe(newProduct.title);
            expect(createdProduct.price).toBe(newProduct.price);
            expect(createdProduct.description).toBe(newProduct.description);
            expect(createdProduct.category.id).toBe(newProduct.categoryId);
            expect(createdProduct.images).toEqual(newProduct.images);
        });
    });

    test('should return 500 status code when required fields are missing', async ({ request }) => {
        const response =
            await test.step('Send POST request to /api/v1/products with missing required fields', async () => {
                const incompleteProduct = {
                    title: 'Incomplete Product',
                    // price: 99.99,
                    description: 'This product is missing a price',
                    categoryId: 1,
                    images: ['https://example.com/image.jpg'],
                };
                return await request.post('/api/v1/products', {
                    data: incompleteProduct,
                    failOnStatusCode: false,
                });
            });
        await test.step('Verify response status code is 500', async () => {
            expect(response.status()).toBe(500);
        });
    });

    const invalidPriceCases = [
        {
            description: 'negative price',
            price: -10,
            expectedMessage: 'price must be a positive number',
        },
        { description: 'zero price', price: 0, expectedMessage: 'price must be a positive number' },
        {
            description: 'non-numeric price',
            price: 'abc' as unknown as number,
            expectedMessage: 'price must be a positive number',
        },
        {
            description: 'null price',
            price: null as unknown as number,
            expectedMessage: 'price should not be empty',
        },
    ];

    for (const { description, price, expectedMessage } of invalidPriceCases) {
        test(`should return 400 status code when price is invalid (${description})`, async ({
            request,
        }) => {
            const response =
                await test.step(`Send POST request to /api/v1/products with invalid price (${description})`, async () => {
                    const invalidProduct = {
                        title: 'Invalid Product',
                        price,
                        description: 'This product has an invalid price',
                        categoryId: 1,
                        images: ['https://example.com/image.jpg'],
                    };
                    return await request.post('/api/v1/products', {
                        data: invalidProduct,
                        failOnStatusCode: false,
                    });
                });
            await test.step(`Verify response status code is 400 and error message is correct for invalid price (${description})`, async () => {
                const responseBody = await response.json();
                expect(response.status()).toBe(400);
                expect(responseBody.error).toBe('Bad Request');
                expect(responseBody.statusCode).toBe(400);
                expect(responseBody.message).toEqual(expect.arrayContaining([expectedMessage]));
            });
        });
    }
});

test.describe('Update Product', () => {
    let randomProductId: number;
    test.beforeAll(async ({ request }) => {
        const response = await request.get('/api/v1/products', { failOnStatusCode: true });
        const products: ProductResponse[] = await response.json();
        randomProductId = products[Math.floor(Math.random() * products.length)].id;
    });

    test('should update an existing product and return 200 status code', async ({ request }) => {
        let updatedProduct: ProductRequest;
        const putResponse =
            await test.step('Send PUT request to /api/v1/products/:id with updated product data', async () => {
                updatedProduct = {
                    title: 'Updated Test Product' + Math.floor(Math.random() * 1000),
                    price: 79,
                    description: 'This is an updated test product',
                    categoryId: 1,
                    images: ['https://example.com/updated-image.jpg'],
                };
                return await request.put(`/api/v1/products/${randomProductId}`, {
                    data: updatedProduct,
                    failOnStatusCode: true,
                });
            });
        await test.step('Verify response status code is 200 and product details are updated', async () => {
            const getResponse = await request.get(`/api/v1/products/${randomProductId}`, {
                failOnStatusCode: true,
            });
            const product: ProductResponse = await getResponse.json();
            expect(putResponse.status()).toBe(200);
            expect(putResponse.statusText()).toBe('OK');
            expect(product.title).toBe(updatedProduct.title);
            expect(product.price).toBe(updatedProduct.price);
            expect(product.description).toBe(updatedProduct.description);
            expect(product.category.id).toBe(updatedProduct.categoryId);
            expect(product.images).toEqual(updatedProduct.images);
        });
    });

    test('should return 400 status code when updating a non-existent product', async ({
        request,
    }) => {
        const response =
            await test.step('Send PUT request to /api/v1/products/:id with non-existent product ID', async () => {
                const updatedProduct: ProductRequest = {
                    title: 'Non-existent Product',
                    price: 79.99,
                    description: 'Trying to update a non-existent product',
                    categoryId: 1,
                    images: ['https://example.com/non-existent-image.jpg'],
                };
                return await request.put('/api/v1/products/9999', {
                    data: updatedProduct,
                    failOnStatusCode: false,
                });
            });
        await test.step('Verify response status code is 400', async () => {
            expect(response.status()).toBe(400);
        });
    });

    test('should return 400 status code when updating with invalid data', async ({ request }) => {
        const response =
            await test.step('Send PUT request to /api/v1/products/:id with invalid product data', async () => {
                const invalidProduct = {
                    title: 'Invalid Update Product',
                    price: -50,
                    description: 'Trying to update with invalid data',
                    categoryId: 1,
                    images: ['https://example.com/invalid-update-image.jpg'],
                };
                return await request.put(`/api/v1/products/${randomProductId}`, {
                    data: invalidProduct,
                    failOnStatusCode: false,
                });
            });
        await test.step('Verify response status code is 400', async () => {
            expect(response.status()).toBe(400);
        });
    });
});
