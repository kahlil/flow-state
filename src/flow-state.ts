import * as camelcase from 'lodash.camelcase';
import * as curry from 'lodash.curry';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Action } from './interface/action';
import { CurriedReducer, Reducer } from './interface/reducer';
import { SideEffect } from './interface/effects';

export class FlowState {
  private action$: BehaviorSubject<Action> = new BehaviorSubject({ type: 'INIT' });

  constructor() {
    this.dispatch = this.dispatch.bind(this);
    this.createState$ = this.createState$.bind(this);
    this.getAction$ = this.getAction$.bind(this);
    this.runSideEffects = this.runSideEffects.bind(this);
  }

  public dispatch(action: Action): void {
    this.action$.next(action);
  }

  public createState$(reducers: any, initialState: any = []): Observable<any> {
    const actionToReducer = (actionType: string): Reducer => reducers[camelcase(actionType)];
    const hasReducerForAction = (action: Action) => !!actionToReducer(action.type);
    const applyActionOnReducer = (action: Action): CurriedReducer => {
      return curry(actionToReducer(action.type))(action);
    }
    const applyStateOnReducer = (state: any, reducerWithAction: CurriedReducer): any => {
      return reducerWithAction(state);
    }
    return this.action$
      .filter(hasReducerForAction)
      .map(applyActionOnReducer)
      .scan(applyStateOnReducer, initialState);
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
