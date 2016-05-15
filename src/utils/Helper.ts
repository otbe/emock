export function getPropertyNames (target: Object): Array<string> {
  let result: Array<string> = [];

  do {
    result.push(...Object.getOwnPropertyNames(target));
  } while (target = Object.getPrototypeOf(target));

  return [ ...new Set(result) ];
}

export function isFunction (functionToCheck: Function) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
