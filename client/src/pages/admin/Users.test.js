import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Users from "./Users";
import '@testing-library/jest-dom/extend-expect';
import axios from "axios";
import { afterEach } from "node:test";


jest.mock("axios");
jest.mock('react-hot-toast');
jest.mock('../../components/Layout', () => ({ children }) => <div>{children}</div>);
jest.mock('../../components/AdminMenu', () => () => <div>AdminMenu</div>);

describe("Users Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  })
  
  test("renders the Users component", () => {
    render(<Users />);

    expect(screen.getByText(/All Users/i)).toBeInTheDocument();
  });
  it("axios is called to fetch users", async () => {
    render(<Users />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(`/api/v1/product/get-users`))
  });
});
