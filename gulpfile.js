var gulp = require('gulp');
var bower = require('gulp-bower');

var config = {
  bowerDir: './lib'
}

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest(config.bowerDir))
});
