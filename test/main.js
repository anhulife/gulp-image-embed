/* global describe, it */

'use strict';

var assert = require('assert');
var fs = require('fs');
var gutil = require('gulp-util');
var path = require('path');
var embed = require('../index');

function getFile(filePath) {
	return new gutil.File({
		path: filePath,
		base: path.dirname(filePath),
		contents: fs.readFileSync(filePath)
	});
}

function getFixture(filePath) {
	return getFile(path.resolve('test', 'fixtures', filePath));
}

function getExpected(filePath) {
	return getFile(path.resolve('test', 'expected', filePath));
}

function compare(name, expectedName, stream, done) {
	stream.on('data', function (newFile) {
		if (path.basename(newFile.path) === name) {
			assert.equal(String(getExpected(expectedName).contents), String(newFile.contents));
		}
	});
	stream.on('end', function () {
		done();
	});

	stream.write(getFixture(name));
	stream.end();
}

describe('extension', function () {
	it('jpg', function (done) {
		var stream = embed({
			asset: './test/fixtures',
			extension: ['jpg']
		});

		compare('jpg_png_gif.css', 'jpg.css', stream, done);
	});

	it('png', function (done) {
		var stream = embed({
			asset: './test/fixtures',
			extension: ['png']
		});

		compare('jpg_png_gif.css', 'png.css', stream, done);
	});

	it('gif', function (done) {
		var stream = embed({
			asset: './test/fixtures',
			extension: ['gif']
		});

		compare('jpg_png_gif.css', 'gif.css', stream, done);
	});

	it('jpg_png_gif', function (done) {
		var stream = embed({
			asset: './test/fixtures',
			extension: ['jpg', 'png', 'gif']
		});

		compare('jpg_png_gif.css', 'jpg_png_gif.css', stream, done);
	});
});

describe('include_exclude', function () {
	it('include', function (done) {
		var stream = embed({
			asset: './test/fixtures',
			include: [/dataURI/]
		});

		compare('jpg_png_gif.css', 'include.css', stream, done);
	});

	it('exclude', function (done) {
		var stream = embed({
			asset: './test/fixtures',
			exclude: [/noDataURI/]
		});

		compare('jpg_png_gif.css', 'exclude.css', stream, done);
	});

	it('include_exclude', function (done) {
		var stream = embed({
			asset: './test/fixtures',
			include: [/dataURI/],
			exclude: [/noDataURI/]
		});

		compare('jpg_png_gif.css', 'include_exclude.css', stream, done);
	});
});