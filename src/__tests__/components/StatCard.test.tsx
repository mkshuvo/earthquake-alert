import React from 'react';
import { render, screen, act } from '@testing-library/react';
import StatCard from '../../app/components/StatCard';
import { Activity } from 'lucide-react';

// Mock the Lucide icon since we don't need to test the icon library itself
jest.mock('lucide-react', () => ({
  Activity: () => <div data-testid="activity-icon" />,
}));

describe('StatCard', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly with initial props', () => {
    render(
      <StatCard
        title="Test Title"
        value={100}
        icon={Activity}
        color="blue"
        delay={0}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    // Value starts at 0 due to animation
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('animates value to target number', () => {
    render(
      <StatCard
        title="Test Title"
        value={60}
        icon={Activity}
        color="blue"
        delay={0}
      />
    );

    // Trigger visibility effect
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Trigger animation interval
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('handles string values correctly', () => {
    render(
      <StatCard
        title="String Title"
        value="10km"
        icon={Activity}
        color="red"
        delay={0}
      />
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByText('10km')).toBeInTheDocument();
  });
});
