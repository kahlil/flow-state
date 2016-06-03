import { OddStream } from '../';
import test from 'ava';

test(t => {
  t.plan(1);
  const oddstream = new OddStream();
  const dispatcher$ = oddstream.getDispatcher$();
	t.is(typeof dispatcher$, 'object');
});
