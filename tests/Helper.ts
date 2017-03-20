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

    it('should parse property names out of an obejct and its inherited objects', () => {
      class MyService {
        fn() { }
      }

      class ExtendedMyService extends MyService {
        fn2() { }
      }

      let instance = Object.create(ExtendedMyService.prototype);
      expect(getPropertyNames(instance).indexOf('fn')).toBeGreaterThan(-1);
      expect(getPropertyNames(instance).indexOf('fn2')).toBeGreaterThan(-1);
    });
  });

  describe('isFunction', () => {
    it('should return true only for functions', () => {
      expect(isFunction(() => { })).toBeTruthy();
      expect(isFunction(undefined)).toBeFalsy();
      expect(isFunction( 'Test' as any)).toBeFalsy();
      expect(isFunction( 5 as any)).toBeFalsy();
      expect(isFunction( {} as any)).toBeFalsy();
      expect(isFunction( [] as any)).toBeFalsy();
    });
  });
});
