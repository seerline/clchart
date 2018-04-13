const gulp = require('gulp');
const browserify = require('browserify');
require('babelify');
const source = require('vinyl-source-stream');
// const buffer = require('vinyl-buffer');
// const uglify = require('gulp-uglify');
// const sourcemaps = require('gulp-sourcemaps');
const rimraf = require('rimraf');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');

gulp.task('build', function() {
  return browserify({ entries: [`${SRC_DIR}/index.js`], debug: false })
      .transform("babelify", { presets: ["es2015"] })
      .bundle()
      .pipe(source('cl.chart.js'))
      // .pipe(buffer())
      // .pipe(sourcemaps.init())
      // .pipe(uglify())       // 代码混淆压缩
      // .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest('./dist/'))
});

gulp.task('clean:dist', () => {
  rimraf.sync(`${DIST_DIR}/*`);
});

gulp.task('copy:html', () => gulp.src('./samples/**/*.html')
  .pipe(gulp.dest(`${DIST_DIR}/samples/`)));

gulp.task('watch', ['clean:dist', 'build', 'copy:html'], function() {
  gulp.watch(['./src/**/*.js', './samples/**/*.html'], ['clean:dist', 'build', 'copy:html']);
});
