import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Action, ActionCreators } from './interface/action';

const curry = require('lodash.curry');
const camelCase = require('lodash.camelcase');

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/publishReplay';

export default class OddStream {
  public dispatcher$: any;
  private actionCreators: any = {};

  constructor() {
    this.dispatcher$ = new Subject();
  }

  dispatch(action$: any, actionType: string): Subscription {
    const actionCreator$ = this.mapToActionCreator(action$, actionType);
    const nextFn = (payload: any) => this.dispatcher$.next(payload);
    const errorFn = (error: {}) => console.error('🔥', error);
    return actionCreator$.subscribe(nextFn, errorFn);
  }

  makeStateStream(reducers: any, initialState: any = []): Observable<any> {
    const getReducer = (actionType: string) => reducers[camelCase(actionType)];
    const mapReducer = (action: Action) => curry(getReducer(action.type))(action);
    return this.dispatcher$
      .filter((action: Action) => !!getReducer(action.type))
      .map(mapReducer)
      .scan((state: any, reducer: (state: any) => any) => reducer(state), initialState)
      .publishReplay(1).refCount();
  }

  mapToActionCreator(stream: Observable<any>, actionType: string): Observable<any> {
    const actionCreator = this.actionCreators[camelCase(actionType)];
    if (!!actionCreator === false) {
      throw new Error(`No action creator defined for this action: ${actionType}`);
    }
    return stream.map(actionCreator);
  }

  setActionCreators(actionCreators: ActionCreators) {
    this.actionCreators = actionCreators;
  }

  addActionCreators(actionCreators: ActionCreators) {
    const availableActionCreatorKeys = Object.keys(this.actionCreators);
    // Throw an error if an action creator key already exists.
    Object.keys(actionCreators).forEach(key => {
      if (key in availableActionCreatorKeys) {
        throw new Error(`
          An action creator with the key ${key} already exists.
          Please only add new action creators or use setActionCreators
          to overwrite the current collection of action creators.
        `);
      }
    });

    // Merge the new action creators into `this.actionCreators`.
    Object.assign(this.actionCreators, actionCreators);
  }

  getDispatcher$() {
    return this.dispatcher$;
  }
}
