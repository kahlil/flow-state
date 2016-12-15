import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Action } from './interface/action';
import { Reducers } from './interface/reducer';
export declare class Oddstream {
    dispatcher$: Subject<Action>;
    private actionCreators;
    constructor();
    dispatch(action$: any, actionType: string): Subscription;
    makeStateStream<S>(reducers: Reducers, initialState?: any): Observable<S>;
    mapToActionCreator(stream: Observable<any>, actionType: string): Observable<any>;
    setActionCreators(actionCreators: any): void;
    addActionCreators(actionCreators: any): void;
    getDispatcher$(): Subject<Action>;
}
