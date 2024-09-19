import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import CartPage from "./CartPage";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import axios from "axios";
import DropIn from "braintree-web-drop-in-react";
import { toast } from "react-hot-toast";

// Mock the necessary modules and components
jest.mock("../context/cart", () => ({
  useCart: jest.fn(),
}));

jest.mock("../context/auth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("axios");

jest.mock("braintree-web-drop-in-react", () => ({
  DropIn: jest.fn(() => <div>DropIn</div>),
}));

jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe("CartPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  xit("renders without crashing and shows cart summary", () => {
    useAuth.mockReturnValue([
      { user: { name: "John", address: "123 Street" }, token: "token" },
      jest.fn(),
    ]);
    useCart.mockReturnValue([
      { _id: "1", name: "Item 1", description: "Description 1", price: 100 },
      { _id: "2", name: "Item 2", description: "Description 2", price: 200 },
    ]);
    axios.get.mockResolvedValue({ data: { clientToken: "client-token" } });

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    // Check if cart items are rendered
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Total : $300.00")).toBeInTheDocument();
  });

  xit("successfully removes item from cart", () => {
    const setCart = jest.fn();
    useAuth.mockReturnValue([
      { user: { name: "John", address: "123 Street" }, token: "token" },
      jest.fn(),
    ]);
    useCart.mockReturnValue([
      { _id: "1", name: "Item 1", description: "Description 1", price: 100 },
      { _id: "2", name: "Item 2", description: "Description 2", price: 200 },
    ]);
    axios.get.mockResolvedValue({ data: { clientToken: "client-token" } });

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    // Simulate remove button click
    fireEvent.click(screen.getAllByText("Remove")[0]);

    // Check if cart item was removed
    expect(setCart).toHaveBeenCalledWith([
      { _id: "2", name: "Item 2", description: "Description 2", price: 200 },
    ]);
  });

  xit("handles payment successfully", async () => {
    const setCart = jest.fn();
    const setClientToken = jest.fn();
    const setInstance = jest.fn();
    useAuth.mockReturnValue([
      { user: { name: "John", address: "123 Street" }, token: "token" },
      jest.fn(),
    ]);
    useCart.mockReturnValue([
      { _id: "1", name: "Item 1", description: "Description 1", price: 100 },
    ]);
    axios.get.mockResolvedValue({ data: { clientToken: "client-token" } });
    axios.post.mockResolvedValue({ data: {} });

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    // Mock DropIn instance
    const dropInInstance = {
      requestPaymentMethod: jest
        .fn()
        .mockResolvedValue({ nonce: "dummy-nonce" }),
    };
    DropIn.mockImplementation(({ onInstance }) => {
      onInstance(dropInInstance);
      return <div>DropIn</div>;
    });

    // Simulate payment button click
    fireEvent.click(screen.getByText("Make Payment"));

    // Check if payment handling was successful
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Payment Completed Successfully "
      )
    );
  });

  xit("handles address update navigation correctly", () => {
    useAuth.mockReturnValue([
      { user: { address: "123 Street" }, token: "token" },
      jest.fn(),
    ]);
    useCart.mockReturnValue([
      { _id: "1", name: "Item 1", description: "Description 1", price: 100 },
    ]);
    axios.get.mockResolvedValue({ data: { clientToken: "client-token" } });

    const { container } = render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    );

    // Simulate address update button click
    fireEvent.click(screen.getByText("Update Address"));

    // Check if navigation occurred
    expect(container.innerHTML).toContain("/dashboard/user/profile");
  });
});
