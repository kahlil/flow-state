import { createFlowState } from './flow-state.js';
import { skip, map, filter } from 'rxjs/operators';
import test from 'ava';

let flowState;

test.beforeEach(() => {
  flowState = createFlowState();
});

test.afterEach.always(() => {
  flowState = null;
});

test('getAction$()', t => {
  t.plan(2);
  const dispatcher$ = flowState.getAction$();
  t.is(
    typeof dispatcher$.next,
    'function',
    'The dispatcher stream has a next function.'
  );
  t.is(
    typeof dispatcher$.subscribe,
    'function',
    'The dispatcher stream has a subscribe function.'
  );
});

test('dispatch()', t => {
  t.plan(1);
  const action$ = flowState.getAction$();
  const return$ = action$.pipe(skip(1)).subscribe(action => {
    t.deepEqual(
      action,
      { type: 'TEST_ACTION', payload: 1 },
      'Correct action is dispatched.'
    );
  });
  // Set the actioncreators.
  flowState.dispatch({ type: 'TEST_ACTION', payload: 1 });
  return return$;
});

test('createState$()', t => {
  t.plan(1);
  flowState.dispatch({ type: 'TEST_ACTION', payload: 1 });
  const return$ = flowState
    .createState$(
      {
        testAction: (action, state) => {
          state.push(action.payload);
          return state;
        },
      },
      []
    )
    .subscribe(state => {
      t.deepEqual(state, [1], 'Correct state is created.');
    });
  return return$;
});

// @ts-ignore
test('runSideEffects()', t => {
  t.plan(1);
  flowState = createFlowState();
  const sideEffect = action$ =>
    action$.pipe(
      filter(({ type }) => type === 'INIT'),
      map(() => ({ type: 'FX_ACTION' }))
    );
  flowState.runSideEffects(sideEffect);
  return flowState
    .getAction$()
    .pipe(filter(({ type }) => type === 'FX_ACTION'))
    .subscribe(({ type }) =>
      t.is(type, 'FX_ACTION', 'Correct state is created.')
    );
});
