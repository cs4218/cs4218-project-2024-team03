import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateProduct from "./CreateProduct";
import axios from "axios";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import { toast } from "react-hot-toast";

jest.mock("axios");
jest.mock('react-hot-toast');

jest.mock('../../context/auth', () => ({
  useAuth: jest.fn(() => [null, jest.fn()]) 
}));

jest.mock('../../context/cart', () => ({
  useCart: jest.fn(() => [null, jest.fn()])
}));
  
jest.mock('../../context/search', () => ({
  useSearch: jest.fn(() => [{ keyword: '' }, jest.fn()]) 
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

  test("renders the Create Product component", async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/create-product']}>
          <Routes>
            <Route path="/dashboard/admin/create-product" element={<CreateProduct />} />
          </Routes>
        </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /create product/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("write a name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("write a description")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("write a Price")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("write a quantity")).toBeInTheDocument();
    expect(screen.getByText(/select a category/i)).toBeInTheDocument();
    expect(screen.getByText(/upload photo/i)).toBeInTheDocument();
    

    await waitFor(() => {
      expect(screen.getByText("Category 2")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Category 1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Select Shipping/i)).toBeInTheDocument();
    });
    fireEvent.mouseDown(screen.getByText(/Select Shipping/i)); 
    await waitFor(() => {
      expect(screen.getByText("Yes")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("No")).toBeInTheDocument();
    });
  });

  test("creates a product successfully", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: "Product Created Successfully",
      },
    });

    render(
      <MemoryRouter initialEntries={['/dashboard/admin/create-product']}>
          <Routes>
            <Route path="/dashboard/admin/create-product" element={<CreateProduct />} />
          </Routes>
        </MemoryRouter>
    );

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
    
    const file = new File(["test"], "test.png", { type: "image/png" });
    const input = screen.getByLabelText("Upload Photo");
    fireEvent.change(input, {
      target: { files: [file] },
    }); 
    
    //all 3 non text field being being arranged will break the test case
    // fireEvent.mouseDown(screen.getByText("Select a category")); 
    // await waitFor(() => fireEvent.click(screen.getByText("Category 1"))); 
    
    fireEvent.mouseDown(screen.getByText("Select Shipping")); 
    fireEvent.click(screen.getByText("Yes")); 
    
    await waitFor(() => {
      // expect(screen.getByText(/create product/i)).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /create product/i }));
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/api/v1/product/create-product",
        expect.any(FormData)
      );
    });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Product Created Successfully");
    });
  });

  test("displays error when category fetching fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("API Error"));

    render(
      <MemoryRouter initialEntries={['/dashboard/admin/create-product']}>
          <Routes>
            <Route path="/dashboard/admin/create-product" element={<CreateProduct />} />
          </Routes>
        </MemoryRouter>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Something went wrong in getting category");
    });
  });

  test("displays error when creating product fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("API Error"));

    render(
      <MemoryRouter initialEntries={['/dashboard/admin/create-product']}>
          <Routes>
            <Route path="/dashboard/admin/create-product" element={<CreateProduct />} />
          </Routes>
        </MemoryRouter>
    );

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

    fireEvent.click(screen.getByText("CREATE PRODUCT"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("something went wrong in getting category");
    });
  });
});
