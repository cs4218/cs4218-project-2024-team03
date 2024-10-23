import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Pagenotfound from './Pagenotfound';

jest.mock('../components/Header', () => () => <div>Mocked Header</div>);

describe('Pagenotfound Component', () => {
  test('renders the correct content', () => {
    render(
      <MemoryRouter>
        <Pagenotfound />
      </MemoryRouter>
    );

    // Assert that the '404' status code is present
    expect(screen.getByText('404')).toBeInTheDocument();

    // Assert that the '2xx' status code is not present
    expect(screen.queryByText(/^2\d{2}$/)).not.toBeInTheDocument();


    expect(screen.getByText('Oops ! Page Not Found')).toBeInTheDocument();

    const goBackLink = screen.getByRole('link', { name: /go back/i });
    expect(goBackLink).toBeInTheDocument();
    expect(goBackLink).toHaveAttribute('href', '/');
  });
});
