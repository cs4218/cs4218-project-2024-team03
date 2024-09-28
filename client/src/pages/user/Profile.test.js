import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Profile from './Profile';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/auth';

jest.mock('axios');
jest.mock('react-hot-toast');

jest.mock('../../context/auth', () => ({
  useAuth: jest.fn(() => [null, jest.fn()]) 
}));

jest.mock('../../context/cart', () => ({
  useCart: jest.fn(() => [null, jest.fn()]) 
}));

jest.mock('../../context/search', () => ({
  useSearch: jest.fn(() => [{ keyword: '' }, jest.fn()]) // Mock useSearch hook to return null state and a mock function
}));  

Object.defineProperty(window, 'localStorage', {
  value: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});

describe('Profile Component', () => {
  const setAuthMock = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();

    useAuth.mockReturnValue([
      {
        user: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "12345678",
          address: "123 Street",
        },
      },
      setAuthMock,
    ])
  });

  it('should render the profile page',async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('John Doe')).not.toBeNull();
    expect(screen.getByDisplayValue('john.doe@example.com')).not.toBeNull();
    expect(screen.getByDisplayValue('12345678')).not.toBeNull();
    expect(screen.getByDisplayValue('123 Street')).not.toBeNull();
  });

  it('should update the user successfully', async () => {
    const updatedUser = {
      name: "Username",
      email: "username@exampple.com",
      password: "password123",
      phone: "98765432",
      address: "321 Street",
    }

    axios.put.mockResolvedValue({
      data: {
        updatedUser
      }
    })

    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify({
        user: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "12345678",
          address: "123 Street",
        },
      })),
      setItem: jest.fn()
    }

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );


    fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), { target: { value: updatedUser.name } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: updatedUser.email } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: updatedUser.password} });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Phone'), { target: { value:updatedUser.phone } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Address'), { target: { value: updatedUser.address } });

    fireEvent.click(screen.getByText('UPDATE'));

    await waitFor(() => expect(axios.put).toHaveBeenCalled());

    await waitFor(() => {
      expect(setAuthMock).toHaveBeenCalledWith({
        user: updatedUser
      });
    })

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('auth', JSON.stringify({
        user: updatedUser
      }));
    })
    expect(toast.success).toHaveBeenCalledWith('Profile Updated Successfully');
  })


  it('should display error message when localstorage cannot get user', async () => {
    axios.put.mockRejectedValueOnce({data: {
      success: false,
      message: "Error updating profile"
    }});

    localStorage.getItem.mockImplementationOnce(() => {
      throw new Error("Error getting item")
    })

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );


    fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), { target: { value: 'Username' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'username@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: '12345678' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Address'), { target: { value: '123 Street' } });

    fireEvent.click(screen.getByText('UPDATE'));

    await waitFor(() => expect(axios.put).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalledWith("Something went wrong");
  })

  fit('should display error message when updating profile fails from server', async () => {
    axios.put.mockResolvedValueOnce({
      error: "Password is required and 6 character long"
    })

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter Your Name'), { target: { value: 'Username' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'username@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: '234' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Your Address'), { target: { value: '123 Street' } });

    fireEvent.click(screen.getByText('UPDATE'));

    await waitFor(() => expect(axios.put).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalledWith("Password is required and 6 character long");
  })
})