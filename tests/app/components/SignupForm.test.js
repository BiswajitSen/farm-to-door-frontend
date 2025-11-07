import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupForm from '@/app/components/SignupForm/SignupForm';
import '@testing-library/jest-dom';

describe('SignupForm', () => {
    const mockOnSignup = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render signup form', () => {
        render(<SignupForm onSignup={mockOnSignup} />);

        expect(screen.getByLabelText('Username:')).toBeInTheDocument();
        expect(screen.getByLabelText('Password:')).toBeInTheDocument();
        expect(screen.getByText('Signup')).toBeInTheDocument();
    });

    it('should call onSignup with credentials when form is submitted', async () => {
        const user = userEvent.setup();
        render(<SignupForm onSignup={mockOnSignup} />);

        const usernameInput = screen.getByLabelText('Username:');
        const passwordInput = screen.getByLabelText('Password:');
        const submitButton = screen.getByText('Signup');

        await user.type(usernameInput, 'newuser');
        await user.type(passwordInput, 'newpass');
        await user.click(submitButton);

        expect(mockOnSignup).toHaveBeenCalledWith({
            username: 'newuser',
            password: 'newpass',
        });
    });

    it('should require username and password fields', () => {
        render(<SignupForm onSignup={mockOnSignup} />);

        const usernameInput = screen.getByLabelText('Username:');
        const passwordInput = screen.getByLabelText('Password:');

        expect(usernameInput).toBeRequired();
        expect(passwordInput).toBeRequired();
    });

    it('should update input values when typing', async () => {
        const user = userEvent.setup();
        render(<SignupForm onSignup={mockOnSignup} />);

        const usernameInput = screen.getByLabelText('Username:');
        const passwordInput = screen.getByLabelText('Password:');

        await user.type(usernameInput, 'testuser');
        await user.type(passwordInput, 'testpass');

        expect(usernameInput).toHaveValue('testuser');
        expect(passwordInput).toHaveValue('testpass');
    });
});
