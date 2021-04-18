'use strict' // 2021-02-11 10.50

const fs = require('fs')
const path = require('path')
const { xdDirScan } = require('./util/xdDirScan')
const { xdFileWrite } = require('./util/xdFileWrite')
const { xdPath } = require('./util/xdPath')
const Config = require('./Config')

module.exports = function tsk_glue_files (cfg)
{
    const debug = process.argv.includes('-debug')
    const config = new Config(cfg)
    if (debug) console.log({ config })
    const srcdirRel  = xdPath.std(config.sourceDir)
    const srcdirAbs  = xdPath.abs(config.sourceDir)
    const outfileRel = xdPath.std(config.outputFile)
    const outfileAbs = xdPath.abs(config.outputFile)
    if (debug) console.log({ srcdirRel, srcdirAbs, outfileRel, outfileAbs })
    const srcs = xdDirScan(`${ srcdirAbs }`, 'files').filter(config.filterFn).sort(config.sortFn)
    if (!srcs.length) return console.log(`no matches`)
    let contents = ''

    for (let i = 0; i < srcs.length; i++)
    {
        const srcRel = `${ srcdirRel }/${ srcs[i] }`
        const srcAbs = `${ srcdirAbs }/${ srcs[i] }`
        if (config.verbose) console.log(`${ i + 1 }/${ srcs.length } ${ srcRel }`)
        if (debug) console.log({ srcRel, srcAbs })
        contents += config.wrapFn(fs.readFileSync(srcAbs, 'utf8'), srcRel)
    }

    if (!config.overwrite && fs.existsSync(outfileAbs))
    {
        console.log(`\noutput file already exists. merging`)
        contents = fs.readFileSync(outfileAbs) + contents
    }

    xdFileWrite(outfileAbs, contents)
    console.log(`\n${ srcs.length } ${ srcs.length === 1 ? 'file' : 'files' } -> ${ outfileRel }`)
}