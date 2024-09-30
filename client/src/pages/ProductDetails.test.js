import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";
import { beforeEach } from "node:test";
import ProductDetails from "./ProductDetails";

jest.mock("axios");
jest.mock("react-hot-toast");
jest.mock("../context/auth", () => ({
  useAuth: jest.fn(() => [null, jest.fn()]), // Mock useAuth hook to return null state and a mock function for setAuth
}));

jest.mock("../context/cart", () => ({
  useCart: jest.fn(() => [null, jest.fn()]), // Mock useCart hook to return null state and a mock function
}));

jest.mock("../context/search", () => ({
  useSearch: jest.fn(() => [{ keyword: "" }, jest.fn()]), // Mock useSearch hook to return null state and a mock function
}));

const sample_product = {
  success: true,
  message: "Single Product Fetched",
  product: {
    _id: "66dd70965628054a100976fe",
    name: "PurSoft 3ply Chocolate Rain Outdoor Soft Pack 120 sheets, Pack of 4",
    slug: "PurSoft-3ply-Chocolate-Rain-Outdoor-Soft-Pack-120-sheets-Pack-of-4",
    description: "tissue",
    price: 4.48,
    category: {
      _id: "66dd6f865628054a100976cf",
      name: "Home & Living",
      slug: "home-and-living",
      __v: 0,
    },
    quantity: 10000,
    createdAt: "2024-09-08T09:38:30.249Z",
    updatedAt: "2024-09-08T09:38:30.249Z",
    __v: 0,
  },
};
jest.mock("react-router-dom", () => {
  const params = {
    slug: sample_product.product.slug,
  };
  return {
    ...jest.requireActual("react-router-dom"),
    mockedParams: params,
    useParams: jest.fn(() => params),
  };
});

const Router = require("react-router-dom");
describe("test ProductDetails component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("gets the product detail with slug", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce(sample_product);

    render(
      <Router.MemoryRouter initialEntries={["/"]}>
        <Router.Routes>
          <Router.Route path="/" element={<ProductDetails />} />
        </Router.Routes>
      </Router.MemoryRouter>
    );
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        `/api/v1/product/get-product/${sample_product.product.slug}`
      )
    );
  });
  it("gets related product detail using product and category id", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: sample_product });
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <Router.MemoryRouter initialEntries={["/"]}>
        <Router.Routes>
          <Router.Route path="/" element={<ProductDetails />} />
        </Router.Routes>
      </Router.MemoryRouter>
    );
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        `/api/v1/product/get-product/${sample_product.product.slug}`
      )
    );
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        `/api/v1/product/related-product/${sample_product.product._id}/${sample_product.product.category._id}`
      )
    );
  });
  it("displays product detail correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: sample_product });
    axios.get.mockResolvedValueOnce({ data: { products: [] } });

    render(
      <Router.MemoryRouter initialEntries={["/"]}>
        <Router.Routes>
          <Router.Route path="/" element={<ProductDetails />} />
        </Router.Routes>
      </Router.MemoryRouter>
    );
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        `/api/v1/product/get-product/${sample_product.product.slug}`
      )
    );
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        `/api/v1/product/related-product/${sample_product.product._id}/${sample_product.product.category._id}`
      )
    );
    expect(screen.getByText("Product Details")).toBeInTheDocument();
    const nameEle = await screen.findByText(
      `Name : ${sample_product.product.name}`
    );
    expect(nameEle).toBeInTheDocument();
    const descEle = await screen.findByText(
      `Description : ${sample_product.product.description}`
    );
    expect(descEle).toBeInTheDocument();
    const priceEle = await screen.findByText(
      `Price :$${sample_product.product.price}`
    );
    expect(priceEle).toBeInTheDocument();
    const catEle = await screen.findByText(
      `Category : ${sample_product.product.category.name}`
    );
    expect(catEle).toBeInTheDocument();
    expect(screen.getByText("No Similar Products found")).toBeInTheDocument();
  });
  it("displays related products correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: sample_product });
    const RELATED_PRODUCT_NAME = "Kleenex";
    const related_product = JSON.parse(JSON.stringify(sample_product));
    related_product.product.name = RELATED_PRODUCT_NAME;
    axios.get.mockResolvedValueOnce({
      data: { products: [related_product.product] },
    });
    render(
      <Router.MemoryRouter initialEntries={["/"]}>
        <Router.Routes>
          <Router.Route path="/" element={<ProductDetails />} />
        </Router.Routes>
      </Router.MemoryRouter>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        `/api/v1/product/get-product/${sample_product.product.slug}`
      )
    );
    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        `/api/v1/product/related-product/${sample_product.product._id}/${sample_product.product.category._id}`
      )
    );
    expect(screen.getByText("Similar Products ➡️")).toBeInTheDocument();
    const nameEle = await screen.findByText(related_product.product.name);
    expect(nameEle).toBeInTheDocument();
  });
  it.failing(
    "displays fallback values when receiving invalid product data",
    async () => {
      axios.get.mockResolvedValueOnce({ data: [] });
      const INVALID_PRICE = "invalid string";
      sample_product.product.price = INVALID_PRICE;
      console.log(sample_product);
      axios.get.mockResolvedValueOnce({
        data: sample_product,
      });
      axios.get.mockResolvedValueOnce({ data: { products: [] } });

      render(
        <Router.MemoryRouter initialEntries={["/"]}>
          <Router.Routes>
            <Router.Route path="/" element={<ProductDetails />} />
          </Router.Routes>
        </Router.MemoryRouter>
      );
      await waitFor(() => expect(axios.get).toHaveBeenCalled());
      await waitFor(() => expect(axios.get).toHaveBeenCalled());
      const priceEle = await screen.findByText(`Price :${INVALID_PRICE}`);
      expect(priceEle).not.toBeInTheDocument();
    }
  );
});
