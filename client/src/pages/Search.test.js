import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Search from "./Search";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import { beforeEach } from "node:test";
import { useSearch } from "../context/search";
jest.mock("../context/auth", () => ({
  useAuth: jest.fn(() => [null, jest.fn()]), // Mock useAuth hook to return null state and a mock function for setAuth
}));

jest.mock("../context/cart", () => ({
  useCart: jest.fn(() => [null, jest.fn()]), // Mock useCart hook to return null state and a mock function
}));

jest.mock("../context/search", () => ({
  useSearch: jest.fn(() => [{ keyword: "" }, jest.fn()]), // Mock useSearch hook to return null state and a mock function
}));
describe("Search Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("displays search results correctly", () => {
    useSearch.mockReturnValueOnce([
      {
        keyword: "",
        results: [
          {
            _id: "66dd70965628054a100976fe",
            name: "PurSoft 3ply Chocolate Rain Outdoor Soft Pack 120 sheets, Pack of 4",
            slug: "PurSoft-3ply-Chocolate-Rain-Outdoor-Soft-Pack-120-sheets-Pack-of-4",
            description: "tissue",
            price: 4.48,
            category: "66dd6f865628054a100976cf",
            quantity: 10000,
            createdAt: "2024-09-08T09:38:30.249Z",
            updatedAt: "2024-09-08T09:38:30.249Z",
            __v: 0,
          },
          {
            _id: "66dd70965628054a100976fe",
            name: "ValueStar Facial Tissue Soft Pack, 2-Ply, 4 x 200 sheets [Bundle of 3]",
            slug: "ValueStar-Facial-Tissue-Soft-Pack-2-Ply-4-x-200-sheets-[Bundle-of-3]",
            description: "tissue",
            price: 14.4,
            category: "66dd6f865628054a100976cf",
            quantity: 100,
            createdAt: "2024-09-13T19:38:30.249Z",
            updatedAt: "2024-09-13T19:38:30.249Z",
            __v: 0,
          },
        ],
      },
      jest.fn(),
    ]);
    render(
      <MemoryRouter initialEntries={["/search"]}>
        <Routes>
          <Route path="/search" element={<Search />} />
        </Routes>
      </MemoryRouter>
    );

    const prodItems = screen.getAllByText("ADD TO CART");
    expect(prodItems).toHaveLength(2);
  });
  it("shows correct message when no search result is found", () => {
    useSearch.mockReturnValueOnce([{ keyword: "", results: [] }, jest.fn()]);
    render(
      <MemoryRouter initialEntries={["/search"]}>
        <Routes>
          <Route path="/search" element={<Search />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("No Products Found")).toBeInTheDocument();
  });
  it.failing("does not display invalid search result", () => {
    useSearch.mockReturnValueOnce([
      {
        keyword: "",
        results: [
          {
            index: 1,
            property_a: "random str",
            property_b: "random str",
          },
          {
            index: 2,
            property_a: "random str",
            property_b: "random str",
          },
          {
            _id: "66dd70965628054a100976fe",
            name: "PurSoft 3ply Chocolate Rain Outdoor Soft Pack 120 sheets, Pack of 4",
            slug: "PurSoft-3ply-Chocolate-Rain-Outdoor-Soft-Pack-120-sheets-Pack-of-4",
            description: "tissue",
            price: 4.48,
            category: "66dd6f865628054a100976cf",
            quantity: 10000,
            createdAt: "2024-09-08T09:38:30.249Z",
            updatedAt: "2024-09-08T09:38:30.249Z",
            __v: 0,
          },
        ],
      },
    ]);
    render(
      <MemoryRouter initialEntries={["/search"]}>
        <Routes>
          <Route path="/search" element={<Search />} />
        </Routes>
      </MemoryRouter>
    );
    const prodItems = screen.getAllByText("ADD TO CART");
    expect(prodItems).toHaveLength(1);
  });
  it.failing(
    "product card More Details button functions correctly",
    async () => {
      jest.mock("react-router-dom", () => {
        const nav = jest.fn();
        return {
          ...jest.requireActual("react-router-dom"),
          mockedNavigation: nav,
          useNavigate: jest.fn(() => nav),
        };
      });

      const Router = require("react-router-dom");
      useSearch.mockReturnValueOnce([
        {
          keyword: "",
          results: [
            {
              _id: "66dd70965628054a100976fe",
              name: "PurSoft 3ply Chocolate Rain Outdoor Soft Pack 120 sheets, Pack of 4",
              slug: "PurSoft-3ply-Chocolate-Rain-Outdoor-Soft-Pack-120-sheets-Pack-of-4",
              description: "tissue",
              price: 4.48,
              category: "66dd6f865628054a100976cf",
              quantity: 10000,
              createdAt: "2024-09-08T09:38:30.249Z",
              updatedAt: "2024-09-08T09:38:30.249Z",
              __v: 0,
            },
          ],
        },
        jest.fn(),
      ]);
      render(
        <Router.MemoryRouter initialEntries={["/search"]}>
          <Router.Routes>
            <Router.Route path="/search" element={<Search />} />
          </Router.Routes>
        </Router.MemoryRouter>
      );
      fireEvent.click(screen.getByText("More Details"));
      expect(Router.mockedNavigation).toHaveBeenCalledWith(
        "/product/PurSoft-3ply-Chocolate-Rain-Outdoor-Soft-Pack-120-sheets-Pack-of-4"
      );
    }
  );
  it.failing(
    "product card Add to Cart button functions correctly",
    async () => {
      useSearch.mockReturnValueOnce([
        {
          keyword: "",
          results: [
            {
              _id: "66dd70965628054a100976fe",
              name: "PurSoft 3ply Chocolate Rain Outdoor Soft Pack 120 sheets, Pack of 4",
              slug: "PurSoft-3ply-Chocolate-Rain-Outdoor-Soft-Pack-120-sheets-Pack-of-4",
              description: "tissue",
              price: 4.48,
              category: "66dd6f865628054a100976cf",
              quantity: 10000,
              createdAt: "2024-09-08T09:38:30.249Z",
              updatedAt: "2024-09-08T09:38:30.249Z",
              __v: 0,
            },
          ],
        },
        jest.fn(),
      ]);
      render(
        <MemoryRouter initialEntries={["/search"]}>
          <Routes>
            <Route path="/search" element={<Search />} />
          </Routes>
        </MemoryRouter>
      );
      const cartSize = localStorage.getItem("cart")?.length || 0;
      fireEvent.click(screen.getByText("ADD TO CART"));
      expect(localStorage.getItem("cart")?.length || 0).toBe(cartSize + 1);
    }
  );
});
