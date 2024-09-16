import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import CreateCategory from "./CreateCategory";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Modal } from "antd";
import '@testing-library/jest-dom/extend-expect';
import { toast } from "react-hot-toast";

// Mock necessary modules
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

describe("CreateCategory Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        success: true,
        category: [{ _id: "123", name: "Test Category" }],
      },
    });
  });

  it("renders CreateCategory component and loads categories", async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/create-category']}>
          <Routes>
            <Route path="/dashboard/admin/create-category" element={<CreateCategory />} />
          </Routes>
        </MemoryRouter>
    );

    // Check if title and form are rendered
    expect(screen.getByText(/Manage Category/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter New Category/i)).toBeInTheDocument();

    // Wait for categories to load
    await waitFor(() => expect(screen.getAllByText("Test Category")[0]).toBeInTheDocument());
  });

  it("allows creating a category", async () => {
    axios.post.mockResolvedValue({
      data: { success: true },
    });

    render(
      <MemoryRouter initialEntries={['/dashboard/admin/create-category']}>
          <Routes>
            <Route path="/dashboard/admin/create-category" element={<CreateCategory />} />
          </Routes>
        </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Enter New Category/i);
    fireEvent.change(input, { target: { value: "New Category" } });

    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith("/api/v1/category/create-category", { name: "New Category" }));
  });

  it("allows updating a category", async () => {
    axios.put.mockResolvedValue({
      data: { success: true },
    });

    render(
      <MemoryRouter initialEntries={['/dashboard/admin/create-category']}>
          <Routes>
            <Route path="/dashboard/admin/create-category" element={<CreateCategory />} />
          </Routes>
        </MemoryRouter>
    );

    // Simulate opening the edit modal
    const editButton = await screen.findByText(/Edit/i);
    fireEvent.click(editButton);

    const input = screen.getByDisplayValue("Test Category");
    fireEvent.change(input, { target: { value: "Updated Category" } });

    const submitButtons = screen.getAllByText(/Submit/i);
    const submitButton = submitButtons[1];
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(axios.put).toHaveBeenCalledWith("/api/v1/category/update-category/123", { name: "Updated Category" })
    );
  });

  it("allows deleting a category", async () => {
    axios.delete.mockResolvedValue({
      data: { success: true },
    });

    render(
      <MemoryRouter initialEntries={['/dashboard/admin/create-category']}>
          <Routes>
            <Route path="/dashboard/admin/create-category" element={<CreateCategory />} />
          </Routes>
        </MemoryRouter>
    );

    const deleteButton = await screen.findByText(/Delete/i);
    fireEvent.click(deleteButton);

    await waitFor(() => expect(axios.delete).toHaveBeenCalledWith("/api/v1/category/delete-category/123"));
  });
});
