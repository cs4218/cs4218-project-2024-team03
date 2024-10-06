import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import toast from 'react-hot-toast';
import Register from './Register';

jest.mock('axios');
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

  Object.defineProperty(window, 'localStorage', {
    value: {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
    },
    writable: true,
  });

window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
    };
  };
      

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register the user successfully', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<Register />} />
          </Routes>
        </MemoryRouter>
      );

    fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Address'), { target: { value: '123 Street' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your DOB'), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('What is Your Favorite sports'), { target: { value: 'Football' } });

    fireEvent.click(screen.getByText('REGISTER'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalledWith('Register Successfully, please login');
  });

  it.failing('should display error message if DOB is empty', async () => {
    render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<Register />} />
          </Routes>
        </MemoryRouter>
      );
      fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: 'password123' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your Phone'), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your Address'), { target: { value: '123 Street' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your DOB'), { target: { value: '' } });
      fireEvent.change(screen.getByPlaceholderText('What is Your Favorite sports'), { target: { value: 'Football' } });

      fireEvent.click(screen.getByText('REGISTER'));

      await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
      expect(toast.error).toHaveBeenCalledWith('Please enter your DOB');
  });

  it.failing('should display error message if month less than one', async () => {
    render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<Register />} />
          </Routes>
        </MemoryRouter>
      );
      fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: 'password123' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your Phone'), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your Address'), { target: { value: '123 Street' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your DOB'), { target: { value: '2000-00-01' } });
      fireEvent.change(screen.getByPlaceholderText('What is Your Favorite sports'), { target: { value: 'Football' } });

      fireEvent.click(screen.getByText('REGISTER'));

      await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
      expect(toast.error).toHaveBeenCalledWith('Please enter a valid month');
  });

  it('should register the user successfully if DOB month between 1 and 12 inclusive (boundary 1)', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<Register />} />
          </Routes>
        </MemoryRouter>
      );

    fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Address'), { target: { value: '123 Street' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your DOB'), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('What is Your Favorite sports'), { target: { value: 'Football' } });

    fireEvent.click(screen.getByText('REGISTER'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalledWith('Register Successfully, please login');
  });

  it('should register the user successfully if DOB month between 1 and 12 inclusive (boundary 12)', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<Register />} />
          </Routes>
        </MemoryRouter>
      );

    fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Address'), { target: { value: '123 Street' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your DOB'), { target: { value: '2000-12-01' } });
    fireEvent.change(screen.getByPlaceholderText('What is Your Favorite sports'), { target: { value: 'Football' } });

    fireEvent.click(screen.getByText('REGISTER'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalledWith('Register Successfully, please login');
  });

  it.failing('should display error message if month greater than 12 (boundary)', async () => {
    render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<Register />} />
          </Routes>
        </MemoryRouter>
      );
      fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: 'password123' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your Phone'), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your Address'), { target: { value: '123 Street' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your DOB'), { target: { value: '2000-13-01' } });
      fireEvent.change(screen.getByPlaceholderText('What is Your Favorite sports'), { target: { value: 'Football' } });

      fireEvent.click(screen.getByText('REGISTER'));

      await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
      expect(toast.error).toHaveBeenCalledWith('Please enter a valid month');
  });

  it.failing('should display error message if month greater than 12 (> 12)', async () => {
    render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<Register />} />
          </Routes>
        </MemoryRouter>
      );
      fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: 'password123' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your Phone'), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your Address'), { target: { value: '123 Street' } });
      fireEvent.change(screen.getByPlaceholderText('Enter Your DOB'), { target: { value: '2000-23-01' } });
      fireEvent.change(screen.getByPlaceholderText('What is Your Favorite sports'), { target: { value: 'Football' } });

      fireEvent.click(screen.getByText('REGISTER'));

      await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
      expect(toast.error).toHaveBeenCalledWith('Please enter a valid month');
  });

  it('should display error message on failed registration', async () => {
    axios.post.mockRejectedValueOnce({ message: 'User already exists' });

    render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<Register />} />
          </Routes>
        </MemoryRouter>
      );

    fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Address'), { target: { value: '123 Street' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your DOB'), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('What is Your Favorite sports'), { target: { value: 'Football' } });

    fireEvent.click(screen.getByText('REGISTER'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalledWith('Something went wrong');
  });

  it('should register the user successfully if DOB month is integer and within 1 and 12', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<Register />} />
          </Routes>
        </MemoryRouter>
      );

    fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Address'), { target: { value: '123 Street' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your DOB'), { target: { value: '2000-06-01' } });
    fireEvent.change(screen.getByPlaceholderText('What is Your Favorite sports'), { target: { value: 'Football' } });

    fireEvent.click(screen.getByText('REGISTER'));

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalledWith('Register Successfully, please login');
  });

  it.failing('should register the user successfully if DOB month is not integer and within 1 and 12', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<Register />} />
          </Routes>
        </MemoryRouter>
      );

    fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Address'), { target: { value: '123 Street' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your DOB'), { target: { value: '2000-6.5-01' } });
    fireEvent.change(screen.getByPlaceholderText('What is Your Favorite sports'), { target: { value: 'Football' } });

    fireEvent.click(screen.getByText('REGISTER'));

    await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalledWith('Please enter a valid month');
  });
});
