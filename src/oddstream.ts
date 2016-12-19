import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { curry, camelCase } from 'lodash';
import { Action } from './interface/action';
import { CurriedReducer, Reducer } from './interface/reducer';
import * as errorTexts from './error-texts';

export class Oddstream {
  public dispatcher$: Subject<Action>;
  private actionCreators = {};

  constructor() {
    this.dispatcher$ = new Subject();
  }

  dispatch(action$: any, actionType: string): Subscription {
    const actionCreator$ = this.mapToActionCreator(action$, actionType);
    const nextFn = (payload: any) => this.dispatcher$.next(payload);
    const errorFn = (error: any) => console.error('🔥', error);
    return actionCreator$.subscribe(nextFn, errorFn);
  }

  makeStateStream(reducers: any, initialState: any = []): Observable<any> {
    const getReducer = (actionType: string): Reducer => reducers[camelCase(actionType)];
    const mapReducer = (action: Action): CurriedReducer => curry(getReducer(action.type))(action);
    return this.dispatcher$
      .filter((action: Action) => !!getReducer(action.type))
      .map(mapReducer)
      .scan((state: any, reducer: CurriedReducer) => reducer(state), initialState)
      .share();
  }

  mapToActionCreator(stream: Observable<any>, actionType: string): Observable<any> {
    const actionCreator = this.actionCreators[camelCase(actionType)];
    if (!actionCreator) {
      throw new Error(errorTexts.missingActionCreator(actionType));
    }
    return stream.map(actionCreator);
  }

  setActionCreators(actionCreators: any) {
    this.actionCreators = actionCreators;
  }

  addActionCreators(actionCreators: any) {
    const availableActionCreatorKeys = Object.keys(this.actionCreators);
    // Throw an error if an action creator key already exists.
    Object.keys(actionCreators).forEach(key => {
      if (key in availableActionCreatorKeys) {
        throw new Error(errorTexts.duplicateActionCreator(key));
      }
    });
    // Merge the new action creators into `this.actionCreators`.
    Object.assign(this.actionCreators, actionCreators);
  }

  getDispatcher$(): Subject<Action> {
    return this.dispatcher$;
  }
}
