import 'es6-shim';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/observable/of';

import { Oddstream } from './oddstream';

export { Oddstream } from './oddstream';

export function createOddstream(): Oddstream {
  return new Oddstream();
}

