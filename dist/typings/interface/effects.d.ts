import { BehaviorSubject } from 'rxjs';
import { Action } from './action';
export interface SideEffect {
    (action$: BehaviorSubject<Action>): BehaviorSubject<Action>;
}
