import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Action } from './interface/action';
export declare class Oddstream {
    dispatcher$: BehaviorSubject<Action>;
    constructor();
    dispatch(type: string, payload?: any): void;
    makeStateStream(reducers: any, initialState?: any): Observable<any>;
    getDispatcher$(): BehaviorSubject<Action>;
}
export declare function createOddstream(): Oddstream;
