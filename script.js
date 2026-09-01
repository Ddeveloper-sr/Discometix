const cosmetics = [
  {id:'aurora',name:'Aurora Ring',category:'decoration',art:'art-halo',desc:'Soft luminous ring'},
  {id:'crown',name:'Starlight Crown',category:'decoration',art:'art-crown',desc:'A bright profile accent'},
  {id:'neon',name:'Neon Arc',category:'decoration',art:'art-neon',desc:'Electric violet outline'},
  {id:'orbit',name:'Orbit Frame',category:'frame',art:'art-orbit',desc:'Animated orbital frame'},
  {id:'glass',name:'Glass Frame',category:'frame',art:'art-frame',desc:'Minimal translucent frame'},
  {id:'rose',name:'Rose Frame',category:'frame',art:'art-rose',desc:'Soft geometric frame'},
  {id:'spark',name:'Spark Field',category:'effect',art:'art-spark',desc:'Floating spark particles'},
  {id:'void',name:'Void Pulse',category:'effect',art:'art-neon',desc:'Subtle ambient pulse'},
  {id:'cosmic',name:'Cosmic Orbit',category:'effect',art:'art-orbit',desc:'Slow orbital motion'},
  {id:'star',name:'Star Badge',category:'badge',art:'art-crown',desc:'A small status badge'},
  {id:'diamond',name:'Diamond Badge',category:'badge',art:'art-halo',desc:'Clean diamond emblem'},
  {id:'creator',name:'Creator Badge',category:'badge',art:'art-frame',desc:'Creator-style mark'}
];

const grid = document.querySelector('#cosmeticsGrid');
const searchInput = document.querySelector('#searchInput');
const resultCount = document.querySelector('#resultCount');
const decorationLayer = document.querySelector('#decorationLayer');
const effectLayer = document.querySelector('#effectLayer');
const equippedList = document.querySelector('#equippedList');
const banner = document.querySelector('#previewBanner');
let activeCategory = 'all';
let selected = new Set();

function label(category){return category.charAt(0).toUpperCase()+category.slice(1)}

function render(){
  const term = searchInput.value.trim().toLowerCase();
  const filtered = cosmetics.filter(item => (activeCategory==='all'||item.category===activeCategory) && (!term || `${item.name} ${item.desc}`.toLowerCase().includes(term)));
  resultCount.textContent = `${filtered.length} items`;
  grid.innerHTML = filtered.map(item => `
    <article class="cosmetic-card ${selected.has(item.id)?'selected':''}" data-id="${item.id}" tabindex="0">
      <div class="cosmetic-art ${item.art}"></div>
      <div class="cosmetic-info"><strong>${item.name}</strong><span>${label(item.category)} · ${item.desc}</span></div>
    </article>`).join('');
  grid.querySelectorAll('.cosmetic-card').forEach(card=>{
    card.addEventListener('click',()=>toggle(card.dataset.id));
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(card.dataset.id)}});
  });
}

function toggle(id){
  const item = cosmetics.find(x=>x.id===id);
  if(!item) return;
  if(item.category==='decoration'||item.category==='frame'){
    cosmetics.filter(x=>x.category===item.category).forEach(x=>selected.delete(x.id));
  }
  selected.has(id)?selected.delete(id):selected.add(id);
  applyPreview();
  render();
}

function applyPreview(){
  const items=[...selected].map(id=>cosmetics.find(x=>x.id===id)).filter(Boolean);
  const deco=items.find(x=>x.category==='decoration');
  const frame=items.find(x=>x.category==='frame');
  const effects=items.filter(x=>x.category==='effect');
  decorationLayer.style.borderColor = deco ? (deco.id==='crown'?'#ffd45c':deco.id==='neon'?'#c06cff':'#7b6cff') : '#7b6cff';
  decorationLayer.style.borderStyle = deco ? (deco.id==='neon'?'dashed':'solid') : 'solid';
  decorationLayer.style.opacity = deco ? '1' : '0';
  if(frame){decorationLayer.style.borderWidth='6px';decorationLayer.style.boxShadow=frame.id==='glass'?'0 0 0 4px rgba(190,205,255,.14)':'0 0 22px rgba(145,120,255,.45)'}
  else{decorationLayer.style.borderWidth='4px';decorationLayer.style.boxShadow='none'}
  effectLayer.style.opacity=effects.length?'1':'0';
  effectLayer.style.animation=effects.some(x=>x.id==='cosmic')?'spin 4s linear infinite':'none';
  if(effects.some(x=>x.id==='void')) effectLayer.style.filter='blur(1px)'; else effectLayer.style.filter='none';
  equippedList.innerHTML=items.map(x=>`<span class="equip-chip">${x.name}</span>`).join('') || '<span class="equip-chip">No cosmetics equipped</span>';
  if(frame?.id==='rose') banner.style.background='radial-gradient(circle at 70% 25%,#713e67,transparent 32%),linear-gradient(135deg,#2a1d2d,#15151d)';
  else if(frame?.id==='glass') banner.style.background='linear-gradient(135deg,#293243,#141820)';
  else banner.style.background='radial-gradient(circle at 25% 30%,#8273ff,transparent 30%),linear-gradient(135deg,#262b4d,#171923 60%,#4b315e)';
}

function randomize(){
  selected.clear();
  ['decoration','frame','effect','badge'].forEach(category=>{
    if(Math.random()>.2){const options=cosmetics.filter(x=>x.category===category); selected.add(options[Math.floor(Math.random()*options.length)].id)}
  });
  applyPreview();render();
}

document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{
  document.querySelector('.tab.active').classList.remove('active');tab.classList.add('active');activeCategory=tab.dataset.category;render();
}));
searchInput.addEventListener('input',render);
document.querySelector('#randomizeTop').addEventListener('click',randomize);
document.querySelector('#randomizeHero').addEventListener('click',randomize);
document.querySelector('#resetBtn').addEventListener('click',()=>{selected.clear();applyPreview();render();});
render();
