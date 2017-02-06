module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['mocha'],
        files: [
            {pattern: 'node_modules/chai/chai.js', include: true},
            'resources/main-test2.js',
            'karma/directives/*.js'
        ],
        exclude: [],
        reporters: ['mocha'],
        client: {
            mocha: {
                // change Karma's debug.html to the mocha web reporter
                reporter: 'html'
            }
        },
        mochaReporter: {
            output: 'autowatch',
            colors: {
                success: 'green',
                info: 'magenta',
                warning: 'cyan',
                error: 'bgRed'
            },
            symbols: {
                success: '+',
                info: '#',
                warning: '!',
                error: 'x'
            }
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,//autoWatch为true,Karma将自动执行测试用例
        browsers: ['Chrome'],
        singleRun: false,
        plugins: [
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-chrome-launcher'
        ]
    })
}

//使用 karma start