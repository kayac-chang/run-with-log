# Run With Log

wrap function with custom log message function.

## Install

```
npm install @kaya/run-with-log
```

## Usage

```js
import runWithLog from "@kaya/run-with-log";

const add = (a, b) => a + b;

const addWithLog = runWithLog(
  ([x, y], result) => `${x} + ${y} = ${result}`,
  add
);

const result = addWithLog(1, 1); //=> print "1 + 1 = 2"
// result === 2
```
