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

gulp.task('watch-html', function() {
  gulp.watch('client/index.html', ['html'])
});

// Copy bower files
gulp.task('bower-files', function() {
  return gulp.src(mainBowerFiles())
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest(config.outputDir + '/lib'));
});

// Copy js files
gulp.task('js', function() {
  return gulp.src('client/js/*')
    .pipe(gulp.dest(config.outputDir + '/js'));
});

gulp.task('watch-js', function() {
  gulp.watch('client/js/*', ['js']);
});

// Copy assets
gulp.task('assets', function() {
  return gulp.src('client/assets/*')
    .pipe(gulp.dest(config.outputDir + '/assets'));
});

gulp.task('watch-assets', function() {
  gulp.watch('client/assets/*', ['assets']);
});

gulp.task('clean', function() {
  return gulp.src(config.outputDir, {read:false})
    .pipe(clean());
});

gulp.task('build', ['clean', 'html', 'bower-files', 'assets']);
gulp.task('watch', ['watch-html', 'watch-js', 'watch-assets']);
gulp.task('default', ['bower', 'clean']);
