import axios from "axios";
import { randomInt } from "crypto";

let token;
const baseUrl = "http://localhost:6060/api/v1";

const productBaseUrl = baseUrl + "/product";
const authBaseUrl = baseUrl + "/auth";
const categoryBaseUrl = baseUrl + "/category";

describe("Test admin endpoints", () => {
  const nonAdminToken = "000000000000000000000000000000000000";

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
      console.log(err);
    }
  });
  
  it("should be able to access admin auth endpoint", async () => {
    const res = await axios({
      method: "GET",
      url: authBaseUrl + "/admin-auth",
      headers: {
        Authorization: token,
      },
    });
    expect(res.status).toBe(200);
  });

  it.failing("should not be able to access admin auth endpoint", async () => {
    try {
      const res = await axios({
        method: "GET",
        url: authBaseUrl + "/admin-auth",
        headers: {
          Authorization: nonAdminToken,
        },
      });
    } catch (err) {
      expect(err.response.status).toBe(403);
      expect(err.response.data).toHaveProperty("message", "Unauthorized");
    }
    expect(res.status).not.toBe(200);
  });

  it.failing("should retrieve all orders for admin", async () => {
    const res = await axios({
      method: "GET",
      url: authBaseUrl + "/all-orders",
      headers: {
        Authorization: token,
      },
    });
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("success", true);
    expect(res.data).toHaveProperty("orders");
    expect(res.data.orders).toBeInstanceOf(Array);
  });

  it.failing("should return unauthorized if not admin", async () => {
    try { 
      const res = await axios({
        method: "GET",
        url: authBaseUrl + "/all-orders",
        headers: {
        Authorization: nonAdminToken,
      },
      });
    } catch (err) {
      expect(err.response.status).toBe(403);
      expect(err.response.data).toHaveProperty("message", "Unauthorized");
    }
  });

  it("should update the status of an order", async () => {
    const orderId = "671a178775f125a98e9b9bf2"; // Replace with a valid orderId from your database
    
    const updatedStatus = "Shipped"; 

    const res = await axios({
      method: "PUT",
      url: authBaseUrl + "/order-status/" + orderId,
      data: {
        status: updatedStatus
      },
      headers: {
        Authorization: token,
      },
    });
    
    expect(res.status).toBe(200);
  });

  it.failing("should fail to update order status because invalid update", async () => {
    const orderId = "671a178775f125a98e9b9bf2"; // Replace with a valid orderId from your database
    
    const updatedStatus = 1; 

    const res = await axios({
      method: "PUT",
      url: authBaseUrl + "/order-status/" + orderId,
      data: {
        status: updatedStatus
      },
      headers: {
        Authorization: token,
      },
    });
    
    expect(res.status).not.toBe(200);
  });

  it("should get from the test endpoint", async () => {
    const res = await axios({
      method: "GET",
      url: authBaseUrl + "/test",
      headers: {
        Authorization: token,
      },
    });
    expect(res.status).toBe(200);
  });
});
