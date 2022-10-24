# config.jobDir explaination

The project structure look like

```
| -- jobs/
|      | -- Job1.js
|      | -- Job2.js
| -- src/
|      | -- common/
|      | -- db/
|      |     | -- JobTemplateDb.js

(...)
```

so if `JobTemplateDb.js` needs to **import** or **require**, it need to add prefix to the module path, for example

```js
// JobTemplateDb.js
const job1 = require("./jobs/job1"); // not work

// adding "../../"
const job1 = require("../../jobs/job1"); // work
```

if you install `puppeteer-worker` then propably in will be in your `node_modules` folder, then the prefix must be different.

There will be much more **"`../`"**

```
| -- jobs/
|      | -- job1.js
|      | -- job2.js
| -- node_modules/
|      | -- puppeteer-worker
|             | -- src/
|                    | -- common/
|                    | -- db/
|                    |     | -- JobTemplateDb.js

(...)
```

```js
const job1 = require("../../jobs/job1"); // not work anymore

// adding more "../../"
const job1 = require("../../../../jobs/job1"); // work
```

For simplicity using absolute path: `~/Projects/puppeteer-worker`

in my laptop: `/home/tuana9a/Projects/puppeteer-worker`
