import '@testing-library/jest-dom'; 
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Private from './Private';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

jest.mock('axios');
jest.mock('../../context/auth');
jest.mock('../Spinner', () => (props) => <div data-testid="spinner">Loading... {props.path}</div>);

describe('PrivateRoute Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Outlet when user is authenticated', async () => {
    useAuth.mockReturnValue([{ token: 'valid-token' }, jest.fn()]);
    axios.get.mockResolvedValue({ data: { ok: true } });
    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route element={<Private />}>
            <Route path="/private" element={<div data-testid="private-page">Private Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('private-page')).toBeInTheDocument();
    });
  });

  test('renders Spinner when user is authenticated but not authorized', async () => {
    useAuth.mockReturnValue([{ token: 'valid-token' }, jest.fn()]);
    axios.get.mockResolvedValue({ data: { ok: false } });
    render(
      <MemoryRouter>
        <Private />
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
        <Private />
      </MemoryRouter>
    );
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
