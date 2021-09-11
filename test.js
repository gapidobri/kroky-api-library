const kroky = require("./index.js");

async function main() {
  await kroky.login("dobgas", "abc11gd9");

  console.log(await kroky.getMeals(0));
}

main();
