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

var skinny = gutil.env.skinny; // compress stuff...

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.if(skinny, $.cssnano()))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('scripts', () => {
  return browserify({debug: true})
    .transform(babelify)
    .require('./lib/main.js', {entry: true})
    .bundle()
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(source('main.js'))
    .pipe($.if(skinny, buffer()))
    .pipe($.if(skinny, $.uglify()))
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
    .pipe($.if(skinny, $.htmlmin({collapseWhitespace: true})))
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
  gulp.watch('lib/**/*.js', ['scripts']);

});

gulp.task('build', ['clean', 'lint'], (cb) => {
  const preBuildTasks = ['styles', 'scripts', 'extras'];
  return runSequence(preBuildTasks, 'html', cb);
});

gulp.task('deploy', ['build'], () => {
  return gulp.src('dist')
    .pipe($.subtree());
});

gulp.task('default', ['clean', 'lint'], () => {
  const preServeTasks = ['styles', 'scripts', 'extras'];
  runSequence(preServeTasks, 'html', () => {
    gulp.start('serve');
  });
});
