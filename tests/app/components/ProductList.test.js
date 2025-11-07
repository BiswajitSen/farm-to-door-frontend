import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductList from '@/app/components/ProductList/ProductList';
import '@testing-library/jest-dom';

jest.mock('@/env', () => {
    return {
        __esModule: true,
        default: {
            API_BASE_URL: 'http://localhost:3001',
        },
    };
});

describe('ProductList', () => {
    const mockProducts = [
        {
            _id: '1',
            name: 'Product 1',
            price: 10,
            imageUrl: 'image1.jpg',
            quantity: 5,
        },
        {
            _id: '2',
            name: 'Product 2',
            price: 20,
            imageUrl: 'image2.jpg',
            quantity: 0,
        },
    ];

    const mockCart = { '1': 2 };
    const mockOnAddOne = jest.fn();
    const mockOnRemoveOne = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock getElementById to return a real element with classList methods
        const originalGetElementById = document.getElementById;
        document.getElementById = jest.fn((id) => {
            const element = document.createElement('div');
            element.id = id;
            element.classList.add = jest.fn();
            element.classList.remove = jest.fn();
            return element;
        });
    });

    it('should render products correctly', () => {
        render(
            <ProductList
                products={mockProducts}
                cart={mockCart}
                onAddOne={mockOnAddOne}
                onRemoveOne={mockOnRemoveOne}
            />
        );

        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.getByText('10 USD')).toBeInTheDocument();
        expect(screen.getByText('20 USD')).toBeInTheDocument();
    });

    it('should show selected quantity for items in cart', () => {
        render(
            <ProductList
                products={mockProducts}
                cart={mockCart}
                onAddOne={mockOnAddOne}
                onRemoveOne={mockOnRemoveOne}
            />
        );

        expect(screen.getByText(/Selected: 2/)).toBeInTheDocument();
    });

    it('should show available quantity for items not in cart', () => {
        render(
            <ProductList
                products={mockProducts}
                cart={{}}
                onAddOne={mockOnAddOne}
                onRemoveOne={mockOnRemoveOne}
            />
        );

        expect(screen.getByText(/Available: 5/)).toBeInTheDocument();
    });

    it('should show sold out for products with zero quantity', () => {
        render(
            <ProductList
                products={mockProducts}
                cart={{}}
                onAddOne={mockOnAddOne}
                onRemoveOne={mockOnRemoveOne}
            />
        );

        expect(screen.getByText('Sold Out')).toBeInTheDocument();
    });

    it('should call onAddOne when add button is clicked', async () => {
        render(
            <ProductList
                products={mockProducts}
                cart={{}}
                onAddOne={mockOnAddOne}
                onRemoveOne={mockOnRemoveOne}
            />
        );

        const addButton = screen.getByText('Add to Cart');
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockOnAddOne).toHaveBeenCalledWith('1');
        }, { timeout: 2000 });
    });

    it('should call onRemoveOne when remove button is clicked', () => {
        render(
            <ProductList
                products={mockProducts}
                cart={mockCart}
                onAddOne={mockOnAddOne}
                onRemoveOne={mockOnRemoveOne}
            />
        );

        const removeButton = screen.getAllByText('-')[0];
        fireEvent.click(removeButton);

        expect(mockOnRemoveOne).toHaveBeenCalledWith('1');
    });

    it('should show modal when trying to add more than available quantity', async () => {
        const cartWithMaxQuantity = { '1': 5 };
        render(
            <ProductList
                products={mockProducts}
                cart={cartWithMaxQuantity}
                onAddOne={mockOnAddOne}
                onRemoveOne={mockOnRemoveOne}
            />
        );

        const addButton = screen.getByText('+');
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByText('Cannot add more than available quantity')).toBeInTheDocument();
        });
    });

    it('should open image modal when image is clicked', () => {
        render(
            <ProductList
                products={mockProducts}
                cart={{}}
                onAddOne={mockOnAddOne}
                onRemoveOne={mockOnRemoveOne}
            />
        );

        const images = screen.getAllByAltText(/Product/);
        fireEvent.click(images[0]);

        // Image modal should be rendered (checking for the image URL)
        expect(images[0]).toHaveAttribute('src', 'http://localhost:3001/images/image1.jpg');
    });
});

