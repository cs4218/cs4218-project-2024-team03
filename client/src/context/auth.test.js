import React from "react";
import { render, screen } from "@testing-library/react";
import { useAuth, AuthProvider } from "./auth";
import axios from "axios";

// Mock axios
jest.mock("axios");

describe("AuthProvider", () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("provides initial auth context values", () => {
    const TestComponent = () => {
      const [auth] = useAuth();
      return (
        <div>
          <span data-testid="user">{auth.user ? auth.user : "No user"}</span>
          <span data-testid="token">{auth.token}</span>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user").textContent).toBe("No user");
    expect(screen.getByTestId("token").textContent).toBe("");
  });

  it("sets axios authorization header with token", () => {
    render(
      <AuthProvider>
        <div>Test</div>
      </AuthProvider>
    );

    expect(axios.defaults.headers.common["Authorization"]).toBe("");
  });

  it("loads auth state from localStorage if available", () => {
    const mockData = {
      user: "Test User",
      token: "12345",
    };
    localStorage.setItem("auth", JSON.stringify(mockData));

    const TestComponent = () => {
      const [auth] = useAuth();
      return (
        <div>
          <span data-testid="user">{auth.user}</span>
          <span data-testid="token">{auth.token}</span>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user").textContent).toBe(mockData.user);
    expect(screen.getByTestId("token").textContent).toBe(mockData.token);
    expect(axios.defaults.headers.common["Authorization"]).toBe(mockData.token);
  });
});
