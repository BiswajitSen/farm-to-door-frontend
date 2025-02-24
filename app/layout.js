import React from 'react';
import PropTypes from 'prop-types';

const Layout = ({ children }) => (
    <html>
    <body>
    {children}
    </body>
    </html>
);

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;