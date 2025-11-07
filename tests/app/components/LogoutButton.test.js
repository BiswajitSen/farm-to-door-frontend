import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LogoutButton from '@/app/components/LogoutButton/LogoutButton';
import '@testing-library/jest-dom';

describe('LogoutButton', () => {
    const mockOnLogout = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render logout button', () => {
        render(<LogoutButton onLogout={mockOnLogout} />);

        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('should call onLogout when button is clicked', async () => {
        const user = userEvent.setup();
        render(<LogoutButton onLogout={mockOnLogout} />);

        const logoutButton = screen.getByText('Logout');
        await user.click(logoutButton);

        expect(mockOnLogout).toHaveBeenCalled();
    });

    it('should be a button element', () => {
        render(<LogoutButton onLogout={mockOnLogout} />);

        const button = screen.getByText('Logout');
        expect(button.tagName).toBe('BUTTON');
    });
});
