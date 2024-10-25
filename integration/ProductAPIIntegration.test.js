    import axios from "axios";
    import { randomInt } from "crypto";

    let token;
    let createdProductId;
    let categoryId;
    const baseUrl = "http://localhost:6060/api/v1";
    const categoryBaseUrl = `${baseUrl}/category`;
    const productBaseUrl = `${baseUrl}/product`;

    describe("Test the product endpoints", () => {
    beforeAll(async () => {
        // Acquire admin token
        try {
        const res = await axios({
            method: "POST",
            url: `${baseUrl}/auth/login`,
            data: {
            email: "admin@sys.com",
            password: "admin",
            },
        });
        if (res && res.data.success) {
            token = res.data.token;
        }
        } catch (err) {
        console.error("Failed to get admin token:", err);
        }
    });

    it("should create a new product", async () => {
        // Assume a valid category ID from the fetched categories
        const categoryRes = await axios({
        method: "GET",
        url: `${categoryBaseUrl}/get-category`,
        headers: {
            Authorization: token,
        },
        });
        categoryId = categoryRes.data.category[0]._id;

        // Create a product
        const productName = "Product " + randomInt(1000);
        const formData = new FormData();
        formData.append("name", productName);
        formData.append("description", "This is a test product description.");
        formData.append("price", "100");
        formData.append("quantity", "10");
        formData.append("category", categoryId);
        // Simulate a file upload 
        formData.append("photo", new Blob(["test photo content"], { type: "image/jpeg" }), "photo.jpg");

        const res = await axios({
        method: "POST",
        url: `${productBaseUrl}/create-product`,
        data: formData,
        headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
        },
        });
        console.log("11111111111", res)
        expect(res.status).toBe(201);
        expect(res.data.success).toBe(true);
        expect(res.data.message).toEqual("Product Created Successfully");
        expect(res.data.products).toEqual(
            expect.objectContaining({
                name: productName,
                slug: productName.replace(/ /g, "-"),
                description: "This is a test product description.",
                price: 100,
                quantity: 10,
                category: categoryId,
                _id: expect.any(String),
                photo: expect.any(Object),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })
        )
        // Save the product ID for updating
        createdProductId = res.data.products._id; 
    });

    it("should update the created product", async () => {
        const updatedProductName = "Updated Product " + randomInt(1000);
        const formData = new FormData();
        formData.append("name", updatedProductName);
        formData.append("description", "This is an updated test product description.");
        formData.append("price", "150");
        formData.append("quantity", "20");
        formData.append("photo", new Blob(["test photo content"], { type: "image/jpeg" }), "photo.jpg");
        formData.append("category", categoryId);

        console.log("3333", formData, `${productBaseUrl}/update-product/${createdProductId}`)

        const res = await axios({
        method: "PUT",
        url: `${productBaseUrl}/update-product/${createdProductId}`,
        data: formData,
        headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
        },
        });

        // Check the response status and structure
        expect(res.status).toBe(201);
        expect(res.data.success).toBe(true);
        expect(res.data.message).toEqual("Product Updated Successfully");
        expect(res.data.products).toEqual(
        expect.objectContaining({
            name: updatedProductName,
            slug: updatedProductName.replace(/ /g, "-"),
            description: "This is an updated test product description.",
            price: 150,
            quantity: 20,
            category: categoryId,
            _id: createdProductId,
            photo: expect.any(Object),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        })
        );
    });
    });
