import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CartPage from "./CartPage";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DropIn from "braintree-web-drop-in-react";
import { afterEach } from "node:test";
import '@testing-library/jest-dom/extend-expect';


// Mocking dependencies
jest.mock("../context/auth", () => ({
  useAuth: jest.fn(() => [null, jest.fn()]),
}));

jest.mock("../context/cart", () => ({
  useCart: jest.fn(() => [null, jest.fn()]),
}));

jest.mock("../context/search", () => ({
  useSearch: jest.fn(() => [{ keyword: "" }, jest.fn()]),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("axios");

jest.mock("braintree-web-drop-in-react", () => ({
  __esModule: true,
  default: jest.fn(), 
}));

jest.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="mock-toaster" />,
  success: jest.fn(),
  error: jest.fn(),
}));

describe("CartPage Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  const mockClientTokenResponse = { data: {
    clientToken: "eyJ2ZXJza",
    success: true
  } };
  
  const mockCartItems =[
    {
      "_id": "66eaf9d2a81d7a284daa2963",
      "name": "Milo",
      "slug": "milo",
      "description": "milo description",
      "price": 2,
      "category": "66e6f3b6f0550841c1571dc1",
      "quantity": 2,
      "createdAt": "2024-09-18T16:03:30.710Z",
      "updatedAt": "2024-09-18T16:03:30.710Z",
      "__v": 0
    },
    {
      "_id": "66eaf9afa81d7a284daa294e",
      "name": "Coffee",
      "slug": "coffee",
      "description": "coffee description",
      "price": 5,
      "category": "66e6f3b6f0550841c1571dc1",
      "quantity": 2,
      "createdAt": "2024-09-18T16:02:55.706Z",
      "updatedAt": "2024-09-18T16:02:55.706Z",
      "__v": 0
    },
    {
        "_id": "66eaf9d2a81d7a284daa2963",
        "name": "Cereal",
        "slug": "cereal",
        "description": "cereal description",
        "price": 4,
        "category": "66e6f3b6f0550841c1571dc1",
        "quantity": 1,
        "createdAt": "2024-09-18T16:03:30.710Z",
        "updatedAt": "2024-09-18T16:03:30.710Z",
        "__v": 0
    }
  ];

  it("should get Braintree token on mount", async () => {
    useAuth.mockReturnValue([{ token: "testAuthToken" }]);
    useCart.mockReturnValue([[]]);
  
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(mockClientTokenResponse);
    
    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );    
    
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/api/v1/product/braintree/token"));
  });
  
  it("should render 'Hello Guest' when user is not authenticated", async () => {
    useAuth.mockReturnValue([{
      token: "",
      user: null,
    }, jest.fn()]);
    
    useCart.mockReturnValue([mockCartItems, jest.fn()]);
    
    // Mock API response for categories in the navigation bar
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(mockClientTokenResponse);
    
    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );

    const numOfItem = mockCartItems.length;

    // // Check if hello Guest is rendered
    expect(await screen.findByText("Hello Guest")).toBeInTheDocument();
    expect(await screen.findByText(`You Have ${numOfItem} items in your cart please login to checkout !`)).toBeInTheDocument();

  });
  
  it("should render 'Please Login to to checkout' button if user is not authenticated and onclick navigates to login page", async () => {
    // Mock the navigate function
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    useAuth.mockReturnValue([{
      token: "",
      user: null,
    }, jest.fn()]);

    useCart.mockReturnValue([mockCartItems, jest.fn()]);
  
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(mockClientTokenResponse);
  
    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );
  
    // Click the "Update Address" button
    fireEvent.click(screen.getByText("Plase Login to checkout"));
  
    // Ensure the navigate function is called to go to the login page
    expect(mockNavigate).toHaveBeenCalledWith("/login", { state: "/cart" });
  });

  it("should render 'Hello' with the user's name when user is authenticated", async () => {
    useAuth.mockReturnValue([{
      token: "testToken",
      user: { name: "John Doe" }
    }, jest.fn()]);

    axios.get.mockResolvedValueOnce(mockClientTokenResponse);

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Hello John Doe")).toBeInTheDocument();
  });

  it("should display 'Your Cart Is Empty' when there are no items in the cart", async () => {
    useAuth.mockReturnValue([{
      token: "testToken",
      user: { name: "John Doe" }
    }, jest.fn()]);

    useCart.mockReturnValue([[], jest.fn()]);

    // Mock API response for categories in the navigation bar
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(mockClientTokenResponse);

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.getByText("Your Cart Is Empty")).toBeInTheDocument();
  });

  it("should display the items and total number of items when there are more than 1 items in the cart", async () => {
    useAuth.mockReturnValue([{
      token: "testToken",
      user: { name: "John Doe" }
    }, jest.fn()]);
    
    useCart.mockReturnValue([mockCartItems, jest.fn()]);

    // Mock API response for categories in the navigation bar
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(mockClientTokenResponse);


    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Test for item Milo
    expect(await screen.getByText("Milo")).toBeInTheDocument();
    expect(await screen.getByText("milo description")).toBeInTheDocument();
    expect(await screen.getByText("Price : 2")).toBeInTheDocument();
    
    // Test for item Coffee
    expect(await screen.getByText("Coffee")).toBeInTheDocument();
    expect(await screen.getByText("coffee description")).toBeInTheDocument();
    expect(await screen.getByText("Price : 5")).toBeInTheDocument();
    
    // Test for item Cereal
    expect(await screen.getByText("Cereal")).toBeInTheDocument();
    expect(await screen.getByText("cereal description")).toBeInTheDocument();
    expect(await screen.getByText("Price : 4")).toBeInTheDocument();

    // Test for total number of items
    expect(await screen.getByText("You Have 3 items in your cart")).toBeInTheDocument();
  });
  
  it("should calculate the total price correctly when there are more than 1 items", async () => {
    useAuth.mockReturnValue([{
      token: "testToken",
      user: { name: "John Doe" }
    }, jest.fn()]);
    
    useCart.mockReturnValue([mockCartItems, jest.fn()]);

    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(mockClientTokenResponse);


    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );

    const totalPrice = 2 + 5 + 4;
    const totalPriceStr = totalPrice.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    expect(screen.getByText("Total : " + totalPriceStr)).toBeInTheDocument();
  });

  it("total price should be $0 when no item in the cart", async () => {
    useAuth.mockReturnValue([{
      token: "testToken",
      user: { name: "John Doe" }
    }, jest.fn()]);

    useCart.mockReturnValue([[], jest.fn()]);

    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(mockClientTokenResponse);


    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );

    const totalPrice = 0;
    const totalPriceStr = totalPrice.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    expect(screen.getByText("Total : " + totalPriceStr)).toBeInTheDocument();
  });

  it("should remove an item from the cart", async () => {
      useAuth.mockReturnValue([{
        token: "testToken",
        user: { name: "John Doe" }
      }, jest.fn()]);

    // Mock useCart to return the mockCartItems and a setter function
    const setCart = jest.fn();
    useCart.mockReturnValue([mockCartItems, setCart]);

    // Mock API response for categories in the navigation bar
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(mockClientTokenResponse);

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Should initially have 3 items
    expect(await screen.getByText("You Have 3 items in your cart")).toBeInTheDocument();

    const removeButton = screen.getAllByText("Remove");

    // Test for removing first item
    fireEvent.click(removeButton[0]);
    await waitFor(() => {
      expect(setCart).toHaveBeenCalledWith([mockCartItems[1], mockCartItems[2]]);
    });
  });

  it("should display the current address if the user has one", async () => {
    useAuth.mockReturnValue([{
      token: "testToken",
      user: { name: "John Doe", address: "Blk 123 Main St, Singapore, S123456" }
    }, jest.fn()]);
  
    useCart.mockReturnValue([mockCartItems, jest.fn()]);
  
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(mockClientTokenResponse);
  
    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );
  
    // Ensure the user's address is displayed
    expect(await screen.findByText("Current Address")).toBeInTheDocument();
    expect(await screen.findByText("Blk 123 Main St, Singapore, S123456")).toBeInTheDocument();
  
    // Ensure the "Update Address" button is displayed
    const updateAddressButton = await screen.findByRole('button', { name: "Update Address" });
    expect(updateAddressButton).toBeInTheDocument();    
  });
  
  it("should not display current address and display 'Update Address' button if the address does not exist", async () => {
    useAuth.mockReturnValue([{
      token: "testToken",
      user: { name: "John Doe", address: null }
    }, jest.fn()]);
  
    useCart.mockReturnValue([mockCartItems, jest.fn()]);
  
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(mockClientTokenResponse);
  
    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );
  
    expect(screen.queryByText("Current Address")).not.toBeInTheDocument();

    // Ensure the "Update Address" button is displayed
    const updateAddressButton = await screen.findByRole('button', { name: "Update Address" });
    expect(updateAddressButton).toBeInTheDocument();  
  });
  
  it("should navigate to profile page when 'Update Address' is clicked", async () => {
    // Mock the navigate function
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    useAuth.mockReturnValue([{
      token: "testToken",
      user: { name: "John Doe", address: "123 Test St" }
    }, jest.fn()]);
  
    useCart.mockReturnValue([mockCartItems, jest.fn()]);
  
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(mockClientTokenResponse);
  
    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );
  
    // Click the "Update Address" button
    fireEvent.click(screen.getByText("Update Address"));
  
    // Ensure the navigate function is called to go to the profile page
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/user/profile");
  });

  // Pairwise testing for {!clientToken || !auth?.token || !cart?.length ? ("") : (<> <DropIn /> <button /> </>)}
  // Test Case 1: clientToken present, auth?.token present, cart has items
  it("should render DropIn and payment button when clientToken, auth token, and cart are available", async () => {
    useAuth.mockReturnValue([{
      token: "testToken",
      user: { name: "John Doe", address: "123 Test St" }
    }, jest.fn()]);

    useCart.mockReturnValue([mockCartItems, jest.fn()]);

    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(mockClientTokenResponse);

    DropIn.mockImplementation(({ onInstance }) => {
      onInstance({ requestPaymentMethod: jest.fn() });
      return <div data-testid="dropin" />;
    });

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByTestId("dropin")).toBeInTheDocument();
    expect(await screen.findByText("Make Payment")).toBeInTheDocument();
  });

  // Test Case 2: clientToken present, auth?.token missing, cart empty
  it("should not render DropIn or payment button when clientToken is present but user is not authenticated and cart is empty", async () => {
    useAuth.mockReturnValue([{
      token: null,
      user: { name: "John Doe", address: "123 Test St" }
    }, jest.fn()]);

    useCart.mockReturnValue([[], jest.fn()]);

    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(mockClientTokenResponse);
    
    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );
    
  expect(screen.queryByTestId("dropin")).not.toBeInTheDocument();
  expect(screen.queryByText("Make Payment")).not.toBeInTheDocument();
});

// Test Case 3: clientToken missing, auth?.token present, cart empty
  it("should not render DropIn or payment button when clientToken is missing, even if user is authenticated and cart is empty", async () => {
    useAuth.mockReturnValue([{
      token: "testToken",
      user: { name: "John Doe", address: "123 Test St" }
    }, jest.fn()]);

    useCart.mockReturnValue([[], jest.fn()]);

    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: { clientToken: null }});

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByTestId("dropin")).not.toBeInTheDocument();
    expect(screen.queryByText("Make Payment")).not.toBeInTheDocument();
  });

  // Test Case 4: clientToken missing, auth?.token missing, cart has items
  it("should not render DropIn or payment button when neither clientToken nor auth token is available", async () => {
    useAuth.mockReturnValue([{
      token: null,
      user: { name: "John Doe", address: "123 Test St" }
    }, jest.fn()]);

    useCart.mockReturnValue([mockCartItems, jest.fn()]);

    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: { clientToken: null }});

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByTestId("dropin")).not.toBeInTheDocument();
    expect(screen.queryByText("Make Payment")).not.toBeInTheDocument();
  });

  
  it("should handle payment process correctly and clear the cart", async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  
    // Create a mock instance of DropIn's requestPaymentMethod
    const instance = {
      requestPaymentMethod: jest.fn().mockResolvedValue({ nonce: "testNonce" }),
    };
    
    // Mock DropIn component to set the instance
    DropIn.mockImplementation(({ onInstance }) => {
      setTimeout(() => {
        onInstance(instance);
      }, 0);
      return <div data-testid="dropin" />;
    });

    // Mock the useAuth hook with a logged-in user
    useAuth.mockReturnValue([{ token: "testToken", user: { name: "John Doe", address: "123 Test St" } }, jest.fn()]);

    // Mock useCart to return the mockCartItems and a setter function
    const setCart = jest.fn();
    useCart.mockReturnValue([mockCartItems, setCart]);

    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(mockClientTokenResponse);

    // Mock axios.post to simulate a successful payment
    axios.post.mockResolvedValueOnce({ data: {} });

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    const paymentButton = await screen.findByText("Make Payment");
    expect(paymentButton).toBeInTheDocument();

    // Check if the button is enabled
    await waitFor(() => {
      expect(paymentButton).not.toBeDisabled();
    });
  
    // Simulate button click
    fireEvent.click(paymentButton);

    // Check if the payment method request and API call were made
    await waitFor(() => {
      expect(instance.requestPaymentMethod).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalledWith("/api/v1/product/braintree/payment", {
        nonce: "testNonce",
        cart: mockCartItems,
      });
    });

    // Ensure the cart was cleared after payment
    await waitFor(() => {
      expect(setCart).toHaveBeenCalledWith([]);
    });
  
    // Ensure toast success message is shown
    expect(toast.success).toHaveBeenCalledWith("Payment Completed Successfully ");
  
    // Ensure navigate was called to redirect to the orders page
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/user/orders");
  });  

  it("should disable the 'Make Payment' button when user address does not exist", async () => {
    // Create a mock instance of DropIn's requestPaymentMethod
    const instance = {
      requestPaymentMethod: jest.fn().mockResolvedValue({ nonce: "testNonce" }),
    };
    
    // Mock DropIn component to set the instance
    DropIn.mockImplementation(({ onInstance }) => {
      setTimeout(() => {
        onInstance(instance);
      }, 0);
      return <div data-testid="dropin" />;
    });

    // Mock the useAuth hook with a logged-in user
    useAuth.mockReturnValue([{ token: "testToken", user: { name: "John Doe", address: null} }, jest.fn()]);

    // Mock useCart to return the mockCartItems and a setter function
    const setCart = jest.fn();
    useCart.mockReturnValue([mockCartItems, setCart]);

    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(mockClientTokenResponse);

    // Mock axios.post to simulate a successful payment
    axios.post.mockResolvedValueOnce({ data: {} });

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    const paymentButton = await screen.findByText("Make Payment");
    expect(paymentButton).toBeInTheDocument();

    // Check if the button is enabled
    await waitFor(() => {
      expect(paymentButton).toBeDisabled();
    });
  });  

  it("should handle payment errors due to requestPaymentMethod gracefully", async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  
    // Create a mock instance of DropIn's requestPaymentMethod that simulates error
    const instance = {
      requestPaymentMethod: jest.fn().mockRejectedValue(new Error("Payment error")),
    };

    // Mock DropIn component to set the instance
    DropIn.mockImplementation(({ onInstance }) => {
      setTimeout(() => {
        onInstance(instance);
      }, 0);
      return <div data-testid="dropin" />;
    });
  
    // Mock the useAuth hook with a logged-in user
    useAuth.mockReturnValue([{ token: "testToken", user: { name: "John Doe", address: "123 Test St" } }, jest.fn()]);
  
    // Mock useCart to return the mockCartItems and a setter function
    const setCart = jest.fn();
    useCart.mockReturnValue([mockCartItems, setCart]);
  
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(mockClientTokenResponse);

    axios.post.mockResolvedValueOnce({ data: [] });
    
    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );
  
    const paymentButton = await screen.findByText("Make Payment");
    expect(paymentButton).toBeInTheDocument();
  
    // Check if the button is enabled
    await waitFor(() => {
      expect(paymentButton).not.toBeDisabled();
    });
  
    // Simulate button click
    fireEvent.click(paymentButton);
  
    // Wait for the error to be shown due to the rejected axios post request
    await waitFor(() => {
      expect(instance.requestPaymentMethod).toHaveBeenCalled();
      // Ensure the cart was not cleared
      expect(setCart).not.toHaveBeenCalledWith([]);
    });
  
    // Ensure navigation does not happen on error
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it.failing("handles braintree payment API call errors gracefully", async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  
    // Create a mock instance of DropIn's requestPaymentMethod that simulates error
    const instance = {
      requestPaymentMethod: jest.fn().mockResolvedValue({ nonce: "testNonce" }),
    };

    // Mock DropIn component to set the instance
    DropIn.mockImplementation(({ onInstance }) => {
      setTimeout(() => {
        onInstance(instance);
      }, 0);
      return <div data-testid="dropin" />;
    });
  
    // Mock the useAuth hook with a logged-in user
    useAuth.mockReturnValue([{ token: "testToken", user: { name: "John Doe", address: "123 Test St" } }, jest.fn()]);
  
    // Mock useCart to return the mockCartItems and a setter function
    const setCart = jest.fn();
    useCart.mockReturnValue([mockCartItems, setCart]);
  
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(mockClientTokenResponse);

    // Mock axios.post to simulate a payment failure by rejecting with an error
    const paymentError = new Error("Payment failed");
    axios.post.mockResolvedValueOnce(paymentError);
    
    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );
  
    const paymentButton = await screen.findByText("Make Payment");
    expect(paymentButton).toBeInTheDocument();
  
    // Check if the button is enabled
    await waitFor(() => {
      expect(paymentButton).not.toBeDisabled();
    });
  
    // Simulate button click
    fireEvent.click(paymentButton);
  
    // Wait for the error to be shown due to the rejected axios post request
    await waitFor(() => {
      expect(instance.requestPaymentMethod).toHaveBeenCalled();
      // Ensure the cart was not cleared
      expect(setCart).not.toHaveBeenCalledWith([]);
    });
  
    // Ensure navigation does not happen on error
    expect(mockNavigate).not.toHaveBeenCalled();  
  });
});
