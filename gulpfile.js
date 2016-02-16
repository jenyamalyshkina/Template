var gulp = require('gulp'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    spritesmith = require('gulp.spritesmith'),
    browserSync = require('browser-sync');


// Компиляция файлов .jade
gulp.task('jade-compile', function () {
  var YOUR_LOCALS = {};

  gulp.src('./dev/jade/pages/*.jade')
    .pipe(plumber())
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest('./prod/pages/'))
});


// Компиляция файлов .scss
gulp.task('sass-compile', function () {
  return gulp.src('dev/scss/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('prod/css'));
});


// Минимификация файлов .js
gulp.task('min-js', function() {
  return gulp.src('dev/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('prod/js/'));
});


// Создание спрайтов
gulp.task('sprite', function () {
  var spriteData = gulp.src('dev/img/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    padding: 10,
    algorithm: 'top-down'
  }));
    spriteData.img.pipe(gulp.dest('dev/img/sprite/'));
    spriteData.css.pipe(gulp.dest('dev/scss/'));
});


// Сервер
gulp.task('server', function () {
  browserSync({
    port: 9000,
    server: {
      baseDir: 'prod/pages/'
    }
  });
});


// Слежка
gulp.task('watch', function () {
  gulp.watch('./dev/jade/**/*.jade', ['jade-compile']);
  gulp.watch('dev/js/*.js', ['min-js']);
  gulp.watch([
    'prod/pages/*.html',
    'prod/js/**/*.js',
    'prod/css/**/*.css'
  ]).on('change', browserSync.reload);
});


// Задача по-умолчанию
gulp.task('default', [
  'jade-compile',
  'sass-compile',
  'min-js',
  'server',
  'watch'
  ]);