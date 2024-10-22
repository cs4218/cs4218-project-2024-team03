import axios from "axios";
import { randomInt } from "crypto";

let token;
const baseUrl = "http://localhost:6060/api/v1";
const categoryBaseUrl = baseUrl + "/category";
describe("Test the category endpoints", () => {
  beforeAll(async () => {
    // acquire admin token
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
      console.log(err);
    }
  });
  it("should create a new category", async () => {
    const CATEGORY_NAME = "category " + randomInt(1000);
    const category = {
      name: CATEGORY_NAME,
    };
    const res = await axios({
      method: "POST",
      url: categoryBaseUrl + "/create-category",
      data: category,
      headers: {
        Authorization: token,
      },
    });
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    expect(res.data.message).toEqual("new category created");
    expect(res.data.category).toEqual({
      name: CATEGORY_NAME,
      slug: CATEGORY_NAME.replaceAll(" ", "-"),
      _id: expect.any(String),
      __v: 0,
    });
  });
  it("should update category", async () => {
    let TEST_CATEGORY = "test category " + randomInt(1000);
    const res1 = await axios({
      method: "POST",
      url: categoryBaseUrl + "/create-category",
      data: {
        name: TEST_CATEGORY,
      },
      headers: {
        Authorization: token,
      },
    });
    const category_id = res1.data.category._id;
    TEST_CATEGORY = TEST_CATEGORY + " updated";
    const res2 = await axios({
      method: "PUT",
      url: categoryBaseUrl + "/update-category/" + category_id,
      data: {
        name: TEST_CATEGORY,
      },
      headers: {
        Authorization: token,
      },
    });
    expect(res2.status).toBe(200);
    expect(res2.data.category).toEqual({
      _id: category_id,
      name: TEST_CATEGORY,
      slug: TEST_CATEGORY.replaceAll(" ", "-"),
      __v: 0,
    });
  });
  it("should return all categories", async () => {
    const res = await axios({
      method: "GET",
      url: categoryBaseUrl + "/get-category",
    });
    expect(res.status).toBe(200);
    expect(res.data.category).toBeInstanceOf(Array);
  });
  it("should return category with slug", async () => {
    const TEST_CATEGORY = "test category " + randomInt(1000);
    const res1 = await axios({
      method: "POST",
      url: categoryBaseUrl + "/create-category",
      data: {
        name: TEST_CATEGORY,
      },
      headers: {
        Authorization: token,
      },
    });
    const slug = res1.data.category.slug;
    const category_id = res1.data.category._id;
    const res2 = await axios({
      method: "GET",
      url: categoryBaseUrl + "/single-category/" + slug,
      headers: {
        Authorization: token,
      },
    });
    expect(res2.status).toBe(200);
    expect(res2.data.category).toEqual({
      _id: category_id,
      name: TEST_CATEGORY,
      slug: TEST_CATEGORY.replaceAll(" ", "-"),
      __v: 0,
    });
  });
  it("should delete category by id", async () => {
    const TEST_CATEGORY = "test category " + randomInt(1000);
    const res1 = await axios({
      method: "POST",
      url: categoryBaseUrl + "/create-category",
      data: {
        name: TEST_CATEGORY,
      },
      headers: {
        Authorization: token,
      },
    });
    const category_id = res1.data.category._id;
    const res2 = await axios({
      method: "DELETE",
      url: categoryBaseUrl + "/delete-category/" + category_id,
      headers: {
        Authorization: token,
      },
    });
    expect(res2.data).toEqual({
      success: true,
      message: "Categry Deleted Successfully",
    });
  });
});
