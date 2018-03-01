var gulp = require('gulp'),
webpack = require('webpack-stream'),
uglify = require('gulp-uglify'),
named = require('vinyl-named'),
pump = require('pump');

gulp.task('scripts', function() {
  pump(
    gulp.src('./src/scripts/script.js',{base:'src'}),
    named(),
    webpack(),
    uglify(),
    gulp.dest('./dist/scripts')
  )
});

// gulp.task('jsmin', (cb) => {
//   pump([
//     gulp.src([
//       './src//*.js'
//     ], { base: 'src' }),
//     uglify(),
//     gulp.dest('./dist'),
//   ], cb);
// });