import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderSuccessModal from '@/app/components/OrderSuccessModal/OrderSuccessModal';
import '@testing-library/jest-dom';

describe('OrderSuccessModal', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render success message', () => {
        render(<OrderSuccessModal onClose={mockOnClose} />);

        expect(screen.getByText('Order successful!')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
        const user = userEvent.setup();
        render(<OrderSuccessModal onClose={mockOnClose} />);

        const closeButton = screen.getByText('Close');
        await user.click(closeButton);

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should render close button', () => {
        render(<OrderSuccessModal onClose={mockOnClose} />);

        expect(screen.getByText('Close')).toBeInTheDocument();
    });
});
