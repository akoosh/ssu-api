//  gulpfile.js
'use strict';
 
// Load some modules which are installed through NPM.
var gulp        = require('gulp');
var browserify  = require('browserify');
var del         = require('del');
var reactify    = require('reactify');
var source      = require('vinyl-source-stream');
 
// Define some paths.
var paths = {
  src: {
    index: ['./src/index.html'],
    app_js: ['./src/js/app.jsx'],
    js: ['./src/js/**/*.js', './src/js/**/*.jsx'],
  },
  dest: {
    index: 'public',
    js: 'public/js'
  }
};

gulp.task('clean', function(done) {
  del(['public'], done);
});
 
// Our JS task. It will Browserify our code and compile React JSX files.
gulp.task('js', ['clean'], function() {
  // Browserify/bundle the JS.
  browserify(paths.src.app_js, {extensions: ['.jsx']})
    .transform(reactify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest(paths.dest.js));
});
 
// Our html  task. It will Browserify our code and compile React JSX files.
gulp.task('html', ['clean'], function() {
    gulp.src(paths.src.index)
      .pipe(gulp.dest(paths.dest.index));
});
 
// Rerun tasks whenever a file changes.
gulp.task('watch', function() {
  gulp.watch(paths.src.js, ['js', 'html']);
  gulp.watch(paths.src.index, ['html']);
});
 
// The default task (called when we run `gulp` from cli)
gulp.task('default', ['watch', 'html', 'js']);
