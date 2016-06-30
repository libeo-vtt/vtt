module.exports = {
    build: './build/',
    src: './src/',
    templates: './templates/',
    exportPath: './export/',
    minify: false,
    imagemin: false,
    sourcemaps: true,
    svgFallback: false,
    showDebugStaticNav: true,
    lint: {
        js: true,
        sass: true
    },
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
        sass: {
            mainFont: 'Roboto'
        },
        twig: {
            data: false,
            file: 'twig/data.js'
        }
    }
};
