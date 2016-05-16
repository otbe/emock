import { Spy, createSpy, assert } from 'expect';
import { getPropertyNames, isFunction } from '../utils/Helper';
import { VALUE_KEY, CALL_SIGNATURE_KEY, SPY_KEY } from './MetaKeys';

export interface INewable<T> {
  new(...args: Array<any>): T
}

export class Mock<T> {
  private nameGenerator: T;

  mock: T;

  constructor (private target: INewable<T>, exclude: Array<string> = []) {
    const _this = this;

    this.mock = Object.create(target.prototype);
    this.nameGenerator = Object.create(target.prototype);

    const properties = getPropertyNames(this.mock);

    for (let property of properties) {
      if (exclude.indexOf(property) > -1) {
        continue;
      }

      Reflect.defineMetadata(VALUE_KEY, Reflect.get(this.mock, property), this.mock, property);

      // this naive implementation does not allow to overwrite spies with custom functions, but thats fine for me
      // because you can configure your spies to return whatever you want :)
      Object.defineProperty(this.mock, property, {
        enumerable: true,
        configurable: true,
        get: function getter () {
          const returnValue = Reflect.getMetadata(VALUE_KEY, _this.mock, property);

          if (isFunction(returnValue)) {
            return _this.getSpy(property);
          }
          
          return returnValue;
        },
        set: function setter(newValue) {
          // only for non function values (prototype properties)
          Reflect.defineMetadata(VALUE_KEY, newValue, _this.mock, property);
        }
      });

      Object.defineProperty(this.nameGenerator, property, {
        enumerable: true,
        configurable: true,
        get: function getter () {
          assert(isFunction(Reflect.getMetadata(VALUE_KEY, _this.mock, property)), `${property.toString()} is not a function`);

          return (...args: Array<any>) => {
            Reflect.defineMetadata(CALL_SIGNATURE_KEY, args, _this.getSpy(property));
            return property;
          };
        }
      });
    }


    // this.mock = new Proxy(proto, {
    //   get(target, name) {
    //     const targetKey = normalizeKey(name);
    //     const returnValue = Reflect.get(target, targetKey);
    //
    //     if (isFunction(returnValue)) {
    //       return _this.getSpy(targetKey);
    //     }
    //
    //     return returnValue;
    //   }
    // });
    //
    // this.nameGeneratorProxy = new Proxy(proto, {
    //   get(target, name) {
    //     const targetKey = normalizeKey(name);
    //
    //     assert(isFunction(Reflect.get(target, targetKey)), `${targetKey.toString()} is not a function`);
    //
    //     return (...args: Array<any>) => {
    //       Reflect.defineMetadata(CALL_SIGNATURE_KEY, args, _this.getSpy(targetKey));
    //       return targetKey;
    //     };
    //   }
    // });
  }

  spyOn (keyGen: { (x: T): any }): Spy {
    const targetKey = keyGen(this.nameGenerator);

    assert(typeof targetKey === 'string', `${targetKey.toString()} is not valid target key`);
    assert(isFunction(Reflect.get(this.mock, targetKey)), `${targetKey.toString()} is not a function`);

    return this.getSpy(targetKey);
  }

  private getSpy (targetKey: string): Spy {
    if (!Reflect.hasMetadata(SPY_KEY, this.mock, targetKey)) {
      Reflect.defineMetadata(SPY_KEY, createSpy(), this.mock, targetKey);
    }

    return Reflect.getMetadata(SPY_KEY, this.mock, targetKey);
  }

  static of<U> (target: INewable<U>, exclude: Array<string> = [ 'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'propertyIsEnumerable', 'isPrototypeOf', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__', '__proto__', 'constructor' ]): Mock<U> {
    return new Mock(target, exclude);
  }
}
