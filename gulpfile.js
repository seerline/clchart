const gulp = require('gulp');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const eslint = require('gulp-eslint');
const file = require('gulp-file');
const insert = require('gulp-insert');
const replace = require('gulp-replace');
const size = require('gulp-size');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');
const util = require('gulp-util');
const zip = require('gulp-zip');
const exec = require('child-process-promise').exec;
const karma = require('karma');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const merge = require('merge-stream');
const collapse = require('bundle-collapser/plugin');
const yargs = require('yargs');
const path = require('path');
const fs = require('fs');
const htmllint = require('gulp-htmllint');
const packageConfig = require('./package.json');

const argv = yargs
  .option('force-output', {default: false})
  .option('silent-errors', {default: false})
  .option('verbose', {default: false})
  .argv

const srcDir = './src/';
const outDir = './dist/';

const header = "/*!\n" +
  " * ClChart.js\n" +
  " * Version: {{ version }}\n" +
  " *\n" +
  " * Copyright " + (new Date().getFullYear()) + " ClChart.js Contributors\n" +
  " * Released under the MIT license\n" +
  " * https://github.com/seerline/clchart/blob/master/LICENSE.md\n" +
  " */\n";

if (argv.verbose) {
  util.log("Gulp running with options: " + JSON.stringify(argv, null, 2));
}

gulp.task('bower', bowerTask);
gulp.task('build', buildTask);
gulp.task('package', packageTask);
gulp.task('watch', watchTask);
gulp.task('lint', ['lint-html', 'lint-js']);
gulp.task('lint-html', lintHtmlTask);
gulp.task('lint-js', lintJsTask);
gulp.task('docs', docsTask);
gulp.task('test', ['lint', 'unittest']);
gulp.task('size', ['library-size', 'module-sizes']);
gulp.task('server', serverTask);
gulp.task('unittest', unittestTask);
gulp.task('library-size', librarySizeTask);
gulp.task('module-sizes', moduleSizesTask);
gulp.task('_open', _openTask);
gulp.task('dev', ['server', 'default']);
gulp.task('default', ['build', 'watch']);

/**
 * Generates the bower.json manifest file which will be pushed along release tags.
 * Specs: https://github.com/bower/spec/blob/master/json.md
 */
function bowerTask() {
  const json = JSON.stringify({
      name: packageConfig.name,
      description: packageConfig.description,
      homepage: packageConfig.homepage,
      license: packageConfig.license,
      version: packageConfig.version,
      main: outDir + "ClChart.js",
      ignore: [
        '.github',
        '.codeclimate.yml',
        '.gitignore',
        '.npmignore',
        '.travis.yml',
        'scripts'
      ]
    }, null, 2);

  return file('bower.json', json, { src: true })
    .pipe(gulp.dest('./'));
}

function buildTask() {

  const errorHandler = function (err) {
    if(argv.forceOutput) {
      const browserError = 'console.error("Gulp: ' + err.toString() + '")';
      ['ClChart', 'ClChart.min', 'ClChart.bundle', 'ClChart.bundle.min'].forEach(function(fileName) {
        fs.writeFileSync(outDir+fileName+'.js', browserError);
      });
    }
    if(argv.silentErrors) {
      util.log(util.colors.red('[Error]'), err.toString());
      this.emit('end');
    } else {
      throw err;
    }
  }

  const bundled = browserify('./src/cl.chart.js', { standalone: 'ClChart' })
    .transform("babelify", { presets: ["es2015"] })
    .plugin(collapse)
    .bundle()
    .on('error', errorHandler)
    .pipe(source('ClChart.bundle.js'))
    .pipe(insert.prepend(header))
    .pipe(streamify(replace('{{ version }}', packageConfig.version)))
    .pipe(gulp.dest(outDir))
    .pipe(streamify(uglify()))
    .pipe(insert.prepend(header))
    .pipe(streamify(replace('{{ version }}', packageConfig.version)))
    .pipe(streamify(concat('ClChart.bundle.min.js')))
    .pipe(gulp.dest(outDir));

  const nonBundled = browserify('./src/cl.chart.js', { standalone: 'ClChart' })
    .transform("babelify", { presets: ["es2015"] })
    .plugin(collapse)
    .bundle()
    .on('error', errorHandler)
    .pipe(source('ClChart.js'))
    .pipe(insert.prepend(header))
    .pipe(streamify(replace('{{ version }}', packageConfig.version)))
    .pipe(gulp.dest(outDir))
    .pipe(streamify(uglify()))
    .pipe(insert.prepend(header))
    .pipe(streamify(replace('{{ version }}', packageConfig.version)))
    .pipe(streamify(concat('ClChart.min.js')))
    .pipe(gulp.dest(outDir));

  return merge(bundled, nonBundled);

}

function packageTask() {
  return merge(
      // gather "regular" files landing in the package root
      gulp.src([outDir + '*.js', 'LICENSE.md']),

      // since we moved the dist files one folder up (package root), we need to rewrite
      // samples src="../dist/ to src="../ and then copy them in the /samples directory.
      gulp.src('./samples/**/*', { base: '.' })
        .pipe(streamify(replace(/src="((?:\.\.\/)+)dist\//g, 'src="$1')))
  )
  // finally, create the zip archive
  .pipe(zip('ClChart.js.zip'))
  .pipe(gulp.dest(outDir));
}

function lintJsTask() {
  const files = [
    'samples/**/*.html',
    'samples/**/*.js',
    'src/**/*.js',
    'test/**/*.js'
  ];

  // NOTE(SB) codeclimate has 'complexity' and 'max-statements' eslint rules way too strict
  // compare to what the current codebase can support, and since it's not straightforward
  // to fix, let's turn them as warnings and rewrite code later progressively.
  const options = {
    rules: {
      'complexity': [1, 10],
      'max-statements': [1, 30]
    }
  };

  return gulp.src(files)
    .pipe(eslint(options))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function lintHtmlTask() {
  return gulp.src('samples/**/*.html')
    .pipe(htmllint({
      failOnError: true,
    }));
}

function docsTask(done) {
  const script = require.resolve('gitbook-cli/bin/gitbook.js');
  const cmd = process.execPath;

  exec([cmd, script, 'install', './'].join(' ')).then(() => {
    return exec([cmd, script, 'build', './', './dist/docs'].join(' '));
  }).catch((err) => {
    console.error(err.stdout);
  }).then(() => {
    done();
  });
}

function startTest() {
  return [
    {pattern: './test/fixtures/**/*.json', included: false},
    {pattern: './test/fixtures/**/*.png', included: false},
    './node_modules/moment/min/moment.min.js',
    './test/jasmine.index.js',
    './src/**/*.js',
  ].concat(
    argv.inputs ?
      argv.inputs.split(';') :
      ['./test/specs/**/*.js']
  );
}

function unittestTask(done) {
  new karma.Server({
    configFile: path.join(__dirname, 'karma.conf.js'),
    singleRun: !argv.watch,
    files: startTest(),
    args: {
      coverage: !!argv.coverage
    }
  },
  // https://github.com/karma-runner/gulp-karma/issues/18
  function(error) {
    error = error ? new Error('Karma returned with the error code: ' + error) : undefined;
    done(error);
  }).start();
}

function librarySizeTask() {
  return gulp.src('dist/ClChart.bundle.min.js')
    .pipe(size({
      gzip: true
    }));
}

function moduleSizesTask() {
  return gulp.src(srcDir + '**/*.js')
    .pipe(uglify())
    .pipe(size({
      showFiles: true,
      gzip: true
    }));
}

function watchTask() {
  if (util.env.test) {
    return gulp.watch('./src/**', ['build', 'unittest', 'unittestWatch']);
  }
  return gulp.watch('./src/**', ['build']);
}

function serverTask() {
  connect.server({
    port: 8000
  });
}

// Convenience task for opening the project straight from the command line

function _openTask() {
  exec('open http://localhost:8000');
  exec('subl .');
}
