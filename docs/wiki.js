
(function(){
  var q=document.getElementById('q'),box=document.getElementById('results'),idx=null,sel=-1;
  function load(cb){if(idx)return cb();fetch('search.json').then(function(r){return r.json()}).then(function(j){idx=j;cb()})}
  function esc(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function run(){var v=q.value.trim().toLowerCase();if(v.length<2){box.style.display='none';return}
    load(function(){var words=v.split(/\s+/),hits=[];
      idx.forEach(function(e){var t=e.t.toLowerCase(),x=(e.x||'').toLowerCase(),s=0;
        for(var i=0;i<words.length;i++){var w=words[i];if(t.indexOf(w)>=0)s+=t.indexOf(w)===0?5:3;else if(x.indexOf(w)>=0)s+=1;else{s=0;break}}
        if(s)hits.push([s,e])});
      hits.sort(function(a,b){return b[0]-a[0]});sel=-1;
      box.innerHTML=hits.slice(0,12).map(function(h){var e=h[1];return '<a href="'+e.u+'">'+esc(e.t)+(e.c?' <small>'+esc(e.c)+'</small>':'')+(e.x?'<small>'+esc(e.x.slice(0,110))+'</small>':'')+'</a>'}).join('')||'<a>No matches</a>';
      box.style.display='block'})}
  q.addEventListener('input',run);
  q.addEventListener('keydown',function(ev){var a=box.querySelectorAll('a');if(!a.length)return;
    if(ev.key==='ArrowDown'){sel=Math.min(a.length-1,sel+1);ev.preventDefault()}else if(ev.key==='ArrowUp'){sel=Math.max(0,sel-1);ev.preventDefault()}
    else if(ev.key==='Enter'){(a[sel>=0?sel:0]).click();return}else if(ev.key==='Escape'){box.style.display='none';return}
    a.forEach(function(x,i){x.classList.toggle('sel',i===sel)})});
  document.addEventListener('click',function(ev){if(!ev.target.closest('.search'))box.style.display='none'});
  document.querySelectorAll('input.filter').forEach(function(f){f.addEventListener('input',function(){var v=f.value.trim().toLowerCase();
    document.querySelectorAll(f.dataset.target).forEach(function(el){el.style.display=!v||el.dataset.name.indexOf(v)>=0?'':'none'})})});
  // open a secret if the link points straight at it
  if(location.hash){var t=document.querySelector(location.hash);if(t){var d=t.querySelector('details.spoiler');if(d)d.open=true}}
})();
