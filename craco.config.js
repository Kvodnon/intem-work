const path = require('path');

const resolvePath = p => path.resolve(__dirname, p)

module.exports = {
    webpack: {
        alias: {
            'entities': resolvePath('./src/entities'),
            'shared': resolvePath('./src/shared'),
            'widgets': resolvePath('./src/widgets'),
            'features': resolvePath('./src/features'),
            'pages': resolvePath('./src/pages')
        }
    },
}