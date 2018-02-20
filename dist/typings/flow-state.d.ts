import { Observable, BehaviorSubject } from 'rxjs';
import { Action } from './interface/action';
import { SideEffect } from './interface/effects';
export declare class FlowState {
    private action$;
    dispatch(action: Action): void;
    createState$(reducers: any, initialState?: any): Observable<any>;
    getAction$(): BehaviorSubject<Action>;
    runSideEffects(...sideEffects: SideEffect[]): void;
}
export declare function createFlowState(): FlowState;
