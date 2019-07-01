// Javascript with Node.js.
// Needs uglify-es (npm install uglify-es)
// Needs uglifycss (npm install uglifycss)
// Needs svg2png (npm install svg2png)
// Needs html-minifier (npm install html-minifier)
// Build script.


// Options for minify js.

var js_options = {compress: {drop_console: true,
                          keep_classnames: false,
                          keep_fnames: false,
                          toplevel: true},
               mangle: {keep_classnames: false,
                        keep_fnames: false,
                        toplevel: false},
               keep_classnames: false,
               keep_fnames: false,
               toplevel: true,
               warnings: true};

// Options for minify css.
var css_options = {maxLineLen: 0,
	           expandVars: true,
	           uglyComments: false,
	           cuteComments: false,
	           convertUrls: '',
	           debug: true,
	           output: ''};

// Options for minify svg.
var svg_options = {collapseInlineTagWhitespace: true,
	           collapseWhitespace: true,
			   minifyCSS: true,
			   minifyJS: true,
	           removeComments: true,
	           removeEmptyAttributes: true,
	           removeRedundantAttributes: true};

// Options for minify html.
var html_options = {collapseInlineTagWhitespace: true,
	           collapseWhitespace: true,
	           removeComments: true,
	           removeEmptyAttributes: true,
	           removeRedundantAttributes: true};


// Import modules.
var fs = require("fs");
var uglifyjs = require("uglify-es");
var uglifycss = require("uglifycss");
var svg2png = require("svg2png");
var htmlminifier = require("html-minifier");

// Build tasks..
// var paramfile = "./tools/build.json";
// var tasks = {};
// if (fs.existsSync(paramfile)) {
//     tasks = JSON.parse(fs.readFileSync(paramfile));
// }
var tasks = require("./build.json");

// Update build date.
var d = new Date();
var builddate = ("0" + d.getYear()).slice(-2)
            + ("0" + (d.getMonth() + 1)).slice(-2)
            + ("0" + d.getDate()).slice(-2);
var version = "0.0";
var timestamp = builddate;
console.log("Date: " + builddate);

// Minify and join source codes.
for (var key in tasks) {
    var task = tasks[key];
	var srcfiles = "";
	var result = "";
    var binary = null;

	// Concat all input files to one file.
	task.srcfiles.forEach((srcfile) => {
        if (srcfiles == "") {
            srcfiles = srcfile;
        } else {
            srcfiles += ", " + srcfile;
        }
        binary = fs.readFileSync(srcfile);
        result += binary;
	});

	// Update timestamp.
	if (task.update_timestamp) {

        // Load build count file.
        // Timestamp format is "M.N.YYMMDD+B"
        // (M:major ver, N:minor ver, YY:year, MM:month, DD:day, B:build count).
        result = result.replace(/(\d+)\.(\d+)\.(\d{6})\+(\d+)/,
                                (match, p1, p2, p3, p4) => {
            if (p3 == builddate) {
				p4 = parseInt(p4) + 1;
			} else {
                p3 = builddate;
                p4 = 0;
            }
            version = p1 + "." + p2;
            timestamp = p3 + "+" + p4;
            console.log("Timestamp: " + timestamp);
            return version + "." + timestamp;
        });
	}

    // Update version.
	if (task.update_version) {

		// Version format is below.
        // "version" : "0.0.000000+0"
        //  version  = "0.0.000000+0";
        result = result.replace(
            /(version\"?\s*[\:\=]\s*\")(?:\d*\.)*[\d\+]*(\")/g,
            "$1" + version + "." + timestamp + "$2");
	}

	// Copy text files.
	if (task.target.match("(.txt)$")) {

		console.log("" + task.target + " ( " + srcfiles + "): "
		            + result.length + " bytes.");
		var targetpath = task.target.substring(0, task.target.lastIndexOf('/'));
		if (targetpath && !fs.existsSync(targetpath)) {
			fs.mkdirSync(targetpath);
		}
		fs.writeFileSync(task.target, result, "utf8");

	// Minifly js files.
    } else if (task.target.match("(.js|.json)$")) {

        // Ignore nobuild code.
		if (task.ignore_nobuild) {
			result = result.replace(/NOBUILD[\s\S]*?\/NOBUILD/g, "");
		}

		// Minify.
		if (task.minify) {
			var result_minified = uglifyjs.minify(result, js_options);
			if (result_minified.error) {
				console.log("" + task.target + " ( " + srcfiles + "): "
				            + result_minified.error);
			} else {
				console.log("" + task.target + " ( " + srcfiles + "): "
				            + result.length + " bytes -> "
				            + result_minified.code.length + " bytes.");
				var targetpath = task.target.substring(0, task.target.lastIndexOf('/'));
				if (targetpath && !fs.existsSync(targetpath)) {
					fs.mkdirSync(targetpath);
				}
				fs.writeFileSync(task.target, result_minified.code, "utf8");
			}
		} else {
			console.log("" + task.target + " ( " + srcfiles + "): "
			            + result.length + " bytes.");
			var targetpath = task.target.substring(0, task.target.lastIndexOf('/'));
			if (targetpath && !fs.existsSync(targetpath)) {
				fs.mkdirSync(targetpath);
			}
			fs.writeFileSync(task.target, result, "utf8");
		}

	// Minifly css files.
	} else if (task.target.match(".css$")) {

		// Minify.
		if (task.minify) {
			var result_minified = uglifycss.processString(result, css_options);
			if (result_minified.error) {
				console.log("" + task.target + " ( " + srcfiles + "): "
				            + result_minified.error);
			} else {
				console.log("" + task.target + " ( " + srcfiles + "): "
				            + result.length + " bytes -> "
				            + result_minified.length + " bytes.");
				var targetpath = task.target.substring(0, task.target.lastIndexOf('/'));
				if (targetpath && !fs.existsSync(targetpath)) {
					fs.mkdirSync(targetpath);
				}
				fs.writeFileSync(task.target, result_minified, "utf8");
			}
		} else {
			console.log("" + task.target + " ( " + srcfiles + "): "
			            + result.length + " bytes.");
			var targetpath = task.target.substring(0, task.target.lastIndexOf('/'));
			if (targetpath && !fs.existsSync(targetpath)) {
				fs.mkdirSync(targetpath);
			}
			fs.writeFileSync(task.target, result, "utf8");
		}

	// Convert svg files to png or copy png.
	} else if (task.target.match(".png")) {

		// Ignore multiple svg tags.
		var result_single = result.replace(/<\/svg\>\s*\<svg[\s\S]*?>/g, "");

		// Convert.
        if (result_single.match(/svg/)) {
    		var result_convert = svg2png.sync(result_single, task.options);
    		if (result_convert.error) {
    			console.log("" + task.target + " ( " + srcfiles + "): "
    			            + result_convert.error);
    		} else {
    			console.log("" + task.target + " ( " + srcfiles + "): "
    			            + result.length + " bytes -> "
    			            + result_convert.length + " bytes.");
    			var targetpath = task.target.substring(0, task.target.lastIndexOf('/'));
    			if (targetpath && !fs.existsSync(targetpath)) {
    				fs.mkdirSync(targetpath);
    			}
    			fs.writeFileSync(task.target, result_convert, "utf8");
    		}
        } else {
            console.log("" + task.target + " ( " + srcfiles + "): "
			            + binary.length + " bytes.");
			var targetpath = task.target.substring(0, task.target.lastIndexOf('/'));
			if (targetpath && !fs.existsSync(targetpath)) {
				fs.mkdirSync(targetpath);
			}
			fs.writeFileSync(task.target, binary);
        }

	// Minify svg files.
	} else if (task.target.match(".svg")) {

		// Ignore multiple svg tags.
		var result_single = result.replace(/<\/svg\>\s*\<svg[\s\S]*?>/g, "");

		// Minify.
		if (task.minify) {
			var result_minified = htmlminifier.minify(result_single, svg_options);
			if (result_minified.error) {
				console.log("" + task.target + " ( " + srcfiles + "): "
				            + result_minified.error);
			} else {
				console.log("" + task.target + " ( " + srcfiles + "): "
				            + result.length + " bytes -> "
				            + result_minified.length + " bytes.");
				var targetpath = task.target.substring(0, task.target.lastIndexOf('/'));
				if (targetpath && !fs.existsSync(targetpath)) {
					fs.mkdirSync(targetpath);
				}
				fs.writeFileSync(task.target, result_minified, "utf8");
			}
		} else {
			console.log("" + task.target + " ( " + srcfiles + "): "
						+ result.length + " bytes -> "
						+ result_single.length + " bytes.");
			var targetpath = task.target.substring(0, task.target.lastIndexOf('/'));
			if (targetpath && !fs.existsSync(targetpath)) {
				fs.mkdirSync(targetpath);
			}
			fs.writeFileSync(task.target, result, "utf8");
		}

	// Minify html files.
	} else if (task.target.match(".html")) {

		// Ignore nobuild code.
		if (task.ignore_nobuild) {
			result = result.replace(/NOBUILD[\s\S]*?\/NOBUILD/g, "");
		}

		// Minify.
		if (task.minify) {
			var result_minified = htmlminifier.minify(result, html_options);
			if (result_minified.error) {
				console.log("" + task.target + " ( " + srcfiles + "): "
				            + result_minified.error);
			} else {
				console.log("" + task.target + " ( " + srcfiles + "): "
				            + result.length + " bytes -> "
				            + result_minified.length + " bytes.");
				var targetpath = task.target.substring(0, task.target.lastIndexOf('/'));
				if (targetpath && !fs.existsSync(targetpath)) {
					fs.mkdirSync(targetpath);
				}
				fs.writeFileSync(task.target, result_minified, "utf8");
			}
		} else {
			console.log("" + task.target + " ( " + srcfiles + "): "
			            + result.length + " bytes.");
			var targetpath = task.target.substring(0, task.target.lastIndexOf('/'));
			if (targetpath && !fs.existsSync(targetpath)) {
				fs.mkdirSync(targetpath);
			}
			fs.writeFileSync(task.target, result, "utf8");
		}
	}
}
