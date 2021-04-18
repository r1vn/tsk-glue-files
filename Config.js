'use strict'

module.exports = class Config
{
    sourceDir
    outputFile
    filterFn
    sortFn
    wrapFn
    overwrite
    verbose

    constructor (opts)
    {
        for (const key in this)
        {
            if (!opts.hasOwnProperty(key))
            {
                throw `missing property in config: ${ key }`
            }
        }

        for (const key in opts)
        {
            if (!this.hasOwnProperty(key))
            {
                throw `unknown property in config: ${ key }`
            }

            this[key] = opts[key]
        }

        // sourceDir / outputFile

        for (const prop of ['sourceDir', 'outputFile'])
        {
            if (typeof this[prop] !== 'string')
            {
                throw `config.${ prop }: must be a string`
            }
        }

        // filterFn / sortFn / wrapFn

        for (const prop of ['filterFn', 'sortFn', 'wrapFn'])
        {
            if (typeof this[prop] !== 'function')
            {
                throw `config.${ prop } must be a function`
            }
        }
    }
}