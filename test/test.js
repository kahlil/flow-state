import { OddStream } from '../';
import test from 'ava';

let oddstream;

test.before(t => {
  oddstream = new OddStream();
});

test(t => {
  t.plan(2);
  const dispatcher$ = oddstream.getDispatcher$();
	t.is(typeof dispatcher$.next, 'function', 'The dispatcher stream has a next function.');
	t.is(typeof dispatcher$.subscribe, 'function', 'The dispatcher stream has a subscribe function.');
});

test(t => {
  t.plan(1);
  const actionCreators = { someAction() {} };
  oddstream.setActionCreators(actionCreators);
  t.is(oddstream.actionCreators, actionCreators, 'Action creators are being set correctly.');
});
