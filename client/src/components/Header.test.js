import React from "react";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import Header from "./Header";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter, Route, Routes } from "react-router-dom";
jest.mock("../context/auth", () => ({
  useAuth: jest.fn(() => [null, jest.fn()]), // Mock useAuth hook to return null state and a mock function for setAuth
}));

jest.mock("../context/cart", () => ({
  useCart: jest.fn(() => [null, jest.fn()]), // Mock useCart hook to return null state and a mock function
}));

jest.mock("../context/search", () => ({
  useSearch: jest.fn(() => [{ keyword: "" }, jest.fn()]), // Mock useSearch hook to return null state and a mock function
}));
const HOME_LIVING = "home and living";
const FOOD_BEVERAGE = "food and beverages";
jest.mock("../../src/hooks/useCategory", () => {
  return () => {
    return [
      { name: HOME_LIVING, slug: HOME_LIVING.split(" ").join("-") },
      { name: FOOD_BEVERAGE, slug: FOOD_BEVERAGE.split(" ").join("-") },
    ];
  };
});
describe("test Header component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("logo redirects to home page", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Header />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("🛒 Virtual Vault"));
    expect(window.location.pathname).toBe("/");
  });
  it("HOME element redirects to home page", () => {
    render(
      <MemoryRouter initialEntries={["/header"]}>
        <Routes>
          <Route path="/header" element={<Header />} />
          <Route path="/" element={<div>__HOME__</div>} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByTestId("home-btn"));
    expect(screen.getByText("__HOME__")).toBeInTheDocument();
  });
  it("dropdown list displays category correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Header />} />
        </Routes>
      </MemoryRouter>
    );
    const allCategories = screen.queryByTestId("all-categories");
    expect(allCategories).toBeInTheDocument();
    const homeAndLiving = screen.getByText(HOME_LIVING);
    expect(homeAndLiving).toBeInTheDocument();
    const foodAndBeverage = screen.getByText(FOOD_BEVERAGE);
    expect(foodAndBeverage).toBeInTheDocument();
  });
  it("dropdown list all categories item redirects correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/categories" element={<div>__CATEGORIES__</div>} />
        </Routes>
      </MemoryRouter>
    );
    const allCategories = screen.queryByTestId("all-categories");
    expect(allCategories).toBeInTheDocument();
    fireEvent.click(allCategories);
    expect(screen.getByText("__CATEGORIES__")).toBeInTheDocument();
  });
  it("dropdown list custom category redirects correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route
            path="/category/home-and-living"
            element={<div>__CATEGORY_ITEM__</div>}
          />
        </Routes>
      </MemoryRouter>
    );
    const homeAndLiving = screen.getByText(HOME_LIVING);
    expect(homeAndLiving).toBeInTheDocument();
    fireEvent.click(homeAndLiving);
    expect(screen.getByText("__CATEGORY_ITEM__")).toBeInTheDocument();
  });
  it("register button redirects correctly", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/register" element={<div>__REGISTER__</div>} />
        </Routes>
      </MemoryRouter>
    );
    const register = screen.getByText("Register");
    fireEvent.click(register);
    expect(screen.getByText("__REGISTER__")).toBeInTheDocument();
  });
  it("login button redirects correctly", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/login" element={<div>__LOGIN__</div>} />
        </Routes>
      </MemoryRouter>
    );
    const login = screen.getByText("Login");
    fireEvent.click(login);
    expect(screen.getByText("__LOGIN__")).toBeInTheDocument();
  });
  it("cart button redirects correctly", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/cart" element={<div>__CART__</div>} />
        </Routes>
      </MemoryRouter>
    );
    const cart = screen.getByText("Cart");
    fireEvent.click(cart);
    expect(screen.getByText("__CART__")).toBeInTheDocument();
  });
});
