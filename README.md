# Kroky API

#### Import the module
```js
const kroky = require('kroky-api')
```

#### Login
```js
await kroky.login(username, password)
```

#### Get meals
**week (Number):**

- `-1` - *Previous week*
- `0` - *Current week*
- `1` - *Next week*
- ...
```js
await kroky.getMeals(week)
```

#### Select meal
- **date (Date)**: `2020-03-18`
- **id (Number)**: `23679` - category id
- **xl (Boolean)**: `true` - large meal
```js
await kroky.selectMeal(date, id, xl)
```

#### Sample json response
```json
[
    [
        {
            "id": 23679,
            "name": "This is a custom meal name",
            "date": "2020-03-18",
            "selected": true
        }
    ]
]
```