// any combination of spaces and punctuation characters
// thanks to http://stackoverflow.com/a/25575009
const wordSeparatorsRegEx = /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]+/;
const basicCamelRegEx = /^[a-z\u00E0-\u00FCA-Z\u00C0-\u00DC][\d|a-z\u00E0-\u00FCA-Z\u00C0-\u00DC]*$/;
const fourOrMoreConsecutiveCapsRegEx = /([A-Z\u00C0-\u00DC]{4,})/g;
const allCapsRegEx = /^[A-Z\u00C0-\u00DC]+$/;

export function camelCase(str) {
  const words = str.split(wordSeparatorsRegEx);
  const len = words.length;
  const mappedWords = new Array(len);
  for (let i = 0; i < len; i++) {
    let word = words[i];
    if (word === '') {
      continue;
    }
    const isCamelCase = basicCamelRegEx.test(word) && !allCapsRegEx.test(word);
    if (isCamelCase) {
      word = word.replace(fourOrMoreConsecutiveCapsRegEx, function(
        match,
        p1,
        offset
      ) {
        return deCap(match, word.length - offset - match.length == 0);
      });
    }
    let firstLetter = word[0];
    firstLetter = i > 0 ? firstLetter.toUpperCase() : firstLetter.toLowerCase();
    mappedWords[i] =
      firstLetter +
      (!isCamelCase ? word.slice(1).toLowerCase() : word.slice(1));
  }
  return mappedWords.join('');
}

function deCap(match, endOfWord) {
  const arr = match.split('');
  const first = arr.shift().toUpperCase();
  const last = endOfWord ? arr.pop().toLowerCase() : arr.pop();
  return first + arr.join('').toLowerCase() + last;
}

/*
  function add(a, b, c) {
    return a + b + c;
  }
  curry(add)(1)(2)(3); // 6
  curry(add)(1)(2)(2); // 5
  curry(add)(2)(4, 3); // 9
  function add(...args) {
    return args.reduce((sum, n) => sum + n, 0)
  }
  const curryAdd4 = curry(add, 4)
  curryAdd4(1)(2, 3)(4); // 10
  function converter(ratio, input) {
    return (input*ratio).toFixed(1);
  }
  const curriedConverter = curry(converter)
  const milesToKm = curriedConverter(1.62);
  milesToKm(35); // 56.7
  milesToKm(10); // 16.2
*/

export function curry(fn, arity) {
  return function curried() {
    if (arity == null) {
      arity = fn.length;
    }
    const args = [].slice.call(arguments);
    if (args.length >= arity) {
      return fn.apply(this, args);
    } else {
      return function() {
        return curried.apply(this, args.concat([].slice.call(arguments)));
      };
    }
  };
}
