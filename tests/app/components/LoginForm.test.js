import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/app/components/LoginForm/LoginForm';
import '@testing-library/jest-dom';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

describe('LoginForm', () => {
    const mockOnLogin = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('should render login form', () => {
        render(<LoginForm onLogin={mockOnLogin} />);

        expect(screen.getByLabelText('Username:')).toBeInTheDocument();
        expect(screen.getByLabelText('Password:')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Signup')).toBeInTheDocument();
    });

    it('should call onLogin with credentials when form is submitted', async () => {
        const user = userEvent.setup({ delay: null });
        render(<LoginForm onLogin={mockOnLogin} />);

        const usernameInput = screen.getByLabelText('Username:');
        const passwordInput = screen.getByLabelText('Password:');
        const submitButton = screen.getByText('Login');

        await user.type(usernameInput, 'testuser');
        await user.type(passwordInput, 'testpass');
        await user.click(submitButton);

        expect(mockOnLogin).toHaveBeenCalledWith({
            username: 'testuser',
            password: 'testpass',
        });
    });

    it('should redirect to signup page when signup button is clicked', async () => {
        const user = userEvent.setup({ delay: null });
        render(<LoginForm onLogin={mockOnLogin} />);

        const signupButton = screen.getByText('Signup');
        await user.click(signupButton);

        jest.advanceTimersByTime(2000);

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/signup');
        });
    });

    it('should require username and password fields', () => {
        render(<LoginForm onLogin={mockOnLogin} />);

        const usernameInput = screen.getByLabelText('Username:');
        const passwordInput = screen.getByLabelText('Password:');

        expect(usernameInput).toBeRequired();
        expect(passwordInput).toBeRequired();
    });

    it('should update input values when typing', async () => {
        const user = userEvent.setup({ delay: null });
        render(<LoginForm onLogin={mockOnLogin} />);

        const usernameInput = screen.getByLabelText('Username:');
        const passwordInput = screen.getByLabelText('Password:');

        await user.type(usernameInput, 'testuser');
        await user.type(passwordInput, 'testpass');

        expect(usernameInput).toHaveValue('testuser');
        expect(passwordInput).toHaveValue('testpass');
    });
});
