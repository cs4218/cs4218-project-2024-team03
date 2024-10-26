import { expect } from "@playwright/test";
import axios from "axios";

import userModel from '../models/userModel';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import { hashPassword } from '../helpers/authHelper';

dotenv.config({ path: './.env' });

let token;
const baseUrl = "http://localhost:6060/api/v1";
const profileBaseUrl = baseUrl + "/auth/profile";


describe("Test the profile endpoints", () => {
  let user;
  let password = 'password';
  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);
    await mongoose.connection.createCollection('users');
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

    try {
      const res = await axios({
        method: "POST",
        url: baseUrl + "/auth/login",
        data: {
          email: user.email,
          password: 'password',
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
    await mongoose.disconnect();
  })

  it('should be able to update existing user', async () => {
    const updatedUserData = {
      name: "Test User 1", 
      email: user.email,
      password: password,
      phone: "1234567890",
      address: "123 Test Street",
    }

    const res = await axios({
      method: "PUT",
      url: profileBaseUrl,
      data: {
        ...updatedUserData
      },
      headers: {
        Authorization: token,
      },
    })

    expect(res.status).toBe(200);
    expect(res.statusText).toBe("OK");
    expect(res.data.success).toBe(true);
    expect(res.data.message).toBe("Profile Updated SUccessfully");
    expect(res.data.updatedUser.name).toBe(updatedUserData.name);
  })

  it('should return error when updating password with less than 6 characters', async () => {
    const updatedUserData = {
      name: user.name,
      email: user.email,
      password: "pass",
      phone: user.phone,
      address: user.address,
    }

      const res = await axios({
        method: "PUT",
        url: profileBaseUrl,
        data: {
          ...updatedUserData
        },
        headers: {
          Authorization: token,
        },
      })

      expect(res.status).toBe(200);
      expect(res.statusText).toBe("OK");
      expect(res.data.error).toBe("Passsword is required and 6 character long")
  });

  it('should be able to update password when password is 6 characters long', async () => {
    const updatedUserData = {
      name: user.name,
      email: user.email,
      password: "validPassword",
      phone: user.phone,
      address: user.address,
    }

    const res = await axios({
      method: "PUT",
      url: profileBaseUrl,
      data: {
        ...updatedUserData
      },
      headers: {
        Authorization: token,
      },
    })

    expect(res.status).toBe(200);
    expect(res.statusText).toBe("OK");
    expect(res.data.success).toBe(true);
    expect(res.data.message).toBe("Profile Updated SUccessfully");
    expect(res.data.updatedUser.name).toBe(updatedUserData.name);
  })
})