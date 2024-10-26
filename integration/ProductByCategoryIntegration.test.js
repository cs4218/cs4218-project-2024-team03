import axios from "axios";
import { randomInt } from "crypto";

let token;
const baseUrl = "http://localhost:6060/api/v1";
const categoryUrl = `${baseUrl}/product/product-category`;

const mockCategorySlug = "electronics" + randomInt(1000);

describe("Test the category product endpoints", () => {
  beforeAll(async () => {
    try {
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

  it("should fetch products by category", async () => {
    const res = await axios({
      method: "GET",
      url: `${categoryUrl}/${mockCategorySlug}`,
      headers: {
        Authorization: token,
      },
    });

    expect(res.status).toBe(200);
    expect(res.statusText).toBe("OK");
    expect(res.data.success).toBe(true);
    expect(res.data).toHaveProperty("products");
    expect(res.data).toHaveProperty("category");
    expect(res.data.products).toBeInstanceOf(Array);
  });
});
