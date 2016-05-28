import { Subject } from 'rxjs/Subject';
import { curry, camelCase } from 'lodash';

export class OddStream {
  public dispatcher$: Subject<{ type: string }>;
  private actionCreators: any;

  constructor() {
    this.dispatcher$ = new Subject();
  }

  dispatch(action$, actionType) {
    const actionCreator$ = this.mapToActionCreator(action$, actionType);
    const nextFn = data => this.dispatcher$.next(data);
    const errorFn = error => console.error('🔥', error);
    actionCreator$.subscribe(nextFn, errorFn);
  }

  makeStateStream(reducers) {
    const getReducer = actionType => reducers[camelCase(actionType)];
    const mapReducer = action => curry(getReducer(action.type))(action);
    return this.dispatcher$
      .filter(action => !!getReducer(action.type))
      .map(mapReducer)
      .scan((state: [{}], reducer: (state: [{}]) => [{}]) => reducer(state), [])
      .publishReplay(1).refCount();
  }

  mapToActionCreator(stream, actionType) {
    const actionCreator = this.actionCreators[camelCase(actionType)];
    if (!!actionCreator === false) {
      throw new Error(`No action creator defined for this action: ${actionType}`);
    }
    return stream.map(actionCreator);
  }

  setActionCreators(actionCreators) {
    this.actionCreators = actionCreators;
  }

  getDispatcher$() {
    return this.dispatcher$;
  }
}
