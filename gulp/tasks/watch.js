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

  gulp.watch('./src/index.html',['htmlmin']);

  gulp.watch('./dist/index.html',function(){
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
  return gulp.src('.dist/styles/styles.css')
    .pipe(browserSync.stream());
});

gulp.task('scriptsRefresh', ['scripts'], function() {
  browserSync.reload();
});