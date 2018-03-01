var gulp = require('gulp'),
watch = require('gulp-watch'),
browserSync = require('browser-sync').create();

gulp.task('watch', function() {

  browserSync.init({
    notify: false,
    server: {
      baseDir: "dist"
    }
  });

  gulp.watch('./src/index.html', ['htmlmin'], function() {
    browserSync.reload();
  });

  gulp.watch('./src/styles/**/*.css', function() {
    gulp.start('cssInject');
  });

  gulp.watch('./src/scripts/**/*.js', function() {
    gulp.start('scriptsRefresh');
  });

});

gulp.task('cssInject', ['styles'], function() {
  return gulp.src('.src/styles/styles.css')
    .pipe(browserSync.stream());
});

gulp.task('scriptsRefresh', ['scripts'], function() {
  browserSync.reload();
});