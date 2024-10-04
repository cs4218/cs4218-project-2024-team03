import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import { toast } from "react-hot-toast";
import AdminDashboard from "./AdminDashboard";
import { before } from "node:test";

jest.mock("axios");
jest.mock('react-hot-toast');

jest.mock('../../context/auth', () => ({
  useAuth: jest.fn(() => [{ user: { name: "Admin User", email: "admin@example.com", phone: "123-456-7890" } }, jest.fn()]) 
}));

jest.mock('../../context/cart', () => ({
  useCart: jest.fn(() => [null, jest.fn()]) 
}));
  
jest.mock('../../context/search', () => ({
  useSearch: jest.fn(() => [{ keyword: '' }, jest.fn()]) 
}));  

describe("AdminDashboard Component, auth succeeds", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the user profile component correctly", () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/admin']}>
          <Routes>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Routes>
        </MemoryRouter>
    );

    expect(screen.getByText(/Admin Name : Admin User/i)).toBeInTheDocument();
    expect(screen.getByText(/Admin Email : admin@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Admin Contact : 123-456-7890/i)).toBeInTheDocument();
  });

  test("renders navbar components", () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/admin']}>
          <Routes>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Routes>
        </MemoryRouter>
    );

    expect(screen.getByText(/Virtual Vault/i)).toBeInTheDocument();
    expect(screen.getByText(/Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Categories/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/All Categories/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Admin User/i })).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    expect(screen.getByText(/Cart/i)).toBeInTheDocument();
  });

  test("renders Admin Menu components", () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/admin']}>
          <Routes>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Routes>
        </MemoryRouter>
    );

    expect(screen.getByText(/Admin Panel/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Category/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Product/i)).toBeInTheDocument();
    expect(screen.getByText(/Products/i)).toBeInTheDocument();
    expect(screen.getByText(/Orders/i)).toBeInTheDocument();
  });

  test("renders bottom components", () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/admin']}>
          <Routes>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Routes>
        </MemoryRouter>
    );

    expect(screen.getByText(/All Rights Reserved © TestingComp/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Contact/i })).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
  });
});


describe('auth fails', () => { 
  test("user profile don't render when auth fail", () => {
    const mockUseAuth = require('../../context/auth').useAuth;
    mockUseAuth.mockReturnValue([null, jest.fn()]); 

    render(
      <MemoryRouter initialEntries={['/dashboard/admin']}>
          <Routes>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Routes>
        </MemoryRouter>
    );

    expect(screen.queryByText(/Admin Name : Admin User/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Admin Email : admin@example.com/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Admin Contact : 123-456-7890/i)).not.toBeInTheDocument();
  });
 })
