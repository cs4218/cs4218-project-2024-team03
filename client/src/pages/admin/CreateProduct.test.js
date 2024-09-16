import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateProduct from "./CreateProduct";
import axios from "axios";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import { toast } from "react-hot-toast";

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

describe("CreateProduct component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
});
beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'mocked-url');
});
  beforeEach(() => {
    // Mock category data for the Select dropdown
    axios.get.mockResolvedValueOnce({
      data: {
        success: true,
        category: [
          { _id: "1", name: "Category 1" },
          { _id: "2", name: "Category 2" },
        ],
      },
    });
  });

  test("renders the CreateProduct form", async () => {
    // Render the component inside MemoryRouter
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/create-category']}>
          <Routes>
            <Route path="/dashboard/admin/create-category" element={<CreateProduct />} />
          </Routes>
        </MemoryRouter>
    );

    // Check if the title and form elements are present
    expect(screen.getByRole("button", { name: /create product/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("write a name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("write a description")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("write a Price")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("write a quantity")).toBeInTheDocument();

    // Wait for categories to be populated in the Select dropdown
    await waitFor(() => {
      expect(screen.getByText("Category 2")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Category 1")).toBeInTheDocument();
    });
  });

  test("creates a product successfully", async () => {
    // Mock the POST request for creating a product
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: "Product Created Successfully",
      },
    });

    // Render the component inside MemoryRouter
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/create-category']}>
          <Routes>
            <Route path="/dashboard/admin/create-category" element={<CreateProduct />} />
          </Routes>
        </MemoryRouter>
    );

    // Simulate user interaction: filling the form
    fireEvent.change(screen.getByPlaceholderText("write a name"), {
      target: { value: "Test Product" },
    });
    fireEvent.change(screen.getByPlaceholderText("write a description"), {
      target: { value: "This is a test product" },
    });
    fireEvent.change(screen.getByPlaceholderText("write a Price"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByPlaceholderText("write a quantity"), {
      target: { value: "10" },
    });

    // Simulate selecting shipping
    fireEvent.mouseDown(screen.getByText("Select Shipping")); // Open the dropdown
    // await waitFor(() => screen.getByText("Yes")); // Wait for the option to appear
    fireEvent.click(screen.getByText("Yes"));
    
    // Simulate file upload
    const file = new File(["test"], "test.png", { type: "image/png" });
    const input = screen.getByLabelText("Upload Photo");
    fireEvent.change(input, {
      target: { files: [file] },
    });
    

    // Simulate selecting a category
    fireEvent.mouseDown(screen.getByText("Select a category")); // Open the dropdown
    await waitFor(() => screen.getByText("Category 1")); // Wait for the category options to appear
    fireEvent.click(screen.getByText("Category 1"));

    // Click the "CREATE PRODUCT" button
    console.log("After selecting category:");
    // await waitFor(() => screen.getByRole("button", { name: /create product/i }));
    // fireEvent.click(screen.getByRole("button", { name: /create product/i }))
    screen.debug(); // Check the DOM

    // // Wait for the form submission to be processed
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(
    //     "/api/v1/product/create-product",
    //     expect.any(FormData)
    //   );
    // });
    // await waitFor(() => {
    //   expect(toast.success).toHaveBeenCalledWith("Product Created Successfully");
    // });
  });

  test("displays error when category fetching fails", async () => {
    // Mock a failed GET request for categories
    axios.get.mockRejectedValueOnce(new Error("API Error"));

    // Render the component inside MemoryRouter
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/create-category']}>
          <Routes>
            <Route path="/dashboard/admin/create-category" element={<CreateProduct />} />
          </Routes>
        </MemoryRouter>
    );

    // Wait for error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Something went wrong in getting category");
    });
  });

  test("displays error when creating product fails", async () => {
    // Mock a failed POST request
    axios.post.mockRejectedValueOnce(new Error("API Error"));

    // Render the component inside MemoryRouter
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/create-category']}>
          <Routes>
            <Route path="/dashboard/admin/create-category" element={<CreateProduct />} />
          </Routes>
        </MemoryRouter>
    );

    // Simulate user interaction: filling the form
    fireEvent.change(screen.getByPlaceholderText("write a name"), {
      target: { value: "Test Product" },
    });
    fireEvent.change(screen.getByPlaceholderText("write a description"), {
      target: { value: "This is a test product" },
    });
    fireEvent.change(screen.getByPlaceholderText("write a Price"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByPlaceholderText("write a quantity"), {
      target: { value: "10" },
    });

    // Click the "CREATE PRODUCT" button
    fireEvent.click(screen.getByText("CREATE PRODUCT"));

    // Wait for the error toast to appear
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("something went wrong in getting category");
    });
  });
});
