gulp-image-embed
===========

> A gulp task for converting images inside a stylesheet to data-URI strings.

## Install

```
npm install --save-dev gulp-image-embed
```

## Examples
```js
var gulp = require('gulp');
var embed = require('gulp-image-embed');

//basic
gulp.task('embed', function(){
  return gulp.src('*.css')
    .pipe(embed({
      asset: 'static'
    }))
    .pipe(gulp.dest('build.css'));
});

//use include
gulp.task('embed', function(){
  return gulp.src('*.css')
    .pipe(embed({
      asset: 'static',
      include: [/dataURI/]
    }))
    .pipe(gulp.dest('build.css'));
});
```

### Options

#### asset: 'static'

The path to assets in your project

#### extension: ['jpg', 'png']

The extension list

#### include: [/dataURI/]

The include list(can has Regexp)

#### exclude: [/noDataURI/]

The exclude list(can has Regexp)