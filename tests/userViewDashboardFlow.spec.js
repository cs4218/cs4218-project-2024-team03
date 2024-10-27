import { test, expect } from '@playwright/test';
import userModel from '../models/userModel';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import { hashPassword } from '../helpers/authHelper';

dotenv.config({ path: './.env' });

test.describe('user view dashboard flow', () => {
  test.beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);
    await mongoose.connection.createCollection('users');

    const hashedPassword = await hashPassword("password");
    const user = new userModel({
      name: "newUser", 
      email: "email@email.com", 
      password: hashedPassword,
      phone: "12345678", 
      address: "123 address", 
      answer: "safeAnswer", 
      role: 0
  });

    await user.save();
  })

  test.afterEach(async() => {
    await userModel.deleteOne({ email: "email@email.com" });
    await mongoose.disconnect();
  })

  test("login -> dashboard -> view user dashboard -> logout", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByText("LOGIN").click();
    await page.getByPlaceholder("Enter Your Email").fill("email@email.com");
    await page.getByPlaceholder("Enter Your Password").fill("password");
    await page.getByRole("button", { name: "LOGIN" }).click();
    await page.waitForURL("http://localhost:3000/");

    await page.getByRole("button", { name: "NEWUSER"}).click();
    await page.getByText("Dashboard").click();

    expect(page.getByRole("heading", { name: 'newUser'})).toBeVisible();
    expect(page.getByRole("heading", { name: 'email@email'})).toBeVisible();
    expect(page.getByRole("heading", { name: '123 address'})).toBeVisible();

    await page.getByRole("button", { name: "NEWUSER"}).click();
    await page.getByText("LOGOUT").click();
  })
})