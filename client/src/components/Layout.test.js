import { render, screen } from '@testing-library/react';
import React from 'react';
import Layout from './Layout';
import '@testing-library/jest-dom';

// Mock the Header, Footer, and Toaster components
jest.mock('./Header', () => () => <div>Header</div>);
jest.mock('./Footer', () => () => <div>Footer</div>);
jest.mock('react-hot-toast', () => ({
  Toaster: () => <div>Toaster</div>,
}));
jest.mock('react-helmet', () => ({
  Helmet: ({ children }) => <div data-testid="helmet">{children}</div>,
}));

const getMetaTag = (name) => {
  // eslint-disable-next-line testing-library/no-node-access
  const metas = document.getElementsByTagName('meta');
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') === name) {
      return metas[i];
    }
  }
  return null;
};


describe("Layout Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render children and components correctly", () => {
    render(
        <Layout>
          <div>Test Children</div>
        </Layout>
    );

    expect(screen.getByText('Test Children')).not.toBeNull();
    expect(screen.getByText('Header')).not.toBeNull();
    expect(screen.getByText('Footer')).not.toBeNull();
    expect(screen.getByText('Toaster')).not.toBeNull();
  });

  it("should apply default props correctly", () => {
    render(
        <Layout>
          <div>Test Children</div>
        </Layout>
    );

    expect(document.title).toBe('Ecommerce app - shop now');
    expect(getMetaTag('description').getAttribute('content')).toBe('mern stack project');
    expect(getMetaTag('keywords').getAttribute('content')).toBe('mern,react,node,mongodb');
    expect(getMetaTag('author').getAttribute('content')).toBe('Techinfoyt');
  });

  it("should render custom meta tags and title correctly",async () => {
    render(
        <Layout
          title="Test Title"
          description="Test Description"
          keywords="test,keywords"
          author="Test Author"
        >
          <div>Test Children</div>
        </Layout>
    );

    expect(document.title).toBe('Test Title');
    expect(getMetaTag('description').getAttribute('content')).toBe('Test Description');
    expect(getMetaTag('keywords').getAttribute('content')).toBe('test,keywords');
    expect(getMetaTag('author').getAttribute('content')).toBe('Test Author');

  });

  it("should render with the correct styles", () => {
    render(
      <Layout />
    )
      const mainEelement = screen.getByRole('main');
      expect(mainEelement).toHaveStyle('min-height: 70vh');
    
  })
});