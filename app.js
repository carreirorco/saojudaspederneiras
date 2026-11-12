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
  instagram:'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".6"/></svg>',
  facebook:'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/></svg>',
  whatsapp:'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4.100A8 8 0 1 1 8.200 18.900z"/><path d="M9.200 8.800c0 3 2.500 5.600 5.600 6l1.100-1.300-1.800-.9-.8.700c-.9-.3-1.900-1.300-2.300-2.200l.7-.8-.9-1.800z"/></svg>',
  go:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'
};

function zap(msg){return "https://wa.me/"+D.whatsapp.numero+"?text="+encodeURIComponent(msg)}
function mapaUrl(){return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(D.mapa.consulta)}

/* ---------- Pix: BR Code estático (padrão do Banco Central) ---------- */
function tlv(id,v){var l=String(v.length);return id+(l.length<2?"0"+l:l)+v}
function semAcento(s){return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^A-Za-z0-9 ]/g,"").toUpperCase()}
function crc16(str){
  var c=0xFFFF;
  for(var i=0;i<str.length;i++){c^=str.charCodeAt(i)<<8;for(var j=0;j<8;j++){c=(c&0x8000)?((c<<1)^0x1021):(c<<1);c&=0xFFFF}}
  return ("0000"+c.toString(16).toUpperCase()).slice(-4);
}
function pixPayload(p){
  var conta=tlv("00","BR.GOV.BCB.PIX")+tlv("01",p.chave);
  var s=tlv("00","01")+tlv("01","11")+tlv("26",conta)+tlv("52","0000")+tlv("53","986")+tlv("58","BR")+
    tlv("59",semAcento(p.nome).slice(0,25))+tlv("60",semAcento(p.cidade).slice(0,15))+tlv("62",tlv("05","***"))+"6304";
  return s+crc16(s);
}
function pixQrSvg(payload){
  if(typeof qrcode!=="function") return "";
  var q=qrcode(0,"M"); q.addData(payload); q.make();
  return q.createSvgTag(5,4,"QR Code Pix da "+D.pix.nome,"QR Code Pix");
}

function render(){
  var h='';
  var redes=(D.redes||[]).concat([{nome:"WhatsApp",usuario:D.whatsapp.exibir,url:"https://wa.me/"+D.whatsapp.numero}]);
  if(redes.length){
    h+='<nav class="redes" aria-label="Redes sociais e contato">'+redes.filter(function(r){return /^https:\/\//.test(r.url)}).map(function(r){
      return '<a class="pill" href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer" aria-label="'+esc(r.nome+": "+r.usuario)+'">'+(I[r.nome.toLowerCase()]||"")+esc(r.nome)+'</a>'}).join("")+'</nav>';
  }
  h+='<div class="stack">';
  h+='<a class="btn primary" href="'+esc(D.agenda.url)+'">'+I.cal+'<span><b>'+esc(D.agenda.titulo)+'</b><small>'+esc(D.agenda.texto)+'</small></span></a>';

  h+='<details class="card zap"><summary>'+I.chat+'<span><b>'+esc(D.whatsapp.titulo)+'</b><small>'+esc(D.whatsapp.texto)+'</small></span><svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary><ul class="msgs">'+
    D.whatsapp.mensagens.map(function(m){
      return '<li><a href="'+esc(zap(m.m))+'" target="_blank" rel="noopener noreferrer">'+esc(m.t)+I.go+'</a></li>';
    }).join("")+'</ul><p class="aviso">WhatsApp da secretaria: '+esc(D.whatsapp.exibir)+'</p></details>';

  D.eventos.filter(function(e){return e.ativo!==false}).forEach(function(e){
    h+='<section class="card"><h2>'+I.cross+esc(e.titulo)+'</h2><p class="when">'+esc(e.quando)+'</p><p>'+esc(e.onde)+'</p>'+
      '<div class="actions"><button type="button" class="pill" data-ics="'+esc(e.id)+'">'+I.calAdd+'Adicionar à agenda</button></div></section>';
  });

  h+='<section class="card"><h2>'+I.clock+esc(D.atendimento.titulo)+'</h2><p>'+esc(D.atendimento.texto)+'</p>'+
    '<div class="actions"><a class="pill" href="'+esc(zap(D.whatsapp.mensagens.filter(function(m){return /Confiss/.test(m.t)})[0].m))+'" target="_blank" rel="noopener noreferrer">Perguntar pelo WhatsApp</a></div></section>';

  h+='<section class="card"><h2>'+I.pin+esc(D.mapa.titulo)+'</h2><p>'+esc(D.mapa.texto)+'</p>'+
    '<div class="actions"><a class="pill solid" href="'+esc(mapaUrl())+'" target="_blank" rel="noopener noreferrer">Abrir no mapa</a></div></section>';

  var payload=pixPayload(D.pix), svg=D.pix.qr===false?"":pixQrSvg(payload);
  h+='<section class="card"><h2>'+I.heart+esc(D.pix.titulo)+'</h2><p>'+esc(D.pix.texto)+'</p>'+
    '<div class="chave"><b>'+esc(D.pix.exibir)+'</b><button type="button" class="pill" data-copy="'+esc(D.pix.chave)+'" data-msg="Chave Pix copiada">'+I.copy+'Copiar</button></div>'+
    (svg?'<details class="qr"><summary>Exibir QR Code<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary>'+
      '<div class="qrbox">'+svg+'</div><p class="aviso">Abra o aplicativo do seu banco, escolha Pix e aponte a câmera para o código.</p>'+
      '<div class="actions"><button type="button" class="pill" data-copy="'+esc(payload)+'" data-msg="Pix copia e cola copiado">'+I.copy+'Copiar Pix copia e cola</button></div></details>':'')+
    '<p class="aviso">'+esc(D.pix.aviso)+'</p></section>';

  h+='</div><p class="note">'+esc(D.rodape)+'</p>';
  $("conteudo").innerHTML=h;
}

/* ---------- toast e copiar ---------- */
function toast(m){var t=$("toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(function(){t.classList.remove("show")},1800)}
function copyText(text,msg){
  function fb(){var ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";ta.style.opacity="0";ta.readOnly=true;document.body.appendChild(ta);ta.focus();ta.select();ta.setSelectionRange(0,ta.value.length);var ok=false;try{ok=document.execCommand("copy")}catch(e){}document.body.removeChild(ta);toast(ok?(msg||"Copiado"):"Selecione e copie manualmente")}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){toast(msg||"Copiado")},fb)}else fb();
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
  if(b.dataset.copy){copyText(b.dataset.copy,b.dataset.msg);return}
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
