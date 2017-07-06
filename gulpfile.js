var gulp=require("gulp"),
  pump = require('pump'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  babel = require("gulp-babel"),
  es2015 = require("babel-preset-es2015"),
  stage0 = require('babel-preset-stage-0'),
  stage1 = require('babel-preset-stage-1'),
  stage3 = require('babel-preset-stage-3'),
  breact = require("babel-preset-react");

const srcs = [
  './src/**/*.js'
]

gulp.task('default', function () {
  pump([
      gulp.src(srcs),
      sourcemaps.init(),
      babel({ presets:[ breact, es2015, stage0, stage1, stage3 ] }),
      // uglify(),
      sourcemaps.write('./maps'),
      gulp.dest('./build')
    ]
  );
});
