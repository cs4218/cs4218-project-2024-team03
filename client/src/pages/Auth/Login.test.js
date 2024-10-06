import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import toast from 'react-hot-toast';
import Login from './Login';

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

describe('Login Component Pairwise Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test 1
    it('should log in successfully with valid email and valid password', async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                success: true,
                user: { id: 1, name: 'John Doe', email: 'test@example.com' },
                token: 'mockToken',
            },
        });

        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('LOGIN'));

        await waitFor(() => expect(axios.post).toHaveBeenCalled());

        expect(toast.success).toHaveBeenCalledWith(undefined, {
            duration: 5000,
            icon: '🙏',
            style: {
                background: 'green',
                color: 'white',
            },
        });
    });

    // Test 2
    it('should show error when password is invalid with valid email', async () => {
        axios.post.mockRejectedValueOnce({ message: 'Invalid credentials' });

        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: 'wrongPassword' } });
        fireEvent.click(screen.getByText('LOGIN'));

        await waitFor(() => expect(axios.post).toHaveBeenCalled());

        expect(toast.error).toHaveBeenCalledWith('Something went wrong');
    });

    // Test 3
    it('should show error when password is empty with valid email', async () => {
        axios.post.mockRejectedValueOnce({ message: 'Invalid credentials' });

        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: '' } });
        fireEvent.click(screen.getByText('LOGIN'));

        await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
    });

    // Test 4
    it('should show error when email is invalid with valid password', async () => {
        axios.post.mockRejectedValueOnce({ message: 'Invalid credentials' });

        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'invalidEmail' } });
        fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('LOGIN'));

        await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
    });

    // Test 5
    it('should show error when both email and password are invalid', async () => {
        axios.post.mockRejectedValueOnce({ message: 'Invalid credentials' });

        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'invalidEmail' } });
        fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: 'wrongPassword' } });
        fireEvent.click(screen.getByText('LOGIN'));

        await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
    });

    // Test 6
    it('should show error when email is invalid and password is empty', async () => {
        axios.post.mockRejectedValueOnce({ message: 'Invalid credentials' });

        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: 'invalidEmail' } });
        fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: '' } });
        fireEvent.click(screen.getByText('LOGIN'));

        await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
    });

    // Test 7
    it('should show error when email is empty and password is valid', async () => {
        axios.post.mockRejectedValueOnce({ message: 'Invalid credentials' });

        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: '' } });
        fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('LOGIN'));

        await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
    });

    // Test 8
    it('should show error when both email is empty and password is invalid', async () => {
        axios.post.mockRejectedValueOnce({ message: 'Invalid credentials' });

        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: '' } });
        fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: 'wrongPassword' } });
        fireEvent.click(screen.getByText('LOGIN'));

        await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
    });

    // Test 9
    it('should show error when both email and password are empty', async () => {
        axios.post.mockRejectedValueOnce({ message: 'Invalid credentials' });

        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter Your Email'), { target: { value: '' } });
        fireEvent.change(screen.getByPlaceholderText('Enter Your Password'), { target: { value: '' } });
        fireEvent.click(screen.getByText('LOGIN'));

        await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
    });
});
