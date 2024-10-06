import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import AdminOrders from "./AdminOrders";
import { useAuth } from "../../context/auth"; 
import moment from "moment";
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { toast } from "react-hot-toast";
import '@testing-library/jest-dom/extend-expect';
import { afterEach } from "node:test";

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

describe("AdminOrders Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockOrders = [
    {
      _id: "order1",
      status: "Not Processed",
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

  test("should fetch from server", async () => {
    useAuth.mockReturnValue([{ token: "test-token" }, jest.fn()]);
    axios.get.mockResolvedValue({ data: mockOrders });

    render(
        <MemoryRouter initialEntries={['/admin/orders']}>
            <Routes>
                <Route path="/admin/orders" element={<AdminOrders />} />
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/api/v1/auth/all-orders"));
  });

  test("should render orders properly", async () => {
    useAuth.mockReturnValue([{ token: "test-token" }, jest.fn()]);
    axios.get.mockResolvedValue({ data: mockOrders });

    render(
        <MemoryRouter initialEntries={['/admin/orders']}>
            <Routes>
                <Route path="/admin/orders" element={<AdminOrders />} />
            </Routes>
        </MemoryRouter>
    );

    expect(await screen.findByText("All Orders")).toBeInTheDocument();
    
    expect(await screen.findByText("Not Processed")).toBeInTheDocument();
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(await screen.findByText("Success")).toBeInTheDocument();
    expect(await screen.findByText("Product 1")).toBeInTheDocument();
    expect(await screen.findByText("Price : 10")).toBeInTheDocument();
    expect(await screen.findByText("Product 2")).toBeInTheDocument();
    expect(await screen.findByText("Price : 20")).toBeInTheDocument();
    
    expect(await screen.findByText("Processing")).toBeInTheDocument();
    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(await screen.findByText("Failed")).toBeInTheDocument();
    expect(await screen.findByText("Product 3")).toBeInTheDocument();
    expect(await screen.findByText("Price : 30")).toBeInTheDocument();
  });

  test("should update status and render accordingly", async () => {
    useAuth.mockReturnValue([{ token: "test-token" }, jest.fn()]);
    axios.get.mockResolvedValue({ data: mockOrders });

    render(
        <MemoryRouter initialEntries={['/admin/orders']}>
            <Routes>
                <Route path="/admin/orders" element={<AdminOrders />} />
            </Routes>
        </MemoryRouter>
    );

    expect(await screen.findByText("All Orders")).toBeInTheDocument();
    
    expect(await screen.findByText("Not Processed")).toBeInTheDocument();
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(await screen.findByText("Success")).toBeInTheDocument();
    expect(await screen.findByText("Product 1")).toBeInTheDocument();
    expect(await screen.findByText("Price : 10")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByText("Not Processed"));
    fireEvent.click(screen.getByText("cancel"));

    axios.put.mockResolvedValueOnce({ data: {} });
    await waitFor(() =>
      expect(axios.put).toHaveBeenCalledWith("/api/v1/auth/order-status/order1", { status: "cancel" })
    );

    axios.get.mockResolvedValueOnce({ data: mockOrders });

    render(
      <MemoryRouter initialEntries={['/admin/orders']}>
          <Routes>
              <Route path="/admin/orders" element={<AdminOrders />} />
          </Routes>
      </MemoryRouter>
    );

    expect(await screen.getAllByText("cancel")[0]).toBeInTheDocument();
  });

  test("Mock order contains invalid price and success value, should not succeed", async () => {
    const mockOrders = [
      {
        _id: "order1",
        status: "Not Processed",
        buyer: { name: "John Doe" },
        createAt: moment().subtract(2, "days").toISOString(),
        payment: { success: "not" },
        products: [
          { _id: "product1", name: "Product 1", description: "Description 1", price: "qwe10" },
          { _id: "product2", name: "Product 2", description: "Description 2", price: 20 },
        ],
      }
    ];

    useAuth.mockReturnValue([{ token: "test-token" }, jest.fn()]);
    axios.get.mockResolvedValue({ data: mockOrders });

    render(
        <MemoryRouter initialEntries={['/admin/orders']}>
            <Routes>
                <Route path="/admin/orders" element={<AdminOrders />} />
            </Routes>
        </MemoryRouter>
    );

    expect(await screen.findByText("Product 1")).toBeInTheDocument();
    expect(await screen.findByText("Success")).not.toBeInTheDocument();
    expect(await screen.findByText("Price : qwe10")).not.toBeInTheDocument();

  });

  test("Status should use proper words", async () => {
    useAuth.mockReturnValue([{ token: "test-token" }, jest.fn()]);
    axios.get.mockResolvedValue({ data: mockOrders });

    render(
        <MemoryRouter initialEntries={['/admin/orders']}>
            <Routes>
                <Route path="/admin/orders" element={<AdminOrders />} />
            </Routes>
        </MemoryRouter>
    );

    expect(await screen.findByText("All Orders")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByText("Not Processed"));
    
    expect(await screen.findByText("Not Processed")).toBeInTheDocument();
    expect(await screen.findByText("Processing")).toBeInTheDocument();
    expect(await screen.findByText("Shipped")).toBeInTheDocument();
    expect(await screen.findByText("Delivered")).toBeInTheDocument();
    expect(await screen.findByText("Canceled")).toBeInTheDocument();
  });
});
