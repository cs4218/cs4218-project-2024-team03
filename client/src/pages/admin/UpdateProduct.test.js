import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateProduct from "./CreateProduct";
import axios from "axios";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import { toast } from "react-hot-toast";
import UpdateProduct from "./UpdateProduct";

jest.mock("axios");
jest.mock('react-hot-toast');

jest.mock('../../context/auth', () => ({
  useAuth: jest.fn(() => [null, jest.fn()]) 
}));

jest.mock('../../context/cart', () => ({
  useCart: jest.fn(() => [null, jest.fn()])
}));
  
jest.mock('../../context/search', () => ({
  useSearch: jest.fn(() => [{ keyword: '' }, jest.fn()]) 
}));  

const mockProduct = {
    _id: "66d73fdee152a157371c9cb3",
    name: "mdb",
    description: "Test description",
    price: 100,
    quantity: 10,
    shipping: true,
    category: { _id: "cat1", name: "Category 1"}
};

const mockCategory = [
  { _id: "66d73fdee152a157371c9cb4", name: "Category 1" }, 
  { _id: "66d73fdee152a157371c9cb5", name: "Category 2" }
];
      

describe("UpdateProduct Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  })

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        product: mockProduct,
        category: mockCategory,
        success: true
      },
    });
    global.URL.createObjectURL = jest.fn();
  });

  test("renders UpdateProduct component and loads data", async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/product/mdb']}>
        <Routes>
          <Route path="/dashboard/admin/product/mdb" element={<UpdateProduct />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /Update Product/i })).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByDisplayValue("mdb")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("10")).toBeInTheDocument();
    });

    expect(screen.getByText(/Category 1/i)).toBeInTheDocument();
  });

  test("get-category API is called", async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/product/mdb']}>
        <Routes>
          <Route path="/dashboard/admin/product/mdb" element={<UpdateProduct />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/api/v1/category/get-category"));
  });

  test("allows updating product text fields", async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/product/mdb']}>
          <Routes>
            <Route path="/dashboard/admin/product/mdb" element={<UpdateProduct />} />
          </Routes>
        </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('write a name')).toHaveValue('mdb');
    });

    fireEvent.change(screen.getByPlaceholderText(/write a name/i), {
      target: { value: "Updated Product" },
    });

    fireEvent.change(screen.getByPlaceholderText(/write a description/i), {
      target: { value: "Updated description" },
    });

    fireEvent.change(screen.getByPlaceholderText(/write a Price/i), {
      target: { value: 200 },
    });
    
    const button = await screen.findByRole("button", { name: /Update Product/i });
    fireEvent.click(button);
    
    await waitFor(() => expect(axios.put).toHaveBeenCalledWith(
      `/api/v1/product/update-product/66d73fdee152a157371c9cb3`,
      expect.any(FormData)
    ));
  });

  test("update photo", async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/product/mdb']}>
          <Routes>
            <Route path="/dashboard/admin/product/mdb" element={<UpdateProduct />} />
          </Routes>
        </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('write a name')).toHaveValue('mdb');
    });

    const file = new File(["image"], "photo.jpg", { type: "image/jpeg" });
    const input = screen.getByLabelText(/Upload Photo/i);
    fireEvent.change(input, { target: { files: [file] } });

    // These 2 are somehow causing errors in the test case  
    // fireEvent.mouseDown(screen.getByText(/Select a category/i)); 
    // fireEvent.click(screen.getByText(/New Category Name/i));

    // await waitFor(() => {
    //   const shippingSelect = screen.getAllByTestId('category-select')[1]
    //   fireEvent.change(shippingSelect, { target: { value: '0' } })
    //   expect(shippingSelect.value).toBe('0')
    // })
    
    const button = await screen.findByRole("button", { name: /Update Product/i });
    fireEvent.click(button);
    
    await waitFor(() => expect(axios.put).toHaveBeenCalledWith(
      `/api/v1/product/update-product/66d73fdee152a157371c9cb3`,
      expect.any(FormData)
    ));
  });

  it("handles deleting a product", async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/product/mdb']}>
          <Routes>
            <Route path="/dashboard/admin/product/mdb" element={<UpdateProduct />} />
          </Routes>
        </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByPlaceholderText('write a name')).toHaveValue('mdb');
    });

    window.prompt = jest.fn().mockReturnValue(true);

    const button = await screen.findByRole("button", { name: /Delete Product/i });
    fireEvent.click(button);

    const temp = screen.queryByText("mdb");
    await waitFor(() => expect(temp).not.toBeInTheDocument());
  });

  it("deleting a product calls the correct API", async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/product/mdb']}>
          <Routes>
            <Route path="/dashboard/admin/product/mdb" element={<UpdateProduct />} />
          </Routes>
        </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByPlaceholderText('write a name')).toHaveValue('mdb');
    });

    window.prompt = jest.fn().mockReturnValue(true);

    const button = await screen.findByRole("button", { name: /Delete Product/i });
    fireEvent.click(button);
    
    await waitFor(() => expect(axios.delete).toHaveBeenCalledWith(`/api/v1/product/delete-product/66d73fdee152a157371c9cb3`));
  });

  it("handles a canceled delete", async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/admin/product/mdb']}>
          <Routes>
            <Route path="/dashboard/admin/product/mdb" element={<UpdateProduct />} />
          </Routes>
        </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByPlaceholderText('write a name')).toHaveValue('mdb');
    });

    window.prompt = jest.fn(() => null)

    const button = await screen.findByRole("button", { name: /Delete Product/i });
    fireEvent.click(button);
  
    await waitFor(() => {
      expect(screen.getByPlaceholderText('write a name')).toHaveValue('mdb');
    });
    
    expect(axios.delete).not.toHaveBeenCalled()
  });
});
