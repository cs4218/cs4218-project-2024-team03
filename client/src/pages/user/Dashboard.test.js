import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import React from 'react'

let mockUser = {
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
    phone: "12345678",
    address: "123 Street",
  },
  token: "token123"
}

jest.mock("../../components/Layout", () => ({ children }) => <div>{children}</div>);

jest.mock("../../context/auth", () => ({
  useAuth: jest.fn(() => [mockUser, jest.fn()])
}));

jest.mock("../../context/cart", () => ({
  useCart: jest.fn(() => [null, jest.fn()])
}));

jest.mock("../../context/search", () => ({
  useSearch: jest.fn(() => [{ keyword: "" }, jest.fn()])
}));

describe("Dashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it("should render the dashboard page", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(mockUser.user.name)).not.toBeNull();
    expect(screen.getByText(mockUser.user.email)).not.toBeNull();
    expect(screen.getByText(mockUser.user.address)).not.toBeNull();
    expect(screen.getByText('Profile')).not.toBeNull();
    expect(screen.getByText('Orders')).not.toBeNull();
  })
})