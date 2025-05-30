import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '../LandingPage';

describe('LandingPage', () => {
  const renderComponent = () => 
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

  it('renders the main heading', () => {
    renderComponent();
    
    // Check if the main heading is present
    const headingElement = screen.getByText('Water Classroom:');
    expect(headingElement).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    renderComponent();
    
    // Check if the subtitle is present
    const subtitleElement = screen.getByText('AI-Powered Learning Revolution');
    expect(subtitleElement).toBeInTheDocument();
  });

  it('renders call-to-action buttons', () => {
    renderComponent();
    
    // Check if the CTA buttons are present
    const getStartedButton = screen.getByText('Get Started Free');
    const learnMoreButton = screen.getByText('Learn More');
    
    expect(getStartedButton).toBeInTheDocument();
    expect(learnMoreButton).toBeInTheDocument();
  });
});
