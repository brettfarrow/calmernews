require('isomorphic-fetch');

const host = process.argv
  .find((i) => i.includes('--host'))
  .replace('--host=', '');

let promises = [fetch(`${host}`), fetch(`${host}/api`)];

for (let i = 1; i < 10; i++) {
  promises.push(fetch(`${host}/news?p=${i}`));
}

const results = Promise.all(promises)
  .then((r) => console.log(r))
  .catch((e) => console.error(e));
