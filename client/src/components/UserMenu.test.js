import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, BrowserRouter } from 'react-router-dom';
import UserMenu from './UserMenu';
import '@testing-library/jest-dom';

describe('UserMenu Component', () => {
  it('should render the dashboard heading', () => {
    render(
      <BrowserRouter>
        <UserMenu />
      </BrowserRouter>
    );

    const heading = screen.getByText('Dashboard');
    expect(heading).toBeInTheDocument();
  });

  it('should render the Profile and Orders links', () => {
    render(
      <BrowserRouter>
        <UserMenu />
      </BrowserRouter>
    );

    const profileLink = screen.getByText('Profile');
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute('href', '/dashboard/user/profile');

    const ordersLink = screen.getByText('Orders');
    expect(ordersLink).toBeInTheDocument();
    expect(ordersLink).toHaveAttribute('href', '/dashboard/user/orders');
  });

  it("should be able to navigate to Profile page", async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/user']}>
        <Routes>
          <Route path="/dashboard/user" element={<UserMenu />} />
          <Route path="/dashboard/user/profile" element={<div>USER PROFILE</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Profile'));
    await waitFor(() => {
      expect(screen.getByText('USER PROFILE')).toBeInTheDocument();
    });
  });

  it('should be able to navigate to Orders page', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/user']}>
        <Routes>
          <Route path="/dashboard/user" element={<UserMenu />} />
          <Route path="/dashboard/user/orders" element={<div>All Orders</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Orders'));
    await waitFor(() => {
      expect(screen.getByText('All Orders')).toBeInTheDocument();
    });
  });
});