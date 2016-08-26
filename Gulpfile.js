
const babel = require('rollup-plugin-babel');
const connect = require('connect');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const header = require('gulp-header');
const http = require('http');
const karma = require('karma');
const minify = require('uglify-js').minify;
const path = require('path');
const rollup = require('rollup-stream');
const serveStatic = require('serve-static');
const source = require('vinyl-source-stream');
const uglify = require('rollup-plugin-uglify');

const pkg = require('./package.json');
const banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('build', () =>
  rollup({
    entry: './src/postmate.js',
    format: 'umd',
    moduleName: 'Postmate',
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      uglify({}, minify),
    ],
  })
    .pipe(source('postmate.min.js'))
    .pipe(header(banner, { pkg }))
    .pipe(gulp.dest('./build'))
);

gulp.task('lint', () =>
  gulp.src(['**/*.js', '!node_modules/**', '!build/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('test', done => {
  const testFixtures = connect().use(serveStatic('.')).use(serveStatic('test/fixtures'));
  const child = http.createServer(testFixtures)
    .listen(9001, () => {
      const server = new karma.Server({
        autoWatch: false,
        configFile: path.join(__dirname, './karma.conf.js'),
        singleRun: true,
        port: 9876,
        client: {
          useIframe: false,
        },
      }, exitCode => {
        child.close();
        done();
        process.exit(exitCode);
      });
      server.start();
    });
});

gulp.task('watch', () => gulp.watch('./src/postmate.js', ['build']));
gulp.task('build-watch', ['build', 'watch']);
