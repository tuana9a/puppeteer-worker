# config.jobImportPrefix explaination

The project structure look like

```
| -- .tmp/
|      | -- job1.js
|      | -- job2.js
| -- src/
       | -- common/
       | -- db/
       |     | -- job-template.db.js
    ...etc
```

so if `job-template.db.js` needs to **import** or **require(modulepath)** it need to add prefix to the module path, for example

```js
// job-template.db.js
const job1 = require("./.tmp/job1"); // not work

// adding "../../"
const job1 = require("../../" + ".tmp/job1"); // work
```

if you install `puppeteer-worker` then propably in will be in your `node_modules` folder, then the prefix must be different.

There will be much more **"`../`"**

```
| -- .tmp/
|      | -- job1.js
|      | -- job2.js
| -- node_modules/
        | -- puppeteer-worker
                | -- src/
                    | -- common/
                    | -- controllers/
                    |     | -- job-template.db.js
                    ...etc
```

```js
const job1 = require("../../" + ".tmp/job1"); // not work anymore

// adding more "../../"
const job1 = require("../../../../" + ".tmp/job1"); // work
```

I suggest using absolute path like `~/Projects/puppeteer-worker` or `/home/tuana9a/Projects/puppeteer-worker` for simplicity
