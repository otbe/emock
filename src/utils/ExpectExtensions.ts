import isEqual from 'is-equal';
import { Extension, assert } from 'expect';
import { MATCHER } from './It';
import { CALL_SIGNATURE_KEY } from '../mock/MetaKeys';

export const expectExtensions: Extension = {
  toHaveBeenCalledWithSignature(): void {
    assert(this.actual.getLastCall(), 'spy was never called');

    let lastCallArgs: Array<any> = this.actual.getLastCall().arguments;
    let desiredCallArgs: Array<any> = Reflect.getMetadata(CALL_SIGNATURE_KEY, this.actual);

    assert(desiredCallArgs != null, 'No call signature recorded');
    assert(lastCallArgs.length === desiredCallArgs.length, 'Call signature mismatch; present: %s <-> desired: %s arguments', lastCallArgs.length, desiredCallArgs.length);

    let mismatchIndex = -1;
    let message: string;

    for (let i = 0; i < lastCallArgs.length; i++) {
      switch (desiredCallArgs[i]) {
        case MATCHER.ANY:
          break;
        case MATCHER.STRING:
          if (typeof lastCallArgs[i] !== 'string') {
            mismatchIndex = i;
            message = '%s is not a string';
          }
          break;
        case MATCHER.NUMBER:
          if (typeof lastCallArgs[i] !== 'number') {
            mismatchIndex = i;
            message = '%s is not a number';
          }
          break;
        case MATCHER.OBJECT:
          if (typeof lastCallArgs[i] !== 'object') {
            mismatchIndex = i;
            message = '%s is not an object';
          }
          break;
        case MATCHER.ARRAY:
          if (!Array.isArray(lastCallArgs[i])) {
            mismatchIndex = i;
            message = '%s is not an array';
          }
          break;
        default:
          if (!isEqual(lastCallArgs[i], desiredCallArgs[i])) {
            mismatchIndex = i;
            message = 'Arguments mismatch; present: %s <-> desired: %s at position %s';
          }
      }

      assert(mismatchIndex === -1, message, lastCallArgs[mismatchIndex], desiredCallArgs[mismatchIndex], mismatchIndex);
    }
  }
};
