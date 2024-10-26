import { expect } from "@playwright/test";
import axios from "axios";
import userModel from '../models/userModel';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import { hashPassword } from '../helpers/authHelper';
import categoryModel from "../models/categoryModel";
import orderModel from "../models/orderModel";
import productModel from "../models/productModel";

dotenv.config({ path: './.env' });

let token;
const baseUrl = "http://localhost:6060/api/v1";
const ordersBaseUrl = baseUrl + "/auth/orders";

describe("Test the orders endpoints", () => {
  let user;
  const password = "password"
  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);
    await mongoose.connection.createCollection('users');
    await mongoose.connection.createCollection('categories');
    await mongoose.connection.createCollection('products');
    await mongoose.connection.createCollection('orders');
    const hashedPassword = await hashPassword(password);

    user = new userModel({
      name: "newUser", 
      email: "email@email.com", 
      password: hashedPassword,
      phone: "12345678", 
      address: "123 address", 
      answer: "safeAnswer", 
      role: 0
    });

    await user.save();

    const category = new categoryModel({
      name: "category",
      slug: "category",
    })

    const product = new productModel({
      name: "product",
      slug: "product",
      price: 100,
      category: category._id,
      quantity: 10,
      description: "description",
      shipping: true,
    })

    const order = new orderModel({
      products: [product._id],
      payment: { success: true },
      buyer: user._id,
      status: "Processing"
    })

    await category.save();
    await product.save();
    await order.save();

    try {
      const res = await axios({
        method: "POST",
        url: baseUrl + "/auth/login",
        data: {
          email: user.email,
          password,
        },
      })

      if (res && res.data.success) {
        token = res.data.token;
      }
    } catch (err) {
      console.error("Failed to get user token:", err);
    }
  })

  afterEach(async() => {
    await userModel.deleteOne({ email: user.email });
    await categoryModel.deleteOne({ name: "category" });
    await productModel.deleteOne({ name: "product" });
    await orderModel.deleteOne({ buyer: user._id });
    await mongoose.disconnect();
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
    expect(res.data[0].buyer.name).toBe(user.name);
  })
})