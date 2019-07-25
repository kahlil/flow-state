import { filter, map, scan } from 'rxjs
/operators';
import { BehaviorSubject } from 'rxjs';
import { camelCase, curry } from './lib';

export class FlowState {
  constructor() {
    this.action$ = new BehaviorSubject({ type: 'INIT' });
  }

  dispatch(action) {
    this.action$.next(action);
  }

  createState$(reducers, initialState = []) {
    const state$ = new BehaviorSubject(initialState);
    const actionToReducer = actionType => reducers[camelCase(actionType)];
    const hasReducerForAction = action => !!actionToReducer(action.type);
    const applyActionOnReducer = action => {
      return curry(actionToReducer(action.type))(action);
    };
    const applyStateOnReducer = (state, reducerWithAction) => {
      return reducerWithAction(state);
    };

    this.action$
      .pipe(
        filter(hasReducerForAction),
        map(applyActionOnReducer),
        scan(applyStateOnReducer, initialState)
      )
      .subscribe(state => state$.next(state));

    return state$;
  }

  getAction$() {
    return this.action$;
  }

  runSideEffects(...sideEffects) {
    sideEffects.map(sideEffect => {
      sideEffect(this.action$).subscribe(action => this.action$.next(action));
    });
  }
}

export function createFlowState() {
  return new FlowState();
}
