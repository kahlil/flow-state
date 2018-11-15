import { createFlowState } from '../dist/es5';
import { Observable } from 'rxjs';
import test from 'ava';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/filter';
const util = require('util');

let flowState;

test.beforeEach(t => {
  flowState = createFlowState();
});

test('getAction$()', t => {
  t.plan(2);
  const dispatcher$ = flowState.getAction$();
	t.is(typeof dispatcher$.next, 'function', 'The dispatcher stream has a next function.');
	t.is(typeof dispatcher$.subscribe, 'function', 'The dispatcher stream has a subscribe function.');
});

test('dispatch()', t => {
  t.plan(1);
  const action$ = flowState.getAction$();
  const return$ = action$
    .skip(1)
    .subscribe(action => {
      t.deepEqual(action, { type: 'TEST_ACTION', payload: 1 }, 'Correct action is dispatched.')
    });
  // Set the actioncreators.
  flowState.dispatch({ type: 'TEST_ACTION', payload: 1 });
  return return$;
});

test('createState$()', t => {
  t.plan(1);  
  flowState.dispatch({ type: 'TEST_ACTION', payload: 1 });
  const return$ = flowState
    .createState$({ 
      testAction: (action, state) => {
        state.push(action.payload);
        return state;
      }
    }, [])
    .subscribe(state => {
      t.deepEqual(state, [1], 'Correct state is created.')
    });
  return return$;
});

test('runSideEffects()', t => {
  t.plan(1)
  const sideEffect = action$ => action$
    .filter(({ type }) => type === 'INIT')
    .map(action => ({ type: 'FX_ACTION' }));
  flowState.runSideEffects(sideEffect);
  const action$ = flowState.getAction$();
  const return$ = action$
    .filter(({ type }) => type === 'FX_ACTION')
    .subscribe(({ type }) => {
      t.is(type, 'FX_ACTION', 'Correct state is created.');
    });
  return return$;
})
