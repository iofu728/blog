export function pathToComponentName(path) {
  if (path.charAt(path.length - 1) === '/') {
    return `page${path.replace(/\//g, '-') + 'index'}`
  } else {
    return `page${path.replace(/\//g, '-').replace(/\.html$/, '')}`
  }
}

export function updateMetaTags(meta, current) {
  if (current) {
    current.forEach(c => {
      document.head.removeChild(c)
    })
  }
  if (meta) {
    return meta.map(m => {
      const tag = document.createElement('meta')
      Object.keys(m).forEach(key => {
        tag.setAttribute(key, m[key])
      })
      document.head.appendChild(tag)
      return tag
    })
  }
}

const slugReg = /\/([^\/]+).html$/;

export function matchSlug(path) {
  const arr = path.match(slugReg);
  return arr ? arr[1] : "homePage";
}

export function decoderTagName(tagName) {
  const res = [];
  const tags = tagName.split("/").slice(0, 3);
  tags.slice(-1)[0].replace("(", "").replace(")", "").split("#").forEach(tag => {
    var tmp = [...tags];
    tmp[tmp.length - 1] = tag;
    res.push(tmp);
  })
  return res
}

export function decoderTagGraph(tagG) {
  const res = [];
  const done = new Set();
  for (const [key, value] of Object.entries(tagG)) {
    if (!done.has(key)) {
      var tmpRes = dfsTagGraph(key, tagG, done);
      res.push(...tmpRes);
    }
  }
  return res;
}

export function dfsTagGraph(root, tagG, done) {
  const queue = [];
  const res = [];
  queue.push([root, 1]);
  while (queue.length) {
    var top = queue.pop();
    if (done.has(top[0])) {
      continue;
    }
    done.add(top[0]);
    res.push(top);
    const children = tagG[top[0]] || [];
    children.forEach(c => {
      if (!done.has(c)) {
        queue.push([c, top[1] + 1]);
      }
    })
  }
  return res;
}