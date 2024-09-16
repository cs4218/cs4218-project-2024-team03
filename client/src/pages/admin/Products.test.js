import React, { useState, useEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Products from "./Products";
import axios from "axios";
import '@testing-library/jest-dom/extend-expect';

import { MemoryRouter, Routes, Route } from "react-router-dom"; // Import MemoryRouter

// Mock axios
jest.mock("axios");
jest.mock("../../context/auth", () => ({
  useAuth: jest.fn(),
}));
jest.mock("../../context/cart", () => ({
  useCart: jest.fn(),
}));
jest.mock("../../context/search", () => ({
  useSearch: jest.fn(),
}));
jest.mock("../../hooks/useCategory", () => ({
  __esModule: true, // this is necessary for default export mocking
  default: jest.fn(),
}));

describe("Products component", () => {
  // Mocking window.matchMedia globally
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

  beforeEach(() => {
    //useAuth.mockReturnValue([{ user: { name: "John Doe", role: 1 } }, mockSetAuth]);
    // Provide mock implementation for useAuth
    const mockSetAuth = jest.fn();
    require("../../context/auth").useAuth.mockReturnValue([{}, mockSetAuth]);
  });
  beforeEach(() => {
    // Provide mock implementation for useAuth
    const mockSetCart = jest.fn();
    require("../../context/cart").useCart.mockReturnValue([mockSetCart]);
    const mockSetValues = jest.fn();
    require("../../context/search").useSearch.mockReturnValue([{}, mockSetValues]);
  });
  beforeEach(() => {
    // Provide mock implementation for useAuth
    const mockSetCategory = jest.fn();
    require("../../hooks/useCategory").default.mockReturnValue([mockSetCategory]);

  });

  test("fetches and displays products", async () => {
    // Mock data
    const mockProducts = [
      {
        _id: "1",
        name: "Product 1",
        description: "Description 1",
        slug: "product-1",
      },
      {
        _id: "2",
        name: "Product 2",
        description: "Description 2",
        slug: "product-2",
      },
    ];

    // Mock the axios.get call
    axios.get.mockResolvedValueOnce({
      data: { products: mockProducts },
    });

    // Render the component
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter initialEntries={['/dashboard/admin/products']}>
        <Routes>
          <Route path="/dashboard/admin/products" element={<Products />} />
        </Routes>
      </MemoryRouter>
    );

    // Verify if axios.get was called
    expect(axios.get).toHaveBeenCalledWith("/api/v1/product/get-product");

    // Wait for the products to be displayed
    await waitFor(() => {
      mockProducts.forEach((product) => {
        expect(getByText(product.name)).toBeInTheDocument();
      });
    });
  });

  test("displays error message on API failure", async () => {
    // Mock a rejected API call
    axios.get.mockRejectedValueOnce(new Error("API error"));

    // Render the component
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter initialEntries={['/dashboard/admin/products']}>
        <Routes>
          <Route path="/dashboard/admin/products" element={<Products />} />
        </Routes>
      </MemoryRouter>
    );
    // Wait for the error message
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/api/v1/product/get-product");
      expect(getByText("Someething Went Wrong")).toBeInTheDocument();
    });
  });
});
