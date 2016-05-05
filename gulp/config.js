module.exports = {
    build: './build/',
    src: './src/',
    templates: './templates/',
    minify: false,
    imagemin: false,
    sourcemaps: true,
    svgFallback: false,
    showDebugStaticNav: true,
    prettify: {
        indent_inner_html: false,
        indent_size: 4,
        preserve_newlines: true,
        wrap_line_length: 0
    },
    defaults: {
        browserSync: {
            open: false
        },
        googleMap: {
            apiKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXX-XX-XXXXXXXX'
        },
        loremipsum: {
            minRange: 0.75,
            maxRange: 1.25
        },
        svg: {
            width: '100',
            height: '100',
            prefix: ''
        },
        svgSprite: {
            filename: 'symbols.svg'
        },
        twig: {
            data: false,
            file: 'twig/data.js'
        }
    }
};
