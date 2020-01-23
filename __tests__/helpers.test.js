import byKeyValue from '../byKeyValue';
import byObj from '../byObj';

describe('query helpers', () => {
  it('byKeyValue_ - should work', () => {
    expect(byKeyValue('a', 1)({ a: 1 })).toBeTruthy();
    expect(byKeyValue('a', 1)({ a: '1' })).toBeFalsy();
    expect(byKeyValue('b', 2)({ a: 1 })).toBeFalsy();
    expect(byKeyValue('b', 2)({ b: 3 })).toBeFalsy();
  });

  it('byKeyValue_ - shouldn\'t throw', () => {
    expect(byKeyValue()({ b: 3 })).toBeFalsy();
    expect(byKeyValue('b', 2)()).toBeFalsy();
  });

  it('byObj_ - should work', () => {
    const cars = [
      { brand: 'bmw', model: 'm4', year: 2013 },
      { brand: 'bmw', model: 'm5', year: 2014 },
      { brand: 'kia', model: 'sorento', year: 2014 },
      { brand: 'kia', model: 'rio', year: 2010 },
      { brand: 'kia', model: 'sportage', year: 2012 },
    ];

    // query
    const list = byObj({ brand: 'kia', year: 2014 });
    expect(list).toHaveLength(2);

    // test query result
    const [first, second] = list.map(predicate => cars.filter(predicate));
    expect(first).toEqual([
      { brand: 'kia', model: 'sorento', year: 2014 },
      { brand: 'kia', model: 'rio', year: 2010 },
      { brand: 'kia', model: 'sportage', year: 2012 },
    ]);
    expect(second).toEqual([
      { brand: 'bmw', model: 'm5', year: 2014 },
      { brand: 'kia', model: 'sorento', year: 2014 },
    ]);
  });

  it('byObj_ - shouldn\'t throw', () => {
    expect(byObj({})).toHaveLength(0);
    expect(byObj()).toHaveLength(0);
    const list = byObj({ brand: 'kia', year: 2014 });
    const result = list.map(predicate => [].filter(predicate));
    expect(result).toHaveLength(2);
  });
});