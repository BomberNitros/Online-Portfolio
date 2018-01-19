// Dependencies
var gulp = require('gulp');
var data = require('gulp-data');
var nunjucksRender = require('gulp-nunjucks-render');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var filePath = {
  root: 'site',
  data: './data/data.json',
  templates: 'views/templates',
  njk: 'views/**/*.+(html|njk|nunjucks)',
  scss: 'css/scss/**/*.scss',
  js: 'javascript/**/*.js'
};

// File watcher for code changes
gulp.task('serve', ['nunjucks', 'sass', 'js'], function() {
  browserSync.init({
    server: {
      baseDir: 'site',
      serveStaticOptions: {
        extensions: ['html']
      }
    }
  });
  gulp.watch(filePath.data, ['checkData', newData.showNewData]);
  gulp.watch(filePath.njk, ['nunjucks']);
  gulp.watch(filePath.scss, ['sass']);
  gulp.watch(filePath.js, ['js']);
});
gulp.task('default', ['serve']);

// Trigger task for new data check
var newData = {
  showNewData: function() {
    newData.getDataUpdate();
    newData.notifyDataUpdate();
  },
  getDataUpdate: function() {
    return gulp.src(filePath.data)
      .pipe(gulp.dest('site/data'));
  },
  notifyDataUpdate: function() {
    console.log("New data ready — restart BrowserSync to view update.");
  }
};
gulp.task('checkData', newData.showNewData);

// Manual update for new data
// gulp.task('updateData', function() {
//   function updateTemplates() {
//     return gulp.src(filePath.njk)
//       .pipe(data(function() {
//         return require(filePath.data)
//       }))
//       .pipe(nunjucksRender({
//         path: [filePath.templates]
//       }))
//       .pipe(gulp.dest('site'))
//   };
//   browserSync.init({
//     server: {
//       baseDir: 'site',
//       serveStaticOptions: {
//         extensions: ['html']
//       }
//     }
//   });
// });

// Get and write .html and .nunjucks with data
gulp.task('nunjucks', function() {
  return gulp.src(filePath.njk)
    .pipe(data(function() {
      return require(filePath.data)
    }))
    .pipe(nunjucksRender({
      path: [filePath.templates]
    }))
    .pipe(gulp.dest('site'))
    .pipe(reload({
      stream: true
    }));
});

// Converts SCSS to CSS
gulp.task('sass', function() {
  return gulp.src(filePath.scss)
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(gulp.dest('site/css'))
    .pipe(reload({
      stream: true
    }));
});

// Javascript watcher
gulp.task('js', function() {
  return gulp.src(filePath.js)
    .pipe(gulp.dest('site/js'))
    .pipe(reload({
      stream: true
    }));
});
