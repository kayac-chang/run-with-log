export default function <Fn extends (...args: any[]) => any>(
  logfn: (args: Parameters<Fn>, result: ReturnType<Fn>) => void,
  fn: Fn
): Fn {
  return function (...args) {
    const result = fn(...args);

    console.log(logfn(args as Parameters<Fn>, result));

    return result;
  } as Fn;
}
