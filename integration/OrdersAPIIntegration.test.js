import { expect } from "@playwright/test";
import axios from "axios";

let token;
const baseUrl = "http://localhost:6060/api/v1";
const ordersBaseUrl = baseUrl + "/auth/orders";

// Please update the name, email and password based on the user in your database
const name = "Test User"
const email = "test@email.com"
const password = "password"

describe("Test the orders endpoints", () => {
  beforeEach(async () => {
    try {
      const res = await axios({
        method: "POST",
        url: baseUrl + "/auth/login",
        data: {
          email: email,
          password: password,
        },
      })

      if (res && res.data.success) {
        token = res.data.token;
      }
    } catch (err) {
      console.error("Failed to get user token:", err);
    }
  })

  it('should fetch all orders for user', async () => {
    const res = await axios({
      method: "GET",
      url: ordersBaseUrl,
      headers: {
        Authorization: token,
      },
    })

    expect(res.status).toBe(200);
    expect(res.statusText).toBe("OK");

    if (res.data.length > 0) {
      expect(res.data[0].buyer.name).toBe(name);
    }
  })
})