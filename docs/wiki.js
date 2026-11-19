
(function(){
  var d=document,root=d.documentElement;
  function $(s,c){return (c||d).querySelector(s)}function $$(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
  // light / dark
  var tb=$('#themebtn');if(tb)tb.onclick=function(){var dark=root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme=dark?'light':'dark';store('wh-theme',root.dataset.theme)};
  // menus
  $$('.menubtn').forEach(function(b){b.onclick=function(ev){ev.stopPropagation();var m=b.parentNode,open=!m.classList.contains('open');
    $$('.menu.open').forEach(function(x){x.classList.remove('open')});if(open)m.classList.add('open');b.setAttribute('aria-expanded',open)}});
  var mt=$('#menutoggle');if(mt)mt.onclick=function(ev){ev.stopPropagation();$('#menus').classList.toggle('open')};
  var bu=$('#burger');if(bu)bu.onclick=function(ev){ev.stopPropagation();$('#side').classList.toggle('open')};
  d.addEventListener('click',function(ev){if(!ev.target.closest('.menu'))$$('.menu.open').forEach(function(x){x.classList.remove('open')});
    if(!ev.target.closest('#menus')&&mt)$('#menus').classList.remove('open');if(!ev.target.closest('#side')&&$('#side'))$('#side').classList.remove('open');
    if(!ev.target.closest('.search'))box.style.display='none'});
  // search
  var q=$('#q'),box=$('#results'),idx=null,sel=-1;
  function load(cb){if(idx)return cb();fetch('search.json').then(function(r){return r.json()}).then(function(j){idx=j;cb()})}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function icon(p){return p?'<i class="ic" style="background-position:'+p[0]+'% '+p[1]+'%"></i>':'<i class="noi"></i>'}
  function run(){var v=q.value.trim().toLowerCase();if(v.length<2){box.style.display='none';return}
    load(function(){var words=v.split(/\s+/),hits=[];
      idx.forEach(function(e){var t=e.t.toLowerCase(),x=(e.x||'').toLowerCase()+' '+(e.c||'').toLowerCase(),s=0;
        for(var i=0;i<words.length;i++){var w=words[i];if(t===w)s+=12;else if(t.indexOf(w)===0)s+=6;else if(t.indexOf(' '+w)>=0)s+=4;else if(t.indexOf(w)>=0)s+=3;else if(x.indexOf(w)>=0)s+=1;else{s=0;break}}
        if(s){if(e.k==='Book'||e.k==='Guide'||e.k==='Explore')s+=2;hits.push([s,e])}});
      hits.sort(function(a,b){return b[0]-a[0]||a[1].t.length-b[1].t.length});sel=-1;
      box.innerHTML=hits.slice(0,14).map(function(h){var e=h[1];return '<a href="'+e.u+'">'+icon(e.i)+'<span class="rt">'+esc(e.t)+'<span class="kind">'+esc(e.k||'Page')+'</span>'
        +(e.c?'<small>'+esc(e.c)+'</small>':'')+(e.x?'<small>'+esc(e.x.slice(0,120))+'</small>':'')+'</span></a>'}).join('')||'<a><span class="rt">Nothing found. Try another word.</span></a>';
      box.style.display='block'})}
  if(q){q.addEventListener('input',run);q.addEventListener('focus',run);
    q.addEventListener('keydown',function(ev){var a=$$('a',box);if(!a.length)return;
      if(ev.key==='ArrowDown'){sel=Math.min(a.length-1,sel+1);ev.preventDefault()}else if(ev.key==='ArrowUp'){sel=Math.max(0,sel-1);ev.preventDefault()}
      else if(ev.key==='Enter'){var t=a[sel>=0?sel:0];if(t.href)location.href=t.href;return}else if(ev.key==='Escape'){box.style.display='none';q.blur();return}
      a.forEach(function(x,i){x.classList.toggle('sel',i===sel)});if(a[sel])a[sel].scrollIntoView({block:'nearest'})})}
  d.addEventListener('keydown',function(ev){if((ev.key==='/'||(ev.key==='k'&&(ev.ctrlKey||ev.metaKey)))&&!/INPUT|TEXTAREA/.test(d.activeElement.tagName)){ev.preventDefault();q.focus();q.select()}
    if(ev.key==='Escape'){closeLb()}});
  // a random page
  function random(){load(function(){var pages=idx.filter(function(e){return e.k!=='Item'});var e=pages[Math.floor(Math.random()*pages.length)];location.href=e.u})}
  var rb=$('#random');if(rb)rb.onclick=random;$$('[data-random]').forEach(function(a){a.onclick=function(ev){ev.preventDefault();random()}});
  // filters and the A-Z bar
  $$('input.filter').forEach(function(f){f.addEventListener('input',function(){var v=f.value.trim().toLowerCase();
    $$(f.dataset.target).forEach(function(el){el.style.display=!v||el.dataset.name.indexOf(v)>=0?'':'none'})})});
  $$('[data-jump]').forEach(function(a){a.onclick=function(ev){ev.preventDefault();var t=$('[data-letter="'+a.dataset.jump+'"]');if(t)t.scrollIntoView({behavior:'smooth',block:'start'})}});
  // tabs (breed database): the hash picks the tab
  var tabs=$$('.tab');function showTab(k){tabs.forEach(function(t){t.classList.toggle('on',t.dataset.tab===k)});$$('.panel').forEach(function(p){p.classList.toggle('on',p.dataset.panel===k)})}
  if(tabs.length){tabs.forEach(function(t){t.onclick=function(){showTab(t.dataset.tab);history.replaceState(null,'','#'+t.dataset.tab)}});
    var h=location.hash.slice(1),k=h.split('-')[0];showTab(tabs.some(function(t){return t.dataset.tab===k})?k:tabs[0].dataset.tab);
    if(h.indexOf('-')>0){var el=d.getElementById(h);if(el)setTimeout(function(){el.scrollIntoView({block:'center'})},60)}}
  // sortable tables
  $$('table.sortable').forEach(function(tb){$$('th',tb.tHead).forEach(function(th,i){th.onclick=function(){var asc=!th.classList.contains('asc');
    $$('th',tb.tHead).forEach(function(x){x.classList.remove('asc','desc')});th.classList.add(asc?'asc':'desc');
    var rows=$$('tr',tb.tBodies[0]);rows.sort(function(a,b){var x=a.cells[i],y=b.cells[i];if(!x||!y)return 0;
      var xv=x.dataset.v!==undefined?parseFloat(x.dataset.v):x.textContent.trim(),yv=y.dataset.v!==undefined?parseFloat(y.dataset.v):y.textContent.trim();
      var c=(typeof xv==='number'&&typeof yv==='number')?xv-yv:String(xv).localeCompare(String(yv));return asc?c:-c});
    rows.forEach(function(r){tb.tBodies[0].appendChild(r)})}})});
  // on this page
  var toc=$('#toc');if(toc){var hs=$$('main h2[id], main section.gpage[id] h2');if(hs.length>=3){
    var links=hs.map(function(h){var id=h.id||h.closest('[id]').id;return '<a href="#'+id+'" data-id="'+id+'">'+esc(h.textContent)+'</a>'});
    toc.innerHTML='<b>On this page</b>'+links.join('');var map={};$$('a',toc).forEach(function(a){map[a.dataset.id]=a});
    if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){$$('a.on',toc).forEach(function(a){a.classList.remove('on')});
      var id=e.target.id||e.target.closest('[id]').id;if(map[id])map[id].classList.add('on')}})},{rootMargin:'-80px 0px -70% 0px'});hs.forEach(function(h){io.observe(h.id?h:h.closest('[id]'))})}}}
  // pictures, bigger
  var lb=$('#lightbox');function closeLb(){if(lb)lb.hidden=true}
  d.addEventListener('click',function(ev){var img=ev.target.closest('img.zoom');if(!img)return;ev.preventDefault();
    var a=img.closest('a.shot');$('img',lb).src=a?a.href:img.src;$('figcaption',lb).textContent=img.alt||'';lb.hidden=false});
  if(lb)lb.onclick=closeLb;
  // tooltips, Minecraft style
  var tip=$('#tip');d.addEventListener('mouseover',function(ev){var t=ev.target.closest('[data-tip]');if(!t){tip.style.display='none';return}tip.textContent=t.dataset.tip;tip.style.display='block'});
  d.addEventListener('mousemove',function(ev){if(tip.style.display==='block'){tip.style.left=Math.min(innerWidth-tip.offsetWidth-8,ev.clientX+14)+'px';tip.style.top=(ev.clientY+16)+'px'}});
  // the home page slideshow and counters
  var slides=$$('.slide'),dots=$('#dots'),cur=0,timer;
  function go(n){slides[cur].classList.remove('on');cur=(n+slides.length)%slides.length;slides[cur].classList.add('on');if(dots)$$('button',dots).forEach(function(b,i){b.classList.toggle('on',i===cur)})}
  if(slides.length>1){if(dots){dots.innerHTML=slides.map(function(){return '<button aria-label="Picture"></button>'}).join('');$$('button',dots).forEach(function(b,i){b.onclick=function(){go(i);clearInterval(timer);timer=setInterval(function(){go(cur+1)},7000)}});$$('button',dots)[0].classList.add('on')}
    timer=setInterval(function(){go(cur+1)},7000)}
  $$('[data-count]').forEach(function(el){var n=+el.dataset.count,s=null;function step(t){if(!s)s=t;var p=Math.min(1,(t-s)/1200);el.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step)}
    if('IntersectionObserver' in window){var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){o.disconnect();requestAnimationFrame(step)}});o.observe(el)}});
  // back to top
  var tt=$('#totop');addEventListener('scroll',function(){tt.classList.toggle('show',scrollY>700)},{passive:true});tt.onclick=function(){scrollTo({top:0,behavior:'smooth'})};
  // a new page starts at the top (or at the section its link names) - also when the wiki is shown inside a frame
  // that keeps its own scroll, like the preview viewer: scrollIntoView moves the frame's scroller too
  function toStart(){var t=null;try{if(location.hash)t=d.getElementById(decodeURIComponent(location.hash.slice(1)))}catch(e){}
    try{if(t){t.scrollIntoView({block:'start'})}else{scrollTo(0,0);(d.querySelector('.top')||d.body).scrollIntoView({block:'start'})}}catch(e){}}
  root.style.scrollBehavior='auto';toStart();addEventListener('load',function(){toStart();setTimeout(function(){root.style.scrollBehavior=''},50)});
  addEventListener('pageshow',function(ev){if(ev.persisted)return});
  // open a secret if the link points straight at it
  if(location.hash){try{var t=$(location.hash);if(t){var dd=t.querySelector('details.spoiler');if(dd)dd.open=true}}catch(e){}}
})();
