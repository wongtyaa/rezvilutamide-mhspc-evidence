/* CHART Evidence Atlas: original procedural anatomy; no third-party 3D assets. */
(() => {
  const $ = (selector) => document.querySelector(selector);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const evidence = {
    2026: { title:'Five-year follow-up', date:'Data cutoff 6 June 2025 · 2026 ASCO meeting abstract', rez:'78.8', bic:'44.8', rezWidth:98.5, bicWidth:56, hr:'0.59', low:.47, high:.73, ci:'0.47–0.73', follow:'Median follow-up: 72.8 months (IQR 69.1–77.4)', note:'Bars encode reported medians only; they are not survival curves. 95% CI: 68.3–NR vs 37.1–57.4 months.', detail:'CHART intention-to-treat population, high-volume mHSPC. Overall survival, data cutoff 6 June 2025. Median 78.8 months (95% CI 68.3–NR) for rezvilutamide + ADT and 44.8 months (95% CI 37.1–57.4) for bicalutamide + ADT. Ye et al., 2026 ASCO abstract 5090.', source:'https://ascopubs.org/doi/10.1200/JCO.2026.44.16_suppl.5090', sourceText:'Read the 2026 ASCO abstract ↗', chartLabel:'2026 median overall survival: 78.8 months with rezvilutamide plus ADT versus 44.8 months with bicalutamide plus ADT' },
    2022: { title:'Preplanned interim analysis', date:'Data cutoff 28 February 2022 · Lancet Oncology primary report', rez:'NR', bic:'NR', rezWidth:0, bicWidth:0, hr:'0.58', low:.44, high:.77, ci:'0.44–0.77', follow:'Median follow-up: 29.3 months (IQR 21.0–33.3)', note:'Median OS was not reached in either arm at this cutoff. The bicalutamide arm 95% CI was 36.2 months to NR.', detail:'CHART intention-to-treat population, high-volume mHSPC. Overall survival, data cutoff 28 February 2022. Median OS was not reached in either arm; hazard ratio 0.58 (95% CI 0.44–0.77). Gu et al., Lancet Oncology 2022.', source:'https://doi.org/10.1016/S1470-2045(22)00507-1', sourceText:'Read the 2022 primary report ↗', chartLabel:'2022 median overall survival was not reached in either randomized arm' }
  };
  function setYear(year) {
    const d=evidence[year];
    $('#analysis-title').textContent=d.title; $('#analysis-date').textContent=d.date;
    $('#value-rez').textContent=d.rez; $('#value-bic').textContent=d.bic;
    $('#bar-rez').style.width=d.rezWidth+'%'; $('#bar-bic').style.width=d.bicWidth+'%';
    $('#median-chart').setAttribute('aria-label',d.chartLabel);
    $('#chart-footnote').textContent=d.note; $('#data-detail-text').textContent=d.detail; $('#hr-value').textContent=d.hr;
    $('#hr-description').textContent='Overall survival · 95% CI '+d.ci;
    $('#ci-graphic').setAttribute('aria-label',`${year} overall survival hazard ratio ${d.hr} with 95% confidence interval ${d.low} to ${d.high}`);
    $('#ci-band').style.left=(d.low/1.5*100)+'%'; $('#ci-band').style.width=((d.high-d.low)/1.5*100)+'%';
    $('#ci-point').style.left=(((Number(d.hr)-d.low)/(d.high-d.low))*100)+'%';
    $('#evidence-context').textContent=d.follow; $('#evidence-source').href=d.source; $('#evidence-source').textContent=d.sourceText;
    document.querySelectorAll('.segmented button').forEach(b=>{const active=b.dataset.year===year;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  }
  document.querySelectorAll('.segmented button').forEach(b=>b.addEventListener('click',()=>setYear(b.dataset.year)));
  setYear('2026');

  const detail=$('#study-detail');
  const studyContent={
    eligibility:['Eligibility','Adults with ECOG performance status 0–1 and high-volume mHSPC were eligible. High-volume disease was defined by visceral metastases or at least four bone lesions, including one beyond the pelvis and vertebral column. Prior chemotherapy and other localized prostate treatment were not allowed.'],
    endpoints:['Co-primary endpoints','CHART measured blinded independent review committee assessed radiographic progression-free survival and overall survival in the intention-to-treat population. The 2026 abstract reports investigator-assessed rPFS; it should not be treated as the same assessment as the 2022 primary rPFS endpoint.'],
    rez:['Selected arm: rezvilutamide + ADT','Randomized patients received rezvilutamide 240 mg orally once daily with ADT. This trial studied high-volume metastatic disease and used bicalutamide plus ADT as its comparator.'],
    bic:['Selected arm: bicalutamide + ADT','Randomized patients received bicalutamide 50 mg orally once daily with ADT. The trial does not directly compare rezvilutamide with other contemporary ARPIs.']
  };
  function showStudy(key){const [title,body]=studyContent[key];detail.innerHTML='<strong></strong><p></p>';detail.querySelector('strong').textContent=title;detail.querySelector('p').textContent=body;document.querySelectorAll('.flow-arm').forEach(b=>b.classList.toggle('active',b.dataset.arm===key));}
  document.querySelectorAll('[data-detail]').forEach(b=>b.addEventListener('click',()=>showStudy(b.dataset.detail)));
  document.querySelectorAll('[data-arm]').forEach(b=>b.addEventListener('click',()=>showStudy(b.dataset.arm)));

  const steps=[
    ['01 — Androgen signal','Androgen binds to the androgen receptor.'],
    ['02 — Receptor activity','Activated AR can enter the nucleus and regulate gene transcription.'],
    ['03 — AR antagonism','An AR antagonist interferes with receptor signaling.'],
    ['04 — Downstream effect','AR-driven transcriptional signaling is reduced.']
  ];
  const moa=$('#mechanism-visual'), moaToggle=$('#mechanism-toggle');
  let step=0, moaPaused=reduced.matches, moaVisible=false, moaTimer;
  function showStep(n){step=n;moa.className='mechanism-visual moa-step-'+step;$('#moa-step-count').textContent=`0${step+1} / 04`;$('#moa-step-title').textContent=steps[step][0];$('#moa-step-description').textContent=steps[step][1];$('#moa-progress-fill').style.width=((step+1)*25)+'%';document.querySelectorAll('.moa-dots button').forEach((b,i)=>{b.classList.toggle('active',i===step);b.setAttribute('aria-pressed',String(i===step));});}
  function syncMoa(){clearInterval(moaTimer);if(moaVisible&&!moaPaused&&!reduced.matches)moaTimer=setInterval(()=>showStep((step+1)%4),3300);moaToggle.innerHTML=moaPaused?'Play sequence <span>▶</span>':'Pause sequence <span>Ⅱ</span>';moaToggle.setAttribute('aria-pressed',String(moaPaused));}
  document.querySelectorAll('.moa-dots button').forEach(b=>b.addEventListener('click',()=>showStep(Number(b.dataset.step))));
  moaToggle.addEventListener('click',()=>{moaPaused=!moaPaused;syncMoa();});
  new IntersectionObserver(entries=>{moaVisible=entries[0].isIntersecting;syncMoa();},{threshold:.1}).observe(moa);
  reduced.addEventListener('change',()=>{if(reduced.matches)moaPaused=true;syncMoa();});
  showStep(0);syncMoa();

  const labelsToggle=$('#labels-toggle'), labels=$('#anatomy-labels');
  labelsToggle.addEventListener('click',()=>{const hidden=labels.classList.toggle('hidden');labelsToggle.textContent=hidden?'Labels off':'Labels on';labelsToggle.setAttribute('aria-pressed',String(!hidden));labels.setAttribute('aria-hidden',String(hidden));document.querySelectorAll('[data-anatomy]').forEach(b=>b.tabIndex=hidden?-1:0);$('#anatomy-info').hidden=true;});
  const anatomyNotes={bladder:'The urinary bladder sits above the prostate.',vesicles:'Paired seminal vesicles lie behind and above the prostate.',prostate:'The prostate sits below the bladder and surrounds the proximal urethra.',urethra:'The urethra carries urine from the bladder through the prostate.'};
  document.querySelectorAll('[data-anatomy]').forEach(b=>b.addEventListener('click',()=>{const info=$('#anatomy-info');info.textContent=anatomyNotes[b.dataset.anatomy];info.hidden=false;}));

  /* A compact WebGL renderer generates each anatomical surface from parametric geometry. */
  const canvas=$('#anatomy-canvas'), fallback=$('#anatomy-fallback'), motionToggle=$('#motion-toggle');
  let gl;
  try{gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});}catch(_){gl=null;}
  if(!gl){canvas.style.display='none';fallback.style.display='block';motionToggle.hidden=true;return;}
  const vert=`attribute vec3 position;attribute vec3 normal;uniform float rotY;uniform float rotX;uniform float aspect;varying vec3 vNormal;varying vec3 vView;varying vec3 vLocal;void main(){float cy=cos(rotY),sy=sin(rotY),cx=cos(rotX),sx=sin(rotX);mat3 ry=mat3(cy,0.,-sy,0.,1.,0.,sy,0.,cy);mat3 rx=mat3(1.,0.,0.,0.,cx,sx,0.,-sx,cx);vec3 p=rx*ry*position;vLocal=position;vNormal=normalize(rx*ry*normal);vView=normalize(vec3(-p.xy,5.4-p.z));float perspective=2.38/(5.4-p.z);gl_Position=vec4(p.x*perspective/aspect,p.y*perspective,-p.z/8.,1.);}`;
  // Object-space woven fibers and broad subsurface color stay attached during rotation.
  const frag=`precision mediump float;uniform vec3 color;uniform float opacity;varying vec3 vNormal;varying vec3 vView;varying vec3 vLocal;
  float grain(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*4375.5453);}
  void main(){vec3 n=normalize(vNormal);vec3 view=normalize(vView);vec3 light=normalize(vec3(-.65,.85,1.1));vec3 fill=normalize(vec3(.85,.15,.45));
  float fibers=sin(vLocal.y*100.+sin(vLocal.x*27.)*2.8+sin(vLocal.z*31.)*1.4);float crossFiber=sin(vLocal.x*83.+vLocal.z*42.+sin(vLocal.y*29.)*2.);
  float tissue=sin(vLocal.x*9.+sin(vLocal.y*7.))*sin(vLocal.z*11.+vLocal.y*5.);float micro=grain(floor(vLocal*300.));
  float diffuse=max(dot(n,light),0.);float rim=pow(1.-max(dot(n,view),0.),3.);float spec=pow(max(dot(n,normalize(light+view)),0.),48.);float broad=pow(max(dot(n,normalize(fill+view)),0.),9.);
  vec3 base=color*(.95+.055*tissue+.025*fibers+.018*crossFiber+.014*micro);
  vec3 c=base*(.26+.76*diffuse+.15*max(dot(n,fill),0.));c+=vec3(.61,.86,.87)*spec*.31+vec3(.25,.6,.65)*broad*.12; c+=vec3(.36,.83,.83)*rim*.32;c+=base*pow(max(dot(-n,light),0.),2.)*.13;
  gl_FragColor=vec4(c,opacity);}`;
  function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
  let program;
  try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vert));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,frag));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('WebGL link failed');}catch(_){canvas.style.display='none';fallback.style.display='block';motionToggle.hidden=true;return;}
  gl.useProgram(program);gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.clearColor(0,0,0,0);
  const loc={position:gl.getAttribLocation(program,'position'),normal:gl.getAttribLocation(program,'normal'),rotY:gl.getUniformLocation(program,'rotY'),rotX:gl.getUniformLocation(program,'rotX'),aspect:gl.getUniformLocation(program,'aspect'),color:gl.getUniformLocation(program,'color'),opacity:gl.getUniformLocation(program,'opacity')};
  function makeSurface(center,scale,lat=20,lon=28,deform=()=>1){const verts=[],norms=[],idx=[];for(let j=0;j<=lat;j++){const t=Math.PI*j/lat;for(let i=0;i<=lon;i++){const p=2*Math.PI*i/lon;const x=Math.sin(t)*Math.cos(p),y=Math.cos(t),z=Math.sin(t)*Math.sin(p),f=deform(x,y,z,p,t);verts.push(center[0]+x*scale[0]*f,center[1]+y*scale[1]*f,center[2]+z*scale[2]*f);norms.push(x/scale[0],y/scale[1],z/scale[2]);if(j<lat&&i<lon){const a=j*(lon+1)+i,b=a+lon+1;idx.push(a,a+1,b,b,a+1,b+1);}}}// Recompute smooth normals from the deformed surface rather than a perfect ellipsoid.
    const smooth=new Array(verts.length).fill(0);for(let i=0;i<idx.length;i+=3){const a=idx[i]*3,b=idx[i+1]*3,c=idx[i+2]*3,u=[verts[b]-verts[a],verts[b+1]-verts[a+1],verts[b+2]-verts[a+2]],v=[verts[c]-verts[a],verts[c+1]-verts[a+1],verts[c+2]-verts[a+2]],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];for(const k of [a,b,c])for(let d=0;d<3;d++)smooth[k+d]+=n[d];}
    // Join the longitude seam so the specimen has no artificial vertical highlight.
    for(let j=0;j<=lat;j++){const a=j*(lon+1)*3,b=(j*(lon+1)+lon)*3;for(let d=0;d<3;d++)smooth[a+d]=smooth[b+d]=smooth[a+d]+smooth[b+d];}
    for(let i=0;i<smooth.length;i+=3){const length=Math.hypot(smooth[i],smooth[i+1],smooth[i+2]);if(length>.000001)for(let d=0;d<3;d++)norms[i+d]=smooth[i+d]/length;}
    return {verts,norms,idx};}
  function makeTube(points,radius=0.1,sides=10){const verts=[],norms=[],idx=[];points.forEach((p,j)=>{const a=points[Math.max(0,j-1)],b=points[Math.min(points.length-1,j+1)],t=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],len=Math.hypot(...t)||1;t.forEach((v,k)=>t[k]=v/len);let u=[-t[1],t[0],0],ul=Math.hypot(...u);if(ul<.01){u=[1,0,0];ul=1;}u=u.map(v=>v/ul);let v=[t[1]*u[2]-t[2]*u[1],t[2]*u[0]-t[0]*u[2],t[0]*u[1]-t[1]*u[0]];for(let i=0;i<=sides;i++){const ang=2*Math.PI*i/sides,n=u.map((q,k)=>q*Math.cos(ang)+v[k]*Math.sin(ang));verts.push(...p.map((q,k)=>q+n[k]*radius));norms.push(...n);if(j<points.length-1&&i<sides){const x=j*(sides+1)+i,y=x+sides+1;idx.push(x,x+1,y,y,x+1,y+1);}}});return {verts,norms,idx};}
  function upload(mesh,color){const vb=gl.createBuffer(),nb=gl.createBuffer(),ib=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(mesh.verts),gl.STATIC_DRAW);gl.bindBuffer(gl.ARRAY_BUFFER,nb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(mesh.norms),gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(mesh.idx),gl.STATIC_DRAW);return{vb,nb,ib,count:mesh.idx.length,color};}
  const parts=[];
  // Posterior seminal vesicles: paired lobulated ducts above and behind the gland.
  [-1,1].forEach(side=>{const pts=[];for(let i=0;i<15;i++){const q=i/14;pts.push([side*(.32+q*.63+Math.sin(q*6.2)*.055),.11+q*.55+Math.sin(q*9)*.045,-.35-q*.08]);}parts.push(upload(makeTube(pts,.11),[.35,.65,.68]));});
  // Bladder sits superior to the prostate, with a slight narrowing at its inferior neck.
  parts.push(upload(makeSurface([0,1.01,0],[.88,.87,.66],48,64,(x,y,z,p,t)=>1+.1*y-.28*Math.pow(Math.max(0,-y),2)+.022*Math.cos(p*3.)*Math.pow(Math.sin(t),2)+.012*Math.sin(t*5.)*Math.cos(p*2.)),[.40,.66,.69]));
  parts.push(upload(makeSurface([0,.22,.02],[.18,.32,.17],18,24),[.32,.69,.71]));
  // The urethra continues through the prostate and inferiorly.
  const urethra=[];for(let i=0;i<20;i++){const q=i/19;urethra.push([.02*Math.sin(q*3),.45-q*2.45,.12+Math.sin(q*Math.PI)*.07]);}parts.push(upload(makeTube(urethra,.095),[.62,.84,.80]));
  // The prostate surrounds the proximal urethra just below the bladder.
  parts.push(upload(makeSurface([0,-.37,.04],[.7,.51,.6],28,38,(x,y,z,p)=>1+.035*Math.cos(2*p)+.025*Math.cos(4*p)+.04*y),[.11,.57,.55]));
  let angle=.28,tilt=-.08,active=!reduced.matches,visible=true,dragging=false,previousX=0,previousY=0,frame=0,last=0,orbit=0;
  function resize(){const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.7),w=Math.max(1,Math.floor(rect.width*dpr)),h=Math.max(1,Math.floor(rect.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}gl.uniform1f(loc.aspect,w/h);}
  function render(time=0){frame=0;if(!visible)return;resize();if(active&&!dragging){const delta=Math.min(40,time-last||16);orbit+=delta*.00024;angle+=Math.cos(orbit)*delta*.000035;}last=time;gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform1f(loc.rotY,angle);gl.uniform1f(loc.rotX,tilt);gl.uniform1f(loc.opacity,1);for(const part of parts){gl.uniform3fv(loc.color,part.color);gl.bindBuffer(gl.ARRAY_BUFFER,part.vb);gl.enableVertexAttribArray(loc.position);gl.vertexAttribPointer(loc.position,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,part.nb);gl.enableVertexAttribArray(loc.normal);gl.vertexAttribPointer(loc.normal,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,part.ib);gl.drawElements(gl.TRIANGLES,part.count,gl.UNSIGNED_SHORT,0);}if(active)frame=requestAnimationFrame(render);}
  function requestRender(){if(!frame)frame=requestAnimationFrame(render);}
  motionToggle.addEventListener('click',()=>{active=!active;motionToggle.textContent=active?'Pause motion':'Play motion';motionToggle.setAttribute('aria-pressed',String(!active));requestRender();});
  canvas.addEventListener('pointerdown',e=>{dragging=true;previousX=e.clientX;previousY=e.clientY;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;angle+=(e.clientX-previousX)*.008;tilt=Math.max(-.5,Math.min(.5,tilt+(e.clientY-previousY)*.005));previousX=e.clientX;previousY=e.clientY;requestRender();});
  canvas.addEventListener('pointerup',()=>{dragging=false;});canvas.addEventListener('pointercancel',()=>{dragging=false;});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible&&frame){cancelAnimationFrame(frame);frame=0;}if(visible)requestRender();},{threshold:.01}).observe(canvas);
  addEventListener('resize',requestRender,{passive:true});
  reduced.addEventListener('change',()=>{if(reduced.matches){active=false;motionToggle.textContent='Play motion';motionToggle.setAttribute('aria-pressed','true');}requestRender();});
  requestRender();
})();
