import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Orders from './Orders';
import axios from 'axios';
import React from 'react'

jest.mock('axios');

jest.mock("../../components/Layout", () => ({ children }) => <div>{children}</div>);

const mockUser = {
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
    phone: "12345678",
    address: "123 Street",
  },
  token: "token123"
}

const mockProducts = [
  {
    name: "Product 1",
    slug: "product-1",
    description: "Product 1 description",
    category: {name: "category1", slug: "category1"},
    quantity: 50,
    price: 100,
    photo: {
      data: "image1.jpg",
      contentType: "image/jpg"
    },
    shipping: true
  },
  {
    name: "Product 2",
    slug: "product-2",
    description: "Product 2 description",
    category: {name: "category2", slug: "category2"},
    quantity:100,
    price: 200,
    photo: {
      data: "image2.jpg",
      contentType: "image/jpg"
    },
    shipping: true
  },
]

const mockOrdersSuccess = {
  orders: [
    {
      status: "Delivered",
      buyer: mockUser.user,
      createdAt: new Date("2024-09-01T12:00:00.000Z"),
      payment: {
        success: true
      },
      products: [
        mockProducts[0],
        mockProducts[1]
      ]
    }
  ]
}

const mockOrderFail = {
  orders: [
    {
      status: "Pending",
      buyer: mockUser.user,
      createdAt: new Date("2024-09-01T12:00:00.000Z"),
      payment: {
        success: false
      },
      products: [
        mockProducts[0],
        mockProducts[1]
      ]
    }
  ]
}

jest.mock('../../context/auth', () => ({
  useAuth: jest.fn(() => [mockUser, jest.fn()]) 
}));

describe("Orders Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be able to render the orders page when order is successful", async () => {
    axios.get.mockResolvedValueOnce({
      data: mockOrdersSuccess.orders
    })

    render(      
      <MemoryRouter initialEntries={['/orders']}>
        <Routes>
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("All Orders")).not.toBeNull();

    await waitFor(() => {expect(axios.get).toHaveBeenCalledTimes(1)})
    await waitFor(() => {expect(screen.getByText(mockOrdersSuccess.orders[0].status)).not.toBeNull()})
    await waitFor(() => {expect(screen.getByText(mockUser.user.name)).not.toBeNull()})
    await waitFor(() => {expect(screen.getByText("a few seconds ago")).not.toBeNull()})
    await waitFor(() => {expect(screen.getByText("Success")).not.toBeNull()})
    await waitFor(() => {expect(screen.getByText(mockProducts[0].name)).not.toBeNull()})
    await waitFor(() => {expect(screen.getByText(mockProducts[1].name)).not.toBeNull()})
    await waitFor(() => {expect(screen.getByText(`Price : ${mockProducts[0].price}`)).not.toBeNull()})
    await waitFor(() => {expect(screen.getByText(`Price : ${mockProducts[1].price}`)).not.toBeNull()})
  })

  it("should be able to render the orders page when order is failed", async () => {
    axios.get.mockResolvedValueOnce({
      data: mockOrderFail.orders
    })

    render(
      <MemoryRouter initialEntries={['/orders']}>
        <Routes>
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("All Orders")).not.toBeNull();

    await waitFor(() => {expect(axios.get).toHaveBeenCalledTimes(1)})
    await waitFor(() => {expect(screen.getByText(mockOrderFail.orders[0].status)).not.toBeNull()})
    await waitFor(() => {expect(screen.getByText(mockUser.user.name)).not.toBeNull()})
    await waitFor(() => {expect(screen.getByText("a few seconds ago")).not.toBeNull()})
    await waitFor(() => {expect(screen.getByText("Failed")).not.toBeNull()})
    await waitFor(() => {expect(screen.getByText(mockProducts[0].name)).not.toBeNull()})
    await waitFor(() => {expect(screen.getByText(mockProducts[1].name)).not.toBeNull()})
    await waitFor(() => {expect(screen.getByText(`Price : ${mockProducts[0].price}`)).not.toBeNull()})
    await waitFor(() => {expect(screen.getByText(`Price : ${mockProducts[1].price}`)).not.toBeNull()})
  })

  it("should return error when failed to fetch orders", async () => {
    const error = new Error("Failed to fetch orders")
    axios.get.mockRejectedValueOnce(error);
    const consoleSpy = jest.spyOn(console, "log")

    render(
      <MemoryRouter initialEntries={['/orders']}>
        <Routes>
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {expect(axios.get).toHaveBeenCalledTimes(1)})
    expect(consoleSpy).toHaveBeenCalledWith(error)
  });
})