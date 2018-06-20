const gulp = require('gulp')
const gulpJsdoc = require('gulp-jsdoc3')

const srcCode = ['./src/**/*.js']

// We do this over using include/exclude to make everything feel gulp-like!
const config = require('./jsdocConfig')
function genDocs (cb) {
  gulp.src(['README.md'].concat(srcCode), {read: false})
    .pipe(gulpJsdoc(config, cb))
}
gulp.task('doc', genDocs)

gulp.task('watch', function () {
  gulp.watch(srcCode, gulp.series('doc'))
})
