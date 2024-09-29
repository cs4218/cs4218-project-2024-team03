import '@testing-library/jest-dom';
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import HomePage from "./HomePage";
import { useCart } from '../context/cart';

jest.mock('axios');

jest.mock('../context/cart', () => {
  const React = require('react');
  return {
    useCart: () => React.useState([]),
  };
});

jest.mock('../components/Header', () => () => <div>Mocked Header</div>);

const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key] || '[]';
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { reload: jest.fn() },
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("HomePage Component", () => {
  test("should render the HomePage with filters and products", async () => {
    axios.get.mockImplementation((url) => {
      if (url === "/api/v1/category/get-category") {
        return Promise.resolve({
          data: {
            success: true,
            category: [
              { _id: "1", name: "Category 1" },
              { _id: "2", name: "Category 2" },
            ],
          },
        });
      } else if (url === "/api/v1/product/product-count") {
        return Promise.resolve({
          data: {
            total: 2,
          },
        });
      } else if (url === "/api/v1/product/product-list/1") {
        return Promise.resolve({
          data: {
            products: [
              {
                _id: "1",
                name: "Product 1",
                price: 100,
                description: "Product 1 description",
                slug: "product-1",
              },
              {
                _id: "2",
                name: "Product 2",
                price: 200,
                description: "Product 2 description",
                slug: "product-2",
              },
            ],
          },
        });
      }
    });

    renderWithRouter(<HomePage />);

    const filterByCategoryElement = await screen.findByText("Filter By Category");
    expect(filterByCategoryElement).toBeInTheDocument();

    const filterByPriceElement = await screen.findByText("Filter By Price");
    expect(filterByPriceElement).toBeInTheDocument();

    const category1Element = await screen.findByText("Category 1");
    expect(category1Element).toBeInTheDocument();

    const category2Element = await screen.findByText("Category 2");
    expect(category2Element).toBeInTheDocument();

    const product1Element = await screen.findByText("Product 1");
    expect(product1Element).toBeInTheDocument();

    const product2Element = await screen.findByText("Product 2");
    expect(product2Element).toBeInTheDocument();
  });

  test("should load more products on 'Load More' button click", async () => {
    let page = 1;

    axios.get.mockImplementation((url) => {
      if (url === "/api/v1/product/product-count") {
        return Promise.resolve({
          data: {
            total: 2,
          },
        });
      } else if (url === `/api/v1/product/product-list/${page}`) {
        if (page === 1) {
          return Promise.resolve({
            data: {
              products: [
                {
                  _id: "1",
                  name: "Product 1",
                  price: 100,
                  description: "Product 1 description",
                  slug: "product-1",
                },
              ],
            },
          });
        } else if (page === 2) {
          return Promise.resolve({
            data: {
              products: [
                {
                  _id: "2",
                  name: "Product 2",
                  price: 200,
                  description: "Product 2 description",
                  slug: "product-2",
                },
              ],
            },
          });
        }
      }
    });

    renderWithRouter(<HomePage />);

    const product1Element = await screen.findByText("Product 1");
    expect(product1Element).toBeInTheDocument();
    
    const product2Element = screen.queryByText("Product 2");
    expect(product2Element).not.toBeInTheDocument();

    page = 2;
    fireEvent.click(screen.getByText(/Loadmore/i));

    await waitFor(() => {
      expect(screen.getByText("Product 2")).toBeInTheDocument();
    });
  });

  test("should add a product to cart", async () => {
    axios.get.mockImplementation((url) => {
      if (url === "/api/v1/category/get-category") {
        return Promise.resolve({
          data: {
            success: true,
            category: [],
          },
        });
      } else if (url === "/api/v1/product/product-count") {
        return Promise.resolve({
          data: {
            total: 1,
          },
        });
      } else if (url === "/api/v1/product/product-list/1") {
        return Promise.resolve(
          {data: {
            products: [
              {
                _id: "1",
                name: "Product 1",
                price: 100,
                description: "Product 1 description",
                slug: "product-1",
              },
            ],
          }});
      } else {
        return Promise.reject(new Error(`Unhandled GET request: ${url}`));
      }
    });
  
    renderWithRouter(<HomePage />);
  
    const addToCartButton = await screen.findByText(/ADD TO CART/i);
    expect(addToCartButton).toBeInTheDocument();
  
    fireEvent.click(addToCartButton);
  
    await waitFor(() => {
      const cartItems = JSON.parse(localStorage.getItem("cart"));
      expect(cartItems).toHaveLength(1);
    });
  
    const cartItems = JSON.parse(localStorage.getItem("cart"));
    expect(cartItems[0].name).toBe("Product 1");
  });

  test("should apply category filters correctly", async () => {
    axios.get.mockImplementation((url) => {
      if (url === "/api/v1/category/get-category") {
        return Promise.resolve({
          data: {
            success: true,
            category: [
              { _id: "1", name: "Category 1" },
              { _id: "2", name: "Category 2" },
            ],
          },
        });
      } else if (url === "/api/v1/product/product-count") {
        return Promise.resolve({
          data: {
            total: 1,
          },
        });
      }
    });

    axios.post.mockImplementation((url, data) => {
      if (url === "/api/v1/product/product-filters") {
        return Promise.resolve({
          data: {
            products: [
              {
                _id: "1",
                name: "Filtered Product",
                price: 100,
                description: "Filtered product description",
                slug: "filtered-product",
              },
            ],
          },
        });
      }
    });

    await act(async () => {
      renderWithRouter(<HomePage />);
    });

    fireEvent.click(screen.getByText("Category 1"));

    await waitFor(() => {
      expect(screen.getByText("Filtered Product")).toBeInTheDocument();
    });
  });

  test("should handle loading state correctly", async () => {
    axios.get.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { products: [] } });
        }, 2000);
      });
    });

    renderWithRouter(<HomePage />);

    expect(screen.getByText("Loading ...")).toBeInTheDocument();
  });

  test("should reset filters when 'RESET FILTERS' is clicked", async () => {
    axios.get.mockImplementation((url) => {
      if (url === "/api/v1/category/get-category") {
        return Promise.resolve({
          data: {
            success: true,
            category: [{ _id: "1", name: "Category 1" }],
          },
        });
      }
    });

    axios.post.mockImplementation((url) => {
      if (url === "/api/v1/product/product-filters") {
        return Promise.resolve({
          data: {
            products: [],
          },
        });
      }
    });

    renderWithRouter(<HomePage />);

    fireEvent.click(screen.getByText(/RESET FILTERS/i));

    expect(window.location.reload).toHaveBeenCalled();
  });
});
