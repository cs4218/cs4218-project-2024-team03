import React, { useState, useEffect } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Products from "./Products";
import axios from "axios";
import toast from 'react-hot-toast'
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { afterEach } from "node:test";
import { useAuth } from "../../context/auth";

jest.mock("axios");
jest.mock('react-hot-toast');

jest.mock('../../context/auth', () => ({
  useAuth: jest.fn(() => [null, jest.fn()]) 
}));
jest.mock("../../context/cart", () => ({
  useCart: jest.fn(),
}));
jest.mock("../../context/search", () => ({
  useSearch: jest.fn(),
}));
jest.mock("../../hooks/useCategory", () => ({
  __esModule: true,
  default: jest.fn(),
}));

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

describe("Products component", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    useAuth.mockReturnValue([{ token: "test-token" }, jest.fn()]);
    
    const mockSetCart = jest.fn();
    require("../../context/cart").useCart.mockReturnValue([mockSetCart]);
    
    const mockSetValues = jest.fn();
    require("../../context/search").useSearch.mockReturnValue([{}, mockSetValues]);
    
    const mockSetCategory = jest.fn();
    require("../../hooks/useCategory").default.mockReturnValue([mockSetCategory]);
  });

  test("fetches product from server", async () => {
    axios.get.mockResolvedValueOnce({data: { products: mockProducts }});
    
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/products']}>
        <Routes>
          <Route path="/dashboard/admin/products" element={<Products />} />
        </Routes>
      </MemoryRouter>
    );

    expect(axios.get).toHaveBeenCalledWith("/api/v1/product/get-product");
  });

  test("render products properly", async () => {
    axios.get.mockResolvedValueOnce({data: { products: mockProducts }});

    render(
      <MemoryRouter initialEntries={['/dashboard/admin/products']}>
        <Routes>
          <Route path="/dashboard/admin/products" element={<Products />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Product 1")).toBeInTheDocument();
    expect(await screen.findByText("Description 1")).toBeInTheDocument();
    expect(await screen.findByText("Product 2")).toBeInTheDocument();
    expect(await screen.findByText("Description 2")).toBeInTheDocument();
  });

  test("handles no product properly", async () => {
    axios.get.mockResolvedValueOnce({data: { products: []}});

    render(
      <MemoryRouter initialEntries={['/dashboard/admin/products']}>
        <Routes>
          <Route path="/dashboard/admin/products" element={<Products />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText("Product 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Description 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Product 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Description 2")).not.toBeInTheDocument();
  });

  test("displays error message on API failure", async () => {
    axios.get.mockRejectedValueOnce(new Error("API error"));

    render(
      <MemoryRouter initialEntries={['/dashboard/admin/products']}>
        <Routes>
          <Route path="/dashboard/admin/products" element={<Products />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/api/v1/product/get-product");
    });
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Something Went Wrong')
    });
  });

  test("Products contain link", async () => {
    axios.get.mockResolvedValueOnce({data: { products: mockProducts}});

    render(
      <MemoryRouter initialEntries={['/dashboard/admin/products']}>
        <Routes>
          <Route path="/dashboard/admin/products" element={<Products />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      const product1 = screen.getByRole('link', { name: /Product 1/i });
      expect(product1).toHaveAttribute("href", "/dashboard/admin/product/product-1");
    })

    await waitFor(() => {
      const product2 = screen.getByRole('link', { name: /Product 2/i });
      expect(product2).toHaveAttribute("href", "/dashboard/admin/product/product-2");
    })
  });
});
