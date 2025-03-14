import React from 'react';
import Link from 'next/link';
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