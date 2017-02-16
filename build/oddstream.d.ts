import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Action } from './interface/action';
export declare class Oddstream {
    dispatcher$: Subject<Action>;
    private actionCreators;
    constructor();
    dispatch(actionType: string, payload$?: any): Subscription;
    makeStateStream(reducers: any, initialState?: any): Observable<any>;
    mapToActionCreator(stream: Observable<any>, actionType: string): Observable<any>;
    setActionCreators(actionCreators: any): void;
    addActionCreators(actionCreators: any): void;
    getDispatcher$(): Subject<Action>;
}
export declare function createOddstream(): Oddstream;
