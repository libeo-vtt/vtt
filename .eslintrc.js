module.exports = {
    'env': {
        'browser': true,
        'jquery': true
    },
    'globals': {
        'jQuery': false,
        '_': false,
        'module': false,
        'require': false,
        'svg4everybody': false
    },
    'extends': 'eslint:recommended',
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-console': 1,
        'no-unused-vars': 1
    }
};
