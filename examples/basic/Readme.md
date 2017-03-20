# emock
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

describe('Usage', () => {
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
