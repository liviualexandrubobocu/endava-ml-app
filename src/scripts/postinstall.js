/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/* unknown exports provided */
/* all exports used */
/*!***************************!*\
  !*** external "readline" ***!
  \***************************/
/***/ (function(module, exports) {

module.exports = require("readline");

/***/ }),
/* 1 */
/* unknown exports provided */
/* all exports used */
/*!*************************************!*\
  !*** ./~/prompt-lite/lib/prompt.js ***!
  \*************************************/
/***/ (function(module, exports, __webpack_require__) {

/*
 * prompt.js: Simple prompt for prompting information from the command line
 *
 * (C) 2010, Nodejitsu Inc.
 *
 */

var events = __webpack_require__(/*! events */ 14),
    readline = __webpack_require__(/*! readline */ 0),
    util = __webpack_require__(/*! util */ 16),
    async = __webpack_require__(/*! async */ 6),
    read = __webpack_require__(/*! read */ 11),
    validate = __webpack_require__(/*! revalidator */ 12).validate,
    colors = __webpack_require__(/*! colors */ 9);

//
// Monkey-punch readline.Interface to work-around
// https://github.com/joyent/node/issues/3860
//
readline.Interface.prototype.setPrompt = function(prompt, length) {
  this._prompt = prompt;
  if (length) {
    this._promptLength = length;
  } else {
    var lines = prompt.split(/[\r\n]/);
    var lastLine = lines[lines.length - 1];
    this._promptLength = lastLine.replace(/\u001b\[(\d+(;\d+)*)?m/g, '').length;
  }
};

var stdin = process.stdin,
    stdout = process.stdout,
    history = [];

var prompt = module.exports = Object.create(events.EventEmitter.prototype);
var logger = prompt.logger = {
  help: 'cyan',
  error: 'red'
};
Object.keys(logger).forEach(function (lvl) {
  var color = logger[lvl];

  logger[lvl] = function () {

    var argv = [].slice.call(arguments),
        str = argv.shift(),
        head = lvl;

    if (prompt.colors) {
      head = lvl[color] || lvl;
    }

    head += ': ';

    argv.unshift(head + (str || ''));

    //
    // For compatibility with prompt's use of winston.
    //
    // TODO: Writing to an uncontrolled stream is wrong.
    //
    if (lvl === 'error') {
      return console.error.apply(null, argv);
    }

    stdout.write(util.format.apply(null, argv) + '\n');
  }
});

prompt.started    = false;
prompt.paused     = false;
prompt.allowEmpty = false;
prompt.message    = 'prompt';
prompt.delimiter  = ': ';
prompt.colors     = true;

//
// Create an empty object for the properties
// known to `prompt`
//
prompt.properties = {};

//
// ### function start (options)
// #### @options {Object} **Optional** Options to consume by prompt
// Starts the prompt by listening to the appropriate events on `options.stdin`
// and `options.stdout`. If no streams are supplied, then `process.stdin`
// and `process.stdout` are used, respectively.
//
prompt.start = function (options) {
  if (prompt.started) {
    return;
  }

  options = options        || {};
  stdin   = options.stdin  || process.stdin;
  stdout  = options.stdout || process.stdout;

  //
  // By default: Remember the last `10` prompt property /
  // answer pairs and don't allow empty responses globally.
  //
  prompt.memory     = options.memory     || 10;
  prompt.allowEmpty = options.allowEmpty || false;
  prompt.message    = options.message    || prompt.message;
  prompt.delimiter  = options.delimiter  || prompt.delimiter;
  prompt.colors     = options.colors     || prompt.colors;

  if (process.platform !== 'win32') {
    // windows falls apart trying to deal with SIGINT
    process.on('SIGINT', function () {
      stdout.write('\n');
      process.exit(1);
    });
  }

  prompt.emit('start');
  prompt.started = true;
  return prompt;
};

//
// ### function pause ()
// Pauses input coming in from stdin
//
prompt.pause = function () {
  if (!prompt.started || prompt.paused) {
    return;
  }

  stdin.pause();
  prompt.emit('pause');
  prompt.paused = true;
  return prompt;
};

//
// ### function resume ()
// Resumes input coming in from stdin
//
prompt.resume = function () {
  if (!prompt.started || !prompt.paused) {
    return;
  }

  stdin.resume();
  prompt.emit('resume');
  prompt.paused = false;
  return prompt;
};

//
// ### function history (search)
// #### @search {Number|string} Index or property name to find.
// Returns the `property:value` pair from within the prompts
// `history` array.
//
prompt.history = function (search) {
  if (typeof search === 'number') {
    return history[search] || {};
  }

  var names = history.map(function (pair) {
    return typeof pair.property === 'string'
      ? pair.property
      : pair.property.name;
  });

  if (~names.indexOf(search)) {
    return null;
  }

  return history.filter(function (pair) {
    return typeof pair.property === 'string'
      ? pair.property === search
      : pair.property.name === search;
  })[0];
};

//
// ### function get (schema, callback)
// #### @schema {Array|Object|string} Set of variables to get input for.
// #### @callback {function} Continuation to pass control to when complete.
// Gets input from the user via stdin for the specified message(s) `msg`.
//
prompt.get = function (schema, callback) {
  //
  // Transforms a full JSON-schema into an array describing path and sub-schemas.
  // Used for iteration purposes.
  //
  function untangle(schema, path) {
    var results = [];
    path = path || [];

    if (schema.properties) {
      //
      // Iterate over the properties in the schema and use recursion
      // to process sub-properties.
      //
      Object.keys(schema.properties).forEach(function (key) {
        var obj = {};
        obj[key] = schema.properties[key];

        //
        // Concat a sub-untangling to the results.
        //
        results = results.concat(untangle(obj[key], path.concat(key)));
      });

      // Return the results.
      return results;
    }

    //
    // This is a schema "leaf".
    //
    return {
      path: path,
      schema: schema
    };
  }

  //
  // Iterate over the values in the schema, represented as
  // a legit single-property object subschemas. Accepts `schema`
  // of the forms:
  //
  //    'prop-name'
  //
  //    ['string-name', { path: ['or-well-formed-subschema'], properties: ... }]
  //
  //    { path: ['or-well-formed-subschema'], properties: ... ] }
  //
  //    { properties: { 'schema-with-no-path' } }
  //
  // And transforms them all into
  //
  //    { path: ['path', 'to', 'property'], properties: { path: { to: ...} } }
  //
  function iterate(schema, get, done) {
    var iterator = [],
        result = {};

    if (typeof schema === 'string') {
      //
      // We can iterate over a single string.
      //
      iterator.push({
        path: [schema],
        schema: prompt.properties[schema.toLowerCase()] || {}
      });
    }
    else if (Array.isArray(schema)) {
      //
      // An array of strings and/or single-prop schema and/or no-prop schema.
      //
      iterator = schema.map(function (element) {
        if (typeof element === 'string') {
          return {
            path: [element],
            schema: prompt.properties[element.toLowerCase()] || {}
          };
        }
        else if (element.properties) {
          return {
            path: [Object.keys(element.properties)[0]],
            schema: element.properties[Object.keys(element.properties)[0]]
          };
        }
        else if (element.path && element.schema) {
          return element;
        }
        else {
          return {
            path: [element.name || 'question'],
            schema: element
          };
        }
      });
    }
    else if (schema.properties) {
      //
      // Or a complete schema `untangle` it for use.
      //
      iterator = untangle(schema);
    }
    else {
      //
      // Or a partial schema and path.
      // TODO: Evaluate need for this option.
      //
      iterator = [{
        schema: schema.schema ? schema.schema : schema,
        path: schema.path || [schema.name || 'question']
      }];
    }

    //
    // Now, iterate and assemble the result.
    //
    async.forEachSeries(iterator, function (branch, next) {
      get(branch, function assembler(err, line) {
        if (err) {
          return next(err);
        }

        function build(path, line) {
          var obj = {};
          if (path.length) {
            obj[path[0]] = build(path.slice(1), line);
            return obj;
          }

          return line;
        }

        function attach(obj, attr) {
          var keys;
          if (typeof attr !== 'object' || attr instanceof Array) {
            return attr;
          }

          keys = Object.keys(attr);
          if (keys.length) {
            if (!obj[keys[0]]) {
              obj[keys[0]] = {};
            }
            obj[keys[0]] = attach(obj[keys[0]], attr[keys[0]]);
          }

          return obj;
        }

        result = attach(result, build(branch.path, line));
        next();
      });
    }, function (err) {
      return err ? done(err) : done(null, result);
    });
  }

  iterate(schema, function get(target, next) {
    prompt.getInput(target, function (err, line) {
      return err ? next(err) : next(null, line);
    });
  }, callback);

  return prompt;
};

//
// ### function confirm (msg, callback)
// #### @msg {Array|Object|string} set of message to confirm
// #### @callback {function} Continuation to pass control to when complete.
// Confirms a single or series of messages by prompting the user for a Y/N response.
// Returns `true` if ALL messages are answered in the affirmative, otherwise `false`
//
// `msg` can be a string, or object (or array of strings/objects).
// An object may have the following properties:
//
//    {
//      description: 'yes/no' // message to prompt user
//      pattern: /^[yntf]{1}/i // optional - regex defining acceptable responses
//      yes: /^[yt]{1}/i // optional - regex defining `affirmative` responses
//      message: 'yes/no' // optional - message to display for invalid responses
//    }
//
prompt.confirm = function (/* msg, options, callback */) {
  var args     = Array.prototype.slice.call(arguments),
      msg      = args.shift(),
      callback = args.pop(),
      opts     = args.shift(),
      vars     = !Array.isArray(msg) ? [msg] : msg,
      RX_Y     = /^[yt]{1}/i,
      RX_YN    = /^[yntf]{1}/i;

  function confirm(target, next) {
    var yes = target.yes || RX_Y,
      options = mixin({
        description: typeof target === 'string' ? target : target.description||'yes/no',
        pattern: target.pattern || RX_YN,
        name: 'confirm',
        message: target.message || 'yes/no'
      }, opts || {});


    prompt.get([options], function (err, result) {
      next(err ? false : yes.test(result[options.name]));
    });
  }

  async.rejectSeries(vars, confirm, function(result) {
    callback(null, result.length===0);
  });
};


// Variables needed outside of getInput for multiline arrays.
var tmp = [];


// ### function getInput (prop, callback)
// #### @prop {Object|string} Variable to get input for.
// #### @callback {function} Continuation to pass control to when complete.
// Gets input from the user via stdin for the specified message `msg`.
//
prompt.getInput = function (prop, callback) {
  var schema = prop.schema || prop,
      propName = prop.path && prop.path.join(':') || prop,
      storedSchema = prompt.properties[propName.toLowerCase()],
      delim = prompt.delimiter,
      defaultLine,
      against,
      hidden,
      length,
      valid,
      name,
      raw,
      msg;

  //
  // If there is a stored schema for `propName` in `propmpt.properties`
  // then use it.
  //
  if (schema instanceof Object && !Object.keys(schema).length &&
    typeof storedSchema !== 'undefined') {
    schema = storedSchema;
  }

  //
  // Build a proper validation schema if we just have a string
  // and no `storedSchema`.
  //
  if (typeof prop === 'string' && !storedSchema) {
    schema = {};
  }

  schema = convert(schema);
  defaultLine = schema.default;
  name = prop.description || schema.description || propName;
  raw = prompt.colors
    ? [prompt.message, delim + name.grey, delim.grey]
    : [prompt.message, delim + name, delim];

  prop = {
    schema: schema,
    path: propName.split(':')
  };

  //
  // If the schema has no `properties` value then set
  // it to an object containing the current schema
  // for `propName`.
  //
  if (!schema.properties) {
    schema = (function () {
      var obj = { properties: {} };
      obj.properties[propName] = schema;
      return obj;
    })();
  }

  //
  // Handle overrides here.
  // TODO: Make overrides nestable
  //
  if (prompt.override && prompt.override[propName]) {
    if (prompt._performValidation(name, prop, prompt.override, schema, -1, callback)) {
      return callback(null, prompt.override[propName]);
    }

    delete prompt.override[propName];
  }

  var type = (schema.properties && schema.properties[name] &&
              schema.properties[name].type || '').toLowerCase().trim(),
      wait = type === 'array';

  if (type === 'array') {
    length = prop.schema.maxItems;
    if (length) {
      msg = (tmp.length + 1).toString() + '/' + length.toString();
    }
    else {
      msg = (tmp.length + 1).toString();
    }
    msg += delim;
    raw.push(prompt.colors ? msg.grey : msg);
  }

  //
  // Calculate the raw length and colorize the prompt
  //
  length = raw.join('').length;
  raw[0] = raw[0];
  msg = raw.join('');

  if (schema.help) {
    schema.help.forEach(function (line) {
      logger.help(line);
    });
  }

  //
  // Emit a "prompting" event
  //
  prompt.emit('prompt', prop);

  //
  // If there is no default line, set it to an empty string
  //
  if(typeof defaultLine === 'undefined') {
    defaultLine = '';
  }

  //
  // set to string for readline ( will not accept Numbers )
  //
  defaultLine = defaultLine.toString();

  //
  // Make the actual read
  //
  read({
    prompt: msg,
    silent: prop.schema && prop.schema.hidden,
    default: defaultLine,
    input: stdin,
    output: stdout
  }, function (err, line) {
    if (err && wait === false) {
      return callback(err);
    }

    var against = {},
        numericInput,
        isValid;

    if (line !== '') {

      if (schema.properties[propName]) {
        var type = (schema.properties[propName].type || '').toLowerCase().trim() || undefined;

        //
        // Attempt to parse input as a float if the schema expects a number.
        //
        if (type == 'number') {
          numericInput = parseFloat(line, 10);
          if (!isNaN(numericInput)) {
            line = numericInput;
          }
        }

        //
        // Attempt to parse input as a boolean if the schema expects a boolean
        //
        if (type == 'boolean') {
          if(line === "true") {
            line = true;
          }
          if(line === "false") {
            line = false;
          }
        }

        //
        // If the type is an array, wait for the end. Fixes #54
        //
        if (type == 'array') {
          var length = prop.schema.maxItems;
          if (err) {
            if (err.message == 'canceled') {
              wait = false;
              stdout.write('\n');
            }
          }
          else {
            if (length) {
              if (tmp.length + 1 < length) {
                isValid = false;
                wait = true;
              }
              else {
                isValid = true;
                wait = false;
              }
            }
            else {
              isValid = false;
              wait = true;
            }
            tmp.push(line);
          }
          line = tmp;
        }
      }

      against[propName] = line;
    }

    if (prop && prop.schema.before) {
      line = prop.schema.before(line);
    }

    // Validate
    if (isValid === undefined) isValid = prompt._performValidation(name, prop, against, schema, line, callback);

    if (!isValid) {
      return prompt.getInput(prop, callback);
    }

    //
    // Append this `property:value` pair to the history for `prompt`
    // and respond to the callback.
    //
    prompt._remember(propName, line);
    callback(null, line);

    // Make sure `tmp` is emptied
    tmp = [];
  });
};

//
// ### function performValidation (name, prop, against, schema, line, callback)
// #### @name {Object} Variable name
// #### @prop {Object|string} Variable to get input for.
// #### @against {Object} Input
// #### @schema {Object} Validation schema
// #### @line {String|Boolean} Input line
// #### @callback {function} Continuation to pass control to when complete.
// Perfoms user input validation, print errors if needed and returns value according to validation
//
prompt._performValidation = function (name, prop, against, schema, line, callback) {
  var numericInput, valid, msg;

  try {
    valid = validate(against, schema);
  }
  catch (err) {
    return (line !== -1) ? callback(err) : false;
  }

  if (!valid.valid) {
    msg = line !== -1 ? 'Invalid input for ' : 'Invalid command-line input for ';

    if (prompt.colors) {
      logger.error(msg + name.grey);
    }
    else {
      logger.error(msg + name);
    }

    if (prop.schema.message) {
      logger.error(prop.schema.message);
    }

    prompt.emit('invalid', prop, line);
  }

  return valid.valid;
};

//
// ### function addProperties (obj, properties, callback)
// #### @obj {Object} Object to add properties to
// #### @properties {Array} List of properties to get values for
// #### @callback {function} Continuation to pass control to when complete.
// Prompts the user for values each of the `properties` if `obj` does not already
// have a value for the property. Responds with the modified object.
//
prompt.addProperties = function (obj, properties, callback) {
  properties = properties.filter(function (prop) {
    return typeof obj[prop] === 'undefined';
  });

  if (properties.length === 0) {
    return callback(obj);
  }

  prompt.get(properties, function (err, results) {
    if (err) {
      return callback(err);
    }
    else if (!results) {
      return callback(null, obj);
    }

    function putNested (obj, path, value) {
      var last = obj, key;

      while (path.length > 1) {
        key = path.shift();
        if (!last[key]) {
          last[key] = {};
        }

        last = last[key];
      }

      last[path.shift()] = value;
    }

    Object.keys(results).forEach(function (key) {
      putNested(obj, key.split('.'), results[key]);
    });

    callback(null, obj);
  });

  return prompt;
};

//
// ### @private function _remember (property, value)
// #### @property {Object|string} Property that the value is in response to.
// #### @value {string} User input captured by `prompt`.
// Prepends the `property:value` pair into the private `history` Array
// for `prompt` so that it can be accessed later.
//
prompt._remember = function (property, value) {
  history.unshift({
    property: property,
    value: value
  });

  //
  // If the length of the `history` Array
  // has exceeded the specified length to remember,
  // `prompt.memory`, truncate it.
  //
  if (history.length > prompt.memory) {
    history.splice(prompt.memory, history.length - prompt.memory);
  }
};

//
// ### @private function convert (schema)
// #### @schema {Object} Schema for a property
// Converts the schema into new format if it is in old format
//
function convert(schema) {
  var newProps = Object.keys(validate.messages),
      newSchema = false,
      key;

  newProps = newProps.concat(['description', 'dependencies']);

  for (key in schema) {
    if (newProps.indexOf(key) > 0) {
      newSchema = true;
      break;
    }
  }

  if (!newSchema || schema.validator || schema.warning || typeof schema.empty !== 'undefined') {
    schema.description = schema.message;
    schema.message = schema.warning;

    if (typeof schema.validator === 'function') {
      schema.conform = schema.validator;
    } else {
      schema.pattern = schema.validator;
    }

    if (typeof schema.empty !== 'undefined') {
      schema.required = !(schema.empty);
    }

    delete schema.warning;
    delete schema.validator;
    delete schema.empty;
  }

  return schema;
}

//
// The only piece of utile I need
//
// ### function mixin (target [source0, source1, ...])
// Copies enumerable properties from `source0 ... sourceN`
// onto `target` and returns the resulting object.
//
function mixin(target) {
  [].slice.call(arguments, 1).forEach(function (o) {
    Object.getOwnPropertyNames(o).forEach(function(attr) {
      var getter = Object.getOwnPropertyDescriptor(o, attr).get,
          setter = Object.getOwnPropertyDescriptor(o, attr).set;

      if (!getter && !setter) {
        target[attr] = o[attr];
      }
      else {
        Object.defineProperty(target, attr, {
          get: getter,
          set: setter
        });
      }
    });
  });

  return target;
};


/***/ }),
/* 2 */
/* unknown exports provided */
/* all exports used */
/*!****************************!*\
  !*** ./~/semver/semver.js ***!
  \****************************/
/***/ (function(module, exports) {

exports = module.exports = SemVer

var debug
/* istanbul ignore next */
if (typeof process === 'object' &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift('SEMVER')
    console.log.apply(console, args)
  }
} else {
  debug = function () {}
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0'

var MAX_LENGTH = 256
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16

// The actual regexps go on exports.re
var re = exports.re = []
var src = exports.src = []
var R = 0

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

var NUMERICIDENTIFIER = R++
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*'
var NUMERICIDENTIFIERLOOSE = R++
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+'

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

var NONNUMERICIDENTIFIER = R++
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'

// ## Main Version
// Three dot-separated numeric identifiers.

var MAINVERSION = R++
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')'

var MAINVERSIONLOOSE = R++
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')'

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

var PRERELEASEIDENTIFIER = R++
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                            '|' + src[NONNUMERICIDENTIFIER] + ')'

var PRERELEASEIDENTIFIERLOOSE = R++
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[NONNUMERICIDENTIFIER] + ')'

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

var PRERELEASE = R++
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))'

var PRERELEASELOOSE = R++
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))'

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

var BUILDIDENTIFIER = R++
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+'

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

var BUILD = R++
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))'

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

var FULL = R++
var FULLPLAIN = 'v?' + src[MAINVERSION] +
                src[PRERELEASE] + '?' +
                src[BUILD] + '?'

src[FULL] = '^' + FULLPLAIN + '$'

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                 src[PRERELEASELOOSE] + '?' +
                 src[BUILD] + '?'

var LOOSE = R++
src[LOOSE] = '^' + LOOSEPLAIN + '$'

var GTLT = R++
src[GTLT] = '((?:<|>)?=?)'

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
var XRANGEIDENTIFIERLOOSE = R++
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
var XRANGEIDENTIFIER = R++
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*'

var XRANGEPLAIN = R++
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[PRERELEASE] + ')?' +
                   src[BUILD] + '?' +
                   ')?)?'

var XRANGEPLAINLOOSE = R++
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[PRERELEASELOOSE] + ')?' +
                        src[BUILD] + '?' +
                        ')?)?'

var XRANGE = R++
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$'
var XRANGELOOSE = R++
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$'

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
var COERCE = R++
src[COERCE] = '(?:^|[^\\d])' +
              '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:$|[^\\d])'

// Tilde ranges.
// Meaning is "reasonably at or greater than"
var LONETILDE = R++
src[LONETILDE] = '(?:~>?)'

var TILDETRIM = R++
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+'
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g')
var tildeTrimReplace = '$1~'

var TILDE = R++
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$'
var TILDELOOSE = R++
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$'

// Caret ranges.
// Meaning is "at least and backwards compatible with"
var LONECARET = R++
src[LONECARET] = '(?:\\^)'

var CARETTRIM = R++
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+'
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g')
var caretTrimReplace = '$1^'

var CARET = R++
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$'
var CARETLOOSE = R++
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$'

// A simple gt/lt/eq thing, or just "" to indicate "any version"
var COMPARATORLOOSE = R++
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$'
var COMPARATOR = R++
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$'

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
var COMPARATORTRIM = R++
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')'

// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g')
var comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
var HYPHENRANGE = R++
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[XRANGEPLAIN] + ')' +
                   '\\s*$'

var HYPHENRANGELOOSE = R++
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s*$'

// Star ranges basically just allow anything at all.
var STAR = R++
src[STAR] = '(<|>)?=?\\s*\\*'

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i])
  if (!re[i]) {
    re[i] = new RegExp(src[i])
  }
}

exports.parse = parse
function parse (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  var r = options.loose ? re[LOOSE] : re[FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

exports.valid = valid
function valid (version, options) {
  var v = parse(version, options)
  return v ? v.version : null
}

exports.clean = clean
function clean (version, options) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}

exports.SemVer = SemVer

function SemVer (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }
  if (version instanceof SemVer) {
    if (version.loose === options.loose) {
      return version
    } else {
      version = version.version
    }
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version)
  }

  if (version.length > MAX_LENGTH) {
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
  }

  if (!(this instanceof SemVer)) {
    return new SemVer(version, options)
  }

  debug('SemVer', version, options)
  this.options = options
  this.loose = !!options.loose

  var m = version.trim().match(options.loose ? re[LOOSE] : re[FULL])

  if (!m) {
    throw new TypeError('Invalid Version: ' + version)
  }

  this.raw = version

  // these are actually numbers
  this.major = +m[1]
  this.minor = +m[2]
  this.patch = +m[3]

  if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
    throw new TypeError('Invalid major version')
  }

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
    throw new TypeError('Invalid minor version')
  }

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
    throw new TypeError('Invalid patch version')
  }

  // numberify any prerelease numeric ids
  if (!m[4]) {
    this.prerelease = []
  } else {
    this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id
        if (num >= 0 && num < MAX_SAFE_INTEGER) {
          return num
        }
      }
      return id
    })
  }

  this.build = m[5] ? m[5].split('.') : []
  this.format()
}

SemVer.prototype.format = function () {
  this.version = this.major + '.' + this.minor + '.' + this.patch
  if (this.prerelease.length) {
    this.version += '-' + this.prerelease.join('.')
  }
  return this.version
}

SemVer.prototype.toString = function () {
  return this.version
}

SemVer.prototype.compare = function (other) {
  debug('SemVer.compare', this.version, this.options, other)
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return this.compareMain(other) || this.comparePre(other)
}

SemVer.prototype.compareMain = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch)
}

SemVer.prototype.comparePre = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length) {
    return -1
  } else if (!this.prerelease.length && other.prerelease.length) {
    return 1
  } else if (!this.prerelease.length && !other.prerelease.length) {
    return 0
  }

  var i = 0
  do {
    var a = this.prerelease[i]
    var b = other.prerelease[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function (release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor = 0
      this.major++
      this.inc('pre', identifier)
      break
    case 'preminor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor++
      this.inc('pre', identifier)
      break
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0
      this.inc('patch', identifier)
      this.inc('pre', identifier)
      break
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier)
      }
      this.inc('pre', identifier)
      break

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0) {
        this.major++
      }
      this.minor = 0
      this.patch = 0
      this.prerelease = []
      break
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++
      }
      this.patch = 0
      this.prerelease = []
      break
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++
      }
      this.prerelease = []
      break
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0) {
        this.prerelease = [0]
      } else {
        var i = this.prerelease.length
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++
            i = -2
          }
        }
        if (i === -1) {
          // didn't increment anything
          this.prerelease.push(0)
        }
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0]
          }
        } else {
          this.prerelease = [identifier, 0]
        }
      }
      break

    default:
      throw new Error('invalid increment argument: ' + release)
  }
  this.format()
  this.raw = this.version
  return this
}

exports.inc = inc
function inc (version, release, loose, identifier) {
  if (typeof (loose) === 'string') {
    identifier = loose
    loose = undefined
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version
  } catch (er) {
    return null
  }
}

exports.diff = diff
function diff (version1, version2) {
  if (eq(version1, version2)) {
    return null
  } else {
    var v1 = parse(version1)
    var v2 = parse(version2)
    var prefix = ''
    if (v1.prerelease.length || v2.prerelease.length) {
      prefix = 'pre'
      var defaultResult = 'prerelease'
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}

exports.compareIdentifiers = compareIdentifiers

var numeric = /^[0-9]+$/
function compareIdentifiers (a, b) {
  var anum = numeric.test(a)
  var bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

exports.rcompareIdentifiers = rcompareIdentifiers
function rcompareIdentifiers (a, b) {
  return compareIdentifiers(b, a)
}

exports.major = major
function major (a, loose) {
  return new SemVer(a, loose).major
}

exports.minor = minor
function minor (a, loose) {
  return new SemVer(a, loose).minor
}

exports.patch = patch
function patch (a, loose) {
  return new SemVer(a, loose).patch
}

exports.compare = compare
function compare (a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose))
}

exports.compareLoose = compareLoose
function compareLoose (a, b) {
  return compare(a, b, true)
}

exports.rcompare = rcompare
function rcompare (a, b, loose) {
  return compare(b, a, loose)
}

exports.sort = sort
function sort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compare(a, b, loose)
  })
}

exports.rsort = rsort
function rsort (list, loose) {
  return list.sort(function (a, b) {
    return exports.rcompare(a, b, loose)
  })
}

exports.gt = gt
function gt (a, b, loose) {
  return compare(a, b, loose) > 0
}

exports.lt = lt
function lt (a, b, loose) {
  return compare(a, b, loose) < 0
}

exports.eq = eq
function eq (a, b, loose) {
  return compare(a, b, loose) === 0
}

exports.neq = neq
function neq (a, b, loose) {
  return compare(a, b, loose) !== 0
}

exports.gte = gte
function gte (a, b, loose) {
  return compare(a, b, loose) >= 0
}

exports.lte = lte
function lte (a, b, loose) {
  return compare(a, b, loose) <= 0
}

exports.cmp = cmp
function cmp (a, op, b, loose) {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError('Invalid operator: ' + op)
  }
}

exports.Comparator = Comparator
function Comparator (comp, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (comp instanceof Comparator) {
    if (comp.loose === !!options.loose) {
      return comp
    } else {
      comp = comp.value
    }
  }

  if (!(this instanceof Comparator)) {
    return new Comparator(comp, options)
  }

  debug('comparator', comp, options)
  this.options = options
  this.loose = !!options.loose
  this.parse(comp)

  if (this.semver === ANY) {
    this.value = ''
  } else {
    this.value = this.operator + this.semver.version
  }

  debug('comp', this)
}

var ANY = {}
Comparator.prototype.parse = function (comp) {
  var r = this.options.loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
  var m = comp.match(r)

  if (!m) {
    throw new TypeError('Invalid comparator: ' + comp)
  }

  this.operator = m[1]
  if (this.operator === '=') {
    this.operator = ''
  }

  // if it literally is just '>' or '' then allow anything.
  if (!m[2]) {
    this.semver = ANY
  } else {
    this.semver = new SemVer(m[2], this.options.loose)
  }
}

Comparator.prototype.toString = function () {
  return this.value
}

Comparator.prototype.test = function (version) {
  debug('Comparator.test', version, this.options.loose)

  if (this.semver === ANY) {
    return true
  }

  if (typeof version === 'string') {
    version = new SemVer(version, this.options)
  }

  return cmp(version, this.operator, this.semver, this.options)
}

Comparator.prototype.intersects = function (comp, options) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required')
  }

  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  var rangeTmp

  if (this.operator === '') {
    rangeTmp = new Range(comp.value, options)
    return satisfies(this.value, rangeTmp, options)
  } else if (comp.operator === '') {
    rangeTmp = new Range(this.value, options)
    return satisfies(comp.semver, rangeTmp, options)
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>')
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<')
  var sameSemVer = this.semver.version === comp.semver.version
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=')
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, options) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'))
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, options) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'))

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
}

exports.Range = Range
function Range (range, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (range instanceof Range) {
    if (range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease) {
      return range
    } else {
      return new Range(range.raw, options)
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, options)
  }

  if (!(this instanceof Range)) {
    return new Range(range, options)
  }

  this.options = options
  this.loose = !!options.loose
  this.includePrerelease = !!options.includePrerelease

  // First, split based on boolean or ||
  this.raw = range
  this.set = range.split(/\s*\|\|\s*/).map(function (range) {
    return this.parseRange(range.trim())
  }, this).filter(function (c) {
    // throw out any that are not relevant for whatever reason
    return c.length
  })

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range)
  }

  this.format()
}

Range.prototype.format = function () {
  this.range = this.set.map(function (comps) {
    return comps.join(' ').trim()
  }).join('||').trim()
  return this.range
}

Range.prototype.toString = function () {
  return this.range
}

Range.prototype.parseRange = function (range) {
  var loose = this.options.loose
  range = range.trim()
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE]
  range = range.replace(hr, hyphenReplace)
  debug('hyphen replace', range)
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace)
  debug('comparator trim', range, re[COMPARATORTRIM])

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[TILDETRIM], tildeTrimReplace)

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[CARETTRIM], caretTrimReplace)

  // normalize spaces
  range = range.split(/\s+/).join(' ')

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
  var set = range.split(' ').map(function (comp) {
    return parseComparator(comp, this.options)
  }, this).join(' ').split(/\s+/)
  if (this.options.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function (comp) {
      return !!comp.match(compRe)
    })
  }
  set = set.map(function (comp) {
    return new Comparator(comp, this.options)
  }, this)

  return set
}

Range.prototype.intersects = function (range, options) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required')
  }

  return this.set.some(function (thisComparators) {
    return thisComparators.every(function (thisComparator) {
      return range.set.some(function (rangeComparators) {
        return rangeComparators.every(function (rangeComparator) {
          return thisComparator.intersects(rangeComparator, options)
        })
      })
    })
  })
}

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators
function toComparators (range, options) {
  return new Range(range, options).set.map(function (comp) {
    return comp.map(function (c) {
      return c.value
    }).join(' ').trim().split(' ')
  })
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator (comp, options) {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

function isX (id) {
  return !id || id.toLowerCase() === 'x' || id === '*'
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceTilde(comp, options)
  }).join(' ')
}

function replaceTilde (comp, options) {
  var r = options.loose ? re[TILDELOOSE] : re[TILDE]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
            ' <' + M + '.' + (+m + 1) + '.0'
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0'
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceCaret(comp, options)
  }).join(' ')
}

function replaceCaret (comp, options) {
  debug('caret', comp, options)
  var r = options.loose ? re[CARETLOOSE] : re[CARET]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0'
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
              ' <' + (+M + 1) + '.0.0'
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0'
      }
    }

    debug('caret return', ret)
    return ret
  })
}

function replaceXRanges (comp, options) {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map(function (comp) {
    return replaceXRange(comp, options)
  }).join(' ')
}

function replaceXRange (comp, options) {
  comp = comp.trim()
  var r = options.loose ? re[XRANGELOOSE] : re[XRANGE]
  return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    var xM = isX(M)
    var xm = xM || isX(m)
    var xp = xm || isX(p)
    var anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      ret = gtlt + M + '.' + m + '.' + p
    } else if (xm) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars (comp, options) {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[STAR], '')
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0'
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0'
  } else {
    from = '>=' + from
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0'
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0'
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr
  } else {
    to = '<=' + to
  }

  return (from + ' ' + to).trim()
}

// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function (version) {
  if (!version) {
    return false
  }

  if (typeof version === 'string') {
    version = new SemVer(version, this.options)
  }

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version, this.options)) {
      return true
    }
  }
  return false
}

function testSet (set, version, options) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}

exports.satisfies = satisfies
function satisfies (version, range, options) {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}

exports.maxSatisfying = maxSatisfying
function maxSatisfying (versions, range, options) {
  var max = null
  var maxSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}

exports.minSatisfying = minSatisfying
function minSatisfying (versions, range, options) {
  var min = null
  var minSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}

exports.minVersion = minVersion
function minVersion (range, loose) {
  range = new Range(range, loose)

  var minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    comparators.forEach(function (comparator) {
      // Clone to avoid manipulating the comparator's semver object.
      var compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error('Unexpected operation: ' + comparator.operator)
      }
    })
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}

exports.validRange = validRange
function validRange (range, options) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr
function ltr (version, range, options) {
  return outside(version, range, '<', options)
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr
function gtr (version, range, options) {
  return outside(version, range, '>', options)
}

exports.outside = outside
function outside (version, range, hilo, options) {
  version = new SemVer(version, options)
  range = new Range(range, options)

  var gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    var high = null
    var low = null

    comparators.forEach(function (comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

exports.prerelease = prerelease
function prerelease (version, options) {
  var parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}

exports.intersects = intersects
function intersects (r1, r2, options) {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}

exports.coerce = coerce
function coerce (version) {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  var match = version.match(re[COERCE])

  if (match == null) {
    return null
  }

  return parse(match[1] +
    '.' + (match[2] || '0') +
    '.' + (match[3] || '0'))
}


/***/ }),
/* 3 */
/* unknown exports provided */
/* all exports used */
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 4 */
/* unknown exports provided */
/* all exports used */
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 5 */
/* unknown exports provided */
/* all exports used */
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 6 */
/* unknown exports provided */
/* all exports used */
/*!**************************!*\
  !*** ./~/async/index.js ***!
  \**************************/
/***/ (function(module, exports, __webpack_require__) {

// This file is just added for convenience so this repository can be
// directly checked out into a project's deps folder
module.exports = __webpack_require__(/*! ./lib/async */ 7);


/***/ }),
/* 7 */
/* unknown exports provided */
/* all exports used */
/*!******************************!*\
  !*** ./~/async/lib/async.js ***!
  \******************************/
/***/ (function(module, exports) {

/*global setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root = this,
        previous_async = root.async;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    else {
        root.async = async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    //// cross-browser compatiblity functions ////

    var _forEach = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _forEach(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _forEach(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        async.nextTick = function (fn) {
            setTimeout(fn, 0);
        };
    }
    else {
        async.nextTick = process.nextTick;
    }

    async.forEach = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _forEach(arr, function (x) {
            iterator(x, function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed === arr.length) {
                        callback(null);
                    }
                }
            });
        });
    };

    async.forEachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed === arr.length) {
                        callback(null);
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };

    async.forEachLimit = function (arr, limit, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length || limit <= 0) {
            return callback();
        }
        var completed = 0;
        var started = 0;
        var running = 0;

        (function replenish () {
            if (completed === arr.length) {
                return callback();
            }

            while (running < limit && started < arr.length) {
                started += 1;
                running += 1;
                iterator(arr[started - 1], function (err) {
                    if (err) {
                        callback(err);
                        callback = function () {};
                    }
                    else {
                        completed += 1;
                        running -= 1;
                        if (completed === arr.length) {
                            callback();
                        }
                        else {
                            replenish();
                        }
                    }
                });
            }
        })();
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.forEach].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.forEachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);


    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.forEachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.forEach(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.forEach(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        if (!keys.length) {
            return callback(null);
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            _forEach(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (_keys(results).length === keys.length) {
                callback(null, results);
                callback = function () {};
            }
        });

        _forEach(keys, function (k) {
            var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
            var taskCallback = function (err) {
                if (err) {
                    callback(err);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    taskComplete();
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.nextTick(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    async.parallel = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            async.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.forEach(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.forEachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.queue = function (worker, concurrency) {
        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
                if(data.constructor !== Array) {
                    data = [data];
                }
                _forEach(data, function(task) {
                    q.tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    if (q.saturated && q.tasks.length == concurrency) {
                        q.saturated();
                    }
                    async.nextTick(q.process);
                });
            },
            process: function () {
                if (workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if(q.empty && q.tasks.length == 0) q.empty();
                    workers += 1;
                    worker(task.data, function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if(q.drain && q.tasks.length + workers == 0) q.drain();
                        q.process();
                    });
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            }
        };
        return q;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _forEach(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                callback.apply(null, memo[key]);
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

}());


/***/ }),
/* 8 */
/* unknown exports provided */
/* all exports used */
/*!******************!*\
  !*** ./~/colors ***!
  \******************/
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 8;


/***/ }),
/* 9 */
/* unknown exports provided */
/* all exports used */
/*!****************************!*\
  !*** ./~/colors/colors.js ***!
  \****************************/
/***/ (function(module, exports, __webpack_require__) {

/*
colors.js

Copyright (c) 2010

Marak Squires
Alexis Sellier (cloudhead)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var isHeadless = false;

if (true) {
  isHeadless = true;
}

if (!isHeadless) {
  var exports = {};
  var module = {};
  var colors = exports;
  exports.mode = "browser";
} else {
  exports.mode = "console";
}

//
// Prototypes the string object to have additional method calls that add terminal colors
//
var addProperty = function (color, func) {
  exports[color] = function (str) {
    return func.apply(str);
  };
  String.prototype.__defineGetter__(color, func);
};

function stylize(str, style) {

  var styles;

  if (exports.mode === 'console') {
    styles = {
      //styles
      'bold'      : ['\x1B[1m',  '\x1B[22m'],
      'italic'    : ['\x1B[3m',  '\x1B[23m'],
      'underline' : ['\x1B[4m',  '\x1B[24m'],
      'inverse'   : ['\x1B[7m',  '\x1B[27m'],
      'strikethrough' : ['\x1B[9m',  '\x1B[29m'],
      //text colors
      //grayscale
      'white'     : ['\x1B[37m', '\x1B[39m'],
      'grey'      : ['\x1B[90m', '\x1B[39m'],
      'black'     : ['\x1B[30m', '\x1B[39m'],
      //colors
      'blue'      : ['\x1B[34m', '\x1B[39m'],
      'cyan'      : ['\x1B[36m', '\x1B[39m'],
      'green'     : ['\x1B[32m', '\x1B[39m'],
      'magenta'   : ['\x1B[35m', '\x1B[39m'],
      'red'       : ['\x1B[31m', '\x1B[39m'],
      'yellow'    : ['\x1B[33m', '\x1B[39m'],
      //background colors
      //grayscale
      'whiteBG'     : ['\x1B[47m', '\x1B[49m'],
      'greyBG'      : ['\x1B[49;5;8m', '\x1B[49m'],
      'blackBG'     : ['\x1B[40m', '\x1B[49m'],
      //colors
      'blueBG'      : ['\x1B[44m', '\x1B[49m'],
      'cyanBG'      : ['\x1B[46m', '\x1B[49m'],
      'greenBG'     : ['\x1B[42m', '\x1B[49m'],
      'magentaBG'   : ['\x1B[45m', '\x1B[49m'],
      'redBG'       : ['\x1B[41m', '\x1B[49m'],
      'yellowBG'    : ['\x1B[43m', '\x1B[49m']
    };
  } else if (exports.mode === 'browser') {
    styles = {
      //styles
      'bold'      : ['<b>',  '</b>'],
      'italic'    : ['<i>',  '</i>'],
      'underline' : ['<u>',  '</u>'],
      'inverse'   : ['<span style="background-color:black;color:white;">',  '</span>'],
      'strikethrough' : ['<del>',  '</del>'],
      //text colors
      //grayscale
      'white'     : ['<span style="color:white;">',   '</span>'],
      'grey'      : ['<span style="color:gray;">',    '</span>'],
      'black'     : ['<span style="color:black;">',   '</span>'],
      //colors
      'blue'      : ['<span style="color:blue;">',    '</span>'],
      'cyan'      : ['<span style="color:cyan;">',    '</span>'],
      'green'     : ['<span style="color:green;">',   '</span>'],
      'magenta'   : ['<span style="color:magenta;">', '</span>'],
      'red'       : ['<span style="color:red;">',     '</span>'],
      'yellow'    : ['<span style="color:yellow;">',  '</span>'],
      //background colors
      //grayscale
      'whiteBG'     : ['<span style="background-color:white;">',   '</span>'],
      'greyBG'      : ['<span style="background-color:gray;">',    '</span>'],
      'blackBG'     : ['<span style="background-color:black;">',   '</span>'],
      //colors
      'blueBG'      : ['<span style="background-color:blue;">',    '</span>'],
      'cyanBG'      : ['<span style="background-color:cyan;">',    '</span>'],
      'greenBG'     : ['<span style="background-color:green;">',   '</span>'],
      'magentaBG'   : ['<span style="background-color:magenta;">', '</span>'],
      'redBG'       : ['<span style="background-color:red;">',     '</span>'],
      'yellowBG'    : ['<span style="background-color:yellow;">',  '</span>']
    };
  } else if (exports.mode === 'none') {
    return str + '';
  } else {
    console.log('unsupported mode, try "browser", "console" or "none"');
  }
  return styles[style][0] + str + styles[style][1];
}

function applyTheme(theme) {

  //
  // Remark: This is a list of methods that exist
  // on String that you should not overwrite.
  //
  var stringPrototypeBlacklist = [
    '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__', 'charAt', 'constructor',
    'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf', 'charCodeAt',
    'indexOf', 'lastIndexof', 'length', 'localeCompare', 'match', 'replace', 'search', 'slice', 'split', 'substring',
    'toLocaleLowerCase', 'toLocaleUpperCase', 'toLowerCase', 'toUpperCase', 'trim', 'trimLeft', 'trimRight'
  ];

  Object.keys(theme).forEach(function (prop) {
    if (stringPrototypeBlacklist.indexOf(prop) !== -1) {
      console.log('warn: '.red + ('String.prototype' + prop).magenta + ' is probably something you don\'t want to override. Ignoring style name');
    }
    else {
      if (typeof(theme[prop]) === 'string') {
        addProperty(prop, function () {
          return exports[theme[prop]](this);
        });
      }
      else {
        addProperty(prop, function () {
          var ret = this;
          for (var t = 0; t < theme[prop].length; t++) {
            ret = exports[theme[prop][t]](ret);
          }
          return ret;
        });
      }
    }
  });
}


//
// Iterate through all default styles and colors
//
var x = ['bold', 'underline', 'strikethrough', 'italic', 'inverse', 'grey', 'black', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta', 'greyBG', 'blackBG', 'yellowBG', 'redBG', 'greenBG', 'blueBG', 'whiteBG', 'cyanBG', 'magentaBG'];
x.forEach(function (style) {

  // __defineGetter__ at the least works in more browsers
  // http://robertnyman.com/javascript/javascript-getters-setters.html
  // Object.defineProperty only works in Chrome
  addProperty(style, function () {
    return stylize(this, style);
  });
});

function sequencer(map) {
  return function () {
    if (!isHeadless) {
      return this.replace(/( )/, '$1');
    }
    var exploded = this.split(""), i = 0;
    exploded = exploded.map(map);
    return exploded.join("");
  };
}

var rainbowMap = (function () {
  var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta']; //RoY G BiV
  return function (letter, i, exploded) {
    if (letter === " ") {
      return letter;
    } else {
      return stylize(letter, rainbowColors[i++ % rainbowColors.length]);
    }
  };
})();

exports.themes = {};

exports.addSequencer = function (name, map) {
  addProperty(name, sequencer(map));
};

exports.addSequencer('rainbow', rainbowMap);
exports.addSequencer('zebra', function (letter, i, exploded) {
  return i % 2 === 0 ? letter : letter.inverse;
});

exports.setTheme = function (theme) {
  if (typeof theme === 'string') {
    try {
      exports.themes[theme] = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND';; throw e; }());
      applyTheme(exports.themes[theme]);
      return exports.themes[theme];
    } catch (err) {
      console.log(err);
      return err;
    }
  } else {
    applyTheme(theme);
  }
};


addProperty('stripColors', function () {
  return ("" + this).replace(/\x1B\[\d+m/g, '');
});

// please no
function zalgo(text, options) {
  var soul = {
    "up" : [
      '̍', '̎', '̄', '̅',
      '̿', '̑', '̆', '̐',
      '͒', '͗', '͑', '̇',
      '̈', '̊', '͂', '̓',
      '̈', '͊', '͋', '͌',
      '̃', '̂', '̌', '͐',
      '̀', '́', '̋', '̏',
      '̒', '̓', '̔', '̽',
      '̉', 'ͣ', 'ͤ', 'ͥ',
      'ͦ', 'ͧ', 'ͨ', 'ͩ',
      'ͪ', 'ͫ', 'ͬ', 'ͭ',
      'ͮ', 'ͯ', '̾', '͛',
      '͆', '̚'
    ],
    "down" : [
      '̖', '̗', '̘', '̙',
      '̜', '̝', '̞', '̟',
      '̠', '̤', '̥', '̦',
      '̩', '̪', '̫', '̬',
      '̭', '̮', '̯', '̰',
      '̱', '̲', '̳', '̹',
      '̺', '̻', '̼', 'ͅ',
      '͇', '͈', '͉', '͍',
      '͎', '͓', '͔', '͕',
      '͖', '͙', '͚', '̣'
    ],
    "mid" : [
      '̕', '̛', '̀', '́',
      '͘', '̡', '̢', '̧',
      '̨', '̴', '̵', '̶',
      '͜', '͝', '͞',
      '͟', '͠', '͢', '̸',
      '̷', '͡', ' ҉'
    ]
  },
  all = [].concat(soul.up, soul.down, soul.mid),
  zalgo = {};

  function randomNumber(range) {
    var r = Math.floor(Math.random() * range);
    return r;
  }

  function is_char(character) {
    var bool = false;
    all.filter(function (i) {
      bool = (i === character);
    });
    return bool;
  }

  function heComes(text, options) {
    var result = '', counts, l;
    options = options || {};
    options["up"] = options["up"] || true;
    options["mid"] = options["mid"] || true;
    options["down"] = options["down"] || true;
    options["size"] = options["size"] || "maxi";
    text = text.split('');
    for (l in text) {
      if (is_char(l)) {
        continue;
      }
      result = result + text[l];
      counts = {"up" : 0, "down" : 0, "mid" : 0};
      switch (options.size) {
      case 'mini':
        counts.up = randomNumber(8);
        counts.min = randomNumber(2);
        counts.down = randomNumber(8);
        break;
      case 'maxi':
        counts.up = randomNumber(16) + 3;
        counts.min = randomNumber(4) + 1;
        counts.down = randomNumber(64) + 3;
        break;
      default:
        counts.up = randomNumber(8) + 1;
        counts.mid = randomNumber(6) / 2;
        counts.down = randomNumber(8) + 1;
        break;
      }

      var arr = ["up", "mid", "down"];
      for (var d in arr) {
        var index = arr[d];
        for (var i = 0 ; i <= counts[index]; i++) {
          if (options[index]) {
            result = result + soul[index][randomNumber(soul[index].length)];
          }
        }
      }
    }
    return result;
  }
  return heComes(text);
}


// don't summon zalgo
addProperty('zalgo', function () {
  return zalgo(this);
});


/***/ }),
/* 10 */
/* unknown exports provided */
/* all exports used */
/*!*******************************!*\
  !*** ./~/mute-stream/mute.js ***!
  \*******************************/
/***/ (function(module, exports, __webpack_require__) {

var Stream = __webpack_require__(/*! stream */ 15)

module.exports = MuteStream

// var out = new MuteStream(process.stdout)
// argument auto-pipes
function MuteStream (opts) {
  Stream.apply(this)
  opts = opts || {}
  this.writable = this.readable = true
  this.muted = false
  this.on('pipe', this._onpipe)
  this.replace = opts.replace

  // For readline-type situations
  // This much at the start of a line being redrawn after a ctrl char
  // is seen (such as backspace) won't be redrawn as the replacement
  this._prompt = opts.prompt || null
  this._hadControl = false
}

MuteStream.prototype = Object.create(Stream.prototype)

Object.defineProperty(MuteStream.prototype, 'constructor', {
  value: MuteStream,
  enumerable: false
})

MuteStream.prototype.mute = function () {
  this.muted = true
}

MuteStream.prototype.unmute = function () {
  this.muted = false
}

Object.defineProperty(MuteStream.prototype, '_onpipe', {
  value: onPipe,
  enumerable: false,
  writable: true,
  configurable: true
})

function onPipe (src) {
  this._src = src
}

Object.defineProperty(MuteStream.prototype, 'isTTY', {
  get: getIsTTY,
  set: setIsTTY,
  enumerable: true,
  configurable: true
})

function getIsTTY () {
  return( (this._dest) ? this._dest.isTTY
        : (this._src) ? this._src.isTTY
        : false
        )
}

// basically just get replace the getter/setter with a regular value
function setIsTTY (isTTY) {
  Object.defineProperty(this, 'isTTY', {
    value: isTTY,
    enumerable: true,
    writable: true,
    configurable: true
  })
}

Object.defineProperty(MuteStream.prototype, 'rows', {
  get: function () {
    return( this._dest ? this._dest.rows
          : this._src ? this._src.rows
          : undefined )
  }, enumerable: true, configurable: true })

Object.defineProperty(MuteStream.prototype, 'columns', {
  get: function () {
    return( this._dest ? this._dest.columns
          : this._src ? this._src.columns
          : undefined )
  }, enumerable: true, configurable: true })


MuteStream.prototype.pipe = function (dest, options) {
  this._dest = dest
  return Stream.prototype.pipe.call(this, dest, options)
}

MuteStream.prototype.pause = function () {
  if (this._src) return this._src.pause()
}

MuteStream.prototype.resume = function () {
  if (this._src) return this._src.resume()
}

MuteStream.prototype.write = function (c) {
  if (this.muted) {
    if (!this.replace) return true
    if (c.match(/^\u001b/)) {
      if(c.indexOf(this._prompt) === 0) {
        c = c.substr(this._prompt.length);
        c = c.replace(/./g, this.replace);
        c = this._prompt + c;
      }
      this._hadControl = true
      return this.emit('data', c)
    } else {
      if (this._prompt && this._hadControl &&
          c.indexOf(this._prompt) === 0) {
        this._hadControl = false
        this.emit('data', this._prompt)
        c = c.substr(this._prompt.length)
      }
      c = c.toString().replace(/./g, this.replace)
    }
  }
  this.emit('data', c)
}

MuteStream.prototype.end = function (c) {
  if (this.muted) {
    if (c && this.replace) {
      c = c.toString().replace(/./g, this.replace)
    } else {
      c = null
    }
  }
  if (c) this.emit('data', c)
  this.emit('end')
}

function proxy (fn) { return function () {
  var d = this._dest
  var s = this._src
  if (d && d[fn]) d[fn].apply(d, arguments)
  if (s && s[fn]) s[fn].apply(s, arguments)
}}

MuteStream.prototype.destroy = proxy('destroy')
MuteStream.prototype.destroySoon = proxy('destroySoon')
MuteStream.prototype.close = proxy('close')


/***/ }),
/* 11 */
/* unknown exports provided */
/* all exports used */
/*!****************************!*\
  !*** ./~/read/lib/read.js ***!
  \****************************/
/***/ (function(module, exports, __webpack_require__) {


module.exports = read

var readline = __webpack_require__(/*! readline */ 0)
var Mute = __webpack_require__(/*! mute-stream */ 10)

function read (opts, cb) {
  if (opts.num) {
    throw new Error('read() no longer accepts a char number limit')
  }

  if (typeof opts.default !== 'undefined' &&
      typeof opts.default !== 'string' &&
      typeof opts.default !== 'number') {
    throw new Error('default value must be string or number')
  }

  var input = opts.input || process.stdin
  var output = opts.output || process.stdout
  var prompt = (opts.prompt || '').trim() + ' '
  var silent = opts.silent
  var editDef = false
  var timeout = opts.timeout

  var def = opts.default || ''
  if (def) {
    if (silent) {
      prompt += '(<default hidden>) '
    } else if (opts.edit) {
      editDef = true
    } else {
      prompt += '(' + def + ') '
    }
  }
  var terminal = !!(opts.terminal || output.isTTY)

  var m = new Mute({ replace: opts.replace, prompt: prompt })
  m.pipe(output, {end: false})
  output = m
  var rlOpts = { input: input, output: output, terminal: terminal }

  if (process.version.match(/^v0\.6/)) {
    var rl = readline.createInterface(rlOpts.input, rlOpts.output)
  } else {
    var rl = readline.createInterface(rlOpts)
  }


  output.unmute()
  rl.setPrompt(prompt)
  rl.prompt()
  if (silent) {
    output.mute()
  } else if (editDef) {
    rl.line = def
    rl.cursor = def.length
    rl._refreshLine()
  }

  var called = false
  rl.on('line', onLine)
  rl.on('error', onError)

  rl.on('SIGINT', function () {
    rl.close()
    onError(new Error('canceled'))
  })

  var timer
  if (timeout) {
    timer = setTimeout(function () {
      onError(new Error('timed out'))
    }, timeout)
  }

  function done () {
    called = true
    rl.close()

    if (process.version.match(/^v0\.6/)) {
      rl.input.removeAllListeners('data')
      rl.input.removeAllListeners('keypress')
      rl.input.pause()
    }

    clearTimeout(timer)
    output.mute()
    output.end()
  }

  function onError (er) {
    if (called) return
    done()
    return cb(er)
  }

  function onLine (line) {
    if (called) return
    if (silent && terminal) {
      output.unmute()
      output.write('\r\n')
    }
    done()
    // truncate the \n at the end.
    line = line.replace(/\r?\n$/, '')
    var isDefault = !!(editDef && line === def)
    if (def && !line) {
      isDefault = true
      line = def
    }
    cb(null, line, isDefault)
  }
}


/***/ }),
/* 12 */
/* unknown exports provided */
/* all exports used */
/*!******************************************!*\
  !*** ./~/revalidator/lib/revalidator.js ***!
  \******************************************/
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {(function (exports) {
  exports.validate = validate;
  exports.mixin = mixin;

  //
  // ### function validate (object, schema, options)
  // #### {Object} object the object to validate.
  // #### {Object} schema (optional) the JSON Schema to validate against.
  // #### {Object} options (optional) options controlling the validation
  //      process. See {@link #validate.defaults) for details.
  // Validate <code>object</code> against a JSON Schema.
  // If <code>object</code> is self-describing (i.e. has a
  // <code>$schema</code> property), it will also be validated
  // against the referenced schema. [TODO]: This behaviour bay be
  // suppressed by setting the {@link #validate.options.???}
  // option to <code>???</code>.[/TODO]
  //
  // If <code>schema</code> is not specified, and <code>object</code>
  // is not self-describing, validation always passes.
  //
  // <strong>Note:</strong> in order to pass options but no schema,
  // <code>schema</code> <em>must</em> be specified in the call to
  // <code>validate()</code>; otherwise, <code>options</code> will
  // be interpreted as the schema. <code>schema</code> may be passed
  // as <code>null</code>, <code>undefinded</code>, or the empty object
  // (<code>{}</code>) in this case.
  //
  function validate(object, schema, options) {
    options = mixin({}, options, validate.defaults);
    var errors = [];

    validateObject(object, schema, options, errors);

    //
    // TODO: self-described validation
    // if (! options.selfDescribing) { ... }
    //

    return {
      valid: !(errors.length),
      errors: errors
    };
  };

  /**
   * Default validation options. Defaults can be overridden by
   * passing an 'options' hash to {@link #validate}. They can
   * also be set globally be changing the values in
   * <code>validate.defaults</code> directly.
   */
  validate.defaults = {
      /**
       * <p>
       * Enforce 'format' constraints.
       * </p><p>
       * <em>Default: <code>true</code></em>
       * </p>
       */
      validateFormats: true,
      /**
       * <p>
       * When {@link #validateFormats} is <code>true</code>,
       * treat unrecognized formats as validation errors.
       * </p><p>
       * <em>Default: <code>false</code></em>
       * </p>
       *
       * @see validation.formats for default supported formats.
       */
      validateFormatsStrict: false,
      /**
       * <p>
       * When {@link #validateFormats} is <code>true</code>,
       * also validate formats defined in {@link #validate.formatExtensions}.
       * </p><p>
       * <em>Default: <code>true</code></em>
       * </p>
       */
      validateFormatExtensions: true
  };

  /**
   * Default messages to include with validation errors.
   */
  validate.messages = {
      required:         "is required",
      allowEmpty:       "must not be empty",
      minLength:        "is too short (minimum is %{expected} characters)",
      maxLength:        "is too long (maximum is %{expected} characters)",
      pattern:          "invalid input",
      minimum:          "must be greater than or equal to %{expected}",
      maximum:          "must be less than or equal to %{expected}",
      exclusiveMinimum: "must be greater than %{expected}",
      exclusiveMaximum: "must be less than %{expected}",
      divisibleBy:      "must be divisible by %{expected}",
      minItems:         "must contain more than %{expected} items",
      maxItems:         "must contain less than %{expected} items",
      uniqueItems:      "must hold a unique set of values",
      format:           "is not a valid %{expected}",
      conform:          "must conform to given constraint",
      type:             "must be of %{expected} type"
  };
  validate.messages['enum'] = "must be present in given enumerator";

  /**
   *
   */
  validate.formats = {
    'email':          /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
    'ip-address':     /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i,
    'ipv6':           /^([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$/,
    'date-time':      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:.\d{1,3})?Z$/,
    'date':           /^\d{4}-\d{2}-\d{2}$/,
    'time':           /^\d{2}:\d{2}:\d{2}$/,
    'color':          /^#[a-z0-9]{6}|#[a-z0-9]{3}|(?:rgb\(\s*(?:[+-]?\d+%?)\s*,\s*(?:[+-]?\d+%?)\s*,\s*(?:[+-]?\d+%?)\s*\))aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow$/i,
    //'style':        (not supported)
    //'phone':        (not supported)
    //'uri':          (not supported)
    'host-name':      /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])/,
    'utc-millisec':   {
      test: function (value) {
        return typeof(value) === 'number' && value >= 0;
      }
    },
    'regex':          {
      test: function (value) {
        try { new RegExp(value) }
        catch (e) { return false }

        return true;
      }
    }
  };

  /**
   *
   */
  validate.formatExtensions = {
    'url': /^(https?|ftp|git):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
  };

  function mixin(obj) {
    var sources = Array.prototype.slice.call(arguments, 1);
    while (sources.length) {
      var source = sources.shift();
      if (!source) { continue }

      if (typeof(source) !== 'object') {
        throw new TypeError('mixin non-object');
      }

      for (var p in source) {
        if (source.hasOwnProperty(p)) {
          obj[p] = source[p];
        }
      }
    }

    return obj;
  };

  function validateObject(object, schema, options, errors) {
    var props, allProps = Object.keys(object),
        visitedProps = [];

    // see 5.2
    if (schema.properties) {
      props = schema.properties;
      for (var p in props) {
        if (props.hasOwnProperty(p)) {
          visitedProps.push(p);
          validateProperty(object, object[p], p, props[p], options, errors);
        }
      }
    }

    // see 5.3
    if (schema.patternProperties) {
      props = schema.patternProperties;
      for (var p in props) {
        if (props.hasOwnProperty(p)) {
          var re = new RegExp(p);

          // Find all object properties that are matching `re`
          for (var k in object) {
            if (object.hasOwnProperty(k)) {
              visitedProps.push(k);
              if (re.exec(k) !== null) {
                validateProperty(object, object[k], p, props[p], options, errors);
              }
            }
          }
        }
      }
    }

    // see 5.4
    if (undefined !== schema.additionalProperties) {
      var i, l;

      var unvisitedProps = allProps.filter(function(k){
        return -1 === visitedProps.indexOf(k);
      });

      // Prevent additional properties; each unvisited property is therefore an error
      if (schema.additionalProperties === false && unvisitedProps.length > 0) {
        for (i = 0, l = unvisitedProps.length; i < l; i++) {
          error("additionalProperties", unvisitedProps[i], object[unvisitedProps[i]], false, errors);
        }
      }
      // additionalProperties is a schema and validate unvisited properties against that schema
      else if (typeof schema.additionalProperties == "object" && unvisitedProps.length > 0) {
        for (i = 0, l = unvisitedProps.length; i < l; i++) {
          validateProperty(object, object[unvisitedProps[i]], unvisitedProps[i], schema.unvisitedProperties, options, errors);
        }
      }
    }

  };

  function validateProperty(object, value, property, schema, options, errors) {
    var format,
        valid,
        spec,
        type;

    function constrain(name, value, assert) {
      if (schema[name] !== undefined && !assert(value, schema[name])) {
        error(name, property, value, schema, errors);
      }
    }

    if (value === undefined) {
      if (schema.required && schema.type !== 'any') {
        return error('required', property, undefined, schema, errors);
      } else {
        return;
      }
    }

    if (options.cast) {
      if (('integer' === schema.type || 'number' === schema.type) && value == +value) {
        value = +value;
        object[property] = value;
      }

      if ('boolean' === schema.type) {
        if ('true' === value || '1' === value || 1 === value) {
          value = true;
          object[property] = value;
        }

        if ('false' === value || '0' === value || 0 === value) {
          value = false;
          object[property] = value;
        }
      }
    }

    if (schema.format && options.validateFormats) {
      format = schema.format;

      if (options.validateFormatExtensions) { spec = validate.formatExtensions[format] }
      if (!spec) { spec = validate.formats[format] }
      if (!spec) {
        if (options.validateFormatsStrict) {
          return error('format', property, value, schema, errors);
        }
      }
      else {
        if (!spec.test(value)) {
          return error('format', property, value, schema, errors);
        }
      }
    }

    if (schema['enum'] && schema['enum'].indexOf(value) === -1) {
      error('enum', property, value, schema, errors);
    }

    // Dependencies (see 5.8)
    if (typeof schema.dependencies === 'string' &&
        object[schema.dependencies] === undefined) {
      error('dependencies', property, null, schema, errors);
    }

    if (isArray(schema.dependencies)) {
      for (var i = 0, l = schema.dependencies.length; i < l; i++) {
        if (object[schema.dependencies[i]] === undefined) {
          error('dependencies', property, null, schema, errors);
        }
      }
    }

    if (typeof schema.dependencies === 'object') {
      validateObject(object, schema.dependencies, options, errors);
    }

    checkType(value, schema.type, function(err, type) {
      if (err) return error('type', property, typeof value, schema, errors);

      constrain('conform', value, function (a, e) { return e(a, object) });

      switch (type || (isArray(value) ? 'array' : typeof value)) {
        case 'string':
          constrain('allowEmpty', value,        function (a, e) { return e ? e : a !== '' });
          constrain('minLength',  value.length, function (a, e) { return a >= e });
          constrain('maxLength',  value.length, function (a, e) { return a <= e });
          constrain('pattern',    value,        function (a, e) {
            e = typeof e === 'string'
              ? e = new RegExp(e)
              : e;
            return e.test(a)
          });
          break;
        case 'integer':
        case 'number':
          constrain('minimum',     value, function (a, e) { return a >= e });
          constrain('maximum',     value, function (a, e) { return a <= e });
          constrain('exclusiveMinimum', value, function (a, e) { return a > e });
          constrain('exclusiveMaximum', value, function (a, e) { return a < e });
          constrain('divisibleBy', value, function (a, e) {
            var multiplier = Math.max((a - Math.floor(a)).toString().length - 2, (e - Math.floor(e)).toString().length - 2);
            multiplier = multiplier > 0 ? Math.pow(10, multiplier) : 1;
            return (a * multiplier) % (e * multiplier) === 0
          });
          break;
        case 'array':
          constrain('items', value, function (a, e) {
            for (var i = 0, l = a.length; i < l; i++) {
              validateProperty(object, a[i], property, e, options, errors);
            }
            return true;
          });
          constrain('minItems', value, function (a, e) { return a.length >= e });
          constrain('maxItems', value, function (a, e) { return a.length <= e });
          constrain('uniqueItems', value, function (a) {
            var h = {};

            for (var i = 0, l = a.length; i < l; i++) {
              var key = JSON.stringify(a[i]);
              if (h[key]) return false;
              h[key] = true;
            }

            return true;
          });
          break;
        case 'object':
          // Recursive validation
          if (schema.properties || schema.patternProperties || schema.additionalProperties) {
            validateObject(value, schema, options, errors);
          }
          break;
      }
    });
  };

  function checkType(val, type, callback) {
    var result = false,
        types = isArray(type) ? type : [type];

    // No type - no check
    if (type === undefined) return callback(null, type);

    // Go through available types
    // And fine first matching
    for (var i = 0, l = types.length; i < l; i++) {
      type = types[i].toLowerCase().trim();
      if (type === 'string' ? typeof val === 'string' :
          type === 'array' ? isArray(val) :
          type === 'object' ? val && typeof val === 'object' &&
                             !isArray(val) :
          type === 'number' ? typeof val === 'number' :
          type === 'integer' ? typeof val === 'number' && ~~val === val :
          type === 'null' ? val === null :
          type === 'boolean'? typeof val === 'boolean' :
          type === 'date' ? isDate(val) :
          type === 'any' ? typeof val !== 'undefined' : false) {
        return callback(null, type);
      }
    };

    callback(true);
  };

  function error(attribute, property, actual, schema, errors) {
    var lookup = { expected: schema[attribute], actual: actual, attribute: attribute, property: property };
    var message = schema.messages && schema.messages[attribute] || schema.message || validate.messages[attribute] || "no default message";
    message = message.replace(/%\{([a-z]+)\}/ig, function (_, match) { return lookup[match.toLowerCase()] || ''; });
    errors.push({
      attribute: attribute,
      property:  property,
      expected:  schema[attribute],
      actual:    actual,
      message:   message
    });
  };

  function isArray(value) {
    var s = typeof value;
    if (s === 'object') {
      if (value) {
        if (typeof value.length === 'number' &&
           !(value.propertyIsEnumerable('length')) &&
           typeof value.splice === 'function') {
           return true;
        }
      }
    }
    return false;
  }

  function isDate(value) {
    var s = typeof value;
    if (s === 'object') {
      if (value) {
        if (typeof value.getTime === 'function') {
          return true;
        }
      }
    }

    return false;
  }

})(typeof module === 'object' && module && module.exports ? module.exports : window);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../webpack/buildin/module.js */ 13)(module)))

/***/ }),
/* 13 */
/* unknown exports provided */
/* all exports used */
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 14 */
/* unknown exports provided */
/* all exports used */
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 15 */
/* unknown exports provided */
/* all exports used */
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 16 */
/* unknown exports provided */
/* all exports used */
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 17 */
/* unknown exports provided */
/* all exports used */
/*!******************************!*\
  !*** ./scripts/installer.js ***!
  \******************************/
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! fs */ 4);
var path = __webpack_require__(/*! path */ 5);
var prompt = __webpack_require__(/*! prompt-lite */ 1);

const { execSync } = __webpack_require__(/*! child_process */ 3);
const semver = __webpack_require__(/*! semver */ 2);
const tnsVersionFull = execSync('tns --version', { encoding: 'ascii'});

// iOS modern build system is supported from version NativeScript-CLI version 5.2.0
const supportsIOSModernBuildSystem = tnsVersionFull.indexOf("5.2.0-") > -1 || semver.gte(tnsVersionFull, "5.2.0");

// Custom gradle buildscripts are supported from NativeScript-Android version 5.3.0 (TODO this actually checks the CLI version)
const supportsGradleBuildscripts = tnsVersionFull.indexOf("5.3.0-") > -1 || semver.gte(tnsVersionFull, "5.3.0");

if (!supportsIOSModernBuildSystem) {
  console.log(`You're using NativeScript ${tnsVersionFull}.. which doesn't support the latest Firestore and in-app-messaging SDKs. Upgrade NativeScript to at least 5.2.0 if you need those!\n\n`);
}

// Default settings for a few prompts
var usingiOS = false, usingAndroid = false, externalPushClientOnly = false;

// The directories where the Podfile and include.gradle are stored
var directories = {
  ios: './platforms/ios',
  android: './platforms/android'
};

console.log('NativeScript Firebase Plugin Installation');

var appRoot = "../../";
var pluginConfigFile = "firebase.nativescript.json";
var pluginConfigPath = path.join(appRoot, pluginConfigFile);
var config = {};

function mergeConfig(result) {
  for (var key in result) {
    config[key] = isSelected(result[key]);
  }
}

function saveConfig() {
  fs.writeFileSync(pluginConfigPath, JSON.stringify(config, null, 4));
}

function readConfig() {
  try {
    config = JSON.parse(fs.readFileSync(pluginConfigPath));
  } catch (e) {
    console.log("Failed reading " + pluginConfigFile);
    console.log(e);
    config = {};
  }
}

function isInteractive() {
  return process.stdin && process.stdin.isTTY && process.stdout && process.stdout.isTTY;
}

// note that for CI builds you want a pluginConfigFile, otherwise the build will fail
if (process.argv.indexOf("config") === -1 && fs.existsSync(pluginConfigPath)) {
  readConfig();
  console.log("Config file exists (" + pluginConfigFile + ")");
  askiOSPromptResult(config);
  askAndroidPromptResult(config);
  askExternalPushMessagingOnlyPromptResult(config);
  promptQuestionsResult(config);
} else if (!isInteractive()) {
  console.log("No existing " + pluginConfigFile + " config file found and terminal is not interactive! Default configuration will be used.");
} else {
  console.log("No existing " + pluginConfigFile + " config file found, so let's configure the Firebase plugin!");
  prompt.start();
  askExternalPushMessagingOnlyPrompt();
}

/**
 * Prompt the user if they are integrating Firebase with iOS
 */
function askExternalPushMessagingOnlyPrompt() {
  prompt.get({
    name: 'external_push_client_only',
    description: 'Are you using this plugin ONLY as a Push Notification client for an external (non-Firebase) Push service? (y/n)',
    default: 'n'
  }, function (err, result) {
    if (err) {
      return console.log(err);
    }
    mergeConfig(result);
    askExternalPushMessagingOnlyPromptResult(result);
    askiOSPrompt();
  });
}

/**
 * Prompt the user if they are integrating Firebase with iOS
 */
function askiOSPrompt() {
  prompt.get({
    name: 'using_ios',
    description: 'Are you using iOS (y/n)',
    default: 'y'
  }, function (err, result) {
    if (err) {
      return console.log(err);
    }
    mergeConfig(result);
    askiOSPromptResult(result);
    askAndroidPrompt();
  });
}

function askExternalPushMessagingOnlyPromptResult(result) {
  if (isSelected(result.external_push_client_only)) {
    externalPushClientOnly = true;
  }
}

function askiOSPromptResult(result) {
  if (isSelected(result.using_ios)) {
    usingiOS = true;
  }
}

/**
 * Prompt the user if they are integrating Firebase with Android
 */
function askAndroidPrompt() {
  prompt.get({
    name: 'using_android',
    description: 'Are you using Android (y/n)',
    default: 'y'
  }, function (err, result) {
    if (err) {
      return console.log(err);
    }
    mergeConfig(result);
    askAndroidPromptResult(result);
    if ((usingiOS || usingAndroid) && !externalPushClientOnly) {
      promptQuestions();
    } else if (externalPushClientOnly) {
      promptQuestionsResult(result);
      askSaveConfigPrompt();
    } else {
      askSaveConfigPrompt();
    }
  });
}

function askAndroidPromptResult(result) {
  if (isSelected(result.using_android)) {
    usingAndroid = true;
  }
}

/**
 * Prompt the user through the configurable Firebase add-on services
 */
function promptQuestions() {
  prompt.get([{
    name: 'firestore',
    description: 'Are you using Firestore? (y/n)',
    default: 'n'
  }, {
    name: 'realtimedb',
    description: 'Are you using Realtime DB? (y/n)',
    default: 'n'
  }, {
    name: 'authentication',
    description: 'Are you using Firebase Authentication (pretty likely if you use Firestore or Realtime DB)? (y/n)',
    default: 'y'
  }, {
    name: 'remote_config',
    description: 'Are you using Firebase RemoteConfig? (y/n)',
    default: 'n'
  }, {
    name: 'performance_monitoring',
    description: 'Are you using Performance Monitoring? (y/n)',
    default: 'n'
  }, {
    name: 'messaging',
    description: 'Are you using Firebase Cloud Messaging? (y/n)',
    default: 'n'
  }, {
    name: 'in_app_messaging',
    description: 'Are you using In-App Messaging? (y/n)',
    default: 'n'
  }, {
    name: 'crashlytics',
    description: 'Are you using Firebase Crashlytics? (y/n)',
    default: 'n'
  }, {
    name: 'crash_reporting',
    description: 'Are you using Firebase Crash Reporting? (answer "n" if you want to use Crashlytics instead) (y/n)',
    default: 'n'
  }, {
    name: 'storage',
    description: 'Are you using Firebase Storage? (y/n)',
    default: 'n'
  }, {
    name: 'functions',
    description: 'Are you using Firebase Cloud Functions? (y/n)',
    default: 'n'
  }, {
    name: 'facebook_auth',
    description: 'Are you using Firebase Facebook Authentication? (y/n)',
    default: 'n'
  }, {
    name: 'google_auth',
    description: 'Are you using Firebase Google Authentication? (y/n)',
    default: 'n'
  }, {
    name: 'admob',
    description: 'Are you using AdMob? (y/n)',
    default: 'n'
  }, {
    name: 'invites',
    description: 'Are you using Firebase Invites? (y/n)',
    default: 'n'
  }, {
    name: 'dynamic_links',
    description: 'Are you using Firebase Dynamic Links? (y/n)',
    default: 'n'
  }, {
    name: 'ml_kit',
    description: 'Are you using ML Kit? (y/n)',
    default: 'n'
  }], function (err, result) {
    if (err) {
      return console.log(err);
    }
    if (!isSelected(result.ml_kit)) {
      mergeConfig(result);
      promptQuestionsResult(result);
      askSaveConfigPrompt();
    } else {
      prompt.get([{
        name: 'ml_kit_text_recognition',
        description: 'With Ml Kit, do you want to recognize text? (y/n)',
        default: 'n'
      }, {
        name: 'ml_kit_barcode_scanning',
        description: 'With Ml Kit, do you want to scan barcodes? (y/n)',
        default: 'n'
      }, {
        name: 'ml_kit_face_detection',
        description: 'With Ml Kit, do you want to detect faces? (y/n)',
        default: 'n'
      }, {
        name: 'ml_kit_image_labeling',
        description: 'With Ml Kit, do you want to label images? (y/n)',
        default: 'n'
      }, {
        name: 'ml_kit_custom_model',
        description: 'With Ml Kit, do you want to use a custom TensorFlow Lite model? (y/n)',
        default: 'n'
      // }, {
      //   name: 'ml_kit_natural_language_identification',
      //   description: 'With Ml Kit, do you want to use recognize natural languages? (y/n)',
      //   default: 'n'
      }], function (mlkitErr, mlkitResult) {
        if (mlkitErr) {
          return console.log(mlkitErr);
        }
        for (var attrname in mlkitResult) {
          result[attrname] = mlkitResult[attrname];
        }
        mergeConfig(result);
        promptQuestionsResult(result);
        askSaveConfigPrompt();
      });
    }
  });
}

function promptQuestionsResult(result) {
  if (usingiOS) {
    if (!externalPushClientOnly) {
      writePodFile(result);
    }
    writeGoogleServiceCopyHook();
    writeBuildscriptHookForCrashlytics(isSelected(result.crashlytics));
    writeBuildscriptHookForFirestore(isSelected(result.firestore) && !supportsIOSModernBuildSystem);
  }

  if (usingAndroid) {
    writeGradleFile(result);
    writeGoogleServiceCopyHook();
    writeGoogleServiceGradleHook(result);
    echoAndroidManifestChanges(result);
    activateAndroidPushNotificationsLib(isSelected(result.messaging) || externalPushClientOnly);
    activateAndroidMLKitCustomModelLib(isSelected(result.ml_kit) && isSelected(result.ml_kit_custom_model));
  }

  console.log('Firebase post install completed. To re-run this script, navigate to the root directory of `nativescript-plugin-firebase` in your `node_modules` folder and run: `npm run config`.');
}

function echoAndroidManifestChanges(result) {
  if (isSelected(result.ml_kit)) {
    var selectedFeatures = [];
    if (isSelected(result.ml_kit_text_recognition)) {
      selectedFeatures.push("ocr");
    }
    if (isSelected(result.ml_kit_barcode_scanning)) {
      selectedFeatures.push("barcode");
    }
    if (isSelected(result.ml_kit_face_detection)) {
      selectedFeatures.push("face");
    }
    if (isSelected(result.ml_kit_image_labeling)) {
      selectedFeatures.push("label");
    }
    if (selectedFeatures.length > 0) {
      console.log('\n######################################################################################################');
      console.log('Open your app\'s resources/Android/AndroidManifest.xml file and add this (see the demo for an example):');
      console.log('<meta-data\n' +
          '    android:name="com.google.firebase.ml.vision.DEPENDENCIES"\n' +
          '    android:value="' + selectedFeatures.join(',') + '" />');
      console.log('######################################################################################################\n');
    }
  }
}

function activateAndroidPushNotificationsLib(enable) {
  if (enable && fs.existsSync(path.join(directories.android, 'firebase-release.aar-disabled'))) {
    fs.renameSync(path.join(directories.android, 'firebase-release.aar-disabled'), path.join(directories.android, 'firebase-release.aar'));
  } else if (!enable && fs.existsSync(path.join(directories.android, 'firebase-release.aar'))) {
    fs.renameSync(path.join(directories.android, 'firebase-release.aar'), path.join(directories.android, 'firebase-release.aar-disabled'));
  }
}

function activateAndroidMLKitCustomModelLib(enable) {
  if (enable && fs.existsSync(path.join(directories.android, 'nativescript-firebase-mlkit-helper.jar-disabled'))) {
    fs.renameSync(path.join(directories.android, 'nativescript-firebase-mlkit-helper.jar-disabled'), path.join(directories.android, 'nativescript-firebase-mlkit-helper.jar'));
  } else if (!enable && fs.existsSync(path.join(directories.android, 'nativescript-firebase-mlkit-helper.jar'))) {
    fs.renameSync(path.join(directories.android, 'nativescript-firebase-mlkit-helper.jar'), path.join(directories.android, 'nativescript-firebase-mlkit-helper.jar-disabled'));
  }
}

function askSaveConfigPrompt() {
  prompt.get({
    name: 'save_config',
    description: 'Do you want to save the selected configuration. Reinstalling the dependency will reuse the setup from: ' + pluginConfigFile + '. CI will be easier. (y/n)',
    default: 'y'
  }, function (err, result) {
    if (err) {
      return console.log(err);
    }
    if (isSelected(result.save_config)) {
      saveConfig();
    }
  });
}

/**
 * Create the iOS PodFile for installing the Firebase iOS dependencies and service dependencies
 *
 * @param {any} result The answers to the micro-service prompts
 */
function writePodFile(result) {
  if (!fs.existsSync(directories.ios)) {
    fs.mkdirSync(directories.ios);
  }
  try {
    fs.writeFileSync(directories.ios + '/Podfile',
// The MLVision pod requires a minimum of iOS 9, otherwise the build will fail
(isPresent(result.ml_kit) ? `` : `#`) + `platform :ios, '9.0'

# With NativeScript < 5.2 we can't bump Firebase/Core beyond 5.15.0, but with 5.2+ we can
pod 'Firebase/Core', '~> ` + (supportsIOSModernBuildSystem ? '5.16.0' : '5.15.0') + `'

# Authentication
` + (!isPresent(result.authentication) || isSelected(result.authentication) ? `` : `#`) + `pod 'Firebase/Auth'

# Realtime DB
` + (!isPresent(result.realtimedb) || isSelected(result.realtimedb) ? `` : `#`) + `pod 'Firebase/Database'

# Cloud Firestore (sticking to 0.14 for now because of build error - see https://github.com/firebase/firebase-ios-sdk/issues/2177)
` + (isSelected(result.firestore) && !supportsIOSModernBuildSystem ? `` : `#`) + `pod 'FirebaseFirestore', '~> 0.14.0'
# .. unless the modern build system is supported, then we can use the latest version (NativeScript 5.2+)
` + (isSelected(result.firestore) && supportsIOSModernBuildSystem ? `` : `#`) + `pod 'Firebase/Firestore'

# Remote Config
` + (isSelected(result.remote_config) ? `` : `#`) + `pod 'Firebase/RemoteConfig'

# Performance Monitoring
` + (isSelected(result.performance_monitoring) ? `` : `#`) + `pod 'Firebase/Performance'

# Crash Reporting
` + (isSelected(result.crash_reporting) && !isSelected(result.crashlytics) ? `` : `#`) + `pod 'Firebase/Crash'

# Crashlytics
` + (isSelected(result.crashlytics) ? `` : `#`) + `pod 'Fabric'
` + (isSelected(result.crashlytics) ? `` : `#`) + `pod 'Crashlytics'
` + (!isSelected(result.crashlytics) ? `` : `
# Crashlytics works best without bitcode
post_install do |installer|
    installer.pods_project.targets.each do |target|
        target.build_configurations.each do |config|
            config.build_settings['ENABLE_BITCODE'] = "NO"
            config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = "YES"
        end
    end
end`) + `

# Firebase Cloud Messaging (FCM)
` + (isSelected(result.messaging) ? `` : `#`) + `pod 'Firebase/Messaging'

# Firebase In-App Messaging (supported on NativeScript 5.2+)
` + (isSelected(result.in_app_messaging) && supportsIOSModernBuildSystem ? `` : `#`) + `pod 'Firebase/InAppMessagingDisplay'

# Firebase Cloud Storage
` + (isSelected(result.storage) ? `` : `#`) + `pod 'Firebase/Storage'

# Firebase Cloud Functions
` + (isSelected(result.functions) ? `` : `#`) + `pod 'Firebase/Functions'

# AdMob
` + (isSelected(result.admob) ? `` : `#`) + `pod 'Firebase/AdMob'

# Invites
` + (isSelected(result.invites) ? `` : `#`) + `pod 'Firebase/Invites'

# Dynamic Links
` + (isSelected(result.dynamic_links) ? `` : `#`) + `pod 'Firebase/DynamicLinks'

# ML Kit
` + (isSelected(result.ml_kit) ? `` : `#`) + `pod 'Firebase/MLVision'
` + (isSelected(result.ml_kit) && isSelected(result.ml_kit_text_recognition) ? `` : `#`) + `pod 'Firebase/MLVisionTextModel'
` + (isSelected(result.ml_kit) && isSelected(result.ml_kit_barcode_scanning) ? `` : `#`) + `pod 'Firebase/MLVisionBarcodeModel'
` + (isSelected(result.ml_kit) && isSelected(result.ml_kit_face_detection) ? `` : `#`) + `pod 'Firebase/MLVisionFaceModel'
` + (isSelected(result.ml_kit) && isSelected(result.ml_kit_image_labeling) ? `` : `#`) + `pod 'Firebase/MLVisionLabelModel'
` + (isSelected(result.ml_kit) && isSelected(result.ml_kit_custom_model) ? `` : `#`) + `pod 'Firebase/MLModelInterpreter'
# Natural Language is commented for now, because of (likely) this issue: https://github.com/firebase/firebase-ios-sdk/issues/2324
` + (isSelected(result.ml_kit) && isSelected(result.ml_kit_natural_language_identification) ? `#` : `#`) + `pod 'Firebase/MLNLLanguageID'

# Facebook Authentication
` + (isSelected(result.facebook_auth) ? `` : `#`) + `pod 'FBSDKCoreKit', '~> 4.38.0'
` + (isSelected(result.facebook_auth) ? `` : `#`) + `pod 'FBSDKLoginKit', '~> 4.38.0'

# Google Authentication
` + (isSelected(result.google_auth) ? `` : `#`) + `pod 'GoogleSignIn'`);
    console.log('Successfully created iOS (Pod) file.');
  } catch (e) {
    console.log('Failed to create iOS (Pod) file.');
    console.log(e);
  }
}

/**
 * Create the iOS build script for uploading dSYM files to Crashlytics
 *
 * @param {any} enable Is Crashlytics enabled
 */
function writeBuildscriptHookForCrashlytics(enable) {
  var scriptPath = path.join(appRoot, "hooks", "after-prepare", "firebase-crashlytics-buildscript.js");

  if (!enable) {
    if (fs.existsSync(scriptPath)) {
      fs.unlinkSync(scriptPath);
    }
    return
  }

  console.log("Install Crashlytics buildscript hook.");
  try {
    var scriptContent =
        `const fs = require('fs-extra');
const path = require('path');
const xcode = require('xcode');

const pattern1 = /\\n\\s*\\/\\/Crashlytics 1 BEGIN[\\s\\S]*\\/\\/Crashlytics 1 END.*\\n/m;
const pattern2 = /\\n\\s*\\/\\/Crashlytics 2 BEGIN[\\s\\S]*\\/\\/Crashlytics 2 END.*\\n/m;
const pattern3 = /\\n\\s*\\/\\/Crashlytics 3 BEGIN[\\s\\S]*\\/\\/Crashlytics 3 END.*\\n/m;

const string1 = \`
//Crashlytics 1 BEGIN
#else
#import <Crashlytics/CLSLogging.h>
#endif
//Crashlytics 1 END
\`;

const string2 = \`
//Crashlytics 2 BEGIN
#if DEBUG
#else
static int redirect_cls(const char *prefix, const char *buffer, int size) {
  CLSLog(@"%s: %.*s", prefix, size, buffer);
  return size;
}

static int stderr_redirect(void *inFD, const char *buffer, int size) {
  return redirect_cls("stderr", buffer, size);
}

static int stdout_redirect(void *inFD, const char *buffer, int size) {
  return redirect_cls("stdout", buffer, size);
}
#endif
//Crashlytics 2 END
\`;

const string3 = \`
//Crashlytics 3 BEGIN
#if DEBUG
#else
  // Per https://docs.fabric.io/apple/crashlytics/enhanced-reports.html#custom-logs :
  // Crashlytics ensures that all log entries are recorded, even if the very next line of code crashes.
  // This means that logging must incur some IO. Be careful when logging in performance-critical areas.
  
  // As per the note above, enabling this can affect performance if too much logging is present.
  // stdout->_write = stdout_redirect;
  
  // stderr usually only occurs during critical failures;
  // so it is usually essential to identifying crashes, especially in JS
  stderr->_write = stderr_redirect;
#endif
//Crashlytics 3 END
\`;

module.exports = function($logger, $projectData, hookArgs) {
  const platform = hookArgs.platform.toLowerCase();
  return new Promise(function(resolve, reject) {
    const isNativeProjectPrepared = !hookArgs.nativePrepare || !hookArgs.nativePrepare.skipNativePrepare;
    if (isNativeProjectPrepared) {
      try {
        if (platform === 'ios') {
          const sanitizedAppName = path.basename($projectData.projectDir).split('').filter((c) => /[a-zA-Z0-9]/.test(c)).join('');

          // write buildscript for dSYM upload
          const xcodeProjectPath = path.join($projectData.platformsDir, 'ios', sanitizedAppName + '.xcodeproj', 'project.pbxproj');
          $logger.trace('Using Xcode project', xcodeProjectPath);
          if (fs.existsSync(xcodeProjectPath)) {
            var xcodeProject = xcode.project(xcodeProjectPath);
            xcodeProject.parseSync();
            var options = { shellPath: '/bin/sh', shellScript: '\"\${PODS_ROOT}/Fabric/run\"' };
            xcodeProject.addBuildPhase(
              [], 'PBXShellScriptBuildPhase', 'Configure Crashlytics', undefined, options
            ).buildPhase;
            fs.writeFileSync(xcodeProjectPath, xcodeProject.writeSync());
            $logger.trace('Xcode project written');
          } else {
            $logger.error(xcodeProjectPath + ' is missing.');
            reject();
            return;
          }

          // Logging from stdout/stderr
          $logger.out('Add iOS crash logging');
          const mainmPath = path.join($projectData.platformsDir, 'ios', 'internal', 'main.m');
          if (fs.existsSync(mainmPath)) {
            let mainmContent = fs.readFileSync(mainmPath).toString();
            // string1
            mainmContent = pattern1.test(mainmContent)
              ? mainmContent.replace(pattern1, string1)
              : mainmContent.replace(/(\\n#endif\\n)/, string1);
            // string2
            mainmContent = pattern2.test(mainmContent)
              ? mainmContent.replace(pattern2, string2)
              : mainmContent.replace(/(\\nint main.*)/, string2 + '$1');
            // string3
            mainmContent = pattern3.test(mainmContent)
              ? mainmContent.replace(pattern3, string3)
              : mainmContent.replace(/(int main.*\\n)/, '$1' + string3 + '\\n');
            fs.writeFileSync(mainmPath, mainmContent);
          } else {
            $logger.error(mainmPath + ' is missing.');
            reject();
            return;
          }

          resolve();
        } else {
          resolve();
        }
      } catch (e) {
        $logger.error('Unknown error during prepare Crashlytics', e);
        reject();
      }
    } else {
      $logger.trace("Native project not prepared.");
      resolve();
    }
  });
};
`;
    var afterPrepareDirPath = path.dirname(scriptPath);
    var hooksDirPath = path.dirname(afterPrepareDirPath);
    if (!fs.existsSync(afterPrepareDirPath)) {
      if (!fs.existsSync(hooksDirPath)) {
        fs.mkdirSync(hooksDirPath);
      }
      fs.mkdirSync(afterPrepareDirPath);
    }
    fs.writeFileSync(scriptPath, scriptContent);
  } catch (e) {
    console.log("Failed to install Crashlytics buildscript hook.");
    console.log(e);
  }
}

/**
 * Create the iOS build script for setting the workspace to the legacy build system (for now).
 *
 * @param {any} enable is Firestore enabled
 */
function writeBuildscriptHookForFirestore(enable) {
  var scriptPath = path.join(appRoot, "hooks", "after-prepare", "firebase-firestore-buildscript.js");

  if (!enable) {
    if (fs.existsSync(scriptPath)) {
      fs.unlinkSync(scriptPath);
    }
    return
  }

  console.log("Install Firestore buildscript hook.");
  try {
    var scriptContent =
        `const fs = require('fs-extra');
const path = require('path');

module.exports = function($logger, $projectData, hookArgs) {
  const platform = hookArgs.platform.toLowerCase();
  return new Promise(function(resolve, reject) {
    const isNativeProjectPrepared = !hookArgs.nativePrepare || !hookArgs.nativePrepare.skipNativePrepare;
    if (isNativeProjectPrepared) {
      try {
        if (platform !== 'ios') {
          resolve();
          return;
        }

        const sanitizedAppName = path.basename($projectData.projectDir).split('').filter((c) => /[a-zA-Z0-9]/.test(c)).join('');

        const xcodeWorkspacePath = path.join($projectData.platformsDir, 'ios', sanitizedAppName + '.xcworkspace');
        if (!fs.existsSync(xcodeWorkspacePath)) {
          $logger.error(xcodeWorkspacePath + ' is missing.');
          reject();
          return;
        }

        const xcodeWorkspaceShareddataPath = path.join($projectData.platformsDir, 'ios', sanitizedAppName + '.xcworkspace', 'xcshareddata');
        $logger.trace('Using Xcode workspace settings path', xcodeWorkspaceShareddataPath);
        console.log('Using Xcode workspace settings path: ' + xcodeWorkspaceShareddataPath);

        if (!fs.existsSync(xcodeWorkspaceShareddataPath)) {
          fs.mkdirSync(xcodeWorkspaceShareddataPath);
        }

        const xcodeWorkspaceSettingsFile = path.join(xcodeWorkspaceShareddataPath, 'WorkspaceSettings.xcsettings');
        // for this temp fix we assume that if the file is there, it contains the correct config
        if (!fs.existsSync(xcodeWorkspaceSettingsFile)) {
          fs.writeFileSync(xcodeWorkspaceSettingsFile, \`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>BuildSystemType</key>
	<string>Original</string>
</dict>
</plist>
\`);
          $logger.trace('Xcode workspace file written');
        }
        resolve();

      } catch (e) {
        $logger.error('Unknown error during prepare Firestore', e);
        reject();
      }
    } else {
      $logger.trace("Native project not prepared.");
      resolve();
    }
  });
};
`;
    var afterPrepareDirPath = path.dirname(scriptPath);
    var hooksDirPath = path.dirname(afterPrepareDirPath);
    if (!fs.existsSync(afterPrepareDirPath)) {
      if (!fs.existsSync(hooksDirPath)) {
        fs.mkdirSync(hooksDirPath);
      }
      fs.mkdirSync(afterPrepareDirPath);
    }
    fs.writeFileSync(scriptPath, scriptContent);
  } catch (e) {
    console.log("Failed to install Firestore buildscript hook.");
    console.log(e);
  }
}

/**
 * Create the Android Gradle for installing the Firebase Android dependencies and service dependencies
 *
 * @param {any} result The answers to the micro-service prompts
 */
function writeGradleFile(result) {
  if (!fs.existsSync(directories.android)) {
    fs.mkdirSync(directories.android);
  }
  try {
    fs.writeFileSync(directories.android + '/include.gradle',
        `
android {
    // (possibly-temporary) workaround for https://stackoverflow.com/questions/52518378/more-than-one-file-was-found-with-os-independent-path-meta-inf-proguard-android
    packagingOptions {
        exclude 'META-INF/proguard/androidx-annotations.pro'
    }
}

repositories {
    mavenCentral()
    maven {
        url "https://maven.google.com"
    }
    jcenter()
}

dependencies {
    def supportVersion = project.hasProperty("supportVersion") ? project.supportVersion : "26.1.0"
    def googlePlayServicesVersion = project.hasProperty('googlePlayServicesVersion') ? project.googlePlayServicesVersion : "16.0.1"
    
    if (googlePlayServicesVersion != '+' && VersionNumber.parse(googlePlayServicesVersion) < VersionNumber.parse('15.0.+')) {
        throw new GradleException(" googlePlayServicesVersion set too low, please update to at least 15.0.0 / 15.0.+ (currently set to $googlePlayServicesVersion)");
    }

    implementation "com.android.support:appcompat-v7:$supportVersion"
    implementation "com.android.support:cardview-v7:$supportVersion"
    implementation "com.android.support:customtabs:$supportVersion"
    implementation "com.android.support:design:$supportVersion"
    implementation "com.android.support:support-compat:$supportVersion"

    // make sure you have these versions by updating your local Android SDK's (Android Support repo and Google repo)
    implementation "com.google.firebase:firebase-core:16.0.6"

    // implementation "com.google.firebase:firebase-analytics:16.0.6"

    // for reading google-services.json and configuration
    implementation "com.google.android.gms:play-services-base:$googlePlayServicesVersion"

    // Authentication
    ` + (!externalPushClientOnly && (!isPresent(result.authentication) || isSelected(result.authentication)) ? `` : `//`) + ` implementation "com.google.firebase:firebase-auth:16.1.0"

    // Realtime DB
    ` + (!externalPushClientOnly && (!isPresent(result.realtimedb) || isSelected(result.realtimedb)) ? `` : `//`) + ` implementation "com.google.firebase:firebase-database:16.0.6"

    // Cloud Firestore
    ` + (isSelected(result.firestore) ? `` : `//`) + ` implementation "com.google.firebase:firebase-firestore:18.0.0"

    // Remote Config
    ` + (isSelected(result.remote_config) ? `` : `//`) + ` implementation "com.google.firebase:firebase-config:16.1.3"

    // Performance Monitoring
    ` + (isSelected(result.performance_monitoring) ? `` : `//`) + ` implementation "com.google.firebase:firebase-perf:16.2.3"

    // Crash Reporting
    ` + (isSelected(result.crash_reporting) && !isSelected(result.crashlytics) ? `` : `//`) + ` implementation "com.google.firebase:firebase-crash:16.2.1"

    // Crashlytics
    ` + (isSelected(result.crashlytics) ? `` : `//`) + ` implementation "com.crashlytics.sdk.android:crashlytics:2.9.8"

    // Cloud Messaging (FCM)
    ` + (isSelected(result.messaging) || externalPushClientOnly ? `` : `//`) + ` implementation "com.google.firebase:firebase-messaging:17.3.4"

    // In-App Messaging
    ` + (isSelected(result.in_app_messaging) ? `` : `//`) + ` implementation "com.google.firebase:firebase-inappmessaging-display:17.0.5"

    // Cloud Storage
    ` + (isSelected(result.storage) ? `` : `//`) + ` implementation "com.google.firebase:firebase-storage:16.0.5"

    // Cloud Functions
    ` + (isSelected(result.functions) ? `` : `//`) + ` implementation "com.google.firebase:firebase-functions:16.1.3"

    // AdMob / Ads
    ` + (isSelected(result.admob) ? `` : `//`) + ` implementation "com.google.firebase:firebase-ads:17.1.2"

    // ML Kit
    ` + (isSelected(result.ml_kit) ? `` : `//`) + ` implementation "com.google.firebase:firebase-ml-vision:18.0.2"
    ` + (isSelected(result.ml_kit_image_labeling) ? `` : `//`) + ` implementation "com.google.firebase:firebase-ml-vision-image-label-model:17.0.2"
    ` + (isSelected(result.ml_kit_custom_model) ? `` : `//`) + ` implementation "com.google.firebase:firebase-ml-model-interpreter:16.2.4"
    ` + (isSelected(result.ml_kit_natural_language_identification) ? `//` : `//`) + ` implementation "com.google.firebase:firebase-ml-natural-language:18.1.1"
    ` + (isSelected(result.ml_kit_natural_language_identification) ? `//` : `//`) + ` implementation "com.google.firebase:firebase-ml-natural-language-language-id-model:18.0.2"

    // Facebook Authentication
    ` + (isSelected(result.facebook_auth) ? `` : `//`) + ` implementation ("com.facebook.android:facebook-android-sdk:4.35.0"){ exclude group: 'com.google.zxing' }

    // Google Sign-In Authentication
    ` + (isSelected(result.google_auth) ? `` : `//`) + ` implementation "com.google.android.gms:play-services-auth:16.0.0"

    // Invites
    ` + (isSelected(result.invites) ? `` : `//`) + ` implementation "com.google.firebase:firebase-invites:16.0.6"

    // Dynamic Links
    ` + (isSelected(result.dynamic_links) ? `` : `//`) + ` implementation "com.google.firebase:firebase-dynamic-links:16.1.5"
}

apply plugin: "com.google.gms.google-services"

// Crashlytics
` + (isSelected(result.crashlytics) ? `` : `//`) + `apply plugin: "io.fabric"
`);
    console.log('Successfully created Android (include.gradle) file.');
  } catch (e) {
    console.log('Failed to create Android (include.gradle) file.');
    console.log(e);
  }
}

/**
 * Installs an after-prepare build hook to copy the app/App_Resources/Android/google-services.json to platform/android on build.
 * Installs before-checkForChange build hook to detect changes in environment and copy GoogleServices.plist on build.
 */
function writeGoogleServiceCopyHook() {
  // Install after-prepare hook
  console.log("Install google-service.json after-prepare copy hook.");
  try {
    var afterPrepareScriptContent =
        `
var path = require("path");
var fs = require("fs");

module.exports = function($logger, $projectData, hookArgs) {

return new Promise(function(resolve, reject) {

        /* Decide whether to prepare for dev or prod environment */

        var isReleaseBuild = (hookArgs.appFilesUpdaterOptions && hookArgs.appFilesUpdaterOptions.release) ? true : false;
        var validProdEnvs = ['prod','production'];
        var isProdEnv = false; // building with --env.prod or --env.production flag

        if (hookArgs.platformSpecificData.env) {
            Object.keys(hookArgs.platformSpecificData.env).forEach((key) => {
                if (validProdEnvs.indexOf(key)>-1) { isProdEnv=true; }
            });
        }

        var buildType = isReleaseBuild || isProdEnv ? 'production' : 'development';

        /* Create info file in platforms dir so we can detect changes in environment and force prepare if needed */

        var npfInfoPath = path.join($projectData.platformsDir, hookArgs.platform.toLowerCase(), ".pluginfirebaseinfo");
        var npfInfo = {
            buildType: buildType,
        };

        try { fs.writeFileSync(npfInfoPath, JSON.stringify(npfInfo)); }
        catch (err) {
            $logger.info('nativescript-plugin-firebase: unable to create '+npfInfoPath+', prepare will be forced next time!');
        }


        /* Handle preparing of Google Services files */

        if (hookArgs.platform.toLowerCase() === 'android') {
            var destinationGoogleJson = path.join($projectData.platformsDir, "android", "app", "google-services.json");
            var destinationGoogleJsonAlt = path.join($projectData.platformsDir, "android", "google-services.json");
            var sourceGoogleJson = path.join($projectData.appResourcesDirectoryPath, "Android", "google-services.json");
            var sourceGoogleJsonProd = path.join($projectData.appResourcesDirectoryPath, "Android", "google-services.json.prod");
            var sourceGoogleJsonDev = path.join($projectData.appResourcesDirectoryPath, "Android", "google-services.json.dev");

            // ensure we have both dev/prod versions so we never overwrite singlular google-services.json
            if (fs.existsSync(sourceGoogleJsonProd) && fs.existsSync(sourceGoogleJsonDev)) {
                if (buildType==='production') { sourceGoogleJson = sourceGoogleJsonProd; } // use prod version
                else { sourceGoogleJson = sourceGoogleJsonDev; } // use dev version
            }

            // copy correct version to destination
            if (fs.existsSync(sourceGoogleJson) && fs.existsSync(path.dirname(destinationGoogleJson))) {
                $logger.out("Copy " + sourceGoogleJson + " to " + destinationGoogleJson + ".");
                fs.writeFileSync(destinationGoogleJson, fs.readFileSync(sourceGoogleJson));
                resolve();
            } else if (fs.existsSync(sourceGoogleJson) && fs.existsSync(path.dirname(destinationGoogleJsonAlt))) {
                // NativeScript < 4 doesn't have the 'app' folder
                $logger.out("Copy " + sourceGoogleJson + " to " + destinationGoogleJsonAlt + ".");
                fs.writeFileSync(destinationGoogleJsonAlt, fs.readFileSync(sourceGoogleJson));
                resolve();
            } else {
                $logger.warn("Unable to copy google-services.json.");
                reject();
            }
        } else if (hookArgs.platform.toLowerCase() === 'ios') {
            // we have copied our GoogleService-Info.plist during before-checkForChanges hook, here we delete it to avoid changes in git
            var destinationGooglePlist = path.join($projectData.appResourcesDirectoryPath, "iOS", "GoogleService-Info.plist");
            var sourceGooglePlistProd = path.join($projectData.appResourcesDirectoryPath, "iOS", "GoogleService-Info.plist.prod");
            var sourceGooglePlistDev = path.join($projectData.appResourcesDirectoryPath, "iOS", "GoogleService-Info.plist.dev");

            // if we have both dev/prod versions, let's remove GoogleService-Info.plist in destination dir
            if (fs.existsSync(sourceGooglePlistProd) && fs.existsSync(sourceGooglePlistDev)) {
                if (fs.existsSync(destinationGooglePlist)) { fs.unlinkSync(destinationGooglePlist); }
                resolve();
            } else { // single GoogleService-Info.plist modus
                resolve();
            }
        } else {
            resolve();
        }
    });
};
`;
    var scriptPath = path.join(appRoot, "hooks", "after-prepare", "firebase-copy-google-services.js");
    var afterPrepareDirPath = path.dirname(scriptPath);
    var hooksDirPath = path.dirname(afterPrepareDirPath);
    if (!fs.existsSync(afterPrepareDirPath)) {
      if (!fs.existsSync(hooksDirPath)) {
        fs.mkdirSync(hooksDirPath);
      }
      fs.mkdirSync(afterPrepareDirPath);
    }
    fs.writeFileSync(scriptPath, afterPrepareScriptContent);
  } catch (e) {
    console.log("Failed to install google-service.json after-prepare copy hook.");
    console.log(e);
  }

  /*
     Install before-checkForChanges hook
  */

  console.log("Install google-service.json before-checkForChanges copy hook.");
  try {
    var beforeCheckForChangesContent =
        `
var path = require("path");
var fs = require("fs");

module.exports = function($logger, $projectData, hookArgs) {
    return new Promise(function(resolve, reject) {

        /* Decide whether to prepare for dev or prod environment */

        var isReleaseBuild = hookArgs['checkForChangesOpts']['projectData']['$options']['argv']['release'] || false;
        var validProdEnvs = ['prod','production'];
        var isProdEnv = false; // building with --env.prod or --env.production flag

        var env = hookArgs['checkForChangesOpts']['projectData']['$options']['argv']['env'];
        if (env) {
            Object.keys(env).forEach((key) => {
                if (validProdEnvs.indexOf(key)>-1) { isProdEnv=true; }
            });
        }

        var buildType = isReleaseBuild || isProdEnv ? 'production' : 'development';

        /*
            Detect if we have nativescript-plugin-firebase temp file created during after-prepare hook, so we know
            for which environment {development|prod} the project was prepared. If needed, we delete the NS .nsprepareinfo
            file so we force a new prepare
        */
        var platform = hookArgs['checkForChangesOpts']['platform'].toLowerCase(); // ios | android
        var platformsDir = hookArgs['checkForChangesOpts']['projectData']['platformsDir'];
        var appResourcesDirectoryPath = hookArgs['checkForChangesOpts']['projectData']['appResourcesDirectoryPath'];
        var forcePrepare = true; // whether to force NS to run prepare, defaults to true
        var npfInfoPath = path.join(platformsDir, platform, ".pluginfirebaseinfo");
        var nsPrepareInfoPath = path.join(platformsDir, platform, ".nsprepareinfo");
        var copyPlistOpts = { platform, appResourcesDirectoryPath, buildType, $logger }

        if (fs.existsSync(npfInfoPath)) {
            var npfInfo = undefined;
            try { npfInfo = JSON.parse(fs.readFileSync(npfInfoPath, 'utf8')); }
            catch (e) { $logger.info('nativescript-plugin-firebase: error reading '+npfInfoPath); }

            if (npfInfo && npfInfo.hasOwnProperty('buildType') && npfInfo.buildType===buildType) {
                $logger.info('nativescript-plugin-firebase: building for same environment, not forcing prepare.');
                forcePrepare=false;
            }
        } else { $logger.info('nativescript-plugin-firebase: '+npfInfoPath+' not found, forcing prepare!'); }

        if (forcePrepare) {
            $logger.info('nativescript-plugin-firebase: running release build or change in environment detected, forcing prepare!');

            if (fs.existsSync(npfInfoPath)) { fs.unlinkSync(npfInfoPath); }
            if (fs.existsSync(nsPrepareInfoPath)) { fs.unlinkSync(nsPrepareInfoPath); }

            if (copyPlist(copyPlistOpts)) { resolve(); } else { reject(); }
        } else { resolve(); }
    });
};

/*
    Handle preparing of Google Services files for iOS
*/
var copyPlist = function(copyPlistOpts) {
    if (copyPlistOpts.platform === 'android') { return true; }
    else if (copyPlistOpts.platform === 'ios') {
        var sourceGooglePlistProd = path.join(copyPlistOpts.appResourcesDirectoryPath, "iOS", "GoogleService-Info.plist.prod");
        var sourceGooglePlistDev = path.join(copyPlistOpts.appResourcesDirectoryPath, "iOS", "GoogleService-Info.plist.dev");
        var destinationGooglePlist = path.join(copyPlistOpts.appResourcesDirectoryPath, "iOS", "GoogleService-Info.plist");

        // if we have both dev/prod versions, we copy (or overwrite) GoogleService-Info.plist in destination dir
        if (fs.existsSync(sourceGooglePlistProd) && fs.existsSync(sourceGooglePlistDev)) {
            if (copyPlistOpts.buildType==='production') { // use prod version
                copyPlistOpts.$logger.out("nativescript-plugin-firebase: copy " + sourceGooglePlistProd + " to " + destinationGooglePlist + ".");
                fs.writeFileSync(destinationGooglePlist, fs.readFileSync(sourceGooglePlistProd));
                return true;
            } else { // use dev version
                copyPlistOpts.$logger.out("nativescript-plugin-firebase: copy " + sourceGooglePlistDev + " to " + destinationGooglePlist + ".");
                fs.writeFileSync(destinationGooglePlist, fs.readFileSync(sourceGooglePlistDev));
                return true;
            }
        } else if (!fs.existsSync(destinationGooglePlist)) { // single GoogleService-Info.plist modus but missing`;
    if (externalPushClientOnly) {
      beforeCheckForChangesContent += `
            return true; // this is a push-only project, so this is allowed`;
    } else {
      beforeCheckForChangesContent += `
            copyPlistOpts.$logger.warn("nativescript-plugin-firebase: " + destinationGooglePlist + " does not exist. Please follow the installation instructions from the documentation");
            return false;`;
    }
    beforeCheckForChangesContent += `
        } else {
            return true; // single GoogleService-Info.plist modus
        }
    } else { return true; }
}
`;
    var scriptPath = path.join(appRoot, "hooks", "before-checkForChanges", "firebase-copy-google-services.js");
    var afterPrepareDirPath = path.dirname(scriptPath);
    var hooksDirPath = path.dirname(afterPrepareDirPath);
    if (!fs.existsSync(afterPrepareDirPath)) {
      if (!fs.existsSync(hooksDirPath)) {
        fs.mkdirSync(hooksDirPath);
      }
      fs.mkdirSync(afterPrepareDirPath);
    }
    fs.writeFileSync(scriptPath, beforeCheckForChangesContent);
  } catch (e) {
    console.log("Failed to install google-service.json before-checkForChanges copy hook.");
    console.log(e);
  }
}

function writeGoogleServiceGradleHook(result) {
  try {
    var scriptContent =
        `var path = require("path");
var fs = require("fs");

module.exports = function($logger, $projectData) {

    return new Promise(function(resolve, reject) {
        $logger.out("Configure firebase");
        let projectBuildGradlePath = path.join($projectData.platformsDir, "android", "build.gradle");
        if (fs.existsSync(projectBuildGradlePath)) {
            let buildGradleContent = fs.readFileSync(projectBuildGradlePath).toString();

            if (buildGradleContent.indexOf("fabric.io") === -1) {
                let repositoriesNode = buildGradleContent.indexOf("repositories", 0);
                if (repositoriesNode > -1) {
                    repositoriesNode = buildGradleContent.indexOf("}", repositoriesNode);
                    buildGradleContent = buildGradleContent.substr(0, repositoriesNode - 1) + '\\t\\tmaven { url "https://maven.fabric.io/public" }\\n\\t\\tmaven { url "https://dl.bintray.com/android/android-tools" }\\n' + buildGradleContent.substr(repositoriesNode - 1);
                }

                let dependenciesNode = buildGradleContent.indexOf("dependencies", 0);
                if (dependenciesNode > -1) {
                    dependenciesNode = buildGradleContent.indexOf("}", dependenciesNode);
                    // see https://docs.fabric.io/android/changelog.html
                    buildGradleContent = buildGradleContent.substr(0, dependenciesNode - 1) + '	    classpath "io.fabric.tools:gradle:1.26.1"\\n' + buildGradleContent.substr(dependenciesNode - 1);
                }

            } else if (buildGradleContent.indexOf("https://dl.bintray.com/android/android-tools") === -1) {
                let repositoriesNode = buildGradleContent.indexOf("repositories", 0);
                if (repositoriesNode > -1) {
                    repositoriesNode = buildGradleContent.indexOf("}", repositoriesNode);
                    buildGradleContent = buildGradleContent.substr(0, repositoriesNode - 1) + '\\t\\tmaven { url "https://dl.bintray.com/android/android-tools" }\\n' + buildGradleContent.substr(repositoriesNode - 1);
                }
            }

            let gradlePattern = /classpath ('|")com\\.android\\.tools\\.build:gradle:\\d+\\.\\d+\\.\\d+('|")/;
            let googleServicesPattern = /classpath ('|")com\\.google\\.gms:google-services:\\d+\\.\\d+\\.\\d+('|")/;
            let latestGoogleServicesPlugin = 'classpath "com.google.gms:google-services:4.2.0"';
            if (googleServicesPattern.test(buildGradleContent)) {
                buildGradleContent = buildGradleContent.replace(googleServicesPattern, latestGoogleServicesPlugin);
            } else {
                buildGradleContent = buildGradleContent.replace(gradlePattern, function (match) {
                    return match + '\\n        ' + latestGoogleServicesPlugin;
                });
            }

            fs.writeFileSync(projectBuildGradlePath, buildGradleContent);
        }

        let projectAppBuildGradlePath = path.join($projectData.platformsDir, "android", "app", "build.gradle");
        if (fs.existsSync(projectAppBuildGradlePath)) {
          let appBuildGradleContent = fs.readFileSync(projectAppBuildGradlePath).toString();
          if (appBuildGradleContent.indexOf("buildMetadata.finalizedBy(copyMetadata)") === -1) {
            appBuildGradleContent = appBuildGradleContent.replace("ensureMetadataOutDir.finalizedBy(buildMetadata)", "ensureMetadataOutDir.finalizedBy(buildMetadata)\\n\\t\\tbuildMetadata.finalizedBy(copyMetadata)");
            appBuildGradleContent += \`
task copyMetadata {
  doLast {
    copy {
        from "$projectDir/src/main/assets/metadata"
        def toDir = project.hasProperty("release") ? "release" : "debug"
        def toAssetsDir = "assets"

        if (new File("$projectDir/build/intermediates/merged_assets").listFiles() != null) {
          toAssetsDir = "merged_assets"
          toDir = new File("$projectDir/build/intermediates/merged_assets").listFiles()[0].name
          if (toDir == 'debug') {
            toDir += "/mergeDebugAssets"
          } else {
            toDir += "/mergeReleaseAssets"
          }
          toDir += "/out"
        } else if (new File("$projectDir/build/intermediates/assets").listFiles() != null) {
          toDir = new File("$projectDir/build/intermediates/assets").listFiles()[0].name
          if (toDir != 'debug' && toDir != 'release') {
            toDir += "/release"
          }
        }

        into "$projectDir/build/intermediates/" + toAssetsDir + "/" + toDir + "/metadata"
    }
  }
}\`;
            fs.writeFileSync(projectAppBuildGradlePath, appBuildGradleContent);
          }
        }

        resolve();
    });
};
`;
    var scriptPath = path.join(appRoot, "hooks", "after-prepare", "firebase-build-gradle.js");
    fs.writeFileSync(scriptPath, scriptContent);
  } catch (e) {
    console.log("Failed to install firebase-build-gradle hook.");
    console.log(e);
  }
}

/**
 * Determines if the answer validates as selected
 *
 * @param {any} value The user input for a prompt
 * @returns {boolean} The answer is yes, {false} The answer is no
 */
function isSelected(value) {
  return value === true || (typeof value === "string" && value.toLowerCase() === 'y');
}

function isPresent(value) {
  return value !== undefined;
}


/***/ })
/******/ ]);