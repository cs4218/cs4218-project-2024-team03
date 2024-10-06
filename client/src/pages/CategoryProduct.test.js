import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import CategoryProduct from "./CategoryProduct";
import "@testing-library/jest-dom/extend-expect";

// Mock axios
jest.mock("axios");

jest.mock("../context/auth", () => ({
  useAuth: jest.fn(() => [null, jest.fn()]),
}));

jest.mock("../context/cart", () => ({
  useCart: jest.fn(() => [null, jest.fn()]),
}));

jest.mock("../context/search", () => ({
  useSearch: jest.fn(() => [{ keyword: "" }, jest.fn()]),
}));

const name = "Beverages";
const slug = "beverages";

const mockNavigate = jest.fn();
// Mock useParams to return a specific category slug
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ slug }),
  useNavigate: () => mockNavigate,
}));

const mockGetProductByCategoryData = {
  data: {
    success: true,
    category: {
      _id: "1",
      name: name,
      slug: slug,
      __v: 0,
    },
    products: [
      {
        photos: {
          data: {
            type: "Buffer",
            data: [],
          },
          contentType: "image/jpeg",
        },
        _id: "1",
        name: "product-1",
        slug: "product-1",
        description: "milo family pack",
        price: 5.0,
        category: {
          _id: "1",
          name: name,
          slug: slug,
          __v: 0,
        },
        quantity: 10000,
        createdAt: "2024-09-18T03:19:00.113Z",
        updatedAt: "2024-09-18T03:19:00.113Z",
        __v: 0,
      },
      {
        photos: {
          data: {
            type: "Buffer",
            data: [],
          },
          contentType: "image/jpeg",
        },
        _id: "2",
        name: "product-2",
        slug: "product-2",
        description: "product-2",
        price: 5.0,
        category: {
          _id: "1",
          name: name,
          slug: slug,
          __v: 0,
        },
        quantity: 10000,
        createdAt: "2024-09-18T03:19:00.113Z",
        updatedAt: "2024-09-18T03:19:00.113Z",
        __v: 0,
      },
    ],
  },
};

describe("CategoryProduct Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("API call successfully fetches one or more products by category and display them", async () => {
    // Mock API response for categories in the navigation bar
    axios.get.mockResolvedValueOnce({ data: [] });

    // Mock API response for products by category
    axios.get.mockResolvedValueOnce(mockGetProductByCategoryData);

    render(
      <MemoryRouter initialEntries={["/category/product-1"]}>
        <Routes>
          <Route path="/category/:slug" element={<CategoryProduct />} />
        </Routes>
      </MemoryRouter>
    );

    // check if the API was called with the correct endpoint
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        `/api/v1/product/product-category/${slug}`
      )
    );

    // Check if category name is rendered
    expect(await screen.findByText(`Category - ${name}`)).toBeInTheDocument();

    // // Check if products are rendered
    expect(await screen.findByText("product-1")).toBeInTheDocument();
    expect(await screen.findByText("product-2")).toBeInTheDocument();
    expect(await screen.findByText("2 result found")).toBeInTheDocument();

    // Check if two "More Details" buttons are rendered
    const moreDetailsButtons = screen.queryAllByRole("button", {
      name: /More Details/i,
    });
    expect(moreDetailsButtons.length).toBe(2);
  });

  it("clicking 'More Details' button navigates to the correct product page", async () => {
    // Mock API response for categories in the navigation bar
    axios.get.mockResolvedValueOnce({ data: [] });

    // Mock API response for products by category
    axios.get.mockResolvedValueOnce(mockGetProductByCategoryData);

    render(
      <MemoryRouter initialEntries={["/category/product-1"]}>
        <Routes>
          <Route path="/category/:slug" element={<CategoryProduct />} />
        </Routes>
      </MemoryRouter>
    );

    // Find and click the "More Details" button
    const moreDetailsButton = await screen.findAllByRole("button", {
      name: /More Details/i,
    });

    // click on the product-1 more details button
    fireEvent.click(moreDetailsButton[0]);
    // Assert that useNavigate was called with the correct URL
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/product/product-1");
    });
    // click on the product-2 more details button
    fireEvent.click(moreDetailsButton[1]);
    // Assert that useNavigate was called with the correct URL
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/product/product-2");
    });
  });

  it("API call successfully fetches 0 product by category and renders no product", async () => {
    axios.get.mockResolvedValueOnce([]);

    const mockGetEmptyProductByCategory = {
      data: {
        success: true,
        category: {
          _id: "1",
          name: name,
          slug: slug,
          __v: 0,
        },
        products: [],
      },
    };

    // Mock API response for products by category
    axios.get.mockResolvedValueOnce(mockGetEmptyProductByCategory);

    render(
      <MemoryRouter initialEntries={["/category/product-1"]}>
        <Routes>
          <Route path="/category/:slug" element={<CategoryProduct />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if category name is rendered
    expect(await screen.findByText(`Category - ${name}`)).toBeInTheDocument();

    // // Check if no product is rendered
    expect(await screen.findByText("0 result found")).toBeInTheDocument();

    // Check if no "More Details" button is rendered
    const moreDetailsButtons = screen.queryAllByRole("button", {
      name: /More Details/i,
    });
    expect(moreDetailsButtons.length).toBe(0);
  });

  it("API call fetches 0 product when the category does not exits", async () => {
    // Mock API error response
    axios.get.mockResolvedValueOnce([]);

    const mockGetProductByNonExistentCategory = {
      data: {
        success: true,
        category: null,
        products: [],
      },
    };

    // Mock API response for products by category
    axios.get.mockResolvedValueOnce(mockGetProductByNonExistentCategory);

    render(
      <MemoryRouter initialEntries={["/category/test-category"]}>
        <Routes>
          <Route path="/category/:slug" element={<CategoryProduct />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const categoryTitle = screen.getByText("Category -", { exact: false });
      expect(categoryTitle).toBeInTheDocument();
    });

    // Check if no product is rendered
    expect(await screen.findByText("0 result found")).toBeInTheDocument();

    // Check if no "More Details" button is rendered
    const moreDetailsButtons = screen.queryAllByRole("button", {
      name: /More Details/i,
    });
    expect(moreDetailsButtons.length).toBe(0);
  });

  // this would fail because there is no error handling in the component
  it.failing("handles API call errors gracefully", async () => {
    // observe console.error
    const consoleSpy = jest.spyOn(console, "error");
    consoleSpy.mockImplementation(() => {
      return;
    });

    // Mock API response for categories in the navigation bar
    axios.get.mockResolvedValueOnce({ data: [] });

    // Mock API error response from fetching products by category
    axios.get.mockRejectedValue({ response: { status: 500 } });

    render(
      <MemoryRouter initialEntries={["/category/test-category"]}>
        <Routes>
          <Route path="/category/:slug" element={<CategoryProduct />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(axios.get);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
