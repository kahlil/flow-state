"use strict";
var Subject_1 = require('rxjs/Subject');
var lodash_1 = require('lodash');
var Oddstream = (function () {
    function Oddstream() {
        this.actionCreators = {};
        this.dispatcher$ = new Subject_1.Subject();
    }
    Oddstream.prototype.dispatch = function (action$, actionType) {
        var _this = this;
        var actionCreator$ = this.mapToActionCreator(action$, actionType);
        var nextFn = function (payload) { return _this.dispatcher$.next(payload); };
        var errorFn = function (error) { return console.error('🔥', error); };
        return actionCreator$.subscribe(nextFn, errorFn);
    };
    Oddstream.prototype.makeStateStream = function (reducers, initialState) {
        if (initialState === void 0) { initialState = []; }
        var getReducer = function (actionType) { return reducers[lodash_1.camelCase(actionType)]; };
        var mapReducer = function (action) { return lodash_1.curry(getReducer(action.type))(action); };
        return this.dispatcher$
            .filter(function (action) { return !!getReducer(action.type); })
            .map(mapReducer)
            .scan(function (state, reducer) { return reducer(state); }, initialState)
            .publishReplay(1).refCount();
    };
    Oddstream.prototype.mapToActionCreator = function (stream, actionType) {
        var actionCreator = this.actionCreators[lodash_1.camelCase(actionType)];
        if (!actionCreator) {
            throw new Error("No action creator defined for this action: " + actionType);
        }
        return stream.map(actionCreator);
    };
    Oddstream.prototype.setActionCreators = function (actionCreators) {
        this.actionCreators = actionCreators;
    };
    Oddstream.prototype.addActionCreators = function (actionCreators) {
        var availableActionCreatorKeys = Object.keys(this.actionCreators);
        // Throw an error if an action creator key already exists.
        Object.keys(actionCreators).forEach(function (key) {
            if (key in availableActionCreatorKeys) {
                throw new Error("\n          An action creator with the key " + key + " already exists.\n          Please only add new action creators or use setActionCreators\n          to overwrite the current collection of action creators.\n        ");
            }
        });
        // Merge the new action creators into `this.actionCreators`.
        Object.assign(this.actionCreators, actionCreators);
    };
    Oddstream.prototype.getDispatcher$ = function () {
        return this.dispatcher$;
    };
    return Oddstream;
}());
exports.Oddstream = Oddstream;
//# sourceMappingURL=oddstream.js.map