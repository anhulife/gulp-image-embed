'use strict';

var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var mime = require('mime');

function getDataURI(filePath) {
	var ret = "data:";
	ret += mime.lookup(filePath);
	ret += ";base64,";
	ret += fs.readFileSync(filePath).toString("base64");
	return ret;
}

module.exports = function (options) {
	var contents, mainPath, reg, asset, include, exclude;

	include = options.include;

	exclude = options.exclude;

	asset = options.asset || process.cwd();

	reg = new RegExp('url\\((([^)]+\\.(' + (options.extension ? options.extension.join('|') : 'jpg|jpeg|png|gif') + '))[^)]*)\\)', 'gim');

	return through.obj(function (file, enc, callback) {
		if (file.isNull()) {
			this.push(file);
			return callback();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-static-hash', 'Streams are not supported!'));
			return callback();
		}

		mainPath = path.dirname(file.path);

		contents = file.contents.toString().replace(reg, function (content, url, filePath, extension) {
			var fullPath,
				isIncluded = true;

			if (include) {
				isIncluded = include.some(function (pattern) {
					return (pattern instanceof RegExp) ? pattern.test(url) : (url.indexOf(pattern) > -1);
				});
			}

			if (isIncluded && exclude) {
				isIncluded = !exclude.some(function (pattern) {
					return (pattern instanceof RegExp) ? pattern.test(url) : (url.indexOf(pattern) > -1);
				});
			}

			if (!isIncluded) {
				return content;
			}

			filePath = filePath.replace(/['"]/g, '');

			if (/^\//.test(filePath)) {
				fullPath = path.resolve(asset, filePath.slice(1));
			} else {
				fullPath = path.resolve(asset, mainPath, filePath);
			}

			if (fs.existsSync(fullPath)) {
				return content.replace(url, getDataURI(fullPath));
			} else {
				return content;
			}
		});

		file.contents = new Buffer(contents);

		this.push(file);
		return callback();
	});
};