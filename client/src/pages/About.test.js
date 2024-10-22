import React from "react";
import { render, screen } from "@testing-library/react";
import About from "../pages/About"; 
import axios from "axios";
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

// Mocking dependencies
jest.mock("../context/auth", () => ({
    useAuth: jest.fn(() => [null, jest.fn()]),
}));

jest.mock("../context/cart", () => ({
    useCart: jest.fn(() => [null, jest.fn()]),
}));

jest.mock("../context/search", () => ({
    useSearch: jest.fn(() => [{ keyword: "" }, jest.fn()]),
}));

jest.mock("axios");

describe("About Component", () => {
it("renders the image with the correct src and alt attributes", () => {
    // Mock the return value of the categories in the navigation bar
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
        <MemoryRouter initialEntries={["/about"]}>
        <Routes>
            <Route path="/about" element={<About />} />
        </Routes>
        </MemoryRouter>
    ); 

    const imgElement = screen.getByAltText("contactus");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src", "/images/about.jpeg");
    expect(imgElement).toHaveAttribute("alt", "contactus");
});

it("renders the placeholder text in the paragraph", () => {
    // Mock the return value of the categories in the navigation bar
    axios.get.mockResolvedValueOnce({ data: [] });
    render(
        <MemoryRouter initialEntries={["/about"]}>
        <Routes>
            <Route path="/about" element={<About />} />
        </Routes>
        </MemoryRouter>
    ); 
    const textElement = screen.getByText("Add text");
    expect(textElement).toBeInTheDocument();
});
});
