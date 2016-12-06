import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Action, ActionCreators } from './interface/action';
import { Reducers } from './interface/reducer';
export declare class Oddstream {
    dispatcher$: Subject<Action>;
    private actionCreators;
    constructor();
    dispatch(action$: any, actionType: string): Subscription;
    makeStateStream<S>(reducers: Reducers, initialState?: any): Observable<S>;
    mapToActionCreator(stream: Observable<any>, actionType: string): Observable<any>;
    setActionCreators(actionCreators: ActionCreators): void;
    addActionCreators(actionCreators: ActionCreators): void;
    getDispatcher$(): Subject<Action>;
}
