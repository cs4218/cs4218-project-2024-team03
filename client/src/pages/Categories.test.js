import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import Categories from "./Categories"; // Adjust this to the correct file path
import useCategory from "../hooks/useCategory";

jest.mock("../context/auth", () => ({
  useAuth: jest.fn(() => [null, jest.fn()]), // Mock useAuth hook to return null state and a mock function for setAuth
}));

jest.mock("../context/cart", () => ({
  useCart: jest.fn(() => [null, jest.fn()]), // Mock useCart hook to return null state and a mock function
}));

jest.mock("../context/search", () => ({
  useSearch: jest.fn(() => [{ keyword: "" }, jest.fn()]), // Mock useSearch hook to return null state and a mock function
}));

// Mock the useCategory hook
jest.mock("../hooks/useCategory", () => jest.fn());

describe("Categories Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing when there are no categories", () => {
    // No categories
    useCategory.mockReturnValue([]);

    const { getByText, container } = render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );

    // Check if the page title exists
    expect(getByText("All Categories")).toBeInTheDocument();
    const rows = container.querySelectorAll(".col-md-6");
    expect(rows.length).toBe(0);
  });

  it("displays the correct number of categories", () => {
    // Mock the return value of the useCategory hook with sample categories
    useCategory.mockReturnValue([
      { _id: "1", name: "Category 1", slug: "category-1", v_: 0 },
      { _id: "2", name: "Category 2", slug: "category-2", v_: 0 },
    ]);

    const { getAllByText, container } = render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );

    // Check if the category names are rendered
    const category1Links = getAllByText("Category 1");
    expect(category1Links.length).toBe(2);
    const category2Links = getAllByText("Category 2");
    expect(category2Links.length).toBe(2);

    // Check if the Links are correctly rendered
    expect(category1Links[1].closest("a")).toHaveAttribute(
      "href",
      "/category/category-1"
    );
    expect(category2Links[1].closest("a")).toHaveAttribute(
      "href",
      "/category/category-2"
    );

    const rows = container.querySelectorAll(".col-md-6");
    expect(rows.length).toBe(2);
  });
});
