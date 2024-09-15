import React from "react";
import axios from "axios";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SearchProvider } from "../../context/search";
import SearchInput from "./SearchInput";
import { beforeEach } from "node:test";
jest.mock("axios");

// partially mock only navigation
jest.mock("react-router-dom", () => {
  const nav = jest.fn();
  return {
    ...jest.requireActual("react-router-dom"),
    mockedNavigation: nav,
    useNavigate: jest.fn(() => nav),
  };
});

const Router = require("react-router-dom");
describe("SearchInput Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should allow typing search query", () => {
    render(
      <SearchProvider>
        <Router.MemoryRouter initialEntries={["/"]}>
          <Router.Routes>
            <Router.Route path="/" element={<SearchInput />} />
          </Router.Routes>
        </Router.MemoryRouter>
      </SearchProvider>
    );
    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "tissue" },
    });
    expect(screen.getByPlaceholderText("Search").value).toBe("tissue");
  });
  it("redirects to search page on success", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
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
    });
    render(
      <SearchProvider>
        <Router.MemoryRouter initialEntries={["/"]}>
          <Router.Routes>
            <Router.Route path="/" element={<SearchInput />} />
          </Router.Routes>
        </Router.MemoryRouter>
      </SearchProvider>
    );
    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "tissue" },
    });
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith("/api/v1/product/search/tissue")
    );
    expect(Router.mockedNavigation).toHaveBeenCalledWith("/search");
  });

  it("should not make API call when search string is empty", async () => {
    axios.get.mockResolvedValueOnce({
      data: [],
    });
    render(
      <SearchProvider>
        <Router.MemoryRouter initialEntries={["/"]}>
          <Router.Routes>
            <Router.Route path="/" element={<SearchInput />} />
          </Router.Routes>
        </Router.MemoryRouter>
      </SearchProvider>
    );
    fireEvent.click(screen.getByText("Search"));
    expect(axios.get).not.toHaveBeenCalled();
  });
  it("redirects to search page search results is empty list", async () => {
    axios.get.mockResolvedValueOnce({
      data: [],
    });
    render(
      <SearchProvider>
        <Router.MemoryRouter initialEntries={["/"]}>
          <Router.Routes>
            <Router.Route path="/" element={<SearchInput />} />
          </Router.Routes>
        </Router.MemoryRouter>
      </SearchProvider>
    );
    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "abc" },
    });
    fireEvent.click(screen.getByText("Search"));
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith("/api/v1/product/search/abc")
    );
    expect(Router.mockedNavigation).toHaveBeenCalledWith("/search");
  });
  it("handles special character in the search string", async () => {
    axios.get.mockResolvedValueOnce({
      data: [], // Assume backend returns an empty list
    });
    render(
      <SearchProvider>
        <Router.MemoryRouter initialEntries={["/"]}>
          <Router.Routes>
            <Router.Route path="/" element={<SearchInput />} />
          </Router.Routes>
        </Router.MemoryRouter>
      </SearchProvider>
    );
    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "/" },
    });
    fireEvent.click(screen.getByText("Search"));
    await waitFor(
      () => expect(axios.get).toHaveBeenCalledWith("/api/v1/product/search/%2F") // '/' should be encoded as '%2F'
    );
  });
  it("handles backend failure gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error");
    // mocks the implementation of console.error to do nothing.
    // This is for suppressing Error Output in Tests
    consoleSpy.mockImplementation(() => {
      return;
    });
    axios.get.mockRejectedValueOnce({ response: { status: 500 } });
    render(
      <SearchProvider>
        <Router.MemoryRouter initialEntries={["/"]}>
          <Router.Routes>
            <Router.Route path="/" element={<SearchInput />} />
          </Router.Routes>
        </Router.MemoryRouter>
      </SearchProvider>
    );
    await waitFor(axios.get);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
