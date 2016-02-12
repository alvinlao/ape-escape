var gulp = require('gulp');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var bower = require('gulp-bower');
var mainBowerFiles = require('main-bower-files');

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

// Copy bower files
gulp.task('bower-files', function() {
  return gulp.src(mainBowerFiles())
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest(config.outputDir + '/lib'));
});

// Copy assets
gulp.task('assets', function() {
  return gulp.src('client/assets/*')
    .pipe(gulp.dest(config.outputDir + '/assets'));
});

gulp.task('clean', function() {
  return gulp.src(config.outputDir, {read:false})
    .pipe(clean());
});

gulp.task('build', ['clean', 'html', 'bower-files', 'assets']);

gulp.task('default', ['bower', 'clean']);
