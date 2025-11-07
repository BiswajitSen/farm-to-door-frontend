import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from '@/app/components/Loader/Loader';
import '@testing-library/jest-dom';

describe('Loader', () => {
    it('should render loader component', () => {
        const { container } = render(<Loader />);
        expect(container.querySelector('.loaderOverlay')).toBeInTheDocument();
    });
});
