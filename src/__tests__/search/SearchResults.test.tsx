import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchResults from '../../app/components/search/SearchResults';
import { EarthquakeEvent } from '../../store/earthquakeStore';
import '@testing-library/jest-dom';

// Mock EarthquakeCard component since we don't need to test it here
jest.mock('../../app/components/EarthquakeCard', () => {
  return {
    EarthquakeCard: ({ earthquake }: { earthquake: any }) => (
      <div data-testid="earthquake-card">{earthquake.properties?.title || earthquake.location?.place || 'Earthquake'}</div>
    ),
  };
});

const mockEarthquakes: EarthquakeEvent[] = [
  {
    id: '1',
    magnitude: 5.5,
    location: {
      place: 'Test Location 1',
      latitude: 0,
      longitude: 0,
    },
    depth: 10,
    timestamp: new Date(),
    url: 'http://test.com',
    alert: null,
    tsunami: 0,
    processed: true,
    notificationSent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    magnitude: 6.0,
    location: {
      place: 'Test Location 2',
      latitude: 0,
      longitude: 0,
    },
    depth: 20,
    timestamp: new Date(),
    url: 'http://test.com',
    alert: null,
    tsunami: 0,
    processed: true,
    notificationSent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('SearchResults', () => {
  it('renders loading spinner when isLoading is true', () => {
    render(<SearchResults results={[]} isLoading={true} total={0} />);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders "No earthquakes found" when results are empty and not loading', () => {
    render(<SearchResults results={[]} isLoading={false} total={0} />);
    expect(screen.getByText('No earthquakes found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search filters')).toBeInTheDocument();
  });

  it('renders earthquake cards when results are provided', () => {
    render(<SearchResults results={mockEarthquakes} isLoading={false} total={2} />);
    
    // Check for total results text
    expect(screen.getByText('Found 2 results')).toBeInTheDocument();
    
    // Check if cards are rendered (using the mock)
    const cards = screen.getAllByTestId('earthquake-card');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('Test Location 1');
    expect(cards[1]).toHaveTextContent('Test Location 2');
  });
});
