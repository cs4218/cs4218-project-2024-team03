import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "../src/pages/user/Dashboard";
import { AuthProvider } from "../src/context/auth";
import { CartProvider } from '../src/context/cart';
import { SearchProvider } from '../src/context/search';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';



const mockAuthData = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    address: "123 Main St",
  },
  token: "mockToken123",
};

describe("Dashboard Integration with AuthProvider", () => {
  beforeEach(() => {
    localStorage.setItem("auth", JSON.stringify(mockAuthData));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("Dashboard renders data provided by AuthProvider", () => {
    render(
      <AuthProvider>
      <CartProvider>
          <SearchProvider>
              <MemoryRouter>
                  <Dashboard />
              </MemoryRouter>
          </SearchProvider>
      </CartProvider>
  </AuthProvider>
    );

    const nameElements = screen.getAllByText(/John Doe/i, { selector: 'h3' });
    expect(nameElements[0]).toHaveTextContent('John Doe');
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
  });
});
