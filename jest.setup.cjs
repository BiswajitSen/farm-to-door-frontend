// Global polyfills for Web APIs in Node.js test environment

// Polyfill for Request
global.Request = class Request {
    constructor(url, options = {}) {
        this.url = typeof url === 'string' ? url : url.toString();
        this.method = options.method || 'GET';
        this.headers = new Headers(options.headers || {});
        this._body = options.body;
    }

    async json() {
        return JSON.parse(this._body || '{}');
    }
};

// Polyfill for Headers
global.Headers = class Headers {
    constructor(init = {}) {
        this._headers = {};
        if (init) {
            Object.keys(init).forEach(key => {
                this._headers[key.toLowerCase()] = init[key];
            });
        }
    }

    get(name) {
        return this._headers[name.toLowerCase()];
    }
};

// Polyfill for Response
global.Response = class Response {
    constructor(body, options = {}) {
        this._body = body;
        this.status = options.status || 200;
        this.headers = new Headers(options.headers || {});
    }

    async text() {
        return typeof this._body === 'string' ? this._body : this._body.toString();
    }

    async json() {
        return JSON.parse(typeof this._body === 'string' ? this._body : JSON.stringify(this._body));
    }
};

