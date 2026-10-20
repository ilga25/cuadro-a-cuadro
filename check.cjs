const {plan}=require('./calc.js');const assert=require('node:assert/strict');
const f={w:40,h:60,drop:5,hooks:1,spread:20};
let d={wall:300,gap:10,center:150,align:'center',frames:[f,{...f,w:60,h:40},f]};
let p=plan(d);assert.equal(p.width,160);assert.equal(p.margin,70);assert.deepEqual(p.frames.map(f=>f.points[0]),[90,150,210]);assert.deepEqual(p.frames.map(f=>f.y),[175,165,175]);
p=plan({...d,align:'top'});assert.equal(p.frames[1].top,180);assert.equal(p.frames[1].y,175);
p=plan({...d,align:'bottom'});assert.equal(p.frames[1].bottom,120);assert.equal(p.frames[1].y,155);
p=plan({...d,frames:[{...f,hooks:2,spread:30}]});assert.deepEqual(p.frames[0].points,[135,165]);
assert.throws(()=>plan({...d,wall:100}));assert.throws(()=>plan({...d,center:1}));assert.throws(()=>plan({...d,frames:[{...f,drop:70}]}));assert.throws(()=>plan({...d,frames:[{...f,hooks:2,spread:50}]}));assert.throws(()=>plan({...d,frames:[]}));
for(let n=1;n<=12;n++){const q=plan({...d,wall:1000,frames:Array.from({length:n},()=>f)});assert.ok(Math.abs(q.frames.at(-1).x+40+q.margin-1000)<1e-8);}
console.log('21 comprobaciones de geometría y validación superadas.');
