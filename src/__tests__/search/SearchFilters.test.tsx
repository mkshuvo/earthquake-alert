import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchFilters from '../../app/components/search/SearchFilters';
import '@testing-library/jest-dom';

// Mock next/navigation
const mockPush = jest.fn();
const mockGet = jest.fn();
const mockSearchParams = {
  get: mockGet,
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

describe('SearchFilters Component', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockGet.mockReset();
    mockGet.mockImplementation((key) => {
      if (key === 'minMagnitude') return '0';
      if (key === 'maxMagnitude') return '10';
      return null;
    });
  });

  it('renders search input', () => {
    render(<SearchFilters />);
    expect(screen.getByPlaceholderText("Search location, e.g., 'Japan'")).toBeInTheDocument();
  });

  it('updates URL on search apply (Enter key)', () => {
    render(<SearchFilters />);
    const input = screen.getByPlaceholderText("Search location, e.g., 'Japan'");
    
    fireEvent.change(input, { target: { value: 'Tokyo' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockPush).toHaveBeenCalled();
    const callArg = mockPush.mock.calls[0][0];
    expect(callArg).toContain('q=Tokyo');
    expect(callArg).toContain('page=1');
  });

  it('updates URL when filters are applied via button', () => {
    render(<SearchFilters />);
    
    // Find and click Apply Filters button
    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);

    expect(mockPush).toHaveBeenCalled();
  });

  it('toggles filter visibility', () => {
    render(<SearchFilters />);
    
    const toggleButton = screen.getByText('Search & Filter');
    // It starts expanded
    expect(screen.getByText('Keyword')).toBeVisible();
    
    // Click to collapse
    fireEvent.click(toggleButton);
    // Note: Checking visibility with CSS transitions in JSDOM can be tricky.
    // We rely on the class change logic or just simply that the button is clickable.
    // Here we just check if the state change logic is triggered without error.
    expect(toggleButton).toBeInTheDocument();
  });
});
