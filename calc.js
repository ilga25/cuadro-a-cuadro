(function(root){
 'use strict';
 function plan(d){
  const num=(v,min,max,label)=>{if(!Number.isFinite(v)||v<min||v>max)throw Error(label+' fuera de rango.');return v;};
  const wall=num(d.wall,1,2000,'Ancho de pared'), gap=num(d.gap,0,200,'Separación'), center=num(d.center,0,1000,'Altura de referencia');
  if(!['center','top','bottom'].includes(d.align))throw Error('Alineación no válida.');
  if(!Array.isArray(d.frames)||d.frames.length<1||d.frames.length>12)throw Error('Utiliza entre 1 y 12 cuadros.');
  const frames=d.frames.map(f=>{
   num(f.w,1,500,'Ancho de cuadro');num(f.h,1,500,'Alto de cuadro');num(f.drop,0,f.h,'Distancia al colgador');
   if(![1,2].includes(f.hooks))throw Error('Selecciona uno o dos colgadores.');
   num(f.spread,0,500,'Distancia entre colgadores');
   if(f.hooks===2)num(f.spread,0.1,f.w,'Distancia entre colgadores');
   return {...f};
  });
  const width=frames.reduce((s,f)=>s+f.w,0)+gap*(frames.length-1), margin=(wall-width)/2;
  if(margin< -1e-8)throw Error('Los cuadros y sus separaciones no caben. Necesitas '+width.toFixed(1)+' cm de ancho.');
  const maxH=Math.max(...frames.map(f=>f.h));let x=Math.max(0,margin);
  for(const f of frames){
   f.x=x; f.top=d.align==='top'?center+maxH/2:d.align==='bottom'?center-maxH/2+f.h:center+f.h/2;
   f.bottom=f.top-f.h;f.y=f.top-f.drop;
   if(f.bottom< -1e-8)throw Error('Un cuadro queda por debajo del suelo. Aumenta la altura de referencia.');
   f.points=f.hooks===1?[x+f.w/2]:[x+(f.w-f.spread)/2,x+(f.w+f.spread)/2];x+=f.w+gap;
  }
  return {wall,width,margin:Math.max(0,margin),frames,maxH};
 }
 if(typeof module!=='undefined')module.exports={plan};else root.FrameMath={plan};
})(typeof window!=='undefined'?window:globalThis);
