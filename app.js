const data = {
labor:[
["Паспорт","req","Обязательно"],
["Полис ОМС","req","Обязательно"],
["СНИЛС","req","Обязательно"],
["Обменная карта","req","Обязательно"],
["Телефон и зарядка","rec","Рекомендуется"],
["Вода с удобной крышкой","req","Обязательно"],
["Перекусы на роды","rec","Снеки, пюре, сухое печенье или батончики небольшими порциями"],
["Моющиеся тапочки","req","Обязательно"],
["Компрессионные чулки","rec","По показаниям или при плановом КС"]
],
post:[
["Послеродовые прокладки","req","Обязательно"],
["Одноразовые трусы","rec","Рекомендуется"],
["Средства гигиены","req","Обязательно"],
["Прокладки для груди","rec","Рекомендуется"],
["Халат и сорочка","provided","Уточнить, предоставляет ли роддом"],
["Полотенце и пакет для белья","comfort","Для комфорта"]
],
baby:[
["Подгузники","req","Обязательно"],
["Влажные салфетки","rec","Рекомендуется"],
["Одноразовые пелёнки","rec","Рекомендуется"],
["Одежда на выписку","rec","Подготовить отдельно"],
["Автолюлька","rec","Для выписки"]
],
docs:[
["Паспорт","req","Обязательно"],
["Полис ОМС","req","Обязательно"],
["СНИЛС","req","Обязательно"],
["Обменная карта","req","Обязательно"],
["Направление","req","Для плановой госпитализации"],
["Результаты обследований","rec","Если просил врач"],
["Выписки из стационаров","rec","Если есть"]
],
drive:[
["Паспорт","req","Проверьте перед выходом"],
["Полис ОМС","req","Проверьте перед выходом"],
["Обменная карта","req","Проверьте перед выходом"],
["Телефон и зарядка","req","Проверьте перед выходом"],
["Вода","req","Проверьте перед выходом"],
["Сумка в родблок","req","Проверьте перед выходом"]
]
};

let currentBag="labor";
let saved={};
try{saved=JSON.parse(localStorage.getItem("roddomChecklist")||"{}")}catch(e){saved={}}

const key=(g,i)=>`${g}_${i}`;
const done=(g,i)=>!!saved[key(g,i)];

function persist(){
  try{localStorage.setItem("roddomChecklist",JSON.stringify(saved))}catch(e){}
}

function item(g,x,i){
  const isDone=done(g,i);
  return `<button class="item ${isDone?"done":""}" data-toggle="${g}:${i}" style="width:100%;border:0;text-align:left">
    <span class="check">${isDone?"✓":""}</span>
    <span><b>${x[0]}</b><small>${x[2]}</small><i class="tag ${x[1]}">${x[2]}</i></span>
  </button>`;
}

function render(){
  document.getElementById("bagList").innerHTML=data[currentBag].map((x,i)=>item(currentBag,x,i)).join("");
  document.getElementById("docsList").innerHTML=data.docs.map((x,i)=>item("docs",x,i)).join("");
  document.getElementById("driveList").innerHTML=data.drive.map((x,i)=>item("drive",x,i)).join("");
  const groups=["labor","post","baby","docs"];
  let total=0,complete=0;
  groups.forEach(g=>data[g].forEach((_,i)=>{total++;if(done(g,i))complete++}));
  const p=Math.round(complete/total*100);
  document.getElementById("percent").textContent=p+"%";
  document.getElementById("bar").style.width=p+"%";
}

function openView(id){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  scrollTo(0,0);
}

document.addEventListener("click",e=>{
  const open=e.target.closest("[data-open]");
  if(open){openView(open.dataset.open);return}
  const bag=e.target.closest("[data-bag]");
  if(bag){
    currentBag=bag.dataset.bag;
    document.querySelectorAll("[data-bag]").forEach(b=>b.classList.toggle("active",b===bag));
    render();return
  }
  const toggle=e.target.closest("[data-toggle]");
  if(toggle){
    const [g,i]=toggle.dataset.toggle.split(":");
    saved[key(g,i)]=!done(g,i);
    persist();render();
  }
});

document.getElementById("driveDone").addEventListener("click",()=>{
  const missing=data.drive.some((_,i)=>!done("drive",i));
  alert(missing?"Проверьте пункты без галочки.":"Всё готово. Спокойной дороги и благополучных родов ❤️");
});

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js"));
}
render();
