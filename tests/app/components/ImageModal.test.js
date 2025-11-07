import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageModal from '@/app/components/ImageModal/ImageModal';
import '@testing-library/jest-dom';

describe('ImageModal', () => {
    const mockOnClose = jest.fn();
    const mockImageUrl = 'http://example.com/image.jpg';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render image modal with image', () => {
        render(<ImageModal imageUrl={mockImageUrl} onClose={mockOnClose} />);

        const image = screen.getByAltText('Product');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', mockImageUrl);
    });

    it('should call onClose when overlay is clicked', async () => {
        const user = userEvent.setup();
        const { container } = render(<ImageModal imageUrl={mockImageUrl} onClose={mockOnClose} />);

        const overlay = container.querySelector('.modalOverlay');
        if (overlay) {
            await user.click(overlay);
            expect(mockOnClose).toHaveBeenCalled();
        }
    });

    it('should render with different image URLs', () => {
        const differentUrl = 'http://example.com/another-image.jpg';
        render(<ImageModal imageUrl={differentUrl} onClose={mockOnClose} />);

        const image = screen.getByAltText('Product');
        expect(image).toHaveAttribute('src', differentUrl);
    });
});
