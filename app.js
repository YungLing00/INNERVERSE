const API_URL = ""; // 部署 Google Apps Script 後，把 Web App URL 貼在這裡。

const QUESTIONS = [
  { trait:"O", text:"我喜歡接觸沒體驗過的新事物。", reverse:false },
  { trait:"O", text:"比起嘗試新的方法，我通常更喜歡熟悉的做法。", reverse:true },
  { trait:"C", text:"開始做事情前，我通常會先安排好步驟。", reverse:false },
  { trait:"C", text:"我常常做到一半，才開始想下一步要做什麼。", reverse:true },
  { trait:"E", text:"和一群人在一起時，我通常會主動加入互動。", reverse:false },
  { trait:"E", text:"在熱鬧的場合中，我通常比較喜歡待在旁邊。", reverse:true },
  { trait:"A", text:"我很容易注意到別人的感受。", reverse:false },
  { trait:"A", text:"意見不同時，我通常不太在意對方的感受。", reverse:true },
  { trait:"N", text:"我的情緒很容易受到周遭事情影響。", reverse:false },
  { trait:"N", text:"面對壓力或突發狀況時，我通常很快就能平靜下來。", reverse:true }
];

const TYPES = {
  O:{name:"EXPLORER", subtitle:"The Blue Planet", color:"#4ba9ff", light:"#a9e4ff", dark:"#163a9e", description:"你以好奇心探索未知，喜歡新的想法與體驗。你的世界充滿想像，也總能從不同角度看見可能。"},
  C:{name:"ARCHITECT", subtitle:"The Green Planet", color:"#60d394", light:"#c3ffe1", dark:"#166650", description:"你擅長建立秩序，將想法一步步變成現實。穩定、專注與責任感，是你的星球持續運轉的力量。"},
  E:{name:"SPARK", subtitle:"The Yellow Planet", color:"#ffd15c", light:"#fff2b6", dark:"#9b5d12", description:"你從交流與行動中獲得能量，願意表達也樂於連結。你的存在像一道光，為周遭帶來活力。"},
  A:{name:"HARMONIZER", subtitle:"The Pink Planet", color:"#ff80b7", light:"#ffd0e6", dark:"#8c2857", description:"你能感受他人的需要，重視理解、合作與溫柔。你讓不同的聲音找到平衡，也讓關係產生連結。"},
  N:{name:"SENSITIVE", subtitle:"The Gray Planet", color:"#a9afc3", light:"#eff1fa", dark:"#555d78", description:"你對環境與情緒的變化格外敏銳。細膩的感受力，讓你看見容易被忽略的訊號與深層情感。"}
};

const DEMO = [
  ["O",82,57,71,64,38],["A",56,61,44,88,52],["C",49,91,39,72,35],["E",66,52,93,70,41],["N",73,46,35,67,89],
  ["O",94,68,55,48,43],["C",58,84,62,63,31],["A",47,72,53,92,58],["E",69,44,86,57,46],["O",87,51,76,70,62],
  ["N",65,53,40,74,84],["A",77,69,58,86,39],["C",44,88,48,61,45],["E",61,55,90,68,34],["O",91,43,64,59,55],
  ["A",52,74,45,89,47],["C",62,93,51,56,29],["N",72,59,37,71,91],["E",54,47,88,65,53],["O",85,64,69,73,42]
].map((d,i)=>({id:`DEMO${String(i+1).padStart(3,"0")}`,type:d[0],scores:{O:d[1],C:d[2],E:d[3],A:d[4],N:d[5]},seed:1100+i*97}));

let currentQuestion=0, answers=[], currentResult=null, universeData=[];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

function showScreen(id){ $$(".screen").forEach(s=>s.classList.toggle("active",s.id===id)); window.scrollTo(0,0); if(id==="universe") loadUniverse(); }
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.go)));
$('#start-test').addEventListener('click',startTest); $('#restart-test').addEventListener('click',startTest); $('#enter-universe').addEventListener('click',()=>showScreen('universe'));

function startTest(){ currentQuestion=0; answers=[]; showScreen('test'); renderQuestion(); }
function renderQuestion(){
  const q=QUESTIONS[currentQuestion];
  $('#question-counter').textContent=`${String(currentQuestion+1).padStart(2,'0')} / 10`;
  $('#question-tag').textContent=`QUESTION ${String(currentQuestion+1).padStart(2,'0')}`;
  $('#question-title').textContent=q.text; $('#progress-bar').style.width=`${(currentQuestion+1)*10}%`;
  const scale=$('#answer-scale'); scale.innerHTML='';
  for(let v=1;v<=5;v++){ const b=document.createElement('button'); b.className='answer'; b.dataset.value=v; b.setAttribute('role','radio'); b.setAttribute('aria-label',`${v} 分`); b.addEventListener('click',()=>selectAnswer(v)); scale.appendChild(b); }
}
function selectAnswer(value){ answers[currentQuestion]=value; if(currentQuestion<9){ currentQuestion++; setTimeout(renderQuestion,180); }else finishTest(); }
$('#test-back').addEventListener('click',()=>{ if(currentQuestion===0) showScreen('home'); else{currentQuestion--;renderQuestion();} });

function finishTest(){
  const raw={O:0,C:0,E:0,A:0,N:0};
  QUESTIONS.forEach((q,i)=>raw[q.trait]+=q.reverse?6-answers[i]:answers[i]);
  const scores=Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,Math.round((v-2)/8*100)]));
  const max=Math.max(...Object.values(scores)); const type=Object.keys(scores).find(k=>scores[k]===max);
  currentResult={id:createId(),type,scores,seed:Math.floor(Math.random()*900000)+100000,createdAt:new Date().toISOString()};
  showScreen('forming'); setTimeout(()=>{renderResult();showScreen('result');savePlanet(currentResult)},1800);
}
function createId(){return Math.random().toString(36).slice(2,8).toUpperCase()}
function renderResult(){
  const t=TYPES[currentResult.type], root=document.documentElement;
  root.style.setProperty('--type-color',t.color); root.style.setProperty('--planet-glow',t.color+'88');
  $('#result-code').textContent=`TYPE ${currentResult.type}`; $('#result-name').textContent=t.name; $('#result-subtitle').textContent=t.subtitle;
  $('#result-description').textContent=t.description; $('#planet-id').textContent=`PLANET #${currentResult.id}`;
  $('#result-planet').style.background=`radial-gradient(circle at 36% 32%,${t.light},${t.color} 30%,${t.dark} 66%,#07091b 100%)`;
  $('#score-list').innerHTML=Object.entries(currentResult.scores).map(([k,v])=>`<div class="score-row"><label>${k}</label><div class="score-bar"><i style="--bar:${TYPES[k].color};width:${v}%"></i></div><span>${v}</span></div>`).join('');
}

async function savePlanet(planet){
  const saved=JSON.parse(localStorage.getItem('innerversePlanets')||'[]'); saved.unshift(planet); localStorage.setItem('innerversePlanets',JSON.stringify(saved.slice(0,50)));
  if(!API_URL) return;
  try{await fetch(API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'create',...planet})});toast('你的星球已存入宇宙');}
  catch(e){toast('目前使用本機模式，星球已保存在此裝置');}
}
async function loadUniverse(){
  const local=JSON.parse(localStorage.getItem('innerversePlanets')||'[]'); universeData=[...local,...DEMO];
  if(API_URL){try{const res=await fetch(`${API_URL}?action=list`);const json=await res.json();if(json.success&&json.data.length) universeData=[...json.data,...DEMO.slice(0,8)];}catch(e){toast('無法連線資料庫，已顯示本機宇宙');}}
  renderUniverse(universeData); resetFilter();
}
function renderUniverse(data){
  $('#planet-count').textContent=data.length; const cosmos=$('#cosmos'); cosmos.innerHTML='';
  data.forEach((p,i)=>{
    const t=TYPES[p.type]||TYPES.O, rng=mulberry32(Number(p.seed)||i+8), size=Math.round(28+rng()*48), btn=document.createElement('button');
    btn.className='cosmos-planet'; btn.dataset.type=p.type; btn.style.cssText=`--size:${size}px;--color:${t.color};--light:${t.light};--dark:${t.dark};--glow:${t.color}66;--speed:${4+rng()*4}s;--delay:${-rng()*5}s;--rotate:${rng()*160}deg;width:${size}px;height:${size}px;left:${4+rng()*88}%;top:${5+rng()*82}%`;
    btn.setAttribute('aria-label',`${t.name} 星球 ${p.id}`); btn.addEventListener('click',()=>selectPlanet(p,btn)); cosmos.appendChild(btn);
  });
}
function selectPlanet(p,el){
  $$('.cosmos-planet').forEach(x=>{x.classList.toggle('dimmed',x.dataset.type!==p.type);x.classList.toggle('highlight',x.dataset.type===p.type)});
  $$('.filter').forEach(x=>x.classList.toggle('active',x.dataset.filter===p.type));
  const t=TYPES[p.type]; $('#planet-card').classList.add('open'); $('#planet-card').style.setProperty('--card-color',t.color); $('#card-type').textContent=`TYPE ${p.type} · ${t.subtitle}`; $('#card-name').textContent=t.name; $('#card-id').textContent=`PLANET #${p.id}`;
  $('#card-scores').innerHTML=Object.entries(p.scores).map(([k,v])=>`<div class="card-score"><span>${k}</span><span>${v}</span></div>`).join('');
}
$('#close-card').addEventListener('click',()=>{$('#planet-card').classList.remove('open');resetFilter()});
$('#filter-bar').addEventListener('click',e=>{const b=e.target.closest('.filter');if(!b)return;const f=b.dataset.filter;$$('.filter').forEach(x=>x.classList.toggle('active',x===b));$$('.cosmos-planet').forEach(x=>{x.classList.toggle('dimmed',f!=='ALL'&&x.dataset.type!==f);x.classList.toggle('highlight',f!=='ALL'&&x.dataset.type===f)});$('#planet-card').classList.remove('open')});
function resetFilter(){$$('.filter').forEach(x=>x.classList.toggle('active',x.dataset.filter==='ALL'));$$('.cosmos-planet').forEach(x=>x.classList.remove('dimmed','highlight'))}
function mulberry32(a){return function(){let t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2600)}

const canvas=$('#starfield'),ctx=canvas.getContext('2d');let stars=[];
function resizeStars(){const d=Math.min(devicePixelRatio,2);canvas.width=innerWidth*d;canvas.height=innerHeight*d;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(d,0,0,d,0,0);stars=Array.from({length:Math.round(innerWidth*innerHeight/8000)},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.25+.15,a:Math.random()*.7+.15,s:Math.random()*.006+.002}))}
function drawStars(t=0){ctx.clearRect(0,0,innerWidth,innerHeight);for(const s of stars){ctx.globalAlpha=s.a*(.65+.35*Math.sin(t*s.s));ctx.fillStyle='#e9e8ff';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()}requestAnimationFrame(drawStars)}
addEventListener('resize',resizeStars);resizeStars();drawStars();addEventListener('scroll',()=>$('.site-header').classList.toggle('scrolled',scrollY>15));
