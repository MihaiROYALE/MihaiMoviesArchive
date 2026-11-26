(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
const art=s=>norm(s.replace(/^(the|a|an)\s+/i,''));
const LABEL=['','Not for me','Meh','Good','Really good','Loved it'];
const yl=y=>y?String(y):'Before 1999';
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const seen={};
ARCHIVE.forEach(a=>{a.n2=norm(a.t+' '+a.y);let s=norm(a.t)||'x';seen[s]=(seen[s]||0)+1;a.id=seen[s]>1?s+seen[s]:s;});
const byId=Object.fromEntries(ARCHIVE.map(a=>[a.id,a]));
const stars=r=>`<span class="stars" role="img" aria-label="${r} out of 5">${'★'.repeat(r)}<i>${'★'.repeat(5-r)}</i></span>`;
let imgN=0,obs;
const loc=a=>encodeURI(a.p).replace(/#/g,'%23').replace(/\?/g,'%3F');
const T='https://image.tmdb.org/t/p/';
const img=a=>a.tp?`src="${T}w342${a.tp}" srcset="${T}w185${a.tp} 185w,${T}w342${a.tp} 342w,${T}w500${a.tp} 500w" sizes="(max-width:720px) 132px,170px" data-fb="${loc(a)}"`:`src="${loc(a)}"`;
function sticky(){const s=document.documentElement.style;s.setProperty('--tb',$('.toolbar').offsetHeight+'px');s.setProperty('--yn',($('#yearNav').hidden?0:$('#yearNav').offsetHeight)+'px');}
addEventListener('resize',sticky);
const card=(a,showYear)=>`<a class="card" href="#item=${a.id}" data-id="${a.id}"><div class="frame" data-t="${esc(a.t)}"><img ${img(a)} alt="" width="300" height="450" decoding="async" ${imgN++<8?'fetchpriority="high"':'loading="lazy"'}></div><div class="ti">${esc(a.t)}</div><div class="meta">${stars(a.r)}<span>${[showYear?yl(a.y):'',a.k==='s'&&(D.t==='a'||showYear===2)?'Series':''].filter(Boolean).join(' · ')}</span></div></a>`;
function hook(root){root.querySelectorAll('img').forEach(i=>{if(i.dataset.h)return;i.dataset.h=1;
 const bad=()=>{if(i.dataset.fb){const f=i.dataset.fb;delete i.dataset.fb;i.removeAttribute('srcset');i.src=f;}else i.parentNode.classList.add('err')};
 const good=()=>i.classList.add('ok');
 if(i.complete)(i.naturalWidth?good():bad());else{i.addEventListener('load',good);i.addEventListener('error',bad);}});}

const D={t:'a',rating:'',sort:'yd',view:'years',item:'',g:[],gm:'any'};
function readHash(){const p=new URLSearchParams(location.hash.slice(1));const ty=p.get('type');D.t=ty==='s'||ty==='m'?ty:'a';D.g=(p.get('genre')||'').split(',').filter(Boolean);D.gm=p.get('match')==='all'?'all':'any';D.rating=p.get('rating')||'';D.sort=p.get('sort')==='ya'?'ya':'yd';D.view=p.get('view')==='grid'?'grid':'years';D.item=p.get('item')||'';}
function writeHash(){const p=new URLSearchParams();if(D.t!=='a')p.set('type',D.t);if(D.g.length)p.set('genre',D.g.join(','));if(D.gm==='all')p.set('match','all');if(D.rating)p.set('rating',D.rating);if(D.sort!=='yd')p.set('sort',D.sort);if(D.view==='grid')p.set('view','grid');if(D.item)p.set('item',D.item);history.replaceState(null,'',location.pathname+location.search+(p.toString()?'#'+p:''));}
const cmp=s=>({r:(a,b)=>b.r-a.r||art(a.t).localeCompare(art(b.t)),t:(a,b)=>art(a.t).localeCompare(art(b.t)),yd:(a,b)=>b.y-a.y||art(a.t).localeCompare(art(b.t)),ya:(a,b)=>a.y-b.y||art(a.t).localeCompare(art(b.t))}[s]);
let cur=[];
function render(){
 const of=D.t==='a'?ARCHIVE:ARCHIVE.filter(a=>a.k===D.t);
 cur=of.filter(a=>!D.rating||a.r==D.rating).filter(a=>!D.g.length||(D.gm==='all'?D.g.every(x=>(a.g||[]).includes(x)):D.g.some(x=>(a.g||[]).includes(x)))).sort(cmp(D.sort));
 $('#title').textContent=`${SITE.owner}'s ${D.t==='s'?'Series':D.t==='m'?'Movie':'Movie & Series'} Archive`;
 $$('[data-tab]').forEach(b=>{b.classList.toggle('on',b.dataset.tab===D.t);b.setAttribute('aria-selected',b.dataset.tab===D.t)});
 $$('[data-view]').forEach(b=>b.classList.toggle('on',b.dataset.view===D.view));
 $('#sort').value=D.sort;$('#genreBtn').textContent='Category'+(D.g.length?` (${D.g.length})`:'')+' ▾';$('#genreBtn').classList.toggle('on',!!D.g.length);
 $('#cm').textContent=ARCHIVE.filter(a=>a.k==='m').length;$('#cs').textContent=ARCHIVE.filter(a=>a.k==='s').length;$('#ca').textContent=ARCHIVE.length;
 $$('#ratings .chip').forEach(c=>c.classList.toggle('on',c.dataset.r==D.rating));
 const avg=(of.reduce((s,a)=>s+a.r,0)/of.length).toFixed(1);const est=of.filter(a=>!a.m).length>of.length*.05,mins=of.reduce((s,a)=>s+(a.m||(a.k==='s'?600:110)),0),hrs=Math.round(mins/60);
 
 $('#stats').innerHTML=[[of.length,D.t==='s'?'Series watched':D.t==='m'?'Movies watched':'Titles watched'],['★ '+avg,'Average rating'],[of.filter(a=>a.r===5).length,'Five-star picks'],[(est?'≈ ':'')+hrs.toLocaleString()+' h',`Total watch time${est?' (estimate)':''}${hrs>48?` · ${Math.round(hrs/24)} days`:''}`]].map(([b,s])=>`<div class="stat"><b>${b}</b><span>${s}</span></div>`).join('');
 const grouped=D.view==='years';
 const years=[...new Set(cur.map(a=>a.y))];
 $('#yearNav').hidden=!grouped;
 $('#yearNav').innerHTML=years.map(y=>`<a class="chip" href="#" data-y="${y}">${yl(y)}</a>`).join('');
 $('#count').textContent=`${cur.length} ${D.t==='s'?'series':D.t==='m'?'movies':'titles'}${D.rating?` rated ${D.rating}★`:''}`;
 imgN=0;
 if(!cur.length)$('#list').innerHTML='<div class="empty">No titles match these filters.</div>';
 else if(grouped){
  const rs=cmp('t');
  $('#list').innerHTML=years.map(y=>{const l=cur.filter(a=>a.y===y).sort(rs);return `<section class="year" id="y${y}" data-y="${y}"><h2>${yl(y)}<small>${l.length} ${l.length>1?'titles':'title'}</small></h2><div class="row">${l.map(a=>card(a)).join('')}</div></section>`}).join('');
 }else $('#list').innerHTML=`<div class="grid">${cur.map(a=>card(a,1)).join('')}</div>`;
 obs&&obs.disconnect();if(grouped&&'IntersectionObserver' in window){obs=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const nv=$('#yearNav'),c=nv.querySelector(`[data-y="${en.target.dataset.y}"]`);$$('#yearNav .chip').forEach(x=>x.classList.toggle('on',x===c));if(c)nv.scrollLeft=c.offsetLeft-nv.clientWidth/2+c.offsetWidth/2;}),{rootMargin:'-130px 0px -70% 0px'});$$('.year').forEach(s=>obs.observe(s));}
 $('#foot').textContent=`${ARCHIVE.length} titles catalogued · Last updated ${new Date(SITE.updated).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})} · Posters belong to their owners. Data and artwork via TMDB where shown.`;
 hook($('#list'));sticky();writeHash();
}
$('#ratings').innerHTML='<button class="chip" data-r="">All ratings</button>'+[5,4,3,2,1].map(r=>`<button class="chip" data-r="${r}">${r}★</button>`).join('');
document.addEventListener('click',e=>{
 const t=e.target.closest('#more,#sClear,.toTop,[data-g],[data-gm],#genreBtn,#gclear,[data-tab],[data-view],[data-r],[data-y],.card,[data-close],#openSearch,#theme,#random,#scope [data-s]');if(!t)return;
 if(t.dataset.tab){D.t=t.dataset.tab;D.rating='';scrollTo({top:0,behavior:'smooth'});render();}
 else if(t.dataset.view){D.view=t.dataset.view;render();}
 else if(t.dataset.r!==undefined&&t.closest('#ratings')){D.rating=t.dataset.r;render();}
 else if(t.dataset.y!==undefined){e.preventDefault();$('#y'+t.dataset.y)?.scrollIntoView({behavior:'smooth'});}
 else if(t.classList.contains('card')){e.preventDefault();openItem(t.dataset.id,t.closest('#search')?lastRes:cur);}
 else if(t.dataset.close!==undefined)t.closest('dialog').close();
 else if(t.id==='openSearch'){picks=null;find();$('#search').showModal();$('#q').focus();}
 else if(t.id==='theme'){const l=document.documentElement.classList.toggle('light');try{localStorage.setItem('theme',l?'light':'dark')}catch(_){}}
 else if(t.dataset.g){D.g=D.g.includes(t.dataset.g)?D.g.filter(x=>x!==t.dataset.g):[...D.g,t.dataset.g];drawG();render();}
 else if(t.dataset.gm){D.gm=t.dataset.gm;drawG();render();}
 else if(t.id==='genreBtn'){drawG();$('#genres').showModal();}
 else if(t.id==='gclear'){D.g=[];drawG();render();}
 else if(t.classList.contains('toTop')){scrollTo({top:0,behavior:'smooth'});}
 else if(t.id==='more'){lim+=60;find();}
 else if(t.id==='sClear'){$('#sSort').value='rel';$('#sCat').value='';$('#sYear').value='';lim=60;find();}
 else if(t.id==='random'){openItem(cur[Math.random()*cur.length|0].id,cur);}
 else if(t.dataset.s){$$('#scope .chip').forEach(c=>c.classList.toggle('on',c===t));scope=t.dataset.s;lim=60;find();}
});
$('#sort').onchange=e=>{D.sort=e.target.value;render();};
// detail
let list=[];
function openItem(id,l){const a=byId[id];if(!a)return;list=l||cur;if(!list.includes(a))list=[a];D.item=id;const i=list.indexOf(a);
 $('#dbody').innerHTML=`<div class="d"><div class="frame" data-t="${esc(a.t)}"><img ${img(a)} alt="" width="300" height="450"></div><div><span class="badge">${a.k==='s'?'Series':'Movie'}</span><h2>${esc(a.t)}</h2><div>${stars(a.r)} <span style="color:var(--mu)">${a.r}/5 · ${LABEL[a.r]}</span></div><p>${a.k==='s'?'Series':'Movie'} · ${yl(a.y)}</p>${a.g&&a.g.length?`<div class="tags">${[].concat(a.g).map(x=>`<span class="badge">${esc(x)}</span>`).join('')}</div>`:''}${a.m?`<p>Runtime: ${a.k==='s'&&a.ep?a.ep+' episodes · ':''}${Math.floor(a.m/60)}h ${a.m%60}m${a.k==='s'?' in total':''}</p>`:''}${a.d?`<p>Watched: ${esc(a.d)}</p>`:''}${a.n?`<p>“${esc(a.n)}”</p>`:''}<div class="acts">${a.l?`<a class="btn p" href="${encodeURI(a.l)}">Open page</a>`:''}<button class="btn" id="prev" ${i<1?'disabled':''}>← Prev</button><button class="btn" id="next" ${i>=list.length-1?'disabled':''}>Next →</button><button class="btn" id="share">Copy link</button></div><p style="font-size:.8rem">${i+1} of ${list.length}</p></div></div>`;
 hook($('#dbody'));const d=$('#detail');d.open||d.showModal();
 $('#prev').onclick=()=>openItem(list[i-1].id,list);$('#next').onclick=()=>openItem(list[i+1].id,list);
 $('#share').onclick=async e=>{try{await navigator.clipboard.writeText(location.href);e.target.textContent='Copied ✓'}catch(_){}};
 writeHash();}
$('#detail').addEventListener('close',()=>{D.item='';writeHash();});
$('#detail').addEventListener('keydown',e=>{if(e.key==='ArrowLeft')$('#prev')?.click();if(e.key==='ArrowRight')$('#next')?.click();});
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close();}));
// search
let scope='a',tm,picks,picksScope,lastRes=[],lim=60;
const G={};ARCHIVE.forEach(a=>(a.g||[]).forEach(x=>G[x]=(G[x]||0)+1));
function drawG(){const k=Object.keys(G).sort();$('#glist').innerHTML=k.length?k.map(x=>`<button class="chip${D.g.includes(x)?' on':''}" data-g="${esc(x)}">${esc(x)} <small>${G[x]}</small></button>`).join(''):'<p class="count">Genres appear here once the data is enriched (run enrich.py).</p>';$$('#gmode button').forEach(b=>b.classList.toggle('on',b.dataset.gm===D.gm));}
function find(){const q=norm($('#q').value);const r=$('#results');
 const so=$('#sSort').value,ca=$('#sCat').value,dc=$('#sYear').value,filt=!!(ca||dc||so!=='rel');imgN=0;if(!q&&!filt){if(!picks||picksScope!==scope){picksScope=scope;picks=ARCHIVE.filter(a=>(scope==='a'||a.k===scope)&&a.r>=4).sort(()=>Math.random()-.5).slice(0,18);}lastRes=picks;$('#sc').textContent='Recommended for you';r.innerHTML=picks.map(a=>card(a,2)).join('');hook(r);return;}
 const m=ARCHIVE.filter(a=>(scope==='a'||a.k===scope)&&(!q||a.n2.includes(q))&&(!ca||(a.g||[]).includes(ca))&&(!dc||(a.y>=+dc&&a.y<+dc+10))).sort(so==='yd'?cmp('yd'):so==='ya'?cmp('ya'):(a,b)=>(q?norm(b.t).startsWith(q)-norm(a.t).startsWith(q):0)||art(a.t).localeCompare(art(b.t)));
 $('#sc').textContent=m.length?`${m.length} result${m.length>1?'s':''}${m.length>lim?` (showing ${lim})`:''}`:'No results.';
 lastRes=m.slice(0,lim);r.innerHTML=lastRes.map(a=>card(a,2)).join('')+(m.length>lim?'<button class="btn" id="more">Show more</button>':'');hook(r);}
{const cs=$('#sCat');Object.keys(G).sort().forEach(g=>cs.add(new Option(`${g} (${G[g]})`,g)));[...new Set(ARCHIVE.map(a=>Math.floor(a.y/10)*10))].filter(Boolean).sort((a,b)=>b-a).forEach(d=>$('#sYear').add(new Option(d+'s',d)));}
['#sSort','#sCat','#sYear'].forEach(s=>$(s).onchange=()=>{lim=60;find();});
$('#q').oninput=()=>{lim=60;clearTimeout(tm);tm=setTimeout(find,80);};
$('#q').onkeydown=e=>{if(e.key==='Enter'){const c=$('#results .card');if(c)c.click();}};
document.addEventListener('keydown',e=>{if((e.key==='/'||(e.key==='k'&&(e.ctrlKey||e.metaKey)))&&!/INPUT|SELECT/.test(document.activeElement.tagName)&&!document.querySelector('dialog[open]')){e.preventDefault();$('#openSearch').click();}});
$('#search').addEventListener('close',()=>{});
addEventListener('hashchange',()=>{readHash();render();D.item&&byId[D.item]&&openItem(D.item);});
addEventListener('scroll',()=>document.body.classList.toggle('scrolled',scrollY>140),{passive:true});
readHash();render();
if(D.item&&byId[D.item])openItem(D.item);
})();
