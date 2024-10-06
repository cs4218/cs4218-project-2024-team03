import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryForm from './CategoryForm';
import '@testing-library/jest-dom';

describe('CategoryForm Component', () => {
  let handleSubmit;
  let setValue;
  let value;

  beforeEach(() => {
    handleSubmit = jest.fn();
    setValue = jest.fn();
    value = 'value';
  });

  it('should render the form elements correctly', () => {
    render(
      <CategoryForm handleSubmit={handleSubmit} value={value} setValue={setValue} />
    );

    const input = screen.getByPlaceholderText('Enter new category');
    expect(input).toBeInTheDocument();

    const button = screen.getByText('Submit');
    expect(button).toBeInTheDocument();
  });

  it('should update the input value on change', () => {
    render(
      <CategoryForm handleSubmit={handleSubmit} value={value} setValue={setValue} />
    );

    const input = screen.getByPlaceholderText('Enter new category');
    fireEvent.change(input, { target: { value: 'New Category' } });

    expect(setValue).toHaveBeenCalledWith('New Category');
  });

  it('should call handleSubmit on form submission', () => {
    render(
      <CategoryForm handleSubmit={handleSubmit} value={value} setValue={setValue} />
    );

    fireEvent.click(screen.getByText('Submit'));

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('should not submit the form when input is empty', () => {
    render(
      <CategoryForm handleSubmit={handleSubmit} value={''} setValue={setValue} />
    );
  
    const button = screen.getByText('Submit');
    fireEvent.click(button);
  
    expect(handleSubmit).not.toHaveBeenCalled();
  })
});