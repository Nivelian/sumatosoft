let message;
let start = 0;

window.onload = () => {
  byId('supported').innerHTML = Object.keys(dict).join(', ');
  message = repeatZero(HEIGHT).map(_ => repeatZero(WIDTH));
  append(byId('box'), append(div('row'), div('dot'), WIDTH), HEIGHT);
  setInterval(() => drawMessage(start++), 50);
};
let update = () => {
  [message, start] = [encode(), 0];
  drawMessage(start);
};
let encode = () => {
  let encoded = byId('input').value.split('').map(c => dict[c.toLowerCase()] || dict['_'])
    .concat(repeat(dict['#'], WIDTH/SCALE));
  return encoded.reduce((res, matrix) => {
    matrix.forEach((row, i) => res[i] = (res[i] || []).concat(row));
    return res; 
  }, []);
};
let draw = xss => children(byId('box')).forEach((xs, i) =>
  children(xs).forEach((x, k) => setClass(x, 'filled', bool(xss[i][k]))));
let drawMessage = i => draw(message.map(xs => cut(xs, i)));

// Constants
const SCALE = 7;  // points in letter
const [HEIGHT, WIDTH] = [1*SCALE, 7*SCALE];

// HTML utils
let byId = x => document.getElementById(x);
let setClass = (src, name, x=true) => src.classList[x ? 'add' : 'remove'](name);
let div = (...classes) => {
  let node = document.createElement('div');
  classes.forEach(x => setClass(node, x));
  return node;
}
let children = x => [].slice.call(x.children);
let append = (x, y, n=1) => {
  repeatZero(n).forEach(_ => {x.appendChild(y.cloneNode(true))});
  return x;
};

// Other utils
let repeat = (x, n) => {
  let res = [];
  for (var i=0; i<n; i++) res.push(x);
  return res;
}
let repeatZero = n => repeat(0, n);
let bool = x => !!x;
let _remains = (xs, left) => xs.slice(0, left < 0 ? 0 : left);
let cut = (xs, start, n=WIDTH) => {
  start %= xs.length;
  return n > xs.length ? xs : xs.slice(start, start + n).concat(_remains(xs, n-xs.length+start));
}
