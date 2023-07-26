import { glob } from 'glob';
import fs from 'fs';
import path from 'path';

const fileList = await glob('node_modules/core-js/modules/*.js')

function fsReadPromise(source) {
  return new Promise(resolve => {
    fs.readFile(source, (err, data) => {
      resolve(data)
    })
  })
}

var output = {}

var promiseList = fileList.map(source => {
  return fsReadPromise(source).then(data => {
    const moduleName = path.basename(source);
    const txt = data.toString()
    const [, args = '', funcName] = txt.match(/\$\(\{([\S|\s]+)\},\s+\{\n\s+(\w+):/) || []
    const [, name] = args.match(/target:\s+'(\w+)'/) || [,'window']
    if (args) {
      output[moduleName] = {
        parent: name,
        child: funcName
      }
    }
  })
})

Promise.allSettled(promiseList).then(() => {
  fs.writeFile(path.resolve('./src/core-js-modules.json'), JSON.stringify(output), () => {})
})
