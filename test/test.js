import { default as OddStream } from '../';
import { Observable } from 'rxjs/Observable';
import test from 'ava';
import 'rxjs/add/observable/of';

let oddstream;

test.before(t => {
  oddstream = new OddStream();
});

test('getDispatcher$()', t => {
  t.plan(2);
  const dispatcher$ = oddstream.getDispatcher$();
	t.is(typeof dispatcher$.next, 'function', 'The dispatcher stream has a next function.');
	t.is(typeof dispatcher$.subscribe, 'function', 'The dispatcher stream has a subscribe function.');
});

test('setActionCreators()', t => {
  t.plan(1);
  const actionCreators = { someAction() {} };
  oddstream.setActionCreators(actionCreators);
  t.is(oddstream.actionCreators, actionCreators, 'Action creators are being set correctly.');
});

test('dispatch()', t => {
  t.plan(1);
  const dispatcher$ = oddstream.getDispatcher$();
  // Create observable stream.
  const stream = Observable.of(1);
  // Create actionCreator.
  const actionCreators = {
    testAction: id => ({ type: 'TEST_ACTION', payload: id }),
  }
  const returnStream = dispatcher$
    .map(action => {
      t.deepEqual(action, { type: 'TEST_ACTION', payload: 1 }, 'Correct action is dispatched.')
    })
    .subscribe();
  // Set the actioncreators.
  oddstream.setActionCreators(actionCreators);
  oddstream.dispatch(stream, 'TEST_ACTION');

  return returnStream;
});

test('makeStateStream()', t => {
  t.plan(1);
  // Create observable stream.
  const stream = Observable.of(1);
  // Create actionCreator.
  const actionCreators = {
    testAction: id => ({ type: 'TEST_ACTION', payload: id }),
  }
  oddstream.setActionCreators(actionCreators);
  const returnStream = oddstream
    .makeStateStream({ testAction: (action, state) => {
      state.push(action.payload);
      return state;
    }}, [])
    .map(state => {
      t.deepEqual(state, [1], 'Correct state is created.')
    })
    .subscribe();
  oddstream.dispatch(stream, 'TEST_ACTION');

  return returnStream;
});

test('mapToActionCreator()', t => {
  t.plan(1);
  // Create observable stream.
  const stream = Observable.of(1);
  // Create actionCreator.
  const actionCreators = {
    testAction: id => ({ type: 'TEST_ACTION', payload: id }),
  }
  oddstream.setActionCreators(actionCreators);
  const returnStream = oddstream.mapToActionCreator(stream, 'TEST_ACTION')
    .map(action => {
      t.deepEqual(action, { type: 'TEST_ACTION', payload: 1 }, 'Correct action is dispatched.')
    })
    .subscribe();

  return returnStream;
});
