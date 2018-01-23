"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var camelcase = require("lodash.camelcase");
var curry = require("lodash.curry");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var FlowState = (function () {
    function FlowState() {
        this.action$ = new BehaviorSubject_1.BehaviorSubject({ type: 'INIT' });
    }
    FlowState.prototype.dispatch = function (action) {
        this.action$.next(action);
    };
    FlowState.prototype.createState$ = function (reducers, initialState) {
        if (initialState === void 0) { initialState = []; }
        var actionToReducer = function (actionType) { return reducers[camelcase(actionType)]; };
        var hasReducerForAction = function (action) { return !!actionToReducer(action.type); };
        var applyActionOnReducer = function (action) {
            return curry(actionToReducer(action.type))(action);
        };
        var applyStateOnReducer = function (state, reducerWithAction) {
            return reducerWithAction(state);
        };
        return this.action$
            .filter(hasReducerForAction)
            .map(applyActionOnReducer)
            .scan(applyStateOnReducer, initialState);
    };
    FlowState.prototype.getAction$ = function () {
        return this.action$;
    };
    FlowState.prototype.runSideEffects = function () {
        var _this = this;
        var sideEffects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sideEffects[_i] = arguments[_i];
        }
        sideEffects.map(function (sideEffect) {
            sideEffect(_this.action$).subscribe(function (action) { return _this.action$.next(action); });
        });
    };
    return FlowState;
}());
exports.FlowState = FlowState;
function createFlowState() {
    return new FlowState();
}
exports.createFlowState = createFlowState;
//# sourceMappingURL=flow-state.js.map