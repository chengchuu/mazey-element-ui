import merge from 'mazey-element-ui/src/utils/merge';
import { isObject } from 'mazey-element-ui/src/utils/types';

describe('Utils:Mazey', () => {
  it('merges defined own properties and tolerates empty sources', () => {
    const target = { retained: true, value: 'initial' };
    const result = merge(
      target,
      null,
      undefined,
      { retained: undefined, value: 'updated', enabled: false }
    );

    expect(result).to.equal(target);
    expect(result).to.deep.equal({
      retained: true,
      value: 'updated',
      enabled: false
    });
  });

  it('copies an own __proto__ property without changing the target prototype', () => {
    const target = {};
    const source = JSON.parse('{"__proto__":{"polluted":true}}');

    merge(target, source);

    expect(Object.getPrototypeOf(target)).to.equal(Object.prototype);
    expect(Object.prototype.hasOwnProperty.call(target, '__proto__')).to.equal(true);
    expect(target.__proto__).to.deep.equal({ polluted: true });
    expect(target.polluted).to.equal(undefined);
  });

  it('keeps the established object-tag semantics', () => {
    class Example {}

    expect(isObject({})).to.equal(true);
    expect(isObject(new Example())).to.equal(true);
    expect(isObject(Object.create(null))).to.equal(true);
    expect(isObject([])).to.equal(false);
    expect(isObject(null)).to.equal(false);
  });
});
