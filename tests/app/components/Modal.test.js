import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '@/app/components/Modal/Modal';
import '@testing-library/jest-dom';

describe('Modal', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render modal with message', () => {
        render(<Modal message="Test message" onClose={mockOnClose} />);

        expect(screen.getByText('Test message')).toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
        const user = userEvent.setup();
        render(<Modal message="Test message" onClose={mockOnClose} />);

        const closeButton = screen.getByText('Close');
        await user.click(closeButton);

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should render different messages', () => {
        const { rerender } = render(<Modal message="First message" onClose={mockOnClose} />);
        expect(screen.getByText('First message')).toBeInTheDocument();

        rerender(<Modal message="Second message" onClose={mockOnClose} />);
        expect(screen.getByText('Second message')).toBeInTheDocument();
    });
});
