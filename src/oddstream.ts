import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { curry, camelCase } from 'lodash';
import { Action } from './interface/action';
import { CurriedReducer, Reducer } from './interface/reducer';

export class Oddstream {
  public dispatcher$: BehaviorSubject<Action>;

  constructor() {
    this.dispatcher$ = new BehaviorSubject({ type: 'INIT' });
  }

  public dispatch(type: string, payload?: any): void {
    this.dispatcher$.next({ type, payload });
  }

  public makeStateStream(reducers: any, initialState: any = []): Observable<any> {
    const actionToReducer = (actionType: string): Reducer => reducers[camelCase(actionType)];
    const hasReducerForAction = (action: Action) => !!actionToReducer(action.type);
    const applyActionOnReducer = (action: Action): CurriedReducer => {
      return curry(actionToReducer(action.type))(action);
    }
    const applyStateOnReducer = (state: any, reducerWithAction: CurriedReducer): any => {
      return reducerWithAction(state);
    }
    return this.dispatcher$
      .filter(hasReducerForAction)
      .map(applyActionOnReducer)
      .scan(applyStateOnReducer, initialState)
      .share();
  }

  public getDispatcher$(): BehaviorSubject<Action> {
    return this.dispatcher$;
  }
}

export function createOddstream(): Oddstream {
  return new Oddstream();
}
