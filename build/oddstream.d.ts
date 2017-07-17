import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Action } from './interface/action';
export declare class Oddstream {
    private dispatcher$;
    constructor();
    dispatch(type: string, payload?: any): void;
    makeStateStream(reducers: any, initialState?: any): Observable<any>;
    getDispatcher$(): BehaviorSubject<Action>;
    runSideEffects(): void;
}
export declare function createOddstream(): Oddstream;
