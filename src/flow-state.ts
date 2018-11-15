import { filter, map, scan, share, skip } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import * as camelcase from 'lodash.camelcase';
import * as curry from 'lodash.curry';
import { Action } from './interface/action';
import { CurriedReducer, Reducer } from './interface/reducer';
import { SideEffect } from './interface/effects';

export class FlowState {
  private action$: BehaviorSubject<Action> = new BehaviorSubject({
    type: 'INIT',
  });

  public dispatch(action: Action): void {
    this.action$.next(action);
  }

  public createState$(reducers: any, initialState: any = []): BehaviorSubject<any> {
    const state$ = new BehaviorSubject(initialState);
    const actionToReducer = (actionType: string): Reducer =>
      reducers[camelcase(actionType)];
    const hasReducerForAction = (action: Action) =>
      !!actionToReducer(action.type);
    const applyActionOnReducer = (action: Action): CurriedReducer => {
      return curry(actionToReducer(action.type))(action);
    };
    const applyStateOnReducer = (
      state: any,
      reducerWithAction: CurriedReducer,
    ): any => {
      return reducerWithAction(state);
    };

    this.action$
      .pipe(
        filter(hasReducerForAction),
        map(applyActionOnReducer),
        scan(applyStateOnReducer, initialState),
      )
      .subscribe(state => state$.next(state));

    return state$;
  }

  public getAction$(): BehaviorSubject<Action> {
    return this.action$;
  }

  public runSideEffects(...sideEffects: SideEffect[]) {
    sideEffects.map(sideEffect => {
      sideEffect(this.action$).subscribe(action => this.action$.next(action));
    });
  }
}

export function createFlowState(): FlowState {
  return new FlowState();
}
