require('@testing-library/jest-dom');

const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
    console.error = (...args) => {
        const message = args[0];
        
        if (
            typeof message === 'string' &&
            (message.includes('An update to') ||
             message.includes('not wrapped in act') ||
             message.includes('Warning:') ||
             message.includes('validateDOMNesting') ||
             message.includes('act(...)') ||
             message.includes('cannot be a child of') ||
             message.includes('hydration error') ||
             message.includes('In HTML'))
        ) {
            return;
        }
        
        if (
            typeof message === 'string' &&
            (message.includes('Error fetching products') ||
             message.includes('Error placing order') ||
             message.includes('Error in orders API route') ||
             message.includes('Error in images API route') ||
             message.includes('Network error'))
        ) {
            return;
        }
        
        if (args.some(arg => typeof arg === 'string' && arg.includes('setupTests.cjs'))) {
            return;
        }
        
        originalError.call(console, ...args);
    };
    
    console.warn = (...args) => {
        const message = args[0];
        
        if (
            typeof message === 'string' &&
            (message.includes('cannot be a child of') ||
             message.includes('hydration error') ||
             message.includes('validateDOMNesting') ||
             message.includes('In HTML'))
        ) {
            return;
        }
        
        originalWarn.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
});

