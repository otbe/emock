export const MATCHER = {
  ANY: Symbol(),
  NUMBER: Symbol(),
  STRING: Symbol(),
  OBJECT: Symbol(),
  ARRAY: Symbol()
};

export class It {
  static isAny(): any {
    return MATCHER.ANY;
  }

  static isString(): any {
    return MATCHER.STRING;
  }

  static isArray(): any {
    return MATCHER.ARRAY;
  }

  static isNumber(): any {
    return MATCHER.NUMBER;
  }

  static isObject(): any {
    return MATCHER.OBJECT;
  }
}
