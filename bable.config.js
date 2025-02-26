export default {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        'next/babel',
        '@babel/preset-react',
        '@babel/preset-flow',
    ],
    plugins: [
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        'babel-plugin-styled-components',
        '@babel/plugin-proposal-class-properties',
    ]
};