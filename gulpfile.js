var gulp = require('gulp');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var bower = require('gulp-bower');
var mainBowerFiles = require('main-bower-files');
var webpack = require('webpack-stream');

var config = {
  bowerDir: './bower_components',
  outputDir: './public'
}

// Installs bower components
gulp.task('bower', function() {
  return bower();
});

// Copy html files
gulp.task('html', function() {
  return gulp.src('client/index.html')
    .pipe(gulp.dest(config.outputDir));
});

gulp.task('watch-html', function() {
  gulp.watch('client/index.html', ['html'])
});

// Copy bower files
gulp.task('bower-files', function() {
  return gulp.src(mainBowerFiles())
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest(config.outputDir + '/lib'));
});

gulp.task('watch-bower-files', function() {
  gulp.watch(mainBowerFiles(), ['bower-files']);
});

// Copy js files
gulp.task('js', function() {
  return gulp.src('client/js/main.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(config.outputDir + '/js'));
});

gulp.task('watch-js', function() {
  gulp.watch('client/js/*', ['js']);
});

// Copy assets
gulp.task('assets', function() {
  return gulp.src('client/assets/**/*')
    .pipe(gulp.dest(config.outputDir + '/assets'));
});

gulp.task('watch-assets', function() {
  gulp.watch('client/assets/**/*', ['assets']);
});

gulp.task('clean', function() {
  return gulp.src(config.outputDir, {read:false})
    .pipe(clean());
});

gulp.task('build', ['html', 'bower-files', 'js', 'assets']);
gulp.task('watch', ['watch-bower-files', 'watch-html', 'watch-js', 'watch-assets']);
gulp.task('default', ['bower', 'clean']);
