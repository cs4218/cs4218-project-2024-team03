import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateProduct from "./CreateProduct";
import axios from "axios";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import { toast } from "react-hot-toast";
import UpdateProduct from "./UpdateProduct";

// Mock axios and react-hot-toast
jest.mock("axios");
jest.mock('react-hot-toast');

jest.mock('../../context/auth', () => ({
  useAuth: jest.fn(() => [null, jest.fn()]) // Mock useAuth hook to return null state and a mock function for setAuth
}));

jest.mock('../../context/cart', () => ({
  useCart: jest.fn(() => [null, jest.fn()]) // Mock useCart hook to return null state and a mock function
}));
  
jest.mock('../../context/search', () => ({
  useSearch: jest.fn(() => [{ keyword: '' }, jest.fn()]) // Mock useSearch hook to return null state and a mock function
}));  

Object.defineProperty(window, 'localStorage', {
  value: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};  
describe("UpdateProduct Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        product: {
          name: "mdb",
          _id: "66d73fdee152a157371c9cb3",
          description: "Test description",
          price: 100,
          quantity: 10,
          shipping: true,
          category: { _id: "66d73fdee152a157371c9cb4", name: "Category 1" },
        },
        category: [{ _id: "66d73fdee152a157371c9cb4", name: "Category 1" }, { _id: "66d73fdee152a157371c9cb5", name: "Category 2" }],
      },
    });
  });

  it("renders UpdateProduct component and loads data", async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/product/mdb']}>
        <Routes>
          <Route path="/dashboard/admin/product/mdb" element={<UpdateProduct />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if title and form fields are rendered
    expect(screen.getByRole("button", { name: /Update Product/i })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByDisplayValue("mdb")).toBeInTheDocument());

    // Check if category dropdown is rendered
    expect(screen.getByText(/Category 1/i)).toBeInTheDocument();
  });

  it("allows updating product fields", async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/product/mdb']}>
          <Routes>
            <Route path="/dashboard/admin/product/mdb" element={<UpdateProduct />} />
          </Routes>
        </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByDisplayValue("mdb")).toBeInTheDocument());

    // Simulate entering new values
    fireEvent.change(screen.getByPlaceholderText(/write a name/i), {
      target: { value: "Updated Product" },
    });
    fireEvent.change(screen.getByPlaceholderText(/write a description/i), {
      target: { value: "Updated description" },
    });
    fireEvent.change(screen.getByPlaceholderText(/write a Price/i), {
      target: { value: 200 },
    });

    // Simulate selecting a category
    fireEvent.mouseDown(screen.getByText(/Category 1/i));
    await waitFor(() => fireEvent.click(screen.getByText(/Category 2/i)));

    // Simulate file upload
    const file = new File(["product photo"], "product.jpg", { type: "image/jpeg" });
    // const input = screen.getByLabelText(/Upload Photo/i);
    // fireEvent.change(input, { target: { files: [file] } });

    // Simulate updating the product
    fireEvent.click(screen.getByRole("button", { name: /Update Product/i }));

    // Check if the form submission is called with updated values
    await waitFor(() => expect(axios.put).toHaveBeenCalledWith(
      `/api/v1/product/update-product/123`,
      expect.any(FormData)
    ));
  });

  it("handles deleting a product", async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/product/mdb']}>
          <Routes>
            <Route path="/dashboard/admin/product/mdb" element={<UpdateProduct />} />
          </Routes>
        </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Delete Product/i)).toBeInTheDocument());

    // Simulate deletion confirmation
    window.prompt = jest.fn().mockReturnValue(true);

    // Simulate clicking the delete button
    fireEvent.click(screen.getByText(/delete product/i));

    // Check if the delete request is called
    await waitFor(() => expect(axios.delete).toHaveBeenCalledWith(`/api/v1/product/delete-product/123`));
  });
});
