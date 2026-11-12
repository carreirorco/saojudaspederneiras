(function(){
"use strict";

var D=null;
function $(id){return document.getElementById(id)}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function pad2(n){return n<10?"0"+n:""+n}

var I={
  cal:'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  calAdd:'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4M12 13v4M10 15h4"/></svg>',
  chat:'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg>',
  pin:'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  cross:'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M6 9h12"/></svg>',
  heart:'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/></svg>',
  clock:'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.500V12l3 2"/></svg>',
  copy:'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
  go:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'
};

function zap(msg){return "https://wa.me/"+D.whatsapp.numero+"?text="+encodeURIComponent(msg)}
function mapaUrl(){return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(D.mapa.consulta)}

function render(){
  var h='<div class="stack">';
  h+='<a class="btn primary" href="'+esc(D.agenda.url)+'">'+I.cal+'<span><b>'+esc(D.agenda.titulo)+'</b><small>'+esc(D.agenda.texto)+'</small></span></a>';

  h+='<details class="card zap"><summary>'+I.chat+'<span><b>'+esc(D.whatsapp.titulo)+'</b><small>'+esc(D.whatsapp.texto)+'</small></span><svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary><ul class="msgs">'+
    D.whatsapp.mensagens.map(function(m){
      return '<li><a href="'+esc(zap(m.m))+'" target="_blank" rel="noopener noreferrer">'+esc(m.t)+I.go+'</a></li>';
    }).join("")+'</ul><p class="aviso">WhatsApp da secretaria: '+esc(D.whatsapp.exibir)+'</p></details>';

  D.eventos.forEach(function(e){
    h+='<section class="card"><h2>'+I.cross+esc(e.titulo)+'</h2><p class="when">'+esc(e.quando)+'</p><p>'+esc(e.onde)+'</p>'+
      '<div class="actions"><button type="button" class="pill" data-ics="'+esc(e.id)+'">'+I.calAdd+'Adicionar à agenda</button></div></section>';
  });

  h+='<section class="card"><h2>'+I.clock+esc(D.atendimento.titulo)+'</h2><p>'+esc(D.atendimento.texto)+'</p>'+
    '<div class="actions"><a class="pill" href="'+esc(zap(D.whatsapp.mensagens.filter(function(m){return /Confiss/.test(m.t)})[0].m))+'" target="_blank" rel="noopener noreferrer">Perguntar pelo WhatsApp</a></div></section>';

  h+='<section class="card"><h2>'+I.pin+esc(D.mapa.titulo)+'</h2><p>'+esc(D.mapa.texto)+'</p>'+
    '<div class="actions"><a class="pill solid" href="'+esc(mapaUrl())+'" target="_blank" rel="noopener noreferrer">Abrir no mapa</a></div></section>';

  h+='<section class="card"><h2>'+I.heart+esc(D.pix.titulo)+'</h2><p>'+esc(D.pix.texto)+'</p>'+
    '<div class="chave"><b>'+esc(D.pix.exibir)+'</b><button type="button" class="pill" data-copy="'+esc(D.pix.chave)+'">'+I.copy+'Copiar</button></div>'+
    '<p class="aviso">'+esc(D.pix.aviso)+'</p></section>';

  h+='</div><p class="note">'+esc(D.rodape)+'</p>';
  $("conteudo").innerHTML=h;
}

/* ---------- toast e copiar ---------- */
function toast(m){var t=$("toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(function(){t.classList.remove("show")},1800)}
function copyText(text){
  function fb(){var ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";ta.style.opacity="0";ta.readOnly=true;document.body.appendChild(ta);ta.focus();ta.select();ta.setSelectionRange(0,ta.value.length);var ok=false;try{ok=document.execCommand("copy")}catch(e){}document.body.removeChild(ta);toast(ok?"Chave Pix copiada":"Selecione e copie manualmente")}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){toast("Chave Pix copiada")},fb)}else fb();
}

/* ---------- evento semanal em .ics (horário de Brasília, UTC-3) ---------- */
function utc(ms){return new Date(ms).toISOString().replace(/[-:]|\.\d{3}/g,"")}
function icsEsc(t){return String(t).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n")}
function icsFold(l){var o=[];while(l.length>73){o.push(l.slice(0,73));l=" "+l.slice(73)}o.push(l);return o.join("\r\n")}
function proximaOcorrencia(e){
  var hh=+e.hora.split(":")[0], mm=+e.hora.split(":")[1];
  var br=new Date(Date.now()-3*3600*1000);            /* "agora" em Brasília, lido com getUTC* */
  for(var i=0;i<8;i++){
    var d=new Date(Date.UTC(br.getUTCFullYear(),br.getUTCMonth(),br.getUTCDate()+i));
    if(d.getUTCDay()!==e.diaSemana) continue;
    var ini=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate(),hh+3,mm);
    if(ini>Date.now()) return ini;
  }
  return Date.now();
}
var DIAS=["SU","MO","TU","WE","TH","FR","SA"];
function baixarEvento(e){
  var ini=proximaOcorrencia(e), fim=ini+e.duracaoMin*60000;
  var L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Paroquia Sao Judas Tadeu//PT-BR//","CALSCALE:GREGORIAN","BEGIN:VEVENT",
    "UID:"+e.id+"@saojudaspederneiras.com.br","DTSTAMP:"+utc(Date.now()),"DTSTART:"+utc(ini),"DTEND:"+utc(fim),
    "RRULE:FREQ=WEEKLY;BYDAY="+DIAS[e.diaSemana],
    "SUMMARY:"+icsEsc(e.titulo),"LOCATION:"+icsEsc(e.local),"DESCRIPTION:"+icsEsc(e.descricao),
    "BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+icsEsc(e.titulo),"TRIGGER:-PT1H","END:VALARM","END:VEVENT","END:VCALENDAR"];
  var blob=new Blob([L.map(icsFold).join("\r\n")+"\r\n"],{type:"text/calendar;charset=utf-8"}), a=document.createElement("a");
  a.href=URL.createObjectURL(blob); a.download=e.id+".ics";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function(){URL.revokeObjectURL(a.href)},1000);
  toast("Arquivo de agenda baixado");
}

document.addEventListener("click",function(e){
  var b=e.target.closest("button"); if(!b) return;
  if(b.id==="theme"){
    var nx=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";
    document.documentElement.setAttribute("data-theme",nx);
    try{localStorage.setItem("missas-tema",nx)}catch(_){}
    return;
  }
  if(b.dataset.copy){copyText(b.dataset.copy);return}
  if(b.dataset.ics){
    var ev=D.eventos.filter(function(x){return x.id===b.dataset.ics})[0];
    if(ev) baixarEvento(ev);
  }
});

fetch("data/links.json",{cache:"no-cache"}).then(function(r){if(!r.ok) throw new Error(r.status);return r.json()}).then(function(j){D=j;render()}).catch(function(err){
  console.error(err);
  $("conteudo").innerHTML='<p class="note">Não foi possível carregar os links. Fale com a secretaria pelo WhatsApp: (14) 98185-2803.</p>';
});
})();
