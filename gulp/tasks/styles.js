var gulp = require('gulp'),
  postcss = require('gulp-postcss'),
  cssImport = require('postcss-import'),
  cssnano = require('gulp-cssnano');


gulp.task('styles', function () {
  return gulp.src(['./src/styles/styles.css'], {base: 'src'})
    .pipe(postcss([cssImport]))
    .on('error', function (errorInfo) {
      console.log(errorInfo.toString());
      this.emit('end');
    })
    .pipe(cssnano())
    .pipe(gulp.dest('./dist'));
});