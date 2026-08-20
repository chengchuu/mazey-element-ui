'use strict';

const { series, src, dest } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

function compile() {
  return src('./src/*.scss')
    .pipe(sass.sync({
      quietDeps: true,
      silenceDeprecations: [
        'color-functions',
        'function-units',
        'global-builtin',
        'import',
        'legacy-js-api',
        'slash-div'
      ]
    }))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(dest('./lib'));
}

function copyfont() {
  return src('./src/fonts/**')
    .pipe(dest('./lib/fonts'));
}

exports.build = series(compile, copyfont);
