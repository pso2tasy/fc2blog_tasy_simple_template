var gulp = require('gulp');
var autoRestart = require('gulp-auto-restart');
autoRestart({'task': 'watch'});

// Default
// ----------------------------------------------------------------------------
gulp.task('default', []);

// settings
// ----------------------------------------------------------------------------
var config = {
  jade: {
    src: ['src/jade/**/*.jade', '!src/jade/**/_*/**/*.jade'],
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
  jade: function(config, replacements) {
    gulp.src(config.src)
      .pipe(jade(config.options))
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

var jade = require('gulp-jade');
gulp.task('jade', function() {
  compile.jade(config.jade, new fc2blogKeywords().getReplacement(config.jade.isCompile));
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
gulp.task('watch', ['jade', 'stylus'], function() {
  var args = require('minimist')(process.argv.slice(2));
  if(args.restart) {
    browserSyncConfig.open = false;
  }
  browserSync(browserSyncConfig);
  gulp.watch('src/**/*.jade', ['jade', browserSync.reload]);
  gulp.watch('src/stylus/**/*.styl', ['stylus', browserSync.reload]);
});

gulp.task('compile', [], function() {
  config.jade.isCompile = true;
  compile.jade(config.jade, new fc2blogKeywords().getReplacement(config.jade.isCompile));
  compile.stylus(config.stylus, []);
});
