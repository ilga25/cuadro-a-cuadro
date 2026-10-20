'use strict';
const $=id=>document.getElementById(id), fmt=n=>new Intl.NumberFormat('es',{maximumFractionDigits:2}).format(n);
const initial={wall:300,gap:8,center:150,align:'center',frames:[{w:40,h:50,drop:5,hooks:1,spread:20},{w:50,h:70,drop:6,hooks:2,spread:30},{w:40,h:50,drop:5,hooks:1,spread:20}]};
let state=structuredClone(initial),valid=false;
try{const s=new URL(location.href).searchParams.get('plano');if(s&&s.length<6000){const d=JSON.parse(s);FrameMath.plan(d);state=d;}}catch{$('feedback').textContent='El enlace no contenía un plano válido. Se muestra el ejemplo.';}
function row(f,i){return `<fieldset class="frame"><legend>Cuadro ${i+1}</legend><div class="fields"><label>Ancho exterior (cm)<input data-key="w" type="number" min="1" max="500" step="0.1" value="${f.w}" required></label><label>Alto exterior (cm)<input data-key="h" type="number" min="1" max="500" step="0.1" value="${f.h}" required></label><label>Colgadores fijos<select data-key="hooks"><option value="1" ${f.hooks===1?'selected':''}>Uno centrado</option><option value="2" ${f.hooks===2?'selected':''}>Dos simétricos</option></select></label><label>Del borde superior al apoyo (cm)<input data-key="drop" type="number" min="0" max="500" step="0.1" value="${f.drop}" required></label><label class="spread" ${f.hooks===1?'hidden':''}>Entre colgadores (cm)<input data-key="spread" type="number" min="0.1" max="500" step="0.1" value="${f.spread}"></label></div><button type="button" class="secondary remove" data-remove="${i}" ${state.frames.length===1?'disabled':''}>Quitar cuadro ${i+1}</button></fieldset>`;}
function renderInputs(){for(const k of ['wall','gap','center','align'])$(k).value=state[k];$('frames').innerHTML=state.frames.map(row).join('');$('add').disabled=state.frames.length>=12;}
function read(){for(const k of ['wall','gap','center'])state[k]=Number($(k).value||NaN);state.align=$('align').value;state.frames=[...document.querySelectorAll('.frame')].map(el=>{let f={};el.querySelectorAll('[data-key]').forEach(input=>f[input.dataset.key]=Number(input.value===''?NaN:input.value));return f;});}
function calculate(){
 read();try{
 const p=FrameMath.plan(state);valid=true;$('error').hidden=true;$('result').hidden=false;$('print').disabled=false;$('share').disabled=false;
 $('total').textContent=fmt(p.width)+' cm';$('margin').textContent=fmt(p.margin)+' cm';
 const height=Math.max(...p.frames.map(f=>f.top))+15;
 $('drawing').innerHTML=`<svg viewBox="-12 -12 ${p.wall+24} ${height+24}" role="img" aria-label="Vista frontal: cuadros numerados y puntos de apoyo en naranja. El suelo está abajo."><line x1="0" y1="${height}" x2="${p.wall}" y2="${height}" stroke="#929b83" stroke-width="0.7"/>${p.frames.map((f,i)=>`<rect x="${f.x}" y="${height-f.top}" width="${f.w}" height="${f.h}" fill="${['#d8c7a8','#b5c3a0','#c6b7a8'][i%3]}" stroke="#57644a" stroke-width="1.3"/><text x="${f.x+f.w/2}" y="${height-f.top+f.h/2}" text-anchor="middle" dominant-baseline="middle" font-size="${Math.max(4,Math.min(f.w,f.h)/4)}" fill="#33432c">${i+1}</text>${f.points.map(x=>`<circle cx="${x}" cy="${height-f.y}" r="1.7" fill="#a84b26"/>`).join('')}`).join('')}<text x="${p.wall/2}" y="${height+8}" text-anchor="middle" font-size="5" fill="#57644a">Suelo · pared de ${fmt(p.wall)} cm</text></svg>`;
 $('positions').innerHTML=p.frames.map((f,i)=>`<tr><th scope="row">${i+1}</th><td>${fmt(f.x)} cm</td><td>${fmt(f.bottom)} cm</td><td>${f.points.map(x=>fmt(x)).join(' / ')} cm</td><td>${fmt(f.y)} cm</td></tr>`).join('');
 $('live-status').textContent=`${p.frames.length} cuadros. Composición de ${fmt(p.width)} centímetros y márgenes de ${fmt(p.margin)} centímetros.`;
 }catch(e){valid=false;$('error').textContent=e.message;$('error').hidden=false;$('result').hidden=true;$('print').disabled=true;$('share').disabled=true;$('live-status').textContent='Revisa las medidas.';}
}
$('form').addEventListener('input',e=>{if(e.target.dataset.key==='hooks'){const group=e.target.closest('.frame');group.querySelector('.spread').hidden=e.target.value==='1';}calculate();});
$('form').addEventListener('change',calculate);$('form').addEventListener('submit',e=>e.preventDefault());
$('add').addEventListener('click',()=>{read();state.frames.push({...initial.frames[0]});renderInputs();calculate();});
$('frames').addEventListener('click',e=>{if(e.target.dataset.remove!==undefined){read();state.frames.splice(Number(e.target.dataset.remove),1);renderInputs();calculate();}});
$('reset').addEventListener('click',()=>{state=structuredClone(initial);renderInputs();calculate();$('feedback').textContent='Ejemplo recuperado.';});
$('print').addEventListener('click',()=>{if(valid)window.print();});
$('share').addEventListener('click',async()=>{if(!valid)return;const u=new URL(location.href);u.search='';u.searchParams.set('plano',JSON.stringify(state));try{await navigator.clipboard.writeText(u.href);$('feedback').textContent='Enlace copiado. Incluye las medidas del plano.';}catch{$('share-url').hidden=false;$('share-url').value=u.href;$('share-url').select();$('feedback').textContent='Copia el enlace del campo de abajo.';}});
renderInputs();calculate();
