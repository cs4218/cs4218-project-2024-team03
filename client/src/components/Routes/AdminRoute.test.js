import '@testing-library/jest-dom'; 
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminRoute from './AdminRoute';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import { MemoryRouter, Routes, Route } from 'react-router-dom';


jest.mock('axios');
jest.mock('../../context/auth');
jest.mock('../Spinner', () => () => <div data-testid="spinner">Loading...</div>);

describe('AdminRoute Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Outlet when user is authenticated as admin', async () => {
    useAuth.mockReturnValue([{ token: 'valid-token' }, jest.fn()]);
    axios.get.mockResolvedValue({ data: { ok: true } });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div data-testid="admin-page">Admin Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('admin-page')).toBeInTheDocument();
    });
  });

  test('renders Spinner when user is not authenticated as admin', async () => {
    useAuth.mockReturnValue([{ token: 'valid-token' }, jest.fn()]);
    axios.get.mockResolvedValue({ data: { ok: false } });
    render(
      <MemoryRouter>
        <AdminRoute />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });

  test('renders Spinner when user is not authenticated (no token)', () => {
    useAuth.mockReturnValue([{}, jest.fn()]);
    render(
      <MemoryRouter>
        <AdminRoute />
      </MemoryRouter>
    );
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
