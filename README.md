conditionally concatenate files

## setup

- download [tsk-glue-files.tar.xz](https://github.com/r1vn/tsk-glue-files/raw/master/tsk-glue-files.tar.xz) and unpack as `your-project/lib/tsk-glue-files`
- add a config entry to the manifest

example config: glue all `.js` but not `min.js` files from `tmp/build` to `output/assets/build.js` in project directory

```
tmp/build/foo/file1.js
tmp/build/bar/file2.js
tmp/build/file3.js
tmp/build/file4.min.js
```

```
{
    module: 'lib/tsk-glue-files',
    config:
    {
        // path of the directory to get files from
        sourceDir: 'tmp/build',
        // path of the output file
        outputFile: 'output/assets/build.js',
        // filter for the files in sourceDir
        filterFn: srcPath => /\.js$/i.test(srcPath) && !/\.min\.js$/i.test(srcPath),
        // sort function applied to relative file paths in sourceDir
        sortFn: (a, b) => b - a,
        // this function can modify the contents of a file before inserting its contents into output
        wrapFn: (src, srcPath) => `/** ${ srcPath } **/\n\n${ src }\n\n`,
        // if set to false, the contents will be merged into the existing file instead of overwriting it
        overwrite: true,
        // toggles verbose output
        verbose: true
    }
}
```

the order the files are concatenated in is similar to the output of `ls -R`

`output/assets/build.js`
```
/** tmp/build/bar/file1.js **/

// ..


/** tmp/build/file3.js **/

// ...


/** tmp/build/foo/file2.js **/

// ...
```