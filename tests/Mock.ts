import { Mock } from '../src/mock/Mock';
import expect, { extend } from 'expect';
import { It } from '../src/utils/It';
import { expectExtensions } from '../src/utils/ExpectExtensions';

extend(expectExtensions);

class MyService {
  testProperty: number;

  simple () {
    return true;
  }

  multipleArguments (any: any, string: string, number: number, obj: Object) {
    return true;
  }
}

class MyServiceExtended extends MyService {
  simpleString (s: string) {
    return true;
  }

  simpleNumber (s: number) {
    return true;
  }

  simpleObject (s: Object) {
    return true;
  }

  simpleArray (s: Array<string>) {
    return true;
  }

  notMocked() {
    return 100;
  }
}

(<any>MyServiceExtended.prototype).prototypeProperty = 5;

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
    expect(m.mock.multipleArguments('string', 'string2', 20, { a: 5 })).toBeFalsy();

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
    expect((<any>m.mock).prototypeProperty).toBe(5);
    (<any>m.mock).prototypeProperty = 10;
    expect((<any>m.mock).prototypeProperty).toBe(10);
  });

  it('should exclude some methods form being mocked', () => {
    let m = Mock.of(MyServiceExtended, [ 'constructor', 'notMocked' ]);
    expect(m.mock.notMocked()).toBe(100);
  });

  it('should let me configure the spy', () => {
    let m = Mock.of(MyServiceExtended);

    m.spyOn(x => x.simple()).andReturn(20);

    expect(m.mock.simple()).toBe(20);
  });

  it('should fail on non function properties', () => {
    let m = Mock.of(MyServiceExtended);

    expect(() => m.spyOn(x => x.testProperty)).toThrow();
  });

  it('should let me define a call signature & verifies it for strings', () => {
    let m = Mock.of(MyServiceExtended);

    // success
    m.spyOn(x => x.simpleString('test')).andReturn(false);
    expect(() => (<any>expect(m.mock.simpleString)).toHaveBeenCalledWithSignature()).toThrow();
    expect(m.mock.simpleString('test')).toBe(false);
    (<any>expect(m.mock.simpleString)).toHaveBeenCalledWithSignature();

    // fail
    m.mock.simpleString(<any>5);
    expect(() => (<any>expect(m.mock.simpleString)).toHaveBeenCalledWithSignature()).toThrow();

    m.mock.simpleString('test2');
    expect(() => (<any>expect(m.mock.simpleString)).toHaveBeenCalledWithSignature()).toThrow();

    // success
    m.spyOn(x => x.simpleString(It.isString())).andReturn(false);
    expect(m.mock.simpleString('test')).toBe(false);
    (<any>expect(m.mock.simpleString)).toHaveBeenCalledWithSignature();
    expect(m.mock.simpleString('test2')).toBe(false);
    (<any>expect(m.mock.simpleString)).toHaveBeenCalledWithSignature();

    // fail
    m.mock.simpleString(<any>5);
    expect(() => (<any>expect(m.mock.simpleString)).toHaveBeenCalledWithSignature()).toThrow();
  });

  it('should let me define a call signature & verifies it for numbers', () => {
    let m = Mock.of(MyServiceExtended);

    // success
    m.spyOn(x => x.simpleNumber(5)).andReturn(false);
    expect(m.mock.simpleNumber(5)).toBe(false);
    (<any>expect(m.mock.simpleNumber)).toHaveBeenCalledWithSignature();

    // fail
    m.mock.simpleNumber(<any>'test');
    expect(() => (<any>expect(m.mock.simpleNumber)).toHaveBeenCalledWithSignature()).toThrow();

    m.mock.simpleNumber(10);
    expect(() => (<any>expect(m.mock.simpleNumber)).toHaveBeenCalledWithSignature()).toThrow();

    // success
    m.spyOn(x => x.simpleNumber(It.isNumber())).andReturn(false);
    expect(m.mock.simpleNumber(5)).toBe(false);
    (<any>expect(m.mock.simpleNumber)).toHaveBeenCalledWithSignature();
    expect(m.mock.simpleNumber(10)).toBe(false);
    (<any>expect(m.mock.simpleNumber)).toHaveBeenCalledWithSignature();

    // fail
    m.mock.simpleNumber(<any>'test');
    expect(() => (<any>expect(m.mock.simpleNumber)).toHaveBeenCalledWithSignature()).toThrow();
  });

  it('should let me define a call signature & verifies it for objects', () => {
    let m = Mock.of(MyServiceExtended);

    // success
    m.spyOn(x => x.simpleObject({ a: 10 })).andReturn(false);
    expect(m.mock.simpleObject({ a: 10 })).toBe(false);
    (<any>expect(m.mock.simpleObject)).toHaveBeenCalledWithSignature();

    // fail
    m.mock.simpleObject({a : 20});
    expect(() => (<any>expect(m.mock.simpleObject)).toHaveBeenCalledWithSignature()).toThrow();
    m.mock.simpleObject(<any>Symbol());
    expect(() => (<any>expect(m.mock.simpleObject)).toHaveBeenCalledWithSignature()).toThrow();

    // success
    m.spyOn(x => x.simpleObject(It.isObject())).andReturn(false);
    expect(m.mock.simpleObject({ a: 10 })).toBe(false);
    (<any>expect(m.mock.simpleObject)).toHaveBeenCalledWithSignature();
    expect(m.mock.simpleObject({ a: 20 })).toBe(false);
    (<any>expect(m.mock.simpleObject)).toHaveBeenCalledWithSignature();

    // fail
    m.mock.simpleObject(<any>Symbol());
    expect(() => (<any>expect(m.mock.simpleObject)).toHaveBeenCalledWithSignature()).toThrow();
  });

  it('should let me define a call signature & verifies it for arrays', () => {
    let m = Mock.of(MyServiceExtended);

    // success
    m.spyOn(x => x.simpleArray([ 'a' ])).andReturn(false);
    expect(() => (<any>expect(m.mock.simpleArray)).toHaveBeenCalledWithSignature()).toThrow();
    expect(m.mock.simpleArray([ 'a' ])).toBe(false);
    (<any>expect(m.mock.simpleArray)).toHaveBeenCalledWithSignature();

    // fail
    m.mock.simpleArray(<any>5);
    expect(() => (<any>expect(m.mock.simpleArray)).toHaveBeenCalledWithSignature()).toThrow();

    m.mock.simpleArray([ 'b' ]);
    expect(() => (<any>expect(m.mock.simpleArray)).toHaveBeenCalledWithSignature()).toThrow();

    // success
    m.spyOn(x => x.simpleArray(It.isArray())).andReturn(false);
    expect(m.mock.simpleArray([ 'b' ])).toBe(false);
    (<any>expect(m.mock.simpleArray)).toHaveBeenCalledWithSignature();
    expect(m.mock.simpleArray([ 'a', 'c' ])).toBe(false);
    (<any>expect(m.mock.simpleArray)).toHaveBeenCalledWithSignature();

    // fail
    m.mock.simpleArray(<any>5);
    expect(() => (<any>expect(m.mock.simpleArray)).toHaveBeenCalledWithSignature()).toThrow();
  });

  it('should let me define a call signature & verifies it for multiple arguments', () => {
    let m = Mock.of(MyServiceExtended);

    // success
    m.spyOn(x => x.multipleArguments('string', 'string2', 20, { a: 5 })).andReturn(false);
    expect(m.mock.multipleArguments('string', 'string2', 20, { a: 5 })).toBe(false);
    (<any>expect(m.mock.multipleArguments)).toHaveBeenCalledWithSignature();

    // fail
    m.mock.multipleArguments('test', 'string1', 30, { a: 6 });
    expect(() => (<any>expect(m.mock.multipleArguments)).toHaveBeenCalledWithSignature()).toThrow();

    m.mock.multipleArguments('test', <any>5, <any>'test', true);
    expect(() => (<any>expect(m.mock.multipleArguments)).toHaveBeenCalledWithSignature()).toThrow();

    // success
    m.spyOn(x => x.multipleArguments(It.isAny(), It.isString(), It.isNumber(), It.isObject()));
    m.mock.multipleArguments('string', 'string2', 20, { a: 5 });
    (<any>expect(m.mock.multipleArguments)).toHaveBeenCalledWithSignature();

    m.mock.multipleArguments('string', 'string3',30, { a: 6});
    (<any>expect(m.mock.multipleArguments)).toHaveBeenCalledWithSignature();

    // fail
    m.mock.multipleArguments('string', <any>5, <any>'test', true);
    expect(() => (<any>expect(m.mock.multipleArguments)).toHaveBeenCalledWithSignature()).toThrow();
  });
});
