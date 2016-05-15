import { getPropertyNames, isFunction } from '../src/utils/Helper';
import expect from 'expect';

describe('Helper.ts', () => {
  describe('getPropertyNames', () => {
    it('should parse property names out of an object', () => {
      let o = {
        a: 10,
        b: 11
      };

      expect(getPropertyNames(o).indexOf('a')).toBeGreaterThan(-1);
      expect(getPropertyNames(o).indexOf('b')).toBeGreaterThan(-1);
      expect(getPropertyNames(o).indexOf('c')).toBe(-1);
    });
  });

  describe('isFunction', () => {
    it('should return true only for functions', () => {
      expect(isFunction(() => {})).toBeTruthy();
      expect(isFunction(undefined)).toBeFalsy();
      expect(isFunction(<any>'Test')).toBeFalsy();
      expect(isFunction(<any>5)).toBeFalsy();
      expect(isFunction(<any>{})).toBeFalsy();
      expect(isFunction(<any>[])).toBeFalsy();
    });
  });
});
