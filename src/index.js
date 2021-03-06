// Copyright (c) 2014-2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

exports.stdout = new TestStream(process.stdout);
exports.stderr = new TestStream(process.stderr);

function TestStream(stream) {
	this._stream = stream;
}

TestStream.prototype.inspect = function() {
	expectNoArguments(arguments, "inspect", "inspectSync");

	// This code inspired by http://userinexperience.com/?p=714
	var output = [];
	var stream = this._stream;

	var originalWrite = stream.write;
	stream.write = function(string) {
		output.push(string);
	};

	return {
		output: output,
		restore: function() {
			stream.write = originalWrite;
		}
	};
};

TestStream.prototype.inspectSync = function(fn) {
	expectOneFunction(arguments, "inspectSync", "inspect");

	var inspect = this.inspect();
	try {
		fn(inspect.output);
	}
	finally {
		inspect.restore();
	}
	return inspect.output;
};

TestStream.prototype.ignore = function() {
	expectNoArguments(arguments, "ignore", "ignoreSync");

	return this.inspect().restore;
};

TestStream.prototype.ignoreSync = function(fn) {
	expectOneFunction(arguments, "ignoreSync", "ignore");

	this.inspectSync(function() {
		fn();
	});
};

function expectNoArguments(args, calledFunction, functionToCallInstead) {
	if (args.length !== 0) {
		throw new Error(calledFunction + "() doesn't take a function parameter. Did you mean to call " +
			functionToCallInstead + "()?");
	}
}

function expectOneFunction(args, calledFunction, functionToCallInstead) {
	if (args.length !== 1) {
		throw new Error(calledFunction + "() requires a function parameter. Did you mean to call " +
			functionToCallInstead + "()?");
	}
}