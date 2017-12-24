var gulp = require('gulp');

// Default
// ----------------------------------------------------------------------------
gulp.task('default', []);

// settings
// ----------------------------------------------------------------------------
var config = {
  pug: {
    src: ['src/pug/**/*.pug', '!src/pug/**/_*/**/*.pug'],
    dest: 'public/',
    options: {pretty:false},
    isCompile: false
  },
  stylus: {
    src: ['src/stylus/*.styl', '!src/stylus/**/_*/**/*.styl'],
    dest: 'public/css/'
  }
}

// Data
// ----------------------------------------------------------------------------
var fc2blogKeywords = function() {
  this.getReplacement = function(isCompile) {
    var tags = require('./replacements/tags.json');
    if(isCompile) {
      var patterns = tags;
    } else {
      var patterns = require('./replacements/variables.json').concat(tags);
    }

    for(var i = 0; i < patterns.length; i++) {
      patterns[i].match = new RegExp(patterns[i].match, 'g');
    }
    return patterns;
  }
}

// functions
// ----------------------------------------------------------------------------
var replace = require('gulp-replace-task');
var compile = {
  pug: function(config, replacements) {
    gulp.src(config.src)
      .pipe(pug(config.options))
      .pipe(replace({patterns: replacements}))
      .pipe(gulp.dest(config.dest));
  },
  stylus: function(config, replacements) {
    gulp.src(config.src)
      .pipe(stylus())
      .pipe(replace({patterns: replacements}))
      .pipe(gulp.dest(config.dest));
  }
}

// Basic tasks
// ----------------------------------------------------------------------------
var stylus = require('gulp-stylus');
gulp.task('stylus', function() {
  compile.stylus(config.stylus, data.replacements.stylus)
});

var pug = require('gulp-pug');
gulp.task('pug', function() {
  compile.pug(config.pug, new fc2blogKeywords().getReplacement(config.pug.isCompile));
});

var browserSync = require('browser-sync');
var browserSyncConfig = {
  server: {
    baseDir: './public',
  },
  open: true,
  browser: ["chrome"],
  reloadOnRestart: true
  //browser: ["google chrome", "firefox"] 公式ドキュメント通りのこれだと"google chrome"が認識されず、デフォルトブラウザが起動するので注意(Win 7)
};

// Complex tasks
// ----------------------------------------------------------------------------
gulp.task('watch', ['pug', 'stylus'], function() {
  var args = require('minimist')(process.argv.slice(2));
  if(args.restart) {
    browserSyncConfig.open = false;
  }
  browserSync(browserSyncConfig);
  gulp.watch('src/**/*.pug', ['pug', browserSync.reload]);
  gulp.watch('src/stylus/**/*.styl', ['stylus', browserSync.reload]);
});

gulp.task('compile', [], function() {
  config.pug.isCompile = true;
  compile.pug(config.pug, new fc2blogKeywords().getReplacement(config.pug.isCompile));
  compile.stylus(config.stylus, []);
});
