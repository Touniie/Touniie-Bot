"use strict"

module.exports = function () {
    let req = require,
        { readFileSync, writeFileSync, existsSync } = req('fs'),
        { get } = req('axios'), { log } = console,
        url = a => get(a, { responseType: 'stream' }).then(r => r.data),
        URL = (a, b) => get(a, { responseType: 'stream' }).then(r => (r.data.path = `tmp.${b}`, r.data)),
        read = a => readFileSync(a, 'utf8'),
        write = (a, b) => writeFileSync(a, b, 'utf8'),
        parse = a => JSON.parse(read(a)),
        have = a => existsSync(a),
        ify = (a, b) => write(a, JSON.stringify(b, null, 1)),
        int = parseInt, float = parseFloat, big = BigInt,
        incl = (a, b) => a.includes(b),
        number = a => a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        random = a => Math.floor(Math.random() * a),
        random2 = a => a[Math.floor(Math.random() * a.length)],
        lower = a => a.toLowerCase(), string = a => a.toString(), lth = a => a.length
    return {
        req, url, URL,
        read, write, have,
        parse, ify,
        int, float, number, big,
        incl,
        log,
        random, random2,
        lower, string, lth
    }
}