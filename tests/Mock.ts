import { Mock } from '../src/mock/Mock';
import expect, { extend } from 'expect';
import { It } from '../src/utils/It';
import { expectExtensions } from '../src/utils/ExpectExtensions';

extend(expectExtensions);

class MyService {
  testProperty: number;

  simple() {
    return true;
  }

  multipleArguments(any: any, string: string, number: number, obj: Object) {
    return true;
  }
}

class MyServiceExtended extends MyService {
  simpleString(s: string) {
    return true;
  }

  simpleNumber(s: number) {
    return true;
  }

  simpleObject(s: Object) {
    return true;
  }

  simpleArray(s: Array<string>) {
    return true;
  }

  notMocked() {
    return 100;
  }
}

(MyServiceExtended.prototype as any).prototypeProperty = 5;

describe('Mock.ts', () => {
  it('should create a mock thats a MyService instance', () => {
    let m = Mock.of(MyServiceExtended);

    expect(m.mock).toBeA(MyServiceExtended);

    m = new Mock(MyServiceExtended);

    expect(m.mock).toBeA(MyServiceExtended);
  });

  it('should mock all methods of MyService and let me define properties', () => {
    let m = Mock.of(MyServiceExtended);

    expect(m.mock.simple).toBeTruthy();
    expect(m.mock.simple()).toBeFalsy();

    expect(m.mock.multipleArguments).toBeTruthy();
    expect(
      m.mock.multipleArguments('string', 'string2', 20, { a: 5 })
    ).toBeFalsy();

    expect(m.mock.simpleString).toBeTruthy();
    expect(m.mock.simpleString('string')).toBeFalsy();

    expect(m.mock.simpleNumber).toBeTruthy();
    expect(m.mock.simpleNumber(5)).toBeFalsy();

    expect(m.mock.simpleObject).toBeTruthy();
    expect(m.mock.simpleObject({})).toBeFalsy();

    m.mock.testProperty = 20;
    expect(m.mock.testProperty).toBe(20);
  });

  it('should let me set prototype properties', () => {
    let m = Mock.of(MyServiceExtended);
    expect((m.mock as any).prototypeProperty).toBe(5);
    (m.mock as any).prototypeProperty = 10;
    expect((m.mock as any).prototypeProperty).toBe(10);
  });

  it('should exclude some methods form being mocked', () => {
    let m = Mock.of(MyServiceExtended, ['constructor', 'notMocked']);
    expect(m.mock.notMocked()).toBe(100);
  });

  it('should let me configure the spy', () => {
    let m = Mock.of(MyServiceExtended);

    m.spyOn(x => x.simple()).andReturn(false);

    expect(m.mock.simple()).toBeFalsy();
  });

  it('should fail on non function properties', () => {
    let m = Mock.of(MyServiceExtended);

    expect(() => m.spyOn(x => x.testProperty)).toThrow();
  });

  it('should let me define a call signature & verifies it for strings', () => {
    let m = Mock.of(MyServiceExtended);

    // success
    m.spyOn(x => x.simpleString('test')).andReturn(false);
    expect(() =>
      (expect(m.mock.simpleString) as any).toHaveBeenCalledWithSignature()
    ).toThrow();
    expect(m.mock.simpleString('test')).toBe(false);
    (expect(m.mock.simpleString) as any).toHaveBeenCalledWithSignature();

    // fail
    m.mock.simpleString(5 as any);
    expect(() =>
      (expect(m.mock.simpleString) as any).toHaveBeenCalledWithSignature()
    ).toThrow();

    m.mock.simpleString('test2');
    expect(() =>
      (expect(m.mock.simpleString) as any).toHaveBeenCalledWithSignature()
    ).toThrow();

    // success
    m.spyOn(x => x.simpleString(It.isString())).andReturn(false);
    expect(m.mock.simpleString('test')).toBe(false);
    (expect(m.mock.simpleString) as any).toHaveBeenCalledWithSignature();
    expect(m.mock.simpleString('test2')).toBe(false);
    (expect(m.mock.simpleString) as any).toHaveBeenCalledWithSignature();

    // fail
    m.mock.simpleString(5 as any);
    expect(() =>
      (expect(m.mock.simpleString) as any).toHaveBeenCalledWithSignature()
    ).toThrow();
  });

  it('should let me define a call signature & verifies it for numbers', () => {
    let m = Mock.of(MyServiceExtended);

    // success
    m.spyOn(x => x.simpleNumber(5)).andReturn(false);
    expect(m.mock.simpleNumber(5)).toBe(false);
    (expect(m.mock.simpleNumber) as any).toHaveBeenCalledWithSignature();

    // fail
    m.mock.simpleNumber('test' as any);
    expect(() =>
      (expect(m.mock.simpleNumber) as any).toHaveBeenCalledWithSignature()
    ).toThrow();

    m.mock.simpleNumber(10);
    expect(() =>
      (expect(m.mock.simpleNumber) as any).toHaveBeenCalledWithSignature()
    ).toThrow();

    // success
    m.spyOn(x => x.simpleNumber(It.isNumber())).andReturn(false);
    expect(m.mock.simpleNumber(5)).toBe(false);
    (expect(m.mock.simpleNumber) as any).toHaveBeenCalledWithSignature();
    expect(m.mock.simpleNumber(10)).toBe(false);
    (expect(m.mock.simpleNumber) as any).toHaveBeenCalledWithSignature();

    // fail
    m.mock.simpleNumber('test' as any);
    expect(() =>
      (expect(m.mock.simpleNumber) as any).toHaveBeenCalledWithSignature()
    ).toThrow();
  });

  it('should let me define a call signature & verifies it for objects', () => {
    let m = Mock.of(MyServiceExtended);

    // success
    m.spyOn(x => x.simpleObject({ a: 10 })).andReturn(false);
    expect(m.mock.simpleObject({ a: 10 })).toBe(false);
    (expect(m.mock.simpleObject) as any).toHaveBeenCalledWithSignature();

    // fail
    m.mock.simpleObject({ a: 20 });
    expect(() =>
      (expect(m.mock.simpleObject) as any).toHaveBeenCalledWithSignature()
    ).toThrow();
    m.mock.simpleObject(Symbol() as any);
    expect(() =>
      (expect(m.mock.simpleObject) as any).toHaveBeenCalledWithSignature()
    ).toThrow();

    // success
    m.spyOn(x => x.simpleObject(It.isObject())).andReturn(false);
    expect(m.mock.simpleObject({ a: 10 })).toBe(false);
    (expect(m.mock.simpleObject) as any).toHaveBeenCalledWithSignature();
    expect(m.mock.simpleObject({ a: 20 })).toBe(false);
    (expect(m.mock.simpleObject) as any).toHaveBeenCalledWithSignature();

    // fail
    m.mock.simpleObject(Symbol() as any);
    expect(() =>
      (expect(m.mock.simpleObject) as any).toHaveBeenCalledWithSignature()
    ).toThrow();
  });

  it('should let me define a call signature & verifies it for arrays', () => {
    let m = Mock.of(MyServiceExtended);

    // success
    m.spyOn(x => x.simpleArray(['a'])).andReturn(false);
    expect(() =>
      (expect(m.mock.simpleArray) as any).toHaveBeenCalledWithSignature()
    ).toThrow();
    expect(m.mock.simpleArray(['a'])).toBe(false);
    (expect(m.mock.simpleArray) as any).toHaveBeenCalledWithSignature();

    // fail
    m.mock.simpleArray(5 as any);
    expect(() =>
      (expect(m.mock.simpleArray) as any).toHaveBeenCalledWithSignature()
    ).toThrow();

    m.mock.simpleArray(['b']);
    expect(() =>
      (expect(m.mock.simpleArray) as any).toHaveBeenCalledWithSignature()
    ).toThrow();

    // success
    m.spyOn(x => x.simpleArray(It.isArray())).andReturn(false);
    expect(m.mock.simpleArray(['b'])).toBe(false);
    (expect(m.mock.simpleArray) as any).toHaveBeenCalledWithSignature();
    expect(m.mock.simpleArray(['a', 'c'])).toBe(false);
    (expect(m.mock.simpleArray) as any).toHaveBeenCalledWithSignature();

    // fail
    m.mock.simpleArray(5 as any);
    expect(() =>
      (expect(m.mock.simpleArray) as any).toHaveBeenCalledWithSignature()
    ).toThrow();
  });

  it('should let me define a call signature & verifies it for multiple arguments', () => {
    let m = Mock.of(MyServiceExtended);

    // success
    m
      .spyOn(x => x.multipleArguments('string', 'string2', 20, { a: 5 }))
      .andReturn(false);
    expect(m.mock.multipleArguments('string', 'string2', 20, { a: 5 })).toBe(
      false
    );
    (expect(m.mock.multipleArguments) as any).toHaveBeenCalledWithSignature();

    // fail
    m.mock.multipleArguments('test', 'string1', 30, { a: 6 });
    expect(() =>
      (expect(m.mock.multipleArguments) as any).toHaveBeenCalledWithSignature()
    ).toThrow();

    m.mock.multipleArguments('test', 5 as any, 'test' as any, true);
    expect(() =>
      (expect(m.mock.multipleArguments) as any).toHaveBeenCalledWithSignature()
    ).toThrow();

    // success
    m.spyOn(x =>
      x.multipleArguments(
        It.isAny(),
        It.isString(),
        It.isNumber(),
        It.isObject()
      )
    );
    m.mock.multipleArguments('string', 'string2', 20, { a: 5 });
    (expect(m.mock.multipleArguments) as any).toHaveBeenCalledWithSignature();

    m.mock.multipleArguments('string', 'string3', 30, { a: 6 });
    (expect(m.mock.multipleArguments) as any).toHaveBeenCalledWithSignature();

    // fail
    m.mock.multipleArguments('string', 5 as any, 'test' as any, true);
    expect(() =>
      (expect(m.mock.multipleArguments) as any).toHaveBeenCalledWithSignature()
    ).toThrow();
  });
});
