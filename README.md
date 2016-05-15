#emock
*emock* generates automatically mocks from you classes.

[![Build Status](https://travis-ci.org/otbe/emock.svg?branch=master)](https://travis-ci.org/otbe/emock)
[![Coverage Status](https://coveralls.io/repos/github/otbe/emock/badge.svg?branch=master)](https://coveralls.io/github/otbe/emock?branch=master)

The entire public API will be mocked. It is especially designed to use in conjunction with ES6 classes (but not exclusive).
Internally it uses [expect](https://github.com/mjackson/expect) spies. It has full typescript support and was developed for it!

##Install

```npm i emock --save-dev``

##Usage
It is as simple as:

```javascript
import { Mock, expectExtensions } from 'emock';
import expect, { extend } from 'expect';

extend(expectExtensions);

class MyService {
  echo (s: string): string {
    return s;
  }
}

describe('Usage'`, () => {
  it('should show me usage', () => {
    let m: Mock<MyService> = Mock.of(MyService);

    let service: MyService = m.mock;

    console.log(service.echo('name')); // -> undefined

    // lets add some spy logic
    m.spyOn(x => x.echo('Foo')).andReturn('Bar'); // note: x is from type MyService so will get full code completion! :)

    console.log(service.echo('name')); // -> Bar

    // Was echo called?
    expect(service.echo).toHaveBeenCalled();

    // Was echo called with 'name'?
    expect(service.echo).toHaveBeenCalledWith('name');

    // Why I have added 'Foo' to the spyOn call? Because we could do the following:
    (<any>expect(service.echo)).toHaveBeenCalledWithSignature();

    // the last expect will fail, but why? We have recorded a call signature with m.spyOn(x => x.echo('Foo'))
    // That means, if echo is called it should be called with one parameter 'Foo'
    // toHaveBeenCalledWithSignature() verifies that for us
  });
});
```
See tests for more examples. :)

##Matchers
Like I said before ```m.spyOn(x => x.echo('Foo'));``` records a call signature, but you don't have to use explicit values
like in the example above. You can use some matchers from the ```It``` package. For example:

```javascript
m.spyOn(x => x.echo(It.isString()));

m.mock.echo('test');
(<any>expect(m.mock.echo)).toHaveBeenCalledWithSignature(); // passes

m.mock.echo('test2');
(<any>expect(m.mock.echo)).toHaveBeenCalledWithSignature(); // passes

m.mock.echo(<any>5);
(<any>expect(m.mock.echo)).toHaveBeenCalledWithSignature(); // fails with 5 is not a string

```

##Dependencies
*emock* itself has no dependencies, but some peerDependencies.

* [expect](https://github.com/mjackson/expect) (because *emock* relies on it)
* [is-equal](https://www.npmjs.com/package/is-equal) (comes with expect)

You will need some polyfills for your environment if there is no support for used features:

* [Reflect API](https://www.npmjs.com/package/reflect-metadata) with metadata support
* ```Symbol``` polyfill (comes with babel-polyfill for example)


##Known issues
Sourcemaps are broken while testing. :(
