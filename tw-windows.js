/* Keyboard/focus adapter for the hub's shared windows; existing close handlers own state. */
(function(){
 'use strict';
 // Iframes use the host viewport for typography, not their narrow embedded width.
 if(window.parent!==window){
  try{
   var viewport=window.parent.matchMedia('(max-width:600px)'),listening=false;
   var sync=function(){document.documentElement.style.setProperty('--tw-window-title-size',viewport.matches?'24px':'35px');};
   function attach(){if(listening)return;listening=true;viewport.addEventListener('change',sync);sync();}
   function detach(){if(!listening)return;listening=false;viewport.removeEventListener('change',sync);}
   attach();
   document.addEventListener('keydown',function(e){
    if(e.key!=='Tab'||document.querySelector('dialog[open]'))return;
    var items=Array.from(document.querySelectorAll('button,a[href],input,select,textarea,[tabindex="0"]')).filter(function(el){return !el.disabled&&el.getClientRects().length;});
    if(!items.length)return;
    var active=document.activeElement;
    if((e.shiftKey&&active===items[0])||(!e.shiftKey&&active===items[items.length-1])){
     var close=window.parent.document.querySelector('#twPreviewJogo:not([hidden]) .tw-window-close');
     if(close){e.preventDefault();close.focus({preventScroll:true});}
    }
   });
   window.addEventListener('pagehide',detach);
   window.addEventListener('pageshow',attach);
  }catch(e){/* Cross-origin standalone integrations use the CSS fallback. */}
  return;
 }
 var records=new WeakMap();
 function visible(el){return !el.hidden&&el.getClientRects().length>0;}
 function closeButton(el){return el.querySelector('.tw-window-close');}
 function restore(record){
  if(!record)return;
  var target=record.launcher;
  if(record.card){target=document.querySelector('#hub [data-ir="'+record.card+'"]')||target;}
  if(target&&target.isConnected)target.focus({preventScroll:true});
 }
 new MutationObserver(function(changes){
  changes.forEach(function(change){
   var el=change.target;
   if(!el.matches('.tw-window-overlay'))return;
   if(!el.hidden){
    var active=document.activeElement,card=active&&active.closest('[data-ir]');
    records.set(el,{launcher:active,card:card&&card.getAttribute('data-ir')});
    var close=closeButton(el);if(close)close.focus({preventScroll:true});
   }else restore(records.get(el));
  });
 }).observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden']});
 document.addEventListener('keydown',function(e){
  if(e.defaultPrevented)return;
  var overlays=Array.from(document.querySelectorAll('.ov,.tw-preview-game')).filter(visible);
  overlays.sort(function(a,b){return (parseInt(getComputedStyle(a).zIndex)||0)-(parseInt(getComputedStyle(b).zIndex)||0);});
  var top=overlays[overlays.length-1];
  if(!top||!top.matches('.tw-window-overlay,.tw-preview-game[data-jogo="sora"],.tw-preview-game[data-karaoke-popup]'))return;
  if(e.key==='Escape'){
   var close=closeButton(top);if(close){e.preventDefault();close.click();}
  }else if(e.key==='Tab'){
   var items=Array.from(top.querySelectorAll('button,a[href],input,select,textarea,iframe,[tabindex="0"]')).filter(function(el){return !el.disabled&&visible(el);});
   if(!items.length)return;
   var first=items[0],last=items[items.length-1],active=document.activeElement;
   if(e.shiftKey&&(active===first||!top.contains(active))){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&(active===last||!top.contains(active))){e.preventDefault();first.focus();}
  }
 });
})();
