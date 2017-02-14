const gulp = require('gulp');
const gutil = require('gulp-util');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');

const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const $ = gulpLoadPlugins();
const runSequence = require('run-sequence');
const reload = browserSync.reload;

const fileinclude = require('gulp-file-include');

var compress = gutil.env.compress; // compress stuff...

gulp.task('styles', () => {
  return gulp.src('app/styles/main.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.if(compress, $.cssnano()))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('scripts:app', () => {
  return browserify({debug: true})
    .transform(babelify)
    .require('./app/app.js', {entry: true})
    .bundle()
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(source('app.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts:lib', () => {
  return browserify({debug: true})
    .transform(babelify)
    .require('./lib/index.js', {entry: true})
    .bundle()
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(source('index.js'))
    .pipe($.if(compress, buffer()))
    .pipe($.if(compress, $.uglify()))
    .pipe(gulp.dest('dist'));
});

gulp.task('lint', () => {
  return gulp.src('lib/**/*.js')
    .pipe($.eslint({}))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('html', () => {
  return gulp.src(['app/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe($.if(compress, $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('extras', () => {
  return gulp.src([
    // 'app/*.*',
    'app/LICENSE',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('serve', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist'],
    }
  });

  gulp.watch([
    'dist/**/*',
  ]).on('change', reload);

  gulp.watch('app/**/*.html', ['html']);
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('lib/**/*.js', ['scripts:lib', 'scripts:app']);
  gulp.watch('app/**/*.js', ['scripts:app']);

});

// gulp.task('build', ['clean', 'lint'], (cb) => {
//   const preBuildTasks = ['styles', 'scripts:lib', 'scripts:app', 'extras'];
//   return runSequence(preBuildTasks, 'html', cb);
// });

// gulp.task('deploy', ['build'], () => {
//   return gulp.src('dist')
//     .pipe($.subtree());
// });

gulp.task('default', ['clean', 'lint'], () => {
  const preServeTasks = ['styles', 'scripts:lib', 'scripts:app', 'extras'];
  runSequence(preServeTasks, 'html', () => {
    gulp.start('serve');
  });
});
