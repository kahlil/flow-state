import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Action } from './interface/action';

const curry = require('lodash.curry');
const camelCase = require('lodash.camelcase');

import 'rxjs/operator/filter';
import 'rxjs/operator/map';

export class OddStream {
  public dispatcher$: any;
  private actionCreators: any;

  constructor() {
    this.dispatcher$ = new Subject();
  }

  dispatch(action$: Observable<Action>, actionType: string) {
    const actionCreator$ = this.mapToActionCreator(action$, actionType);
    const nextFn = (data: any) => this.dispatcher$.next(data);
    const errorFn = (error: {}) => console.error('🔥', error);
    actionCreator$.subscribe(nextFn, errorFn);
  }

  makeStateStream(reducers: {}) {
    const getReducer = (actionType: string) => reducers[camelCase(actionType)];
    const mapReducer = (action: Action) => curry(getReducer(action.type))(action);
    return this.dispatcher$
      .filter((action: Action) => !!getReducer(action.type))
      .map(mapReducer)
      .scan((state: Array<any>, reducer: (state: Array<any>) => Array<any>) => reducer(state), [])
      .publishReplay(1).refCount();
  }

  mapToActionCreator(stream: any, actionType: string) {
    const actionCreator = this.actionCreators[camelCase(actionType)];
    if (!!actionCreator === false) {
      throw new Error(`No action creator defined for this action: ${actionType}`);
    }
    return stream.map(actionCreator);
  }

  setActionCreators(actionCreators: {}) {
    this.actionCreators = actionCreators;
  }

  getDispatcher$() {
    return this.dispatcher$;
  }
}
