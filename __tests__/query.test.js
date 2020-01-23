import query from '../query';

describe('Query', () => {
  const cars = [
    { brand: 'bmw', model: 'm4', year: 2013 },
    { brand: 'bmw', model: 'm5', year: 2014 },
    { brand: 'kia', model: 'sorento', year: 2014 },
    { brand: 'kia', model: 'rio', year: 2010 },
    { brand: 'kia', model: 'sportage', year: 2012 },
  ];

  it('From', () => {
    expect(
      query().from([{ a: 1 }]).from([{ b: 2 }]).toArray()
    ).toEqual(
      [{ a: 1 }, { b: 2 }]
    );
  });

  it('Where with query object', () => {
    expect(
      query().from(cars).where({ brand: 'kia' }).toArray()
    ).toEqual([
      { brand: 'kia', model: 'sorento', year: 2014 },
      { brand: 'kia', model: 'rio', year: 2010 },
      { brand: 'kia', model: 'sportage', year: 2012 },
    ]);

    expect(
      query().from(cars).where({ brand: 'kia', year: 2010 }).toArray()
    ).toEqual([
      { brand: 'kia', model: 'rio', year: 2010 },
    ]);

    expect(
      query().from(cars).where({ brand: 'kia', year: 2010, color: 'red' }).toArray()
    ).toEqual([]);
  });

  it('Where with function', () => {
    expect(
      query().from(cars).where(car => car.year > 2012).toArray()
    ).toEqual([
      { brand: 'bmw', model: 'm4', year: 2013 },
      { brand: 'bmw', model: 'm5', year: 2014 },
      { brand: 'kia', model: 'sorento', year: 2014 },
    ]);
  });

  it('Where with pair', () => {
    expect(
      query().from(cars).where('brand', 'bmw').toArray()
    ).toEqual([
      { brand: 'bmw', model: 'm4', year: 2013 },
      { brand: 'bmw', model: 'm5', year: 2014 },
    ]);

    expect(
      query().from(cars).where('brand', 'bmw').where('year', 2013).toArray()
    ).toEqual([
      { brand: 'bmw', model: 'm4', year: 2013 },
    ]);
  });

  it('Where without arg', () => {
    expect(
      query().from(cars).where().toArray()
    ).toEqual([
      { brand: 'bmw', model: 'm4', year: 2013 },
      { brand: 'bmw', model: 'm5', year: 2014 },
      { brand: 'kia', model: 'sorento', year: 2014 },
      { brand: 'kia', model: 'rio', year: 2010 },
      { brand: 'kia', model: 'sportage', year: 2012 },
    ]);
  });

  it('Select with function', () => {
    const formatOutput = (item) => {
      const [first, ...rest] = item.model;
      const newModel = [first.toUpperCase(), ...rest].join('');
      const twoDigitYear = item.year - 2000
      return [newModel, twoDigitYear].join("'");
    };

    expect(
      query().from(cars).where({ brand: 'kia' }).select(formatOutput)
    ).toEqual(
      ["Sorento'14", "Rio'10", "Sportage'12"]
    );
  });

  it('Select with list of fields', () => {
    expect(
      query().from(cars).where({ brand: 'kia' }).select(['model', 'year'])
    ).toEqual([
      { model: 'sorento', year: 2014 },
      { model: 'rio', year: 2010 },
      { model: 'sportage', year: 2012 },
    ]);
  });

  it('Select with key', () => {
    expect(
      query().from(cars).where({ brand: 'kia' }).select('model')
    ).toEqual(
      ['sorento', 'rio', 'sportage']
    );
  });

  it('Select without arg', () => {
    expect(
      query().from(cars).where({ brand: 'kia' }).select()
    ).toEqual([
      { brand: 'kia', model: 'sorento', year: 2014 },
      { brand: 'kia', model: 'rio', year: 2010 },
      { brand: 'kia', model: 'sportage', year: 2012 },
    ]);
  });

  it('Order by with key', () => {
    expect(
      query().from(cars).where({ brand: 'kia' }).orderBy('year').select('year')
    ).toEqual(
      [2010, 2012, 2014]
    );

    expect(
      query().from(cars).where({ brand: 'kia' }).orderBy('year', 'desc').select('year')
    ).toEqual(
      [2014, 2012, 2010]
    );
  });

  it('Order by with function', () => {
    // yearmodel - like 2013m4, 2014sorento
    const computedField = item => [item.year, item.model].join('');

    expect(
      query().from(cars).orderBy(computedField, 'asc').select()
    ).toEqual([
      { brand: 'kia', model: 'rio', year: 2010 },
      { brand: 'kia', model: 'sportage', year: 2012 },
      { brand: 'bmw', model: 'm4', year: 2013 },
      { brand: 'bmw', model: 'm5', year: 2014 },
      { brand: 'kia', model: 'sorento', year: 2014 }
    ]);
  });
});
