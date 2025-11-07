import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '@/app/components/Layout/layout';
import '@testing-library/jest-dom';

// Mock next/navigation since Layout might use it
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe('Layout', () => {
    it('should render children', () => {
        render(
            <Layout>
                <div>Test Content</div>
            </Layout>
        );

        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
        render(
            <Layout>
                <div>Child 1</div>
                <div>Child 2</div>
            </Layout>
        );

        expect(screen.getByText('Child 1')).toBeInTheDocument();
        expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
});

