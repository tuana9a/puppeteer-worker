# config.importPrefix explaination

the structure of project look like

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

so for job-template.db.js `import` or **require(modulepath)** it need to add some

prefix before calling `require` in the example above it can bee `../../` + `.tmp` then the module file

if you install `puppeteer-worker` then propably in will be in your `node_modules` folder, then the prefix must be different.

There will be much more **"`../`"**

I suggest using absolute path like `~/Projects/puppeteer-worker` or `/home/tuana9a/Projects/puppeteer-worker` for simplicity
