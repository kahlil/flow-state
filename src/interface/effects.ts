import { Observable } from 'rxjs/Observable';
import { Action } from './action';

export interface SideEffect {
  (action$: Observable<Action>): Observable<Action>;
}
