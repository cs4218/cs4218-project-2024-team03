import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminMenu from "./AdminMenu";
import axios from "axios";
import { MemoryRouter, Routes, Route, BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import { toast } from "react-hot-toast";

describe("AdminMenu Component", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders properly with related links", () => {

    render(
      <MemoryRouter initialEntries={['/dashboard/admin']}>
          <Routes>
            <Route path="/dashboard/admin" element={<AdminMenu />} />
          </Routes>
        </MemoryRouter>
    );

    const heading = screen.getByText("Admin Panel");
    expect(heading).toBeInTheDocument();

    const createCategoryLink = screen.getByText("Create Category");
    expect(createCategoryLink).toBeInTheDocument();
    expect(createCategoryLink).toHaveAttribute("href", "/dashboard/admin/create-category");

    const createProductLink = screen.getByText("Create Product");
    expect(createProductLink).toBeInTheDocument();
    expect(createProductLink).toHaveAttribute("href", "/dashboard/admin/create-product");

    const productsLink = screen.getByText("Products");
    expect(productsLink).toBeInTheDocument();
    expect(productsLink).toHaveAttribute("href", "/dashboard/admin/products");

    const ordersLink = screen.getByText("Orders");
    expect(ordersLink).toBeInTheDocument();
    expect(ordersLink).toHaveAttribute("href", "/dashboard/admin/orders");
  });

  test("does not render the Users link", () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/admin']}>
          <Routes>
            <Route path="/dashboard/admin" element={<AdminMenu />} />
          </Routes>
        </MemoryRouter>
    );

    const usersLink = screen.queryByText("Users");
    expect(usersLink).not.toBeInTheDocument();
  });


  describe("Links navigate properly", () => {
    const commonRenderer = () => {
      render(
        <MemoryRouter initialEntries={['/dashboard/admin']}>
          <Routes>
            <Route path="/dashboard/admin" element={<AdminMenu />} />
            <Route path="/dashboard/admin/create-category" element={<div>Manage Category</div>} />
            <Route path="/dashboard/admin/create-product" element={<div>Create Product</div>} />
            <Route path="/dashboard/admin/products" element={<div>All Products List</div>} />
            <Route path="/dashboard/admin/orders" element={<div>All Orders List</div>} />
          </Routes>
        </MemoryRouter>
      );
    }

    test("Create Category", () => {
      commonRenderer();
    
      fireEvent.click(screen.getByText("Create Category"));

      expect(screen.getByText("Manage Category")).toBeInTheDocument();
    })

    test("Create Product", () => {
      commonRenderer();
    
      fireEvent.click(screen.getByText("Create Product"));

      expect(screen.getByText("Create Product")).toBeInTheDocument();
    })

    test("Products", () => {
      commonRenderer();
    
      fireEvent.click(screen.getByText("Products"));

      expect(screen.getByText("All Products List")).toBeInTheDocument();
    })

    test("Orders", () => {
      commonRenderer();
    
      fireEvent.click(screen.getByText("Orders"));

      expect(screen.getByText("All Orders List")).toBeInTheDocument();
    })
  })  
});
