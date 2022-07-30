"use strict";

var _sigma = _interopRequireDefault(require("sigma"));

var _graphology = _interopRequireDefault(require("graphology"));

var _circular = _interopRequireDefault(require("graphology-layout/circular"));

var _related = _interopRequireDefault(require("./programs/related.shader"));

var _unrelated = _interopRequireDefault(require("./programs/unrelated.shader"));

var _server = _interopRequireDefault(require("./programs/server.shader"));

var _edge = _interopRequireDefault(require("./programs/edge.antialias"));

var _animate = require("sigma/utils/animate");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var modifierHandler = /*#__PURE__*/_createClass(function modifierHandler() {
  var _this = this;

  _classCallCheck(this, modifierHandler);

  this.SHIFT = false;
  this.CTRL = false;
  this.FUNCTION = false;
  this.ALT = false;

  this.toggleValue = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(event, bool) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = event.key;
              _context.next = _context.t0 === "Alt" ? 3 : _context.t0 === "Control" ? 5 : _context.t0 === "Fn" ? 7 : _context.t0 === "Shift" ? 9 : 11;
              break;

            case 3:
              this.ALT = bool;
              return _context.abrupt("break", 11);

            case 5:
              this.CTRL = bool;
              return _context.abrupt("break", 11);

            case 7:
              this.FUNCTION = bool;
              return _context.abrupt("break", 11);

            case 9:
              this.SHIFT = bool;
              return _context.abrupt("break", 11);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  window.onkeydown = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(event) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _this.toggleValue(event, true);

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x3) {
      return _ref2.apply(this, arguments);
    };
  }();

  window.onkeyup = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(event) {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _this.toggleValue(event, false);

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x4) {
      return _ref3.apply(this, arguments);
    };
  }();
});

var statusColors = {
  Neutral: "#5D5A6D",
  Selected: "#444155",
  AuthNeutral: "#8B7FD3",
  AuthSelected: "#5B4EA1",
  ErrorNeutral: "#B41E06",
  ErrorSelected: "#a30006",
  SuccessNeutral: "#178A0E",
  SuccessSelected: "#47A13F"
};
var mod = new modifierHandler();
var container = document.getElementById("graphContainer");
var suggestionsList = document.querySelector("#search-opts");
var nodeDismissHandler = new eventHandlingMechanism();
var state = {
  activeNode: undefined,
  searchQuery: "",
  suggestions: [],
  errorNodes: [],
  successNodes: [],
  renderedNodes: [],
  renderedLinks: []
};
var graphData = {
  options: {
    allowSelfLoops: false,
    multi: false,
    type: "mixed"
  },
  nodes: [{
    key: "server",
    attributes: {
      size: 15,
      label: "Server",
      type: "server",
      color: statusColors.Neutral
    }
  }],
  edges: []
};
var graph = new _graphology.default();
graph.import(graphData);

_circular.default.assign(graph);

var renderer = new _sigma.default(graph, container, {
  renderLabels: false,
  minCameraRatio: 0.1,
  maxCameraRatio: 3,
  nodeProgramClasses: {
    related: _related.default,
    unrelated: _unrelated.default,
    server: _server.default
  },
  edgeProgramClasses: {
    antialias: _edge.default
  }
});
var camera = renderer.getCamera();
camera.addListener("updated", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(_) {
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (camera.x > camera.ratio + 1) camera.x = camera.ratio + 1;
            if (camera.x < -camera.ratio) camera.x = -camera.ratio;
            if (camera.y > camera.ratio + 1) camera.y = camera.ratio + 1;
            if (camera.y < -camera.ratio) camera.y = -camera.ratio;

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x5) {
    return _ref4.apply(this, arguments);
  };
}());

function blinkStatus(_x6, _x7) {
  return _blinkStatus.apply(this, arguments);
}

function _blinkStatus() {
  _blinkStatus = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(statusIdentifier, node) {
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.t0 = statusIdentifier.toLowerCase();
            _context10.next = _context10.t0 === "error" ? 3 : _context10.t0 === "success" ? 6 : 9;
            break;

          case 3:
            state.errorNodes.push(node);
            setTimeout(function () {
              state.errorNodes.splice(state.errorNodes.indexOf(node), 1);
              renderer.refresh();
            }, 5000);
            return _context10.abrupt("break", 9);

          case 6:
            state.successNodes.push(node);
            setTimeout(function () {
              state.successNodes.splice(state.successNodes.indexOf(node), 1);
              renderer.refresh();
            }, 5000);
            return _context10.abrupt("break", 9);

          case 9:
            renderer.refresh();

          case 10:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _blinkStatus.apply(this, arguments);
}

renderer.setSetting("nodeReducer", function (node, data) {
  var res = _objectSpread({}, data);

  var active = state.activeNode === node;
  var error = state.errorNodes.includes(node);
  var success = state.successNodes.includes(node);
  var prepend = error && success ? error : !(success || error) ? "" : ["Success", "Error"][[success, error].indexOf(true)];
  var fullStatusString = prepend + ["Selected", "Neutral"][[active, !active].indexOf(true)];
  res.color = statusColors[fullStatusString];
  return res;
});
renderer.setSetting("edgeReducer", function (edge, data) {
  var res = _objectSpread({}, data);

  var prependable = graph.extremities(edge).reduce(function (last, extremity) {
    return state.errorNodes.includes(extremity) ? "Error" : state.successNodes.includes(extremity) && last != "Error" ? "Success" : last;
  }, "");

  if (!prependable) {
    if ([1, 0].map(function (flippedIndex, trueIndex) {
      return authPeers.includes(graph.extremities(edge)[flippedIndex]) && graph.extremities(edge)[trueIndex] === CONFIG.communication.hiddenAlias;
    }).includes(true)) {
      prependable = "Auth";
    }
  }

  if (state.activeNode) {
    res.color = "#d9dde0";

    if (graph.hasExtremity(edge, state.activeNode)) {
      res.color = statusColors[prependable + "Selected"];
    }

    return res;
  }

  res.color = statusColors[prependable + "Neutral"];
  return res;
});

function setSearchQuery(query) {
  if (!CONFIG.UI.renderUnfamiliarPublicAliases) {
    suggestionsList.innerHTML = "";
    return;
  }

  state.searchQuery = query;

  if (query) {
    var lcQuery = escapeHTML(query.toLowerCase());
    var suggestions = Object.keys(networkMap.nodes).filter(function (node) {
      try {
        return hiddenAliasLookup[node].toLowerCase().indexOf(lcQuery) != -1;
      } catch (_unused) {
        return false;
      }
    });
    var sortedSuggestions = suggestions.reduce(function (sum, suggestion) {
      var index = hiddenAliasLookup[suggestion].toLowerCase().indexOf(lcQuery);
      sum[index] = sum[index] ? sum[index] : [];
      sum[index].push(suggestion);
      return sum;
    }, {});
    var suggestionPriority = [];
    var suggestionPairs = {};

    for (var len in sortedSuggestions) {
      sortedSuggestions[len] = sortedSuggestions[len].sort(function (a, b) {
        a = hiddenAliasLookup[a].toLowerCase();
        b = hiddenAliasLookup[b].toLowerCase();
        return a === b ? 0 : a > b ? 1 : -1;
      });

      var _iterator = _createForOfIteratorHelper(sortedSuggestions[len]),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var suggestion = _step.value;
          suggestionPriority.push(suggestion);
          var firstIndex = hiddenAliasLookup[suggestion].toLowerCase().indexOf(lcQuery);
          var boldedSuggestion = hiddenAliasLookup[suggestion].slice(0, firstIndex) + "<b>".concat(hiddenAliasLookup[suggestion].slice(firstIndex, firstIndex + lcQuery.length), "</b>") + hiddenAliasLookup[suggestion].slice(firstIndex + lcQuery.length);
          suggestionPairs[suggestion] = boldedSuggestion;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    renderQuerySuggestions(suggestionPairs, suggestionPriority, true);

    if (suggestionPriority.length === 1 && hiddenAliasLookup[suggestionPriority[0]].toLowerCase() === query) {
      activateNode(suggestionPriority[0]);
    } else {
      state.selectedNode = undefined;
    }
  } else {
    renderQuerySuggestions();
  }
}

function renderQuerySuggestions(_x8, _x9, _x10) {
  return _renderQuerySuggestions.apply(this, arguments);
}

function _renderQuerySuggestions() {
  _renderQuerySuggestions = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(suggestionPairs, suggestionPriority, isInformed) {
    var _Object$keys$reduce;

    return _regeneratorRuntime().wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            suggestionPairs = _typeof(suggestionPairs) === "object" ? suggestionPairs : Object.assign(hiddenAliasLookup);
            delete suggestionPairs[CONFIG.communication.hiddenAlias];
            suggestionPriority = _typeof(suggestionPriority) === "object" ? suggestionPriority : Object.keys(suggestionPairs).sort(function (a, b) {
              a = hiddenAliasLookup[a].toLowerCase();
              b = hiddenAliasLookup[b].toLowerCase();
              return a === b ? 0 : a > b ? 1 : -1;
            });
            suggestionPairs = (_Object$keys$reduce = Object.keys(suggestionPairs).reduce(function (total, item) {
              total[item] = (isInformed ? "<b>@</b>" : "@") + suggestionPairs[item];
              return total;
            }, {})) !== null && _Object$keys$reduce !== void 0 ? _Object$keys$reduce : {};
            suggestionsList.innerHTML = "";

            if (!(Object.keys(suggestionPairs) == "")) {
              _context14.next = 7;
              break;
            }

            return _context14.abrupt("return");

          case 7:
            Object.keys(suggestionPairs).forEach(function (hidden, index) {
              suggestionsList.innerHTML += "\n    <li class=\"context-item\">\n      <button class=\"context-button border-surround ".concat(index === 0 ? "search-opts-cap " : "", "suggestion-button\" id=\"").concat(hidden, "-suggestion-button\" onclick=\"activateNode('").concat(hidden, "')\" data-index=").concat(index, ">\n        ").concat(suggestionPairs[hidden], "\n      </button>\n    </li>\n    ");
            });
            document.querySelectorAll(".suggestion-button").forEach(function (btn) {
              btn.addEventListener("mouseup", /*#__PURE__*/function () {
                var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(e) {
                  return _regeneratorRuntime().wrap(function _callee11$(_context11) {
                    while (1) {
                      switch (_context11.prev = _context11.next) {
                        case 0:
                          setTimeout(function () {
                            document.querySelector("#search-opts").style.visibility = "hidden";
                          }, 1);

                        case 1:
                        case "end":
                          return _context11.stop();
                      }
                    }
                  }, _callee11);
                }));

                return function (_x21) {
                  return _ref10.apply(this, arguments);
                };
              }());
              btn.addEventListener("keydown", /*#__PURE__*/function () {
                var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(e) {
                  return _regeneratorRuntime().wrap(function _callee12$(_context12) {
                    while (1) {
                      switch (_context12.prev = _context12.next) {
                        case 0:
                          if (!(e.key == "ArrowDown")) {
                            _context12.next = 5;
                            break;
                          }

                          e.preventDefault();

                          if (!(document.querySelectorAll(".suggestion-button")[new Number(e.target.dataset.index) + 1] == undefined)) {
                            _context12.next = 4;
                            break;
                          }

                          return _context12.abrupt("return");

                        case 4:
                          document.querySelectorAll(".suggestion-button")[new Number(e.target.dataset.index) + 1].focus();

                        case 5:
                          if (!(e.key == "ArrowUp" && !e.target.classList.contains("search-opts-cap"))) {
                            _context12.next = 10;
                            break;
                          }

                          e.preventDefault();

                          if (!(document.querySelectorAll(".suggestion-button")[new Number(e.target.dataset.index) - 1] == undefined)) {
                            _context12.next = 9;
                            break;
                          }

                          return _context12.abrupt("return");

                        case 9:
                          document.querySelectorAll(".suggestion-button")[e.target.dataset.index - 1].focus();

                        case 10:
                        case "end":
                          return _context12.stop();
                      }
                    }
                  }, _callee12);
                }));

                return function (_x22) {
                  return _ref11.apply(this, arguments);
                };
              }());
            });
            document.querySelector(".search-opts-cap").addEventListener("keydown", /*#__PURE__*/function () {
              var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(e) {
                return _regeneratorRuntime().wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        if (e.key == "ArrowUp") {
                          e.preventDefault();
                          document.querySelector("#searchEntryField").focus();
                        }

                      case 1:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13);
              }));

              return function (_x23) {
                return _ref12.apply(this, arguments);
              };
            }());

          case 10:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));
  return _renderQuerySuggestions.apply(this, arguments);
}

networkMap.onUpdate( /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(_sig, externalDetail) {
    var circularLocations;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.t0 = externalDetail[0];
            _context5.next = _context5.t0 === "addNode" ? 3 : _context5.t0 === "addEdge" ? 6 : _context5.t0 === "removeEdge" ? 8 : _context5.t0 === "removeNode" ? 10 : _context5.t0 === "totalWipe" ? 12 : 14;
            break;

          case 3:
            graph.updateNode(externalDetail[1], function () {
              return {
                x: 0,
                y: 0,
                label: externalDetail[1] === CONFIG.communication.hiddenAlias ? "𝙈𝙚" : CONFIG.UI.renderUnfamiliarPublicAliases ? hiddenAliasLookup[externalDetail[1]] : externalDetail[1],
                size: externalDetail[1] === CONFIG.communication.hiddenAlias ? 10 : 5,
                color: statusColors.Neutral,
                type: externalDetail[1] === CONFIG.communication.hiddenAlias ? "server" : "unrelated"
              };
            });
            graph.updateEdge(externalDetail[1], "server", function () {
              return {
                type: "antialias",
                size: 1
              };
            });
            return _context5.abrupt("break", 14);

          case 6:
            graph.updateEdge.apply(graph, _toConsumableArray(externalDetail[1].sort()).concat([function () {
              return {
                type: "antialias",
                size: 1
              };
            }]));
            return _context5.abrupt("break", 14);

          case 8:
            graph.dropEdge.apply(graph, _toConsumableArray(externalDetail[1].sort()));
            return _context5.abrupt("break", 14);

          case 10:
            graph.dropNode(externalDetail[1]);
            return _context5.abrupt("break", 14);

          case 12:
            graph.forEachNode(function (node) {
              if (node === CONFIG.communication.hiddenAlias || node === "server") return;

              try {
                graph.dropNode(node);
              } catch (_unused2) {
                return;
              }
            });
            return _context5.abrupt("break", 14);

          case 14:
            circularLocations = (0, _circular.default)(graph);
            (0, _animate.animateNodes)(graph, circularLocations, {
              easing: "quadraticIn",
              duration: 2000
            });
            renderer.refresh();
            setSearchQuery(document.querySelector("#searchEntryField").value);

          case 18:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x11, _x12) {
    return _ref5.apply(this, arguments);
  };
}());

function activateNode(_x13) {
  return _activateNode.apply(this, arguments);
}

function _activateNode() {
  _activateNode = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(node) {
    return _regeneratorRuntime().wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            state.activeNode = node;
            renderer.refresh();
            if (node) if (graph.nodes().includes(node)) {
              camera.animate(renderer.getNodeDisplayData(node), {
                duration: 500
              });
            }
            if (authPeers.includes(node)) fusedStream.loadCache(node);

          case 4:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));
  return _activateNode.apply(this, arguments);
}

function generateNodeContext(_x14, _x15, _x16) {
  return _generateNodeContext.apply(this, arguments);
}

function _generateNodeContext() {
  _generateNodeContext = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16(node, isKnownConnection, mouseUpPromise) {
    var contextType, contextTypes, context, offset;
    return _regeneratorRuntime().wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            contextTypes = ["#node-context", "#connection-context"];

            if (!(node === "server" || node === CONFIG.communication.hiddenAlias)) {
              _context16.next = 5;
              break;
            }

            return _context16.abrupt("return");

          case 5:
            if (isKnownConnection) contextType = contextTypes[1];else contextType = contextTypes[0];

          case 6:
            context = document.querySelector(contextType);
            _context16.next = 9;
            return mouseUpPromise;

          case 9:
            context.style.visibility = "visible";
            contextTypes.splice(contextTypes.indexOf(contextType), 1);
            contextTypes.forEach(function (type) {
              document.querySelector(type).style.visibility = "hidden";
            });
            context.setAttribute("data-caller", node);
            offset = 0.1 / camera.ratio;
            context.style.left = 50 + offset + "%";
            context.style.bottom = 50 + offset + "%";
            raceNodeContextDismissEvents(context);

          case 17:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));
  return _generateNodeContext.apply(this, arguments);
}

function raceNodeContextDismissEvents(_x17) {
  return _raceNodeContextDismissEvents.apply(this, arguments);
}

function _raceNodeContextDismissEvents() {
  _raceNodeContextDismissEvents = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee25(context) {
    var funcs, resizeCall, contextClickCall, nonContextClickCall, wheelStageCall, raceTimeoutDefault, promiseConsequence;
    return _regeneratorRuntime().wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            funcs = {
              windowResizeEvent: function () {
                var _windowResizeEvent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17() {
                  return _regeneratorRuntime().wrap(function _callee17$(_context17) {
                    while (1) {
                      switch (_context17.prev = _context17.next) {
                        case 0:
                          nodeDismissHandler.dispatch("windowResize");

                        case 1:
                        case "end":
                          return _context17.stop();
                      }
                    }
                  }, _callee17);
                }));

                function windowResizeEvent() {
                  return _windowResizeEvent.apply(this, arguments);
                }

                return windowResizeEvent;
              }(),
              rightClickCanvasEvent: function () {
                var _rightClickCanvasEvent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18() {
                  return _regeneratorRuntime().wrap(function _callee18$(_context18) {
                    while (1) {
                      switch (_context18.prev = _context18.next) {
                        case 0:
                          nodeDismissHandler.dispatch("nonContextClick");

                        case 1:
                        case "end":
                          return _context18.stop();
                      }
                    }
                  }, _callee18);
                }));

                function rightClickCanvasEvent() {
                  return _rightClickCanvasEvent.apply(this, arguments);
                }

                return rightClickCanvasEvent;
              }(),
              clickContextEvent: function () {
                var _clickContextEvent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee19() {
                  return _regeneratorRuntime().wrap(function _callee19$(_context19) {
                    while (1) {
                      switch (_context19.prev = _context19.next) {
                        case 0:
                          nodeDismissHandler.dispatch("contextButtonClicked");

                        case 1:
                        case "end":
                          return _context19.stop();
                      }
                    }
                  }, _callee19);
                }));

                function clickContextEvent() {
                  return _clickContextEvent.apply(this, arguments);
                }

                return clickContextEvent;
              }(),
              clickCanvasEvent: function () {
                var _clickCanvasEvent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee20() {
                  return _regeneratorRuntime().wrap(function _callee20$(_context20) {
                    while (1) {
                      switch (_context20.prev = _context20.next) {
                        case 0:
                          nodeDismissHandler.dispatch("nonContextClick");

                        case 1:
                        case "end":
                          return _context20.stop();
                      }
                    }
                  }, _callee20);
                }));

                function clickCanvasEvent() {
                  return _clickCanvasEvent.apply(this, arguments);
                }

                return clickCanvasEvent;
              }(),
              clickNodeEvent: function () {
                var _clickNodeEvent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee21() {
                  return _regeneratorRuntime().wrap(function _callee21$(_context21) {
                    while (1) {
                      switch (_context21.prev = _context21.next) {
                        case 0:
                          nodeDismissHandler.dispatch("nonContextClick");

                        case 1:
                        case "end":
                          return _context21.stop();
                      }
                    }
                  }, _callee21);
                }));

                function clickNodeEvent() {
                  return _clickNodeEvent.apply(this, arguments);
                }

                return clickNodeEvent;
              }(),
              rightClickNodeEvent: function () {
                var _rightClickNodeEvent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee22() {
                  return _regeneratorRuntime().wrap(function _callee22$(_context22) {
                    while (1) {
                      switch (_context22.prev = _context22.next) {
                        case 0:
                          nodeDismissHandler.dispatch("nonContextClick");

                        case 1:
                        case "end":
                          return _context22.stop();
                      }
                    }
                  }, _callee22);
                }));

                function rightClickNodeEvent() {
                  return _rightClickNodeEvent.apply(this, arguments);
                }

                return rightClickNodeEvent;
              }(),
              wheelStageEvent: function () {
                var _wheelStageEvent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee23() {
                  return _regeneratorRuntime().wrap(function _callee23$(_context23) {
                    while (1) {
                      switch (_context23.prev = _context23.next) {
                        case 0:
                          nodeDismissHandler.dispatch("wheelStage");

                        case 1:
                        case "end":
                          return _context23.stop();
                      }
                    }
                  }, _callee23);
                }));

                function wheelStageEvent() {
                  return _wheelStageEvent.apply(this, arguments);
                }

                return wheelStageEvent;
              }(),
              doubleClickStageEvent: function () {
                var _doubleClickStageEvent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee24() {
                  return _regeneratorRuntime().wrap(function _callee24$(_context24) {
                    while (1) {
                      switch (_context24.prev = _context24.next) {
                        case 0:
                          nodeDismissHandler.dispatch("nonContextClick");

                        case 1:
                        case "end":
                          return _context24.stop();
                      }
                    }
                  }, _callee24);
                }));

                function doubleClickStageEvent() {
                  return _doubleClickStageEvent.apply(this, arguments);
                }

                return doubleClickStageEvent;
              }()
            };
            window.onresize = funcs["windowResizeEvent"];
            context.onmouseup = funcs["clickContextEvent"];
            renderer.on("rightClickStage", funcs["rightClickCanvasEvent"]);
            renderer.on("clickStage", funcs["clickCanvasEvent"]);
            renderer.on("wheelStage", funcs["wheelStageEvent"]);
            renderer.on("clickNode", funcs["clickNodeEvent"]);
            renderer.on("rightClickNode", funcs["rightClickNodeEvent"]);
            renderer.on("doubleClickStage", funcs["doubleClickStageEvent"]);
            resizeCall = nodeDismissHandler.acquireExpectedDispatch("windowResize", 60000);
            contextClickCall = nodeDismissHandler.acquireExpectedDispatch("contextButtonClicked", 60000);
            nonContextClickCall = nodeDismissHandler.acquireExpectedDispatch("nonContextClick", 60000);
            wheelStageCall = nodeDismissHandler.acquireExpectedDispatch("wheelStage", 60000);
            raceTimeoutDefault = nodeDismissHandler.acquireExpectedDispatch("defaultRaceResolveTimer", 59000);

            promiseConsequence = function promiseConsequence(_) {
              context.style.visibility = "hidden";
              activateNode();
              nodeDismissHandler.flushExpectedDispatches();
              window.removeEventListener("resize", funcs["windowResizeEvent"]);
              context.removeEventListener("mouseup", funcs["clickContextEvent"]);
              renderer.removeListener("rightClickStage", funcs["rightClickCanvasEvent"]);
              renderer.removeListener("clickStage", funcs["clickCanvasEvent"]);
              renderer.removeListener("wheelStage", funcs["wheelStageEvent"]);
              renderer.removeListener("clickNode", funcs["clickNodeEvent"]);
              renderer.removeListener("rightClickNode", funcs["rightClickNodeEvent"]);
              renderer.removeListener("doubleClickStage", funcs["doubleClickStageEvent"]);
            };

            Promise.race([resizeCall, contextClickCall, nonContextClickCall, wheelStageCall, raceTimeoutDefault]).then(promiseConsequence, promiseConsequence);

          case 16:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25);
  }));
  return _raceNodeContextDismissEvents.apply(this, arguments);
}

renderer.on("clickNode", /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(event) {
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            setTimeout(function () {
              ["successNodes", "errorNodes"].forEach(function (nodeState) {
                if (state[nodeState].indexOf(event.node) != -1) state[nodeState].splice(state[nodeState].indexOf(event.node), 1);
              });
              renderer.refresh();
              activateNode(event.node);

              if (mod.ALT) {
                if (event.node === "server" || event.node === CONFIG.communication.hiddenAlias) return;
                peerConnection.prototype.negotiateAgnosticAuthConnection(event.node);
              }
            }, 10);

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x18) {
    return _ref6.apply(this, arguments);
  };
}());
renderer.on("clickStage", /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(event) {
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            activateNode();

          case 1:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x19) {
    return _ref7.apply(this, arguments);
  };
}());
renderer.on("rightClickNode", /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(event) {
    var contextPromise;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            activateNode(event.node);

            if (!(event.node === "server")) {
              _context9.next = 3;
              break;
            }

            return _context9.abrupt("return");

          case 3:
            window.onmouseup = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
              return _regeneratorRuntime().wrap(function _callee8$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      nodeDismissHandler.dispatch("mouseUpMenuSpawnable");

                    case 1:
                    case "end":
                      return _context8.stop();
                  }
                }
              }, _callee8);
            }));
            contextPromise = nodeDismissHandler.acquireExpectedDispatch("mouseUpMenuSpawnable");
            generateNodeContext(event.node, authPeers.includes(event.node), contextPromise);

          case 6:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x20) {
    return _ref8.apply(this, arguments);
  };
}());
window.graphState = state;
window.generateNodeContext = generateNodeContext;
window.setSearchQuery = setSearchQuery;
window.activateNode = activateNode;
window.Graph = graph;
window.blinkStatus = blinkStatus;
window.renderer = renderer;