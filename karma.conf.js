module.exports = function(config) {
  const configuration = {
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
      },
    },
    files: [
      // 'node_modules/rsvp/dist/rsvp.min.js',
      'build/postmate.min.js',
      'test/test.js',
    ],
    reporters: ['mocha'],
    frameworks: ['mocha', 'chai'],
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};
