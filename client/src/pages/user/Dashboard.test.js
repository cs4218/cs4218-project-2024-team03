import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import React from 'react'
import { useAuth } from '../../context/auth';
import '@testing-library/jest-dom';

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

  it("should render the dashboard page when auth is present", async () => {
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

  it("should render the dashboard page when auth is not present", async () => {
    const mockEmptyUser = { user: {} };
    useAuth.mockReturnValueOnce([mockEmptyUser]);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.queryByText("undefined")).not.toBeInTheDocument();
    expect(screen.getByText('Profile')).not.toBeNull();
    expect(screen.getByText('Orders')).not.toBeNull();
  })
})