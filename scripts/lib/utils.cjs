function stringify(replaceValues){
  return Object.entries(replaceValues).reduce((acc, [key, value]) => {
    acc[key] = JSON.stringify(value);
    return acc;
  }, {})
}

function replace(str, match) {
  for (const [search, replace] of Object.entries(match)) {
    let s = str.split(search);
    if (s.length > 1) {
      str = s.join(replace)
    }
  }
  return str
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Octets';
  const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

module.exports = {
  replace,
  stringify,
  formatBytes
};