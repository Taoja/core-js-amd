import path from 'path';
import map from './core-js-modules.json';

export default function load(name, req, onload) {
  const moduleName = path.basename(name);
  const res = map[moduleName]
  if (res) {
    var has
    if (res.parent === 'window') {
      has = window[res.child]
    } else {
      has = window[res.parent][res.child]
    }
    if (has) {
      onload(null)
      return
    }
  }
  req([name], function (value) {
    onload(value);
  });
}