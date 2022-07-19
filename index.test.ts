import fc from "fast-check";
import runWithLog from "./index";

describe("test runWithLog", () => {
  test("wrapped function should work same as original function", () => {
    const none = () => {};
    const mockFn = jest.fn(
      (
        a: string,
        b: number,
        c: bigint,
        d: boolean,
        e: undefined,
        f: symbol,
        g: null
      ) => [a, b, c, d, e, f, g]
    );
    fc.assert(
      fc.property(
        fc.string(),
        fc.integer(),
        fc.bigInt(),
        fc.boolean(),
        fc.constant(undefined),
        fc.constant(Symbol()),
        fc.constant(null),
        (a, b, c, d, e, f, g) => {
          const fn = runWithLog(none, mockFn);
          const result = fn(a, b, c, d, e, f, g);
          expect(mockFn).toHaveBeenCalledTimes(1);
          expect(mockFn).toHaveBeenCalledWith(a, b, c, d, e, f, g);
          expect(result).toStrictEqual([a, b, c, d, e, f, g]);
          mockFn.mockClear();
        }
      )
    );
  });

  test("should print hello world after wrapped function be called", () => {
    jest.spyOn(console, "log");

    const mockFn = jest.fn();

    const fn = runWithLog(() => "hello world", mockFn);

    expect(console.log).toHaveBeenCalledTimes(0);

    fn();
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith("hello world");
  });

  test("logger should get arguments and result", () => {
    const loggerFn = jest.fn(console.log);

    const mockFn = jest.fn(
      (
        a: string,
        b: number,
        c: bigint,
        d: boolean,
        e: undefined,
        f: symbol,
        g: null
      ) => [a, b, c, d, e, f, g]
    );

    fc.assert(
      fc.property(
        fc.string(),
        fc.integer(),
        fc.bigInt(),
        fc.boolean(),
        fc.constant(undefined),
        fc.constant(Symbol()),
        fc.constant(null),
        (a, b, c, d, e, f, g) => {
          const fn = runWithLog(loggerFn, mockFn);
          const result = fn(a, b, c, d, e, f, g);

          expect(loggerFn)
            //
            .toHaveBeenCalledWith([a, b, c, d, e, f, g], result);

          loggerFn.mockClear();
          mockFn.mockClear();
        }
      )
    );
  });

  test("usecase: function add with log", () => {
    jest.spyOn(console, "log");
    const add = (a: number, b: number) => a + b;

    const addWithLog = runWithLog(
      ([x, y], result) => `${x} + ${y} = ${result}`,
      add
    );

    const result = addWithLog(1, 1);

    expect(result).toBe(2);
    expect(console.log).toHaveBeenCalledWith("1 + 1 = 2");
  });
});
