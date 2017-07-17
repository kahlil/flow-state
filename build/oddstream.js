"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var lodash_1 = require("lodash");
var Oddstream = (function () {
    function Oddstream() {
        this.dispatcher$ = new BehaviorSubject_1.BehaviorSubject({ type: 'INIT' });
    }
    Oddstream.prototype.dispatch = function (type, payload) {
        this.dispatcher$.next({ type: type, payload: payload });
    };
    Oddstream.prototype.makeStateStream = function (reducers, initialState) {
        if (initialState === void 0) { initialState = []; }
        var actionToReducer = function (actionType) { return reducers[lodash_1.camelCase(actionType)]; };
        var hasReducerForAction = function (action) { return !!actionToReducer(action.type); };
        var applyActionOnReducer = function (action) {
            return lodash_1.curry(actionToReducer(action.type))(action);
        };
        var applyStateOnReducer = function (state, reducerWithAction) {
            return reducerWithAction(state);
        };
        return this.dispatcher$
            .filter(hasReducerForAction)
            .map(applyActionOnReducer)
            .scan(applyStateOnReducer, initialState)
            .share();
    };
    Oddstream.prototype.getDispatcher$ = function () {
        return this.dispatcher$;
    };
    Oddstream.prototype.runSideEffects = function () {
        var _this = this;
        var sideEffects = Array.from(arguments);
        sideEffects.map(function (sideEffect) {
            var action$ = sideEffect(_this.dispatcher$);
            action$
                .subscribe(function (action) { return _this.dispatcher$.next(action); });
        });
    };
    return Oddstream;
}());
exports.Oddstream = Oddstream;
function createOddstream() {
    return new Oddstream();
}
exports.createOddstream = createOddstream;
//# sourceMappingURL=oddstream.js.map