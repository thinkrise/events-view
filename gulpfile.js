var del = require('del'),
    gulp = require('gulp'),
    yargs = require('yargs'),
    gulpif = require('gulp-if'),
    jshint = require('gulp-jshint'),
    prefix = require('gulp-autoprefixer'),
    browserify = require('gulp-browserify'),
    sprites = require("gulp-svg-sprite");

// Minifiers
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

/**
 * Concatinate SVG files into a one sprite-sheet.
 */
gulp.task('sprites', function () {
  return gulp.src('app/assets/svg/*.svg')
    .pipe(sprites({
      mode: {
        defs: true,
        sprite: 'spritesheet.svg'
      }
    }))
    .pipe(gulp.dest("app/views/partials"));
});

/**
 * Compiled CSS.
 */
gulp.task('styles', ['clean'], function(){
  return gulp.src('app/assets/stylesheets/main.css')
    .pipe(prefix("last 10 versions", "> 1%", 'ie 9'))
    .pipe(gulpif(yargs.argv.production, minifyCSS()))
    .pipe(gulp.dest('app/static/stylesheets'));
});

/**
 * Compile JavaScript.
 */
gulp.task('scripts', function() {
    // Single entry point to browserify
  return gulp.src('app/assets/javascript/main.js')
    .pipe(browserify({
      insertGlobals : false
    }))
    .pipe(gulpif(yargs.argv.production, uglify()))
    .pipe(gulp.dest('./app/static/javascript'));
});

gulp.task('lint', function() {
  return gulp.src('app/assets/javascript/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/**
 * Run the build of assets and javascript
 */
gulp.task('build', ['lint', 'clean'], function(){
  gulp.start('styles');
  gulp.start('sprites');
  gulp.start('scripts');
});

/**
 * Watch for file changes
 */
gulp.task('watch', function(){
  gulp.start('build');

  gulp.watch(['app/assets/svg/**/*.svg'], ['sprites']);
  gulp.watch(['app/assets/stylesheets/**/*.css'], ['styles']);
  gulp.watch(['app/assets/js/**/*.js'], ['lint','scripts']);
});

/**
 * Default task - run through all of the tasks
 */
gulp.task('default', function(){
  gulp.start('build');
});
