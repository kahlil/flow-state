import { createOddstream } from '../build';
import { Observable } from 'rxjs/Observable';
import test from 'ava';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/filter';
const util = require('util');

let oddstream;

test.beforeEach(t => {
  oddstream = createOddstream();
});

test('getDispatcher$()', t => {
  t.plan(2);
  const dispatcher$ = oddstream.getDispatcher$();
	t.is(typeof dispatcher$.next, 'function', 'The dispatcher stream has a next function.');
	t.is(typeof dispatcher$.subscribe, 'function', 'The dispatcher stream has a subscribe function.');
});

test('dispatch()', t => {
  t.plan(1);
  const dispatcher$ = oddstream.getDispatcher$();
  const returnStream = dispatcher$
    .skip(1)
    .subscribe(action => {
      t.deepEqual(action, { type: 'TEST_ACTION', payload: 1 }, 'Correct action is dispatched.')
    });
  // Set the actioncreators.
  oddstream.dispatch('TEST_ACTION', 1);
  return returnStream;
});

test('makeStateStream()', t => {
  t.plan(1);  
  oddstream.dispatch('TEST_ACTION', 1);
  const returnStream = oddstream
    .makeStateStream({ 
      testAction: (action, state) => {
        state.push(action.payload);
        return state;
      }
    }, [])
    .subscribe(state => {
      t.deepEqual(state, [1], 'Correct state is created.')
    });
  return returnStream;
});

test('runSideEffects()', t => {
  t.plan(1)
  const sideEffect = action$ => action$
    .filter(({ type }) => type === 'INIT')
    .map(action => ({ type: 'FX_ACTION' }));
  oddstream.runSideEffects(sideEffect);
  const dispatcher$ = oddstream.getDispatcher$();
  const returnStream = dispatcher$
    .filter(({ type }) => type === 'FX_ACTION')
    .subscribe(({ type }) => {
      t.is(type, 'FX_ACTION', 'Correct state is created.');
    });
  return returnStream;
})
