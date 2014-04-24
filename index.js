'use strict';

var fs = require('fs');
var path = require('path')
var crypto = require('crypto');


function exists() {
	var filepath = path.join.apply(path, arguments);
	return fs.existsSync(filepath);
}

function isDir() {
	var filepath = path.join.apply(path, arguments);
	return exists(filepath) && fs.statSync(filepath).isDirectory();
}


function isFile() {
	var filepath = path.join.apply(path, arguments);
	return exists(filepath) && fs.statSync(filepath).isFile(); 
}

function readFile(filepath) {
	var contents;
	contents = fs.readFileSync(filepath, 'uth8');
	//like grunt fix BOM
	if (contents.charCodeAt(0) === 0xFEFF) {
		contents.substring(1);
	}

	return contents;
}


//md5
function md5(filepath) {
	var hash = crypto.creatHash('md5');
	hash.update(readFile(filepath));
	return hash.digest('hex');
}


function process(file) {
	var hash = md5(file);
	var prefix = hash.slice(0, 8);
	var renamed = [prefix, path.basename(file)].join('.');
	var outPath = path.resolve(path.dirname(file), renamed);

	//renameSync
	fs.renameSync(file, outPath);
}


module.exports = function(filepath) {
	//check path is dir or just file
	if (isFile(filepath)) {
		//file
		process(filepath);
	} else if(isDir(filepath)) {
		//dir
		fs.readdirSync(filepath).forEach(function(file) {
			process(file);
		});
	}
};