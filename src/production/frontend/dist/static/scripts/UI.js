"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/** @format */
window.addEventListener("DOMContentLoaded", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
  return _regeneratorRuntime().wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          document.querySelector("#searchEntryField").value = "";
          document.querySelector("#chatEntryField").style.height = document.querySelector("#chatEntryField").scrollHeight;
          document.querySelector("#chatEntryField").scrollTop = document.querySelector("#chatEntryField").style.scrollHeight;
          fusedStream = new FusedStream("messageFeedPane", "#messageSequence");
          fusedStream.chatInit();

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));
var noTransitionTimeout;
window.addEventListener("resize", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
  var set, _iterator, _step, element;

  return _regeneratorRuntime().wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          set = document.querySelectorAll("*");
          _iterator = _createForOfIteratorHelper(set);

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              element = _step.value;
              element.classList.add("force-noAnimation");
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          if (noTransitionTimeout) clearTimeout(noTransitionTimeout);
          noTransitionTimeout = setTimeout(function () {
            var _iterator2 = _createForOfIteratorHelper(set),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var element = _step2.value;
                element.classList.remove("force-noAnimation");
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }, 300);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
})));
var postcontext;
var connectioncardcontext;
var connectionspanel;
var fusedStream;
var eventStream;
var cachedConfigValues = {};

window.onload = function () {
  var _localStorage$config3;

  eventStream = new FusedStream("systemEventPane", "#systemEventSequence", false);
  eventStream.streamInit();
  var chatbar = document.querySelector("#chatEntryField");
  chatbar.style.height = "";
  chatbar.style.height = chatbar.scrollHeight + "px";
  document.querySelector("#searchEntryField").addEventListener("keydown", /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(e) {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (e.key == "ArrowDown" || e.key === "Enter") {
                e.preventDefault();
                document.querySelector(".search-opts-cap").focus();
              }

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }());
  document.querySelector("#searchEntryField").addEventListener("keyup", /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(e) {
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (e.key == "Backspace" || e.key == "Delete") {
                setSearchQuery(document.querySelector("#searchEntryField").value);
              }

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x2) {
      return _ref4.apply(this, arguments);
    };
  }());
  document.querySelector("#searchEntryField").addEventListener("keypress", /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(e) {
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              setSearchQuery(e.target.value + e.key);

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x3) {
      return _ref5.apply(this, arguments);
    };
  }());
  document.querySelector("#searchEntryField").addEventListener("focusin", /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(e) {
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              setSearchQuery(e.target.value);
              document.querySelector("#search-opts").style.visibility = "visible";

            case 2:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x4) {
      return _ref6.apply(this, arguments);
    };
  }());
  document.querySelector("#searchEntryField").addEventListener("focusout", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            setTimeout(function () {
              if (!document.querySelector("#search-opts").contains(document.activeElement)) {
                document.querySelector("#search-opts").style.visibility = "hidden";
              }
            });

          case 1:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  })));
  document.querySelector("#search-opts").addEventListener("focusout", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            setTimeout(function () {
              if (!(document.querySelector("#searchEntryField") == document.activeElement || document.querySelector("#search-opts").contains(document.activeElement))) {
                document.querySelector("#search-opts").style.visibility = "hidden";
              }
            });

          case 1:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  })));
  document.querySelector("#connectedNodesPane").addEventListener("scroll", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            document.querySelector("#search-opts").style.visibility = "hidden";
            document.querySelector("#connectedNodesPane").focus();

          case 2:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  })));
  document.querySelector("#graphContainer").addEventListener("contextmenu", /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(e) {
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              e.preventDefault();

            case 1:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));

    return function (_x5) {
      return _ref10.apply(this, arguments);
    };
  }());
  Array.from(document.querySelectorAll(".integerEntryField")).forEach(function (field) {
    field.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        field.blur();
        return;
      }

      if (!event.key.match(/^[0-9]+$/i)) {
        event.preventDefault();
      }
    });
    field.addEventListener("paste", function (event) {
      if (!(event.clipboardData || window.clipboardData).getData("text").match(/^[0-9]+$/i)) {
        event.preventDefault();
      }
    });
    field.addEventListener("focusin", function () {
      cachedConfigValues[field.id] = field.value;
    });
    field.addEventListener("focusout", function () {
      if (!field.value) field.value = cachedConfigValues[field.id];
      field.value = parseInt(field.value).toString();
      writeSetting(field.dataset.objective, parseInt(field.value));
    });
  });
  Array.from(document.querySelectorAll(".integerEntryContainer")).forEach(function (container) {
    container.style.cursor = "text";
    container.addEventListener("click", function () {
      Array.from(container.childNodes).filter(function (element) {
        if (!element.matches) return false;
        return element.matches(".integerEntryField");
      })[0].focus();
    });
  });
  Array.from(document.querySelectorAll(".settingsToggle")).forEach(function (toggle) {
    toggle.addEventListener("change", function () {
      if (toggle.dataset.objective === "doTURN") {
        exportToLS("doTURN", toggle.checked);
        writeSetting("rtc.ICEpresets.iceServers", toggle.checked ? STUNOnly : allICEServers);
        return;
      } else if (toggle.dataset.objective === "communication.moderateMapInstabilityTolerance") {
        writeSetting(toggle.dataset.objective, !toggle.checked);
        return;
      }

      writeSetting(toggle.dataset.objective, toggle.checked);
    });
  });
  Array.from(document.querySelectorAll(".settingsToggle")).forEach(function (element) {
    var _localStorage$config;

    if (Object.keys(JSON.parse((_localStorage$config = localStorage.config) !== null && _localStorage$config !== void 0 ? _localStorage$config : "{}")).includes(element.dataset.objective)) {
      if (element.dataset.objective === "communication.moderateMapInstabilityTolerance") {
        element.checked = !JSON.parse(localStorage.config)[element.dataset.objective];
        return;
      }

      element.checked = JSON.parse(localStorage.config)[element.dataset.objective];
    }
  });
  Array.from(document.querySelectorAll(".integerEntryField")).forEach(function (element) {
    var _localStorage$config2;

    if (Object.keys(JSON.parse((_localStorage$config2 = localStorage.config) !== null && _localStorage$config2 !== void 0 ? _localStorage$config2 : "{}")).includes(element.dataset.objective)) {
      element.value = JSON.parse(localStorage.config)[element.dataset.objective];
    }
  });
  onAuthRejected(function (_sig, externalDetail) {
    var _hiddenAliasLookup$ex;

    eventStream.log("system", "Authentication request rejected by ".concat(CONFIG.UI.renderUnfamiliarPublicAliases ? (_hiddenAliasLookup$ex = hiddenAliasLookup[externalDetail]) !== null && _hiddenAliasLookup$ex !== void 0 ? _hiddenAliasLookup$ex : externalDetail : externalDetail), "transient", ["align-center", "system-message-card-error", "message-card-slim"]);
  });

  if (!JSON.parse((_localStorage$config3 = localStorage.config) !== null && _localStorage$config3 !== void 0 ? _localStorage$config3 : "{}")["UI.renderUnfamiliarPublicAliases"]) {
    var field = document.querySelector("#searchEntryField");
    field.disabled = true;
    field.placeholder = "Cannot search, public aliases are disabled";
  }

  postcontext = new standardContextMenu("post-context", "messagefeed");
  connectioncardcontext = new standardContextMenu("connection-card-context", "connectedNodesPane");
  connectionspanel = new connectionsPanel();
  connectionspanel.renderConnectionCards();
  onAuthPeersUpdated(function (_signalID, externalDetail) {
    var _fusedStream$chatCach, _fusedStream$chatCach2, _fusedStream$chatCach3;

    if (externalDetail[0] == "addition") {
      if (livePeers[externalDetail[1]]) {
        fusedStream.addAndLoadPeerStream(externalDetail[1]);

        if (eventStream.dontAlert.includes(externalDetail[1])) {
          eventStream.dontAlert.splice(eventStream.dontAlert.indexOf(externalDetail[1]), 1);
        } else {
          var _hiddenAliasLookup$ex2;

          eventStream.log("system", "Successfully authenticated peer session with ".concat(CONFIG.UI.renderUnfamiliarPublicAliases ? (_hiddenAliasLookup$ex2 = hiddenAliasLookup[externalDetail[1]]) !== null && _hiddenAliasLookup$ex2 !== void 0 ? _hiddenAliasLookup$ex2 : externalDetail[1] : externalDetail[1]), "transient", ["align-center", "system-message-card-success", "message-card-slim"]);
        }

        if (!eventHandler.handlerFrame["consumableAuth | ".concat(livePeers[externalDetail[1]].internalUID)]) livePeers[externalDetail[1]].onConsumableAuth(function (_signal, _externalDetail_) {
          fusedStream.log(externalDetail[1], _externalDetail_, "remote", ["message-card-unread"]);
        });
        fusedStream.chatCache[externalDetail[1]].isActive = true;
      }
    }

    if (externalDetail[0] == "deletion") {
      var _hiddenAliasLookup$ex3;

      fusedStream.log(externalDetail[1], "Peer session deauthenticated", "transient", ["align-center", "system-message-card-error", "message-card-slim"]);
      eventStream.log("system", "Peer session with ".concat(CONFIG.UI.renderUnfamiliarPublicAliases ? (_hiddenAliasLookup$ex3 = hiddenAliasLookup[externalDetail[1]]) !== null && _hiddenAliasLookup$ex3 !== void 0 ? _hiddenAliasLookup$ex3 : externalDetail[1] : externalDetail[1], " deauthenticated"), "transient", ["align-center", "system-message-card-error", "message-card-slim"]);
      fusedStream.chatCache[externalDetail[1]].isActive = false;
    }

    if (!((_fusedStream$chatCach = (_fusedStream$chatCach2 = fusedStream.chatCache) === null || _fusedStream$chatCach2 === void 0 ? void 0 : (_fusedStream$chatCach3 = _fusedStream$chatCach2[externalDetail[1]]) === null || _fusedStream$chatCach3 === void 0 ? void 0 : _fusedStream$chatCach3.isActive) !== null && _fusedStream$chatCach !== void 0 ? _fusedStream$chatCach : true)) {
      document.querySelector(".sendbutton").style.setProperty("pointer-events", "none");
      document.querySelector(".sendbutton").style.setProperty("filter", "brightness(330%)");
    } else {
      document.querySelector(".sendbutton").style.removeProperty("pointer-events");
      document.querySelector(".sendbutton").style.removeProperty("filter");
    }

    connectionspanel.renderConnectionCards();
    authPeers.forEach(function (node) {
      Graph.updateNodeAttribute(node, "type", function () {
        return "related";
      });
    });
  });
};

var RightPanel = /*#__PURE__*/function () {
  function RightPanel() {
    _classCallCheck(this, RightPanel);

    this.activePane = "messageFeedPane";
  }

  _createClass(RightPanel, [{
    key: "rotateIn",
    value: function rotateIn(target) {
      if (Math.sign(new DOMMatrix(window.getComputedStyle(document.querySelector("#".concat(target))).getPropertyValue("transform")).f) === -1) {
        if (this.activePane == "messageFeedPane") {
          document.querySelector("#".concat(this.activePane)).style.transform = "translate3d(0px, 100vh, 0px)";
        } else {
          document.querySelector("#".concat(this.activePane)).style.transform = "translate3d(0px, 0vh, 0px)";
        }
      } else {
        if (this.activePane == "messageFeedPane") {
          document.querySelector("#".concat(this.activePane)).style.transform = "translate3d(0px, -100vh, 0px)";
        } else {
          document.querySelector("#".concat(this.activePane)).style.transform = "translate3d(0px, -200vh, 0px)";
        }
      }

      if (target === "messageFeedPane") {
        document.querySelector("#".concat(target)).style.transform = "translate3d(0px, 0vh, 0px)";
      } else {
        document.querySelector("#".concat(target)).style.transform = "translate3d(0px, -100vh, 0px)";
      }

      var initialState = this.activePane;
      this.activePane = target;
      if (target === "messageFeedPane" && target != initialState) fusedStream.refresh();
    }
  }]);

  return RightPanel;
}();

var rightPanel = new RightPanel();

var FusedStream = /*#__PURE__*/function () {
  function FusedStream(paneID, messageSequenceSelector, isInteractive) {
    var _this = this;

    _classCallCheck(this, FusedStream);

    this.panel = rightPanel;
    this.pane = paneID;
    this.messageSequenceContainer = document.querySelector(messageSequenceSelector);
    this.chatCache = {};
    this.activeChat = undefined;
    this.isInteractive = isInteractive !== null && isInteractive !== void 0 ? isInteractive : true;
    this.dontAlert = [];
    this.tutorialSpawnable = false;

    this.tutorialWatcher = function () {
      eventHandler.acquireExpectedDispatch("messageSubmit", 200000000).then(_this.tutorialLoader, _this.tutorialWatcher);
    };

    this.tutorialLoader = function (value) {
      _this.tutorialWatcher();

      if (!(_this.tutorialSpawnable && _this.activeChat == "system" && (value.externalDetail.toLowerCase() == "yes" || value.externalDetail.toLowerCase() == "tutorial"))) {
        return;
      } else {
        _this.tutorial();
      }
    };
  }

  _createClass(FusedStream, [{
    key: "chatInit",
    value: function () {
      var _chatInit = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
        var _localStorage$config4;

        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                if (!JSON.parse((_localStorage$config4 = localStorage.config) !== null && _localStorage$config4 !== void 0 ? _localStorage$config4 : "{}")["communication.hiddenAlias"]) {
                  this.makeCache("system", {
                    transient: "System",
                    local: "Me"
                  }, true);
                  this.loadCache("system");
                  eventHandler.acquireExpectedDispatch("configLoaded", 200000000).then(this.loadDefaultWelcomeSequence.bind(this), function () {});
                }

              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function chatInit() {
        return _chatInit.apply(this, arguments);
      }

      return chatInit;
    }()
  }, {
    key: "streamInit",
    value: function () {
      var _streamInit = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12() {
        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                this.makeCache("system", {
                  transient: "System"
                }, true);
                this.loadCache("system");

              case 2:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function streamInit() {
        return _streamInit.apply(this, arguments);
      }

      return streamInit;
    }()
  }, {
    key: "loadDefaultWelcomeSequence",
    value: function () {
      var _loadDefaultWelcomeSequence = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13() {
        var _this2 = this;

        return _regeneratorRuntime().wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                if (effectiveFirstVisit) {
                  _context13.next = 2;
                  break;
                }

                return _context13.abrupt("return");

              case 2:
                this.tutorialSpawnable = true;
                this.log("system", "Welcome to Membranexus.com, ".concat(CONFIG.communication.publicAlias, "!"), "transient", ["message-card-slim"]);
                setTimeout(function () {
                  _this2.log("system", "I'd love to give you a few tips on using this site, if you like.<br><br><i>Type and send \"yes\" at any time to begin the tutorial.</i>", "transient", ["message-card-slim"]);
                }, 1000);
                this.tutorialWatcher();
                eventHandler.onReceipt("messageSubmit", function (_sig, externalDetail) {
                  if (_this2.activeChat == "system" && externalDetail.toLowerCase() == "stop") {
                    eventHandler.dispatch("tutorialHalt");
                  }
                });

              case 7:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function loadDefaultWelcomeSequence() {
        return _loadDefaultWelcomeSequence.apply(this, arguments);
      }

      return loadDefaultWelcomeSequence;
    }()
  }, {
    key: "tutorial",
    value: function () {
      var _tutorial = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14() {
        var _this3 = this;

        var messageInterval, messageSets, _i, _messageSets, i;

        return _regeneratorRuntime().wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                this.tutorialSpawnable = false;
                messageInterval = 4000;
                messageSets = [["Great, with your cleverness and my teaching, I know you'll be a pro at this site in no time.", []], ["But first of all, <i>why</i> is this site?", []], ["Well, it's just one small, demonstrative piece of the jigsaw surrounding the Membrane project.", []], ["I would never bore you with the details, but it is the very beating heart of this site.", []], ["It allows high-speed, robust data transfer networks with little need for a server", []], ["Which is where this site comes in.", []], ["You see that graph in the middle of your screen?.", []], ["That's every other person on this site right now.", []], ["You're connected to them all, directly or indirectly.", []], ["And you could talk to any one of them, just like you and I are right now", []], ["At the press of the button, with no clunky server to slow you down.", []], ["Oh, and don't worry about security, all of your messages are strongly end-to-end encrypted", []], ["Just watch out; with no server to patrol for fakes and phonies", []], ["You can never know who you're <i>actually</i> talking to.", []], ["Now, on to more interesting things:", []], ["Actually using the app.", []], ["If you look at the graph again, you'll see one veeery big dot.", []], ["That's just the initial signalling server. Don't worry about him.", []], ["However, if you look a bit closer, you may also see one slightly smaller, medium dot.", []], ["If you don't, don't worry. That just means you're all alone on the network right now", []], ["So there's no need to show you, or who you're connected to.", []], ["If you wait around a little longer, someone may come online for you to talk to.", []], ["And your dot will finally appear.", []], ["At any rate, this dot is you.", []], ["There should be other, smaller dots, too.", []], ["These are your new friends.", []], ["Some of them will have lines connecting them to you.", []], ["Don't worry, that just means you'll have a much harder time accidentally falling off the face of the network.", []], ["However, if you wish to <i>Authenticate</i> someone,", []], ["That is, become able to directly message them...", []], ["There are two ways you can do it.", []], ["You can either (a: right-click on their dot and select \"Establish Authenticated Connection\"", []], ["Or, (b: if you want to be super-cool, click the dot normally while holding the \"Alt\" key.", []], ["Either way, if they accept your request,", []], ["And this can take a long time, if they're not actively using the site,", []], ["You'll see their \"name\" appear in that bottom left corner.", []], ["You'll also see a green dot pop up beside your \"Notifications\" button.", []], ["This means you have a new notification.", []], ["If they reject, it'll be a red dot and no new friend.", []], [":(", []], ["Aaaaannnnyhowwww,", []], ["Once you get a new pal,", []], ["You can either click on their network dot,", []], ["Or else on their name-tile,", []], ["To open up a chat with them. From here, it's pretty straightforward to send a message.", []], ["But about notifications again.", []], ["You've met dots red and green, but what about blue?", []], ["If you see this, it means that <i>somebody else</i> wants to chat with <i>you</i>.", []], ["Just click on the notifications button to see their request.", []], ["Here, you can click either \"accept\" or \"reject", []], ["But never. Ever. Reject.", []], ["Because it's real mean.", []], ["Oh! I almost forgot.", []], ["You can configure this app to your heart's desire.", []], ["Just press the \"Configuration\" button in your menu.", []], ["The options will tell you what they do.", []], ["So I shouldn't need to.", []], ["...", []], ["And would you look at that.", []], ["What did I say>", []], ["Are you a pro at this site or what?", []], ["And so it looks like it's time for me to take my leave.", []], ["Adieu, my lovely new friend.", []], ["Thanks so much for talking with me.", []], ["Maybe we will again some day.", []], ["<i>Tutorial completed</i><br>To return to this page at a later time, simply double-click the \"Messages\" button in your side-menu. To replay this tutorial, simply send the word \"tutorial\" to this chat.", []], ["Also, for a more <i>adequate</i> review of the underlying membrane mechanism, take a look at the project's <a href=\"https://github.com/Elijah-Bodden/Membrane\" style=\"color: #000; text-decoration: underline;\">documentation</a>", []]];
                eventHandler.acquireExpectedDispatch("tutorialHalt", 200000000).then(function () {
                  _this3.tutorialSpawnable = true;
                  setTimeout(function () {
                    _this3.log("system", "Okay. Goodbye and thank you so much for chatting with me, I had a great time. If you ever want to talk again, just send me a message saying \"tutorial.\" I'll know what you mean. Also, you can press the \"messages\" button twice any time and it'll take you here.", "transient", ["message-card-slim"]);
                  }, 1000);
                }, function () {});
                _i = 0, _messageSets = messageSets;

              case 5:
                if (!(_i < _messageSets.length)) {
                  _context14.next = 21;
                  break;
                }

                i = _messageSets[_i];
                _context14.prev = 7;
                _context14.next = 10;
                return eventHandler.acquireExpectedDispatch("neverDispatch", messageInterval);

              case 10:
                _context14.next = 18;
                break;

              case 12:
                _context14.prev = 12;
                _context14.t0 = _context14["catch"](7);

                if (!this.tutorialSpawnable) {
                  _context14.next = 16;
                  break;
                }

                return _context14.abrupt("return");

              case 16:
                this.log("system", i[0], "transient", [].concat(_toConsumableArray(i[1]), ["message-card-slim"]));
                return _context14.abrupt("continue", 18);

              case 18:
                _i++;
                _context14.next = 5;
                break;

              case 21:
                eventHandler.forceReject("messageSubmit");
                this.tutorialSpawnable = true;

              case 23:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this, [[7, 12]]);
      }));

      function tutorial() {
        return _tutorial.apply(this, arguments);
      }

      return tutorial;
    }()
  }, {
    key: "makeCache",
    value: function () {
      var _makeCache = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(ID, members) {
        return _regeneratorRuntime().wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                if (!this.chatCache[ID]) {
                  _context15.next = 2;
                  break;
                }

                return _context15.abrupt("return");

              case 2:
                this.chatCache[ID] = {
                  members: members,
                  isActive: true,
                  exchange: []
                };

              case 3:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function makeCache(_x6, _x7) {
        return _makeCache.apply(this, arguments);
      }

      return makeCache;
    }()
  }, {
    key: "refresh",
    value: function () {
      var _refresh = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16() {
        return _regeneratorRuntime().wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                this.loadCache(this.activeChat);

              case 1:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function refresh() {
        return _refresh.apply(this, arguments);
      }

      return refresh;
    }()
  }, {
    key: "loadCache",
    value: function () {
      var _loadCache = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17(ID) {
        var _this4 = this;

        return _regeneratorRuntime().wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                if (this.chatCache[ID] && this.panel.activePane === this.pane) {
                  this.messageSequenceContainer.innerHTML = this.chatCache[ID].exchange.reduce(function (previous, message, index) {
                    return _this4.formatMessageCard(message, index, _this4.chatCache[ID]) + previous;
                  }, "");
                  Array.from(document.querySelectorAll(".colorDot")).forEach(function (element) {
                    element.style.removeProperty("position");
                    element.style.removeProperty("visibility");
                  });
                }

                if (this.isInteractive) {
                  if (!this.chatCache[ID].isActive) {
                    document.querySelector(".sendbutton").style.setProperty("pointer-events", "none");
                    document.querySelector(".sendbutton").style.setProperty("filter", "brightness(330%)");
                  } else {
                    document.querySelector(".sendbutton").style.removeProperty("pointer-events");
                    document.querySelector(".sendbutton").style.removeProperty("filter");
                  }
                }

                document.querySelector(".chattingwithheader").innerHTML = "Chatting with ".concat(this.getRenderableID(ID), ":");
                this.activeChat = ID;

              case 4:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function loadCache(_x8) {
        return _loadCache.apply(this, arguments);
      }

      return loadCache;
    }()
  }, {
    key: "getRenderableID",
    value: function getRenderableID(ID) {
      var _hiddenAliasLookup$ID;

      if (ID === "system") return "System";

      if (!CONFIG.UI.renderUnfamiliarPublicAliases) {
        return ID;
      }

      return (_hiddenAliasLookup$ID = hiddenAliasLookup[ID]) !== null && _hiddenAliasLookup$ID !== void 0 ? _hiddenAliasLookup$ID : ID;
    }
  }, {
    key: "log",
    value: function () {
      var _log = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18(ID, data, polarity) {
        var tags,
            adhoc,
            date,
            index,
            _args18 = arguments;
        return _regeneratorRuntime().wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                tags = _args18.length > 3 && _args18[3] !== undefined ? _args18[3] : [];
                adhoc = _args18.length > 4 && _args18[4] !== undefined ? _args18[4] : "";
                date = new Date().toUTCString();
                data = ID === "system" && polarity === "transient" ? "[system]: " + data : data;
                index = this.chatCache[ID].exchange.push({
                  data: data,
                  polarity: polarity,
                  tags: tags,
                  date: date,
                  adhoc: adhoc
                }) - 1;

                if (!(!this.isInteractive && this.panel.activePane !== this.pane)) {
                  _context18.next = 15;
                  break;
                }

                _context18.t0 = tags.filter(function (tag) {
                  return tag.indexOf("system-message-card-") === 0;
                }).map(function (tag) {
                  return tag.slice(20);
                })[0];
                _context18.next = _context18.t0 === "route-pending" ? 9 : _context18.t0 === "success" ? 11 : _context18.t0 === "error" ? 13 : 15;
                break;

              case 9:
                document.querySelector("#pending-dot").style.cssText = "visibility: visible; position: relative;";
                return _context18.abrupt("break", 15);

              case 11:
                document.querySelector("#success-dot").style.cssText = "visibility: visible; position: relative;";
                return _context18.abrupt("break", 15);

              case 13:
                document.querySelector("#error-dot").style.cssText = "visibility: visible; position: relative;";
                return _context18.abrupt("break", 15);

              case 15:
                if (this.panel.activePane === this.pane && this.activeChat === ID) {
                  this.messageSequenceContainer.innerHTML = this.formatMessageCard(this.chatCache[ID].exchange[index], index, this.chatCache[ID]) + this.messageSequenceContainer.innerHTML;
                }

              case 16:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function log(_x9, _x10, _x11) {
        return _log.apply(this, arguments);
      }

      return log;
    }()
  }, {
    key: "unLog",
    value: function () {
      var _unLog = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee19(ID, index) {
        return _regeneratorRuntime().wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                if (this.chatCache[ID]) {
                  _context19.next = 2;
                  break;
                }

                return _context19.abrupt("return");

              case 2:
                this.chatCache[ID].exchange.splice(index, 1);
                this.optionalLoad(ID);

              case 4:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function unLog(_x12, _x13) {
        return _unLog.apply(this, arguments);
      }

      return unLog;
    }()
  }, {
    key: "optionalLoad",
    value: function () {
      var _optionalLoad = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee20(ID) {
        return _regeneratorRuntime().wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                if (this.activeChat === ID) this.loadCache(ID);

              case 1:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function optionalLoad(_x14) {
        return _optionalLoad.apply(this, arguments);
      }

      return optionalLoad;
    }()
  }, {
    key: "formatMessageCard",
    value: function formatMessageCard(renderPackage, index, cache, adhoc) {
      if (renderPackage.tags.includes("system-message-card-route-pending")) {
        return this.formatConfirmationCard(renderPackage, index, cache, renderPackage.adhoc);
      }

      var card = "<div class=\"".concat(renderPackage.tags.join(" "), " message-card message-card-").concat(renderPackage.polarity, "\">\n    <i class=\"icon post-kebab kebab fa-solid fa-ellipsis-vertical\" onclick=\"postcontext.click(event)\" data-index=\"").concat(index, "\" data-content=\"").concat(renderPackage.data, "\" data-sender=\"").concat(cache.members[renderPackage.polarity], "\"></i>\n    <p class=\"card-text\">").concat(renderPackage.data, "</p>\n\n    <p class=\"date\">").concat(getRenderableDate(renderPackage.date), "</p>\n    </div>");

      if (renderPackage.tags.includes("message-card-unread")) {
        renderPackage.tags.splice(renderPackage.tags.indexOf("message-card-unread"), 1);
      }

      return card;
    }
  }, {
    key: "formatConfirmationCard",
    value: function formatConfirmationCard(renderPackage, index, cache, adhoc) {
      var card = "<div class=\"".concat(renderPackage.tags.join(" "), " message-card message-card-").concat(renderPackage.polarity, "\">\n    <p class=\"card-text\">").concat(renderPackage.data, "</p>\n\n    <div class=\"routePendingButtonContainer\">\n    <button class=\"routePendingButton routeAcceptButton\" onclick=\"eventHandler.dispatch('authenticationAuthorized|").concat(adhoc, "'); eventStream.replaceAttribute('system', ").concat(index, ", 'system-message-card-route-pending', 'system-message-card-success'); eventStream.dontAlert.push('").concat(adhoc, "')\">Accept</button>\n    <button class=\"routePendingButton routeRejectButton\" onclick=\"eventHandler.forceReject('authenticationAuthorized|").concat(adhoc, "'); eventStream.replaceAttribute('system', ").concat(index, ", 'system-message-card-route-pending', 'system-message-card-error')\">Reject</button>\n    </div>\n    <p class=\"date\">").concat(getRenderableDate(renderPackage.date), "</p>\n    </div>");
      return card;
    }
  }, {
    key: "replaceAttribute",
    value: function () {
      var _replaceAttribute = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee21(ID, cardID, initialAttribute, newAttribute) {
        return _regeneratorRuntime().wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                this.chatCache[ID].exchange[cardID].tags.push(newAttribute);
                this.deleteAttribute(ID, cardID, initialAttribute);

              case 2:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function replaceAttribute(_x15, _x16, _x17, _x18) {
        return _replaceAttribute.apply(this, arguments);
      }

      return replaceAttribute;
    }()
  }, {
    key: "deleteAttribute",
    value: function () {
      var _deleteAttribute = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee22(ID, cardID, attribute) {
        return _regeneratorRuntime().wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                if (this.chatCache[ID].exchange[cardID].tags.includes(attribute)) {
                  this.chatCache[ID].exchange[cardID].tags.splice(this.chatCache[ID].exchange[cardID].tags.indexOf(attribute), 1);
                }

                this.optionalLoad(ID);

              case 2:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function deleteAttribute(_x19, _x20, _x21) {
        return _deleteAttribute.apply(this, arguments);
      }

      return deleteAttribute;
    }()
  }, {
    key: "addAndLoadPeerStream",
    value: function () {
      var _addAndLoadPeerStream = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee23(peerID) {
        return _regeneratorRuntime().wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                _context23.next = 2;
                return this.makeCache(peerID, {
                  transient: "system",
                  local: "Me",
                  remote: peerID
                });

              case 2:
                this.optionalLoad(peerID);
                this.log(peerID, "Peer session successfully authenticated", "transient", ["align-center", "system-message-card-success", "message-card-slim"]);

              case 4:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      function addAndLoadPeerStream(_x22) {
        return _addAndLoadPeerStream.apply(this, arguments);
      }

      return addAndLoadPeerStream;
    }()
  }, {
    key: "downloadContent",
    value: function () {
      var _downloadContent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee24(ID) {
        var _this5 = this;

        var raw, downloadAnchor;
        return _regeneratorRuntime().wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                raw = this.chatCache[ID].exchange.reduce(function (sum, component) {
                  return sum + "".concat(_this5.getRenderableID(_this5.chatCache[ID].members[component.polarity]), " (").concat(component.polarity, "): ").concat(component.data, "\n");
                }, "");
                downloadAnchor = document.createElement("a");
                downloadAnchor.href = "data:text/plain;charset=utf-8," + encodeURIComponent(raw);
                downloadAnchor.target = "_blank";
                downloadAnchor.download = "".concat(ID, "-conversation.txt");
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                document.body.removeChild(downloadAnchor);

              case 8:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function downloadContent(_x23) {
        return _downloadContent.apply(this, arguments);
      }

      return downloadContent;
    }()
  }]);

  return FusedStream;
}();

var standardContextMenu = /*#__PURE__*/function () {
  function standardContextMenu(id, parentID) {
    _classCallCheck(this, standardContextMenu);

    this.parentID = parentID ? "#".concat(parentID) : "document";
    this.container = document.querySelector(this.parentID);
    this.eventhandler = new eventHandlingMechanism();
    this.active = false;
    this.id = id;
    this.menu = document.querySelector("#".concat(this.id));
  }

  _createClass(standardContextMenu, [{
    key: "raceDismissEvents",
    value: function () {
      var _raceDismissEvents = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee28() {
        var _this6 = this;

        var triggerFunctions, promiseConsequence;
        return _regeneratorRuntime().wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                triggerFunctions = {
                  windowResizeEvent: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee25() {
                    return _regeneratorRuntime().wrap(function _callee25$(_context25) {
                      while (1) {
                        switch (_context25.prev = _context25.next) {
                          case 0:
                            this.eventhandler.dispatch("windowResize");

                          case 1:
                          case "end":
                            return _context25.stop();
                        }
                      }
                    }, _callee25, this);
                  })).bind(this),
                  clickContextEvent: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee26() {
                    return _regeneratorRuntime().wrap(function _callee26$(_context26) {
                      while (1) {
                        switch (_context26.prev = _context26.next) {
                          case 0:
                            this.eventhandler.dispatch("contextButtonClicked");

                          case 1:
                          case "end":
                            return _context26.stop();
                        }
                      }
                    }, _callee26, this);
                  })).bind(this),
                  clickDocumentEvent: /*#__PURE__*/function () {
                    var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee27(e) {
                      return _regeneratorRuntime().wrap(function _callee27$(_context27) {
                        while (1) {
                          switch (_context27.prev = _context27.next) {
                            case 0:
                              if (e.clientY < this.menu.getBoundingClientRect().top || e.clientY > this.menu.getBoundingClientRect().bottom || e.clientX > this.menu.getBoundingClientRect().right || e.clientX < this.menu.getBoundingClientRect().left) {
                                this.eventhandler.dispatch("nonContextClick");
                              }

                            case 1:
                            case "end":
                              return _context27.stop();
                          }
                        }
                      }, _callee27, this);
                    }));

                    return function (_x24) {
                      return _ref13.apply(this, arguments);
                    };
                  }().bind(this)
                };
                window.onresize = triggerFunctions.windowResizeEvent;
                this.menu.onmouseup = triggerFunctions.clickContextEvent;
                window.onmousedown = triggerFunctions.clickDocumentEvent;

                promiseConsequence = function promiseConsequence(_) {
                  _this6.menu.style.visibility = "hidden";

                  _this6.eventhandler.flushExpectedDispatches();

                  window.removeEventListener("resize", triggerFunctions.windowResizeEvent);

                  _this6.menu.removeEventListener("mouseup", triggerFunctions.clickContextEvent);

                  window.removeEventListener("mousedown", triggerFunctions.clickContextEvent);
                };

                Promise.race(["windowResize", "contextButtonClicked", "nonContextClick"].map(function (listener) {
                  return _this6.eventhandler.acquireExpectedDispatch(listener, 6000000);
                })).then(promiseConsequence, promiseConsequence);

              case 6:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28, this);
      }));

      function raceDismissEvents() {
        return _raceDismissEvents.apply(this, arguments);
      }

      return raceDismissEvents;
    }()
  }, {
    key: "click",
    value: function click(event) {
      var _this7 = this;

      ["data-reference", "data-index", "data-content", "data-sender"].forEach(function (propery) {
        return _this7.menu.setAttribute(propery, event.target.getAttribute(propery));
      });
      this.menu.style.visibility = "visible";
      this.menu.style.top = "".concat(event.target.getBoundingClientRect().top + this.container.scrollTop - this.container.offsetTop, "px");
      this.menu.style.right = "".concat(this.container.getBoundingClientRect().right - event.target.getBoundingClientRect().left, "px");
      this.raceDismissEvents();
    }
  }]);

  return standardContextMenu;
}();

var connectionsPanel = /*#__PURE__*/function () {
  function connectionsPanel() {
    _classCallCheck(this, connectionsPanel);

    this.container = document.querySelector("#connectedNodeCardContainer");
  }

  _createClass(connectionsPanel, [{
    key: "formatConnectionCard",
    value: function formatConnectionCard(label) {
      return "<div class=\"connectedNodeCard\" onclick=\"((event) => {if (event.target!==event.currentTarget&&event.target!==event.currentTarget.firstChild) return; rightPanel.rotateIn('messageFeedPane'); fusedStream.loadCache('".concat(label, "')})(event)\"><p class=\"nodeCardText\">@").concat(CONFIG.UI.renderUnfamiliarPublicAliases ? hiddenAliasLookup[label] : label, "</p><i class=\"icon kebab connection-kebab fa-solid fa-ellipsis-vertical\" onclick=\"connectioncardcontext.click(event)\" data-index=\"\" data-reference=\"").concat(label, "\" tabindex=0></i></div>");
    }
  }, {
    key: "renderConnectionCards",
    value: function renderConnectionCards() {
      var _this8 = this;

      this.container.innerHTML = "";
      authPeers.forEach(function (connection) {
        if (!connection) return;
        _this8.container.innerHTML = _this8.formatConnectionCard(connection) + _this8.container.innerHTML;
      });
    }
  }]);

  return connectionsPanel;
}();

function hiddenAliasPromptMenu() {
  return _hiddenAliasPromptMenu.apply(this, arguments);
}

function _hiddenAliasPromptMenu() {
  _hiddenAliasPromptMenu = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee29() {
    var flashLock, flashInterval, deisredAlias;
    return _regeneratorRuntime().wrap(function _callee29$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            document.querySelector("#aliasEntryField").addEventListener("keypress", function (event) {
              if (event.key === "Enter") {
                event.preventDefault();
                document.querySelector("#aliasEntryButton").focus();
                return;
              }

              if (!event.key.match(/^[a-z0-9 ]+$/i)) {
                flashLock = +new Date();
                event.preventDefault();
                event.target.parentElement.style.setProperty("border-color", "#BB4141", "important");
              }

              if (event.target.value.length >= 32) {
                flashLock = +new Date();
                event.target.parentElement.style.setProperty("border-color", "#BB4141", "important");
              }
            });
            document.querySelector("#aliasEntryField").addEventListener("paste", function (event) {
              if (!(event.clipboardData || window.clipboardData).getData("text").match(/^[a-z0-9 ]+$/i)) {
                flashLock = +new Date();
                event.preventDefault();
                event.target.parentElement.style.setProperty("border-color", "#BB4141", "important");
              }

              if (event.target.value.length + (event.clipboardData || window.clipboardData).getData("text").length > 32) {
                flashLock = +new Date();
                event.target.parentElement.style.setProperty("border-color", "#BB4141", "important");
              }
            });
            flashInterval = setInterval(function () {
              if (+new Date() - flashLock >= 700) document.querySelector(".aliasEntryArea").style.removeProperty("border-color");
            }, 15);
            document.querySelector("#aliasEntryWrapper").style.visibility = "visible";
            _context29.next = 6;
            return eventHandler.acquireExpectedDispatch("hiddenAliasDelivered", 100000000);

          case 6:
            deisredAlias = _context29.sent.externalDetail;
            document.querySelector("#aliasEntryWrapper").style.visibility = "hidden";
            clearInterval(flashInterval);
            return _context29.abrupt("return", deisredAlias);

          case 10:
          case "end":
            return _context29.stop();
        }
      }
    }, _callee29);
  }));
  return _hiddenAliasPromptMenu.apply(this, arguments);
}

function getRenderableDate(UTCString) {
  var localTime = new Date(UTCString).toString().split(" ");

  if (JSON.stringify(localTime.slice(1, 3)) == JSON.stringify(new Date().toString().split(" ").slice(1, 3))) {
    if (parseInt(localTime[4].split(":")[0]) >= 12 && parseInt(localTime[4].split(":")[0]) != 24) {
      return "".concat(parseInt(localTime[4].split(":")[0]) - 12 == 0 ? 12 : parseInt(localTime[4].split(":")[0]) - 12, ":").concat(localTime[4].split(":")[1], " p.m. Today");
    }

    var amHours = parseInt(localTime[4].split(":")[0]) == 0 ? 12 : parseInt(localTime[4].split(":")[0]);
    return "".concat(amHours, ":").concat(localTime[4].split(":")[1], " a.m. Today");
  } else if (new Date().toString().split(" ")[3] == localTime[3]) {
    return "".concat(localTime[0], ", ").concat(localTime[1], " ").concat(localTime[2]);
  } else {
    return "".concat(localTime[0], ", ").concat(localTime[1], " ").concat(localTime[2], ", ").concat(localTime[3]);
  }
}

var settingsManager = /*#__PURE__*/_createClass(function settingsManager() {
  _classCallCheck(this, settingsManager);

  this.panel = rightPanel;
  this.pane = document.querySelector("#configpane");
});

function toggleDescription(_x25) {
  return _toggleDescription.apply(this, arguments);
}

function _toggleDescription() {
  _toggleDescription = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee30(event) {
    var explanation;
    return _regeneratorRuntime().wrap(function _callee30$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            explanation = Array.from(event.target.parentNode.childNodes).filter(function (element) {
              if (!element.matches) return false;
              return element.matches(".configTextDescription");
            })[0];

            if (explanation.style.visibility == "visible") {
              explanation.style.removeProperty("visibility");
              explanation.style.removeProperty("position");
            } else {
              explanation.style.setProperty("visibility", "visible");
              explanation.style.setProperty("position", "relative");
            }

          case 2:
          case "end":
            return _context30.stop();
        }
      }
    }, _callee30);
  }));
  return _toggleDescription.apply(this, arguments);
}

function exportToLS(_x26, _x27) {
  return _exportToLS.apply(this, arguments);
}

function _exportToLS() {
  _exportToLS = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee31(reference, value) {
    var tempConfig;
    return _regeneratorRuntime().wrap(function _callee31$(_context31) {
      while (1) {
        switch (_context31.prev = _context31.next) {
          case 0:
            if (!window.localStorage.config) window.localStorage.config = "{}";
            tempConfig = JSON.parse(window.localStorage.config);
            tempConfig[reference] = value;
            window.localStorage.config = JSON.stringify(tempConfig);

          case 4:
          case "end":
            return _context31.stop();
        }
      }
    }, _callee31);
  }));
  return _exportToLS.apply(this, arguments);
}

function writeSetting(_x28, _x29) {
  return _writeSetting.apply(this, arguments);
}

function _writeSetting() {
  _writeSetting = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee32(reference, value) {
    var field;
    return _regeneratorRuntime().wrap(function _callee32$(_context32) {
      while (1) {
        switch (_context32.prev = _context32.next) {
          case 0:
            if (reference === "UI.renderUnfamiliarPublicAliases") {
              field = document.querySelector("#searchEntryField");
              field.disabled = !value;

              if (value) {
                field.placeholder = "Search for an active node";
              } else {
                field.placeholder = "Cannot search, public aliases are disabled";
              }
            }

            if (reference === "communication.arbitraryPeerRouteTimeout") {
              eventHandler.dispatch("arbitraryPeerRouteTimeoutUpdated");
            }

            _context32.next = 4;
            return exportToLS(reference, value);

          case 4:
            if (!(Object.keys(CONFIG) == "")) {
              _context32.next = 6;
              break;
            }

            return _context32.abrupt("return");

          case 6:
            reference.split(".").reduce(function (sum, prop, index) {
              return reference.split(".").length === index + 1 ? sum : sum[prop];
            }, CONFIG)[reference.split(".").slice(-1)] = value;

          case 7:
          case "end":
            return _context32.stop();
        }
      }
    }, _callee32);
  }));
  return _writeSetting.apply(this, arguments);
}

function fillDefaults(_x30) {
  return _fillDefaults.apply(this, arguments);
}

function _fillDefaults() {
  _fillDefaults = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee33(shortCircuit) {
    var set, subset;
    return _regeneratorRuntime().wrap(function _callee33$(_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            set = Array.from(document.querySelectorAll("[data-objective]"));
            subset = shortCircuit ? set : set.filter(function (element) {
              var _localStorage$config5;

              return !Object.keys(JSON.parse((_localStorage$config5 = localStorage.config) !== null && _localStorage$config5 !== void 0 ? _localStorage$config5 : "{}")).includes(element.dataset.objective);
            });
            Array.from(document.querySelectorAll(".configCardBool .settingsToggle")).filter(function (element) {
              return subset.includes(element);
            }).forEach(function (element, index) {
              element.checked = [false, false, true, true][index];
              writeSetting(element.dataset.objective, index === 1 ? !element.checked : element.checked);
            });
            Array.from(document.querySelectorAll(".configCardInt .integerEntryField")).filter(function (element) {
              return subset.includes(element);
            }).forEach(function (element, index) {
              element.value = [10000, 100000000][index];
              writeSetting(element.dataset.objective, element.value);
            });

          case 4:
          case "end":
            return _context33.stop();
        }
      }
    }, _callee33);
  }));
  return _fillDefaults.apply(this, arguments);
}