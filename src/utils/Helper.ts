export function getPropertyNames(target: Object): Array<string> {
  let result: Array<string> = [];

  do {
    result.push(...Object.getOwnPropertyNames(target));
    // tslint:disable-next-line:no-conditional-assignment
  } while ((target = Object.getPrototypeOf(target)));

  return [...new Set(result)];
}

export function isFunction(functionToCheck: Function) {
  let getType = {};
  return (
    functionToCheck &&
    getType.toString.call(functionToCheck) === '[object Function]'
  );
}
