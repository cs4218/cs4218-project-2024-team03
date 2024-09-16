import React from "react";
import { render, screen } from "@testing-library/react";
import Users from "./Users";
import '@testing-library/jest-dom/extend-expect';


// Mock the components imported in Users
jest.mock('../../components/Layout', () => ({ children }) => <div>{children}</div>);
jest.mock('../../components/AdminMenu', () => () => <div>AdminMenu</div>);

describe("Users Component", () => {
  it("renders the Users component with Layout and AdminMenu", () => {
    // Render the component
    render(<Users />);

    // Check if "All Users" heading is displayed
    expect(screen.getByText(/All Users/i)).toBeInTheDocument();

    // Check if the Layout component renders the correct title
    // expect(screen.getByText(/Dashboard - All Users/i)).toBeInTheDocument();

    // Check if the AdminMenu component is rendered
    expect(screen.getByText(/AdminMenu/i)).toBeInTheDocument();
  });
});
