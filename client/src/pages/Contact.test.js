import React from "react";
import { screen, render } from "@testing-library/react";
import Contact from "./Contact";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
jest.mock("../context/auth", () => ({
  useAuth: jest.fn(() => [null, jest.fn()]), // Mock useAuth hook to return null state and a mock function for setAuth
}));

jest.mock("../context/cart", () => ({
  useCart: jest.fn(() => [null, jest.fn()]), // Mock useCart hook to return null state and a mock function
}));

jest.mock("../context/search", () => ({
  useSearch: jest.fn(() => [{ keyword: "" }, jest.fn()]), // Mock useSearch hook to return null state and a mock function
}));
describe("test Contact component", () => {
  it("displays all contact information correctly", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Contact />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId("contact-email")).toHaveTextContent(
      "www.help@ecommerceapp.com"
    );
    expect(screen.getByTestId("contact-phone")).toHaveTextContent(
      "012-3456789"
    );
    expect(screen.getByTestId("contact-support")).toHaveTextContent(
      "1800-0000-0000 (toll free)"
    );
  });
});
