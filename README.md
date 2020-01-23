# gs-query
LINQ-like collection management library for Google Apps Scripts

## Usage

### 1. Add to your project `src` folder as Git submodule

```BASH
cd dist
git submodule add https://github.com/Glajik/gs-query.git
```

### 2. Setup your .claspignore file

If you don't have it, create it in the same folder where is `.clasp.json` file.

Example of `.claspignore` file

```TEXT
# Ignore all submodule's folders, except 'dist'
gs-query/**
!**/*.js
```

### 3. Use it
```JS
const cars = [
    { brand: 'bmw', model: 'm4', year: 2013 },
    { brand: 'bmw', model: 'm5', year: 2014 },
    { brand: 'kia', model: 'sorento', year: 2014 },
    { brand: 'kia', model: 'rio', year: 2010 },
    { brand: 'kia', model: 'sportage', year: 2012 },
  ];
  
query().from(cars).where({ brand: 'kia' }).select(['model', 'year']).toArray();

/* Output:
[
  { model: 'sorento', year: 2014 },
  { model: 'rio', year: 2010 },
  { model: 'sportage', year: 2012 },
]
*/

// See more usage examples in file __tests__/query.test.js
```

### Update dependency

From your root of project run

```BASH
git submodule update --remote
```
