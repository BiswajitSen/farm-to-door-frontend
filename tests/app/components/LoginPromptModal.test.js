import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPromptModal from '@/app/components/LoginPromptModal/LoginPromptModal';
import '@testing-library/jest-dom';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

describe('LoginPromptModal', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        Object.defineProperty(window, 'location', {
            value: {
                pathname: '/test-path',
            },
            writable: true,
        });
    });

    it('should render login prompt message', () => {
        render(<LoginPromptModal onClose={mockOnClose} />);

        expect(screen.getByText('Please login to proceed with this action.')).toBeInTheDocument();
        expect(screen.getByText('Login Required')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
        const user = userEvent.setup();
        render(<LoginPromptModal onClose={mockOnClose} />);

        const closeButton = screen.getByText('Close');
        await user.click(closeButton);

        expect(mockOnClose).toHaveBeenCalled();
    });


    it('should render both login and close buttons', () => {
        render(<LoginPromptModal onClose={mockOnClose} />);

        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();
    });
});
