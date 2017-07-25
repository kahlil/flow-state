"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camelcase = require("lodash.camelcase");
const curry = require("lodash.curry");
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
class Oddstream {
    constructor() {
        this.dispatcher$ = new BehaviorSubject_1.BehaviorSubject({ type: 'INIT' });
    }
    dispatch(type, payload) {
        this.dispatcher$.next({ type, payload });
    }
    makeStateStream(reducers, initialState = []) {
        const actionToReducer = (actionType) => reducers[camelcase(actionType)];
        const hasReducerForAction = (action) => !!actionToReducer(action.type);
        const applyActionOnReducer = (action) => {
            return curry(actionToReducer(action.type))(action);
        };
        const applyStateOnReducer = (state, reducerWithAction) => {
            return reducerWithAction(state);
        };
        return this.dispatcher$
            .filter(hasReducerForAction)
            .map(applyActionOnReducer)
            .scan(applyStateOnReducer, initialState)
            .share();
    }
    getDispatcher$() {
        return this.dispatcher$;
    }
    runSideEffects(...sideEffects) {
        sideEffects.map(sideEffect => {
            sideEffect(this.dispatcher$).subscribe(action => this.dispatcher$.next(action));
        });
    }
}
exports.Oddstream = Oddstream;
function createOddstream() {
    return new Oddstream();
}
exports.createOddstream = createOddstream;
//# sourceMappingURL=oddstream.js.map