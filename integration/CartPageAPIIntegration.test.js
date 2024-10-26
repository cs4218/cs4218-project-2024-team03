import axios from "axios";

let token;
const baseUrl = "http://localhost:6060/api/v1";
const tokenUrl = baseUrl + "/product/braintree/token";
const paymentUrl = baseUrl + "/product/braintree/payment";

const mockCartItems = [
  {
    _id: "66eaf9d2a81d7a284daa2963",
    name: "Milo",
    slug: "milo",
    description: "milo description",
    price: 2,
    category: "66e6f3b6f0550841c1571dc1",
    quantity: 2,
    createdAt: "2024-09-18T16:03:30.710Z",
    updatedAt: "2024-09-18T16:03:30.710Z",
    __v: 0,
  },
  {
    _id: "66eaf9afa81d7a284daa294e",
    name: "Coffee",
    slug: "coffee",
    description: "coffee description",
    price: 5,
    category: "66e6f3b6f0550841c1571dc1",
    quantity: 2,
    createdAt: "2024-09-18T16:02:55.706Z",
    updatedAt: "2024-09-18T16:02:55.706Z",
    __v: 0,
  },
  {
    _id: "66eaf9d2a81d7a284daa2963",
    name: "Cereal",
    slug: "cereal",
    description: "cereal description",
    price: 4,
    category: "66e6f3b6f0550841c1571dc1",
    quantity: 1,
    createdAt: "2024-09-18T16:03:30.710Z",
    updatedAt: "2024-09-18T16:03:30.710Z",
    __v: 0,
  },
];

describe("Test the payment endpoints", () => {
  beforeAll(async () => {
    try {
      // The db should contain an admin user with the following credentials
      const res = await axios({
        method: "POST",
        url: baseUrl + "/auth/login",
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

  it("should fetch a payment gateway token", async () => {
    const res = await axios({
      method: "GET",
      url: tokenUrl,
      headers: {
        Authorization: token,
      },
    });

    expect(res.status).toBe(200);
    expect(res.statusText).toBe("OK");
    expect(res.data.success).toBe(true);
    expect(res.data).toHaveProperty("clientToken");
    expect(typeof res.data.clientToken).toBe("string");
  });

  it("should handle payment processing", async () => {
    // Mock a payment nonce for testing
    const mockNonce = "fake-payment-nonce";

    // Send a payment request
    const res = await axios({
      method: "POST",
      url: paymentUrl,
      data: {
        nonce: mockNonce,
        cart: mockCartItems,
      },
      headers: {
        Authorization: token,
      },
    });

    expect(res.status).toBe(200);
    expect(res.data.ok).toBe(true);
    expect(res.statusText).toBe("OK");
  });
});
