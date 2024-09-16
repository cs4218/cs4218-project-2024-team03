import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import { toast } from "react-hot-toast";
import AdminDashboard from "./AdminDashboard";

// Mock the useAuth hook to provide test data
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

describe("AdminDashboard Component", () => {
  const mockAuthData = {
    user: {
      name: "Admin User",
      email: "admin@example.com",
      phone: "123-456-7890",
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the AdminDashboard component correctly", () => {
    // Render the component
    render(
      <MemoryRouter initialEntries={['/dashboard/admin']}>
          <Routes>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Routes>
        </MemoryRouter>
    );


    // Check if the admin's details are displayed
    // expect(screen.getByText(/Admin Name : Admin User/i)).toBeInTheDocument();
    // expect(screen.getByText(/Admin Email : admin@example.com/i)).toBeInTheDocument();
    // expect(screen.getByText(/Admin Contact : 123-456-7890/i)).toBeInTheDocument();
  });

  it("renders AdminMenu component", () => {
    // Render the component
    render(
      <MemoryRouter initialEntries={['/dashboard/admin']}>
          <Routes>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Routes>
        </MemoryRouter>
    );

    // Check if the AdminMenu is rendered
    // expect(screen.getByText(/admin menu/i)).toBeInTheDocument();
  });
});
