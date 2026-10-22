/* Portfolio Imhotep Kakpo */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PLAY='<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4.5 2.8v10.4L13 8z"/></svg>';
  var PAUSE='<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2.5" width="3" height="11" rx="1"/><rect x="9.5" y="2.5" width="3" height="11" rx="1"/></svg>';

  /* ---------- Menu Projets ---------- */
  var ddb=document.getElementById('dd-btn'),ddm=document.getElementById('dd-menu');
  ddb.addEventListener('click',function(e){e.stopPropagation();var o=ddb.getAttribute('aria-expanded')!=='true';ddb.setAttribute('aria-expanded',o);ddm.classList.toggle('open',o)});
  document.addEventListener('click',function(){ddb.setAttribute('aria-expanded','false');ddm.classList.remove('open')});

  /* ---------- Apparitions au défilement ---------- */
  if(!reduce && 'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    [].forEach.call(document.querySelectorAll('.rv'),function(el){ if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pre');io.observe(el)} });
  }

  /* ---------- Phrase tapée ---------- */
  var out=document.getElementById('typed-out');
  if(!reduce){
    var parts=[["Je suis Imhotep, un ",0],["développeur full stack",1],[" qui construit des applications web temps réel, de l'API jusqu'au déploiement.",0]];
    out.innerHTML='';var pi=0,ci=0,node;
    setTimeout(function step(){
      if(pi>=parts.length)return;
      if(ci===0){node=document.createElement(parts[pi][1]?'strong':'span');out.appendChild(node)}
      node.textContent+=parts[pi][0][ci++];
      if(ci>=parts[pi][0].length){pi++;ci=0}
      setTimeout(step,34);
    },400);
  }

  /* ---------- Assistant ---------- */
  var A=[
    {k:['qui','présente','presente','toi','profil','imhotep'],q:'Qui est Imhotep ?',a:"Imhotep est développeur full stack, en Mastère à l'EFREI Paris. Il a commencé à Cotonou, entre développement web et un an d'audit de sécurité, puis a fait son stage de fin de Bachelor au CEA/IRFU."},
    {k:['stack','techno','langage','compétence','competence','outil','maîtrise','maitrise'],q:'Sa stack ?',a:"React, Node.js/Express, PHP/Laravel, PostgreSQL, MongoDB, SQLite, Redis, Docker, GitLab CI et GitHub Actions. Flutter côté mobile. Il a aussi pratiqué Java/Spring Boot, C#/ASP.NET Core et Vue.js en projets d'école."},
    {k:['epics','cea','irfu','ldisc','supervision'],q:'EPICS Viewer ?',a:"Une application de supervision temps réel pour le laboratoire LDISC du CEA/IRFU. Il l'a menée jusqu'à la version 2.0 : 73 tests back-end, droits par rôle appliqués tout de suite, interface utilisable sur mobile."},
    {k:['cherche','recherche','dispo','disponible','janvier','offre','recrut','stage'],q:'Il cherche quoi ?',a:"Un stage de 6 mois, de janvier à juin 2027, en Île-de-France. Développement full stack ou back-end de préférence."},
    {k:['sécu','secu','pentest','audit','passi','cyber'],q:'Et la sécurité ?',a:"Chez Global IT Service, il a audité trois plateformes web et mobiles (banque, assurance, secteur public) pour des missions PASSI. Depuis, il pense droits d'accès et secrets dès la conception."},
    {k:['contact','mail','joindre','linkedin','écrire','ecrire','github'],q:'Le contacter ?',a:"Par e-mail à imhotepkakpo6@gmail.com, ou sur LinkedIn. Son code est sur GitHub, sous le nom Agbadogbe."},
    {k:['langue','anglais','english','fon'],q:'',a:"Français, fon, et anglais professionnel (niveau B2)."},
    {k:['bonjour','salut','hello','coucou'],q:'',a:"Salut ! Demande-moi ce que fait Imhotep, ses projets ou comment le joindre."}
  ];
  var bt=document.getElementById('bubble-text'),chips=document.getElementById('chips'),form=document.getElementById('ask'),input=document.getElementById('q'),tt=null;
  function say(text){
    clearTimeout(tt); if(window.__wave)window.__wave();
    if(reduce){bt.textContent=text;return}
    bt.textContent='';var i=0;(function t(){bt.textContent=text.slice(0,++i);if(i<text.length)tt=setTimeout(t,16)})();
  }
  A.filter(function(x){return x.q}).forEach(function(x){var b=document.createElement('button');b.type='button';b.textContent=x.q;b.addEventListener('click',function(){say(x.a)});chips.appendChild(b)});
  form.addEventListener('submit',function(e){
    e.preventDefault();var q=input.value.trim();if(!q)return;input.value='';
    var l=q.toLowerCase(),hit=A.find(function(x){return x.k.some(function(k){return l.indexOf(k)>-1})});
    say(hit?hit.a:"Je n'ai pas encore la réponse à ça. Écris directement à Imhotep : imhotepkakpo6@gmail.com.");
  });

  /* ---------- Avatar 3D ---------- */
  try{buildBot()}catch(e){}
  function buildBot(){
    if(!window.THREE)return;
    var wrap=document.getElementById('bot');
    var renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.outputEncoding=THREE.sRGBEncoding;
    wrap.appendChild(renderer.domElement);
    var scene=new THREE.Scene();
    var cam=new THREE.PerspectiveCamera(28,1,.1,100);
    cam.position.set(0,-.95,10.2);cam.lookAt(0,-.95,0);
    scene.add(new THREE.HemisphereLight(0xffffff,0x8f95a6,1));
    var key=new THREE.DirectionalLight(0xffffff,.9);key.position.set(4,6,7);scene.add(key);
    var rim=new THREE.DirectionalLight(0xc0b0ff,.5);rim.position.set(-5,2,-4);scene.add(rim);
    var white=new THREE.MeshStandardMaterial({color:0xf3f3f6,roughness:.3,metalness:.05});
    var metal=new THREE.MeshStandardMaterial({color:0xa0a6b1,roughness:.32,metalness:.6});
    var dark=new THREE.MeshStandardMaterial({color:0x0e0f13,roughness:.1,metalness:.5,side:THREE.DoubleSide});
    var glow=new THREE.MeshBasicMaterial({color:0x9b86ff});
    function m(g,mt){return new THREE.Mesh(g,mt)}
    var root=new THREE.Group();scene.add(root);
    var body=m(new THREE.SphereGeometry(1,48,48),white);body.scale.set(1.02,1.18,.84);body.position.y=-1.85;root.add(body);
    var chest=m(new THREE.CircleGeometry(.18,32),glow);chest.position.set(0,-1.55,.83);chest.rotation.x=-.14;root.add(chest);
    var belt=m(new THREE.TorusGeometry(.95,.05,12,64),metal);belt.rotation.x=Math.PI/2;belt.scale.set(1,.88,1);belt.position.y=-2.2;root.add(belt);
    var neck=m(new THREE.CylinderGeometry(.2,.27,.42,24),metal);neck.position.y=-.58;root.add(neck);
    var head=new THREE.Group();head.position.y=.42;root.add(head);
    var skull=m(new THREE.SphereGeometry(1,48,48),white);skull.scale.set(1.1,.97,1);head.add(skull);
    var visor=m(new THREE.SphereGeometry(1.03,48,32,Math.PI/2-1.1,2.2,Math.PI*.35,Math.PI*.31),dark);visor.scale.set(1.1,.97,1);head.add(visor);
    var eyes=[];[-.33,.33].forEach(function(x){var e=m(new THREE.SphereGeometry(.11,24,24),glow);e.scale.set(1,1.35,.45);e.position.set(x,.02,.985);head.add(e);eyes.push(e)});
    [-1,1].forEach(function(s){var ear=m(new THREE.CylinderGeometry(.23,.23,.16,32),metal);ear.rotation.z=Math.PI/2;ear.position.set(s*1.1,0,0);head.add(ear)});
    var ant=m(new THREE.CylinderGeometry(.03,.03,.4,12),metal);ant.position.y=1.13;head.add(ant);
    var bulb=m(new THREE.SphereGeometry(.09,20,20),glow);bulb.position.y=1.36;head.add(bulb);
    var arms=[];[-1,1].forEach(function(s){var sh=new THREE.Group();sh.position.set(s*1.02,-1.2,0);root.add(sh);var up=m(new THREE.SphereGeometry(.26,24,24),white);up.scale.set(1,2.3,1);up.position.y=-.56;sh.add(up);var hand=m(new THREE.SphereGeometry(.2,24,24),metal);hand.position.y=-1.2;sh.add(hand);sh.rotation.z=s*.12;arms.push(sh)});
    function size(){var w=wrap.clientWidth,h=wrap.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
    size();window.addEventListener('resize',size);
    var px=0,py=0;
    window.addEventListener('pointermove',function(e){var r=wrap.getBoundingClientRect();px=Math.max(-1,Math.min(1,(e.clientX-(r.left+r.width/2))/(innerWidth/2)));py=Math.max(-1,Math.min(1,(e.clientY-(r.top+r.height*.3))/(innerHeight/2)))});
    var clock=new THREE.Clock(),waveUntil=reduce?0:2,nextBlink=2.5;
    window.__wave=function(){waveUntil=clock.getElapsedTime()+1.6};
    function render(t){
      root.position.y=reduce?0:Math.sin(t*1.6)*.05;
      head.rotation.y+=(px*.55-head.rotation.y)*.08;head.rotation.x+=(py*.28-head.rotation.x)*.08;
      root.rotation.y+=(px*.15-root.rotation.y)*.05;
      var blink=t>nextBlink&&t<nextBlink+.14;if(t>nextBlink+.14)nextBlink=t+2.5+Math.random()*2.5;
      eyes.forEach(function(e){e.scale.y=blink?.12:1.35});
      var r=arms[1];
      if(t<waveUntil){r.rotation.z=2.5+Math.sin(t*12)*.35}else{r.rotation.z+=((.12+Math.sin(t*1.3)*.04)-r.rotation.z)*.12}
      arms[0].rotation.z=-.12-Math.sin(t*1.3)*.04;
      bulb.material.color.setHSL(.71,.9,.7+Math.sin(t*3)*.08);
      renderer.render(scene,cam);
    }
    if(reduce){render(0);window.addEventListener('pointermove',function(){render(0)})}
    else{(function loop(){render(clock.getElapsedTime());requestAnimationFrame(loop)})()}
  }

  /* ---------- Réalisations : défilement continu ---------- */
  var bTrack=document.getElementById('belt-track'),belt=document.getElementById('belt'),bPause=document.getElementById('belt-pause');
  bTrack.innerHTML+=bTrack.innerHTML+bTrack.innerHTML;
  var off=0,speed=60,paused=reduce,hover=false,lastT=performance.now(),jump=0;
  function setPause(p){paused=p;bPause.innerHTML=p?PLAY:PAUSE;bPause.setAttribute('aria-label',p?'Lecture':'Pause')}
  setPause(paused);
  bPause.onclick=function(){setPause(!paused)};
  var card=function(){return bTrack.children[0].offsetWidth+20};
  document.getElementById('belt-next').onclick=function(){jump+=card()};
  document.getElementById('belt-prev').onclick=function(){jump-=card()};
  belt.addEventListener('mouseenter',function(){hover=true});belt.addEventListener('mouseleave',function(){hover=false});
  (function roll(now){
    var dt=Math.min(.05,(now-lastT)/1000);lastT=now;
    if(!paused&&!hover)off+=speed*dt;
    if(jump){var s=jump*Math.min(1,dt*8);off+=s;jump-=s;if(Math.abs(jump)<.5){off+=jump;jump=0}}
    var w=bTrack.scrollWidth/3;if(off>=w)off-=w;if(off<0)off+=w;
    bTrack.style.transform='translateX('+(-off)+'px)';
    requestAnimationFrame(roll);
  })(lastT);

  /* ---------- Projets : diaporama ---------- */
  var sTrack=document.getElementById('slide-track'),slides=[].slice.call(sTrack.children),dots=document.getElementById('dots'),sp=document.getElementById('sl-pause');
  var cur=0,sPaused=reduce,DUR=5000,start=performance.now(),elapsed=0;
  slides.forEach(function(_,i){var d=document.createElement('button');d.type='button';d.setAttribute('aria-label','Projet '+(i+1));d.innerHTML='<i></i>';d.onclick=function(){go(i)};dots.appendChild(d)});
  slides.forEach(function(s,i){s.addEventListener('click',function(e){if(i!==cur){go(i);return}if(s.dataset.href){if(/^https?:/.test(s.dataset.href)){window.open(s.dataset.href,'_blank','noopener')}else{location.href=s.dataset.href}}})});
  function go(i){
    cur=(i+slides.length)%slides.length;elapsed=0;start=performance.now();
    var vw=sTrack.parentNode.clientWidth,sw=slides[0].offsetWidth;
    sTrack.style.transform='translateX('+((vw-sw)/2-cur*(sw+24))+'px)';
    slides.forEach(function(s,j){s.classList.toggle('on',j===cur)});
    [].forEach.call(dots.children,function(d,j){d.classList.toggle('on',j===cur);d.firstChild.style.transform=j===cur&&sPaused?'scaleX(1)':'scaleX(0)'});
  }
  function setSP(p){sPaused=p;sp.innerHTML=p?PLAY:PAUSE;sp.setAttribute('aria-label',p?'Lecture':'Pause');if(!p)start=performance.now()-elapsed}
  setSP(sPaused);
  sp.onclick=function(){setSP(!sPaused)};
  document.getElementById('sl-next').onclick=function(){go(cur+1)};
  document.getElementById('sl-prev').onclick=function(){go(cur-1)};
  (function tick(now){
    if(!sPaused){elapsed=now-start;var p=Math.min(1,elapsed/DUR);var bar=dots.children[cur]&&dots.children[cur].firstChild;if(bar)bar.style.transform='scaleX('+p+')';if(p>=1)go(cur+1)}
    requestAnimationFrame(tick);
  })(performance.now());
  window.addEventListener('resize',function(){go(cur)});
  go(0);
  [].forEach.call(document.querySelectorAll('[data-slide]'),function(a){a.addEventListener('click',function(){go(+a.dataset.slide)})});

  /* ---------- Pages : Sécurité, Parcours, À propos ---------- */
  var views=[].slice.call(document.querySelectorAll('.view')),PAGES=['securite','parcours','apropos'];
  function route(){
    var h=(location.hash||'').slice(1);if(h==='a-propos')h='apropos';var page=PAGES.indexOf(h)>-1?h:'accueil';
    views.forEach(function(v){v.hidden=v.dataset.view!==page});
    [].forEach.call(document.querySelectorAll('.links a[data-page]'),function(a){a.classList.toggle('cur',a.dataset.page===page)});
    if(page==='accueil'){
      go(cur);
      var el=h&&document.getElementById(h);
      if(el){setTimeout(function(){el.scrollIntoView({behavior:reduce?'auto':'smooth'})},30)}else{window.scrollTo(0,0)}
      window.dispatchEvent(new Event('resize'));
    }else{window.scrollTo(0,0)}
    if(!reduce&&'IntersectionObserver' in window){
      var v=document.querySelector('.view[data-view="'+page+'"]');
      [].forEach.call(v.querySelectorAll('.rv'),function(el){if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pre');io2.observe(el)}else{el.classList.remove('pre')}});
    }
  }
  var io2='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove('pre');io2.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'}):null;
  window.addEventListener('hashchange',route);
  route();

  /* Carrousels des pages (défilement par carte) */
  [].forEach.call(document.querySelectorAll('[data-rail]'),function(rail){
    var sec=rail.parentNode,step=function(){var c=rail.querySelector('.rail-track').children[0];return c.offsetWidth+20};
    sec.querySelector('[data-rail-next]').onclick=function(){rail.scrollBy({left:step(),behavior:reduce?'auto':'smooth'})};
    sec.querySelector('[data-rail-prev]').onclick=function(){rail.scrollBy({left:-step(),behavior:reduce?'auto':'smooth'})};
  });

  /* Cartes qui se retournent */
  [].forEach.call(document.querySelectorAll('.flip'),function(f){
    function t(){f.classList.toggle('on')}
    f.addEventListener('click',t);
    f.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();t()}});
  });

  /* ---------- Copier l'e-mail ---------- */
  var cp=document.getElementById('copy'),toast=document.getElementById('copied');
  cp.addEventListener('click',function(){
    var addr='imhotepkakpo6@gmail.com';
    function show(msg){toast.textContent=msg;toast.classList.add('show');setTimeout(function(){toast.classList.remove('show')},2200)}
    try{navigator.clipboard.writeText(addr).then(function(){show('Adresse copiée : '+addr)},function(){show(addr)})}catch(e){show(addr)}
  });
})();
