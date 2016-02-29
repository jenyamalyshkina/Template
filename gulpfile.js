var gulp = require('gulp'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    spritesmith = require('gulp.spritesmith'),
    eslint = require('gulp-eslint'),
    through = require('gulp-through'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync');


// Компиляция файлов .jade
gulp.task('jade-compile', function () {
  var YOUR_LOCALS = {};
  gulp.src('./dev/jade/pages/*.jade')
    .pipe(plumber({errorHandler: notify.onError('Jade: <%= error.message %>')}))
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest('prod'))
});


// Компиляция и конкатенация файлов .scss
gulp.task('sass-compile', function () {
  return gulp.src('dev/scss/*.scss')
    .pipe(plumber({errorHandler: notify.onError("Sass: <%= error.message %>")}))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(concat('main.min.css'))
    .pipe(sourcemaps.write())
    .pipe(browserSync.stream())
    .pipe(gulp.dest('prod/css'));
});


// Минимификация и конкатенация файлов .js
gulp.task('min-js', function() {
  return gulp.src(['bower/jquery/dist/jquery.js', 'bower/jquery-ui/jquery-ui.js', 'bower/jquery.columnizer/src/jquery.columnizer.js', 'bower/selectize/dist/js/standalone/selectize.js', 'dev/js/**/*.js'])
    .pipe(plumber({errorHandler: notify.onError("JS: <%= error.message %>")}))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('prod/js/'));
});


// Создание спрайтов
gulp.task('sprite', function () {
  var spriteData = gulp.src('dev/img/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
    padding: 10,
    algorithm: 'top-down'
  }));
    spriteData.img.pipe(gulp.dest('dev/img/sprite/'));
    spriteData.css.pipe(gulp.dest('dev/scss/_common/'));
});


//Перенос шрифтов в prod
gulp.task('copy-fonts', function() {
    gulp.src('dev/fonts/*.*')
    .pipe(gulp.dest('prod/fonts'))
});


//Перенос картинок в prod
gulp.task('copy-images', function() {
    gulp.src(['dev/img/**/*.*', '!dev/img/icons/*.*'])
    .pipe(gulp.dest('prod/img'))
});


// Сервер
gulp.task('server', function () {
  browserSync({
    port: 9000,
    server: {
      baseDir: 'prod'
    }
  });
});


// Слежка
gulp.task('watch', function () {
  gulp.watch('dev/jade/**/*.jade', ['jade-compile']);
  gulp.watch('dev/scss/**/*.scss', ['sass-compile']);
  gulp.watch('dev/js/**/*.js', ['min-js']);
  gulp.watch('dev/fonts/*.*', ['copy-fonts']);
  gulp.watch('dev/img/**/*.*', ['copy-images']);
  gulp.watch([
    'prod/*.html',
    'prod/js/**/*.js'
  ]).on('change', browserSync.reload);
});


// Задача по-умолчанию
gulp.task('default', [
  'jade-compile',
  'sass-compile',
  'min-js',
  'copy-fonts',
  'copy-images',
  'server',
  'watch'
  ]);