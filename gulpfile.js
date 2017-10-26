"use strict";

// Plugins
var            gulp = require('gulp'),
               sass = require('gulp-sass'),
             prefix = require('gulp-autoprefixer'),
             jshint = require('gulp-jshint'),
           sequence = require('gulp-sequence'),
             rimraf = require('rimraf'),
            stylish = require('jshint-stylish'),
            nodemon = require('gulp-nodemon'),
             gulpConcat = require('gulp-concat'),
             rename = require('gulp-rename'),
             uglify = require('gulp-uglify'),
             sourcemaps = require('gulp-sourcemaps'),
             cleanCSS = require('gulp-clean-css');

// paths & files
var path = {
        src: 'src/',
       html: 'src/**/*.html',
         js: 'src/js/*.js',
       sass: 'src/css/sass/**/*.scss',
        css: 'src/css/',
        data: 'src/data/**/*.*'
};

// ports
var localPort =  3000,
       lrPort = 35729;


// default task
gulp.task( 'default', ['start'] );


//start local server
gulp.task('start', function () {
  nodemon({
    script: 'app.js'
  , tasks: ['clean', 'sass:build', 'minify-css' ,'copy:build', 'js-work', 'js-vendor', 'jshint-frontend', 'jshint-backend']
  , ignore: ['public/**/*','src/js/concat.js','src/js/script.js','src/css/styles.css','src/css/inline.css','logs/biglog.log','image-cache/**/*']
  , ext: 'js html scss css svg png jpg gif jade log json'
  , verbose: true
  , env: { 'NODE_ENV': 'development' }
  }).on('restart', function () {
      console.log('restarted!')
  })
})

// jshint
gulp.task( 'jshint-frontend', function() {
  gulp.src( path.js )
    .pipe( jshint({laxcomma:true}) )
    .pipe( jshint.reporter( stylish ) );
});

gulp.task( 'jshint-backend', function() {
  gulp.src( 'routes/*.js' )
    .pipe( jshint({laxcomma:true}) )
    .pipe( jshint.reporter( stylish ) );
});

// compile sass
gulp.task( 'sass', function() {
  gulp.src( path.sass )
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe( sass({
      outputStyle: [ 'expanded' ],
      sourceComments: 'normal',
      "sourcemap=none": true
    }))
    .pipe( prefix() )
    .pipe(sourcemaps.write())
    .pipe( gulp.dest( path.css ) );
});

gulp.task('sass:build', function() {
  gulp.src( path.sass )
  .pipe( sass({
    outputStyle:'compressed',
    "sourcemap=none": true
  }))
  .pipe( prefix() )
  .pipe( gulp.dest( path.css ) );
});

gulp.task('minify-css', function() {
  return gulp.src('src/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
});

gulp.task('copy:build', function() {
  gulp.src([
    './src/css/**/*.css',
    './src/**/*.html',
    './src/fonts/**/*.*',
    './src/doc/**/*.*',
    './src/images/**/*.*',
    './src/data/**/*.*'
  ], { base: './src' })
  .pipe(gulp.dest('public'));
});

gulp.task('clean', function(cb) {
  rimraf('./dist', cb);
})

gulp.task('build', function(cb) {
  sequence('clean', 'sass:build', 'sass' ,'copy:build', 'js-work', 'start')(cb);
});

gulp.task('js-work', function(){
    return gulp.src(['./src/js/*.js'])
        .pipe(sourcemaps.init())
        .pipe(gulpConcat('concat.js'))
        .pipe(rename('script.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('js-vendor', function(){
  return gulp.src(['./src/js/vendor/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('public/js'));
})

//.pipe(sourcemaps.init())
//.pipe(sourcemaps.write())


