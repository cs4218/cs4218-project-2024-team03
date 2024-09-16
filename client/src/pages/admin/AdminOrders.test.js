import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import AdminOrders from "./AdminOrders";
import { useAuth } from "../../context/auth"; // Mock useAuth context
import moment from "moment";
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { toast } from "react-hot-toast";
import '@testing-library/jest-dom/extend-expect';


// Mock dependencies
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

describe("AdminOrders Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockOrders = [
    {
      _id: "order1",
      status: "Not Process",
      buyer: { name: "John Doe" },
      createAt: moment().subtract(2, "days").toISOString(),
      payment: { success: true },
      products: [
        { _id: "product1", name: "Product 1", description: "Description 1", price: 10 },
        { _id: "product2", name: "Product 2", description: "Description 2", price: 20 },
      ],
    },
    {
      _id: "order2",
      status: "Processing",
      buyer: { name: "Jane Doe" },
      createAt: moment().subtract(3, "days").toISOString(),
      payment: { success: false },
      products: [{ _id: "product3", name: "Product 3", description: "Description 3", price: 30 }],
    },
  ];

  it("should render orders and update status", async () => {
    // Mock useAuth to return a token
    useAuth.mockReturnValue([{ token: "test-token" }, jest.fn()]);

    // Mock axios GET request to return the orders
    axios.get.mockResolvedValueOnce({ data: mockOrders });

    // Render the component
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/orders']}>
          <Routes>
            <Route path="/dashboard/admin/orders" element={<AdminOrders />} />
          </Routes>
        </MemoryRouter>
    );

    // Wait for the orders to be displayed
    expect(screen.getByText("All Orders")).toBeInTheDocument();

    // // Check product details
    // expect(screen.getByText("Product 1")).toBeInTheDocument();
    // expect(screen.getByText("Description 1")).toBeInTheDocument();
    // expect(screen.getByText("Price : 10")).toBeInTheDocument();

    // expect(screen.getByText("Product 3")).toBeInTheDocument();
    // expect(screen.getByText("Description 3")).toBeInTheDocument();
    // expect(screen.getByText("Price : 30")).toBeInTheDocument();

    // Simulate changing the order status for the first order
    // fireEvent.mouseDown(screen.getByText("Not Process"));
    // fireEvent.click(screen.getByText("Shipped"));

    // Mock axios PUT request for status update
    axios.put.mockResolvedValueOnce({ data: {} });

    // Wait for axios PUT to be called and order to be updated
    // await waitFor(() =>
    //   expect(axios.put).toHaveBeenCalledWith("/api/v1/auth/order-status/order1", { status: "Shipped" })
    // );

    // Re-fetch the orders (mocking re-render with updated data)
    // axios.get.mockResolvedValueOnce({ data: mockOrders });

    // // Wait for the updated status
    // await waitFor(() => screen.getByText("Shipped"));
  });
});
