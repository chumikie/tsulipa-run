/* TsuLiPa⭐World — page/viewport motion lifecycle.
   Pauses CSS motion and opt-in canvas loops when the document, view or owner
   panel is not visible. It never advances or rewrites a game's simulation. */
(function(w,d){
'use strict';
if(w.TWMotionLifecycle)return;
var lifecycleActive=true,parentActive=true,gates=new Set(),cssNodes=new Set(),cssMap=new WeakMap(),framed=new WeakSet(),frameGates=new WeakMap(),loopGates=new WeakMap();
var cssIO=('IntersectionObserver' in w)?new IntersectionObserver(function(entries){
 entries.forEach(function(entry){
  var state=cssMap.get(entry.target);if(!state)return;
  state.inView=entry.isIntersecting&&entry.intersectionRatio>0;
  applyCss(state);
 });
},{threshold:[0,.01]}):null;
var style=d.createElement('style');
style.id='tw-motion-lifecycle-style';
style.textContent='html.tw-motion-page-paused *,html.tw-motion-page-paused *::before,html.tw-motion-page-paused *::after,.tw-motion-paused,.tw-motion-paused::before,.tw-motion-paused::after{animation-play-state:paused!important}';
(d.head||d.documentElement).appendChild(style);
function pageIsActive(){return lifecycleActive&&parentActive&&!d.hidden;}
function rectVisible(el){
 if(!el||!el.isConnected||!el.getBoundingClientRect)return false;
 var r=el.getBoundingClientRect(),vw=w.innerWidth||d.documentElement.clientWidth,vh=w.innerHeight||d.documentElement.clientHeight;
 return r.width>0&&r.height>0&&r.bottom>0&&r.right>0&&r.top<vh&&r.left<vw;
}
function domVisible(el){
 if(!el||!el.isConnected||!pageIsActive())return false;
 for(var n=el;n&&n.nodeType===1;n=n.parentElement){
  if(n.hidden)return false;
  var cs=w.getComputedStyle(n);
  if(cs.display==='none'||cs.visibility==='hidden'||cs.contentVisibility==='hidden')return false; // opacity is intentionally not a visibility gate: fade-ins may begin at 0.
 }
 return rectVisible(el);
}
function unobscured(el){
 if(!el||!d.elementFromPoint)return true;
 var r=el.getBoundingClientRect(),xs=[.2,.5,.8],ys=[.2,.5,.8];
 for(var yi=0;yi<ys.length;yi++)for(var xi=0;xi<xs.length;xi++){
  var px=r.left+r.width*xs[xi],py=r.top+r.height*ys[yi];
  if(px<0||py<0||px>=(w.innerWidth||0)||py>=(w.innerHeight||0))continue;
  var top=d.elementFromPoint(px,py);if(!top)continue;
  var cover=top.closest&&top.closest('[aria-modal="true"],[role="dialog"],dialog[open],.ov,.tw-modal,.modal,.overlay');
  if(cover&&cover!==el&&!cover.contains(el))continue;
  if(top===el||el.contains(top)||top.contains(el))return true;
 }
 return false;
}
function elementVisible(el,inView){
 return inView!==false&&domVisible(el)&&unobscured(el);
}
function cssHasMotion(el){
 var styles=[w.getComputedStyle(el),w.getComputedStyle(el,'::before'),w.getComputedStyle(el,'::after')];
 for(var i=0;i<styles.length;i++){
  var names=(styles[i].animationName||'none').split(',');
  var durations=(styles[i].animationDuration||'0s').split(',');
  for(var j=0;j<names.length;j++)if(names[j].trim()!=='none'&&parseFloat(durations[j%durations.length])>0)return true;
 }
 return false;
}
function applyCss(state){
 var paused=!pageIsActive()||!elementVisible(state.el,state.inView);
 if(paused!==state.paused){
  state.paused=paused;
  state.el.classList.toggle('tw-motion-paused',paused);
 }
}
function inspectCss(el){
 if(!el||el.nodeType!==1)return;
 var state=cssMap.get(el),animated=cssHasMotion(el);
 if(animated&&!state){
  state={el:el,inView:rectVisible(el),paused:false};cssMap.set(el,state);cssNodes.add(state);
  if(cssIO)cssIO.observe(el);
  applyCss(state);
 }else if(!animated&&state){
  if(cssIO)cssIO.unobserve(el);
  el.classList.remove('tw-motion-paused');cssNodes.delete(state);cssMap.delete(el);
 }else if(state)applyCss(state);
}
function connectFrame(frame){
 if(!frame||framed.has(frame))return;
 try{var src=frame.getAttribute('src')||w.location.href;if(new URL(src,d.baseURI).origin!==w.location.origin)return;}catch(e){return;}
 framed.add(frame);var active=false;
 function send(value){try{if(frame.contentWindow)frame.contentWindow.postMessage({type:'tsulipa-motion-state',active:!!value},w.location.origin);}catch(e){}}
 function resume(){active=true;send(true);}
 function pause(){active=false;send(false);}
 var gate=watchLoop(frame,function(){return !frame.hidden;},resume,pause);frameGates.set(frame,gate);
 frame.addEventListener('load',function(){send(active&&pageIsActive()&&domVisible(frame)&&rectVisible(frame));});
}
function cleanup(root){
 if(!root||root.nodeType!==1)return;
 var loopSet=loopGates.get(root);
 if(loopSet&&loopSet.size)Array.from(loopSet).forEach(function(state){if(state.destroy)state.destroy();});
 var frameGate=frameGates.get(root);if(frameGate){frameGate.destroy();frameGates.delete(root);framed.delete(root);}
 var state=cssMap.get(root);if(state){if(cssIO)cssIO.unobserve(root);root.classList.remove('tw-motion-paused');cssNodes.delete(state);cssMap.delete(root);}
 if(root.querySelectorAll){var all=root.querySelectorAll('*');for(var i=0;i<all.length;i++)cleanup(all[i]);}
}
function scan(root){
 if(!root)return;
 if(root.nodeType===1){inspectCss(root);if(root.tagName==='IFRAME')connectFrame(root);}
 if(root.querySelectorAll){var all=root.querySelectorAll('*');for(var i=0;i<all.length;i++){inspectCss(all[i]);if(all[i].tagName==='IFRAME')connectFrame(all[i]);}}
}
function refreshAll(){
 d.documentElement.classList.toggle('tw-motion-page-paused',!pageIsActive());
 cssNodes.forEach(function(state){if(!cssIO)state.inView=rectVisible(state.el);applyCss(state);});
 gates.forEach(function(g){if(!g.observed)g.inView=rectVisible(g.el);g.refresh();});
}
var mutationObserver=('MutationObserver' in w)?new MutationObserver(function(records){
 records.forEach(function(rec){
  if(rec.type==='attributes'){inspectCss(rec.target);if(rec.target.tagName==='IFRAME'&&rec.attributeName==='src'&&!frameGates.has(rec.target))connectFrame(rec.target);}
  else{
   for(var i=0;i<rec.removedNodes.length;i++)cleanup(rec.removedNodes[i]);
   for(var j=0;j<rec.addedNodes.length;j++)scan(rec.addedNodes[j]);
  }
 });
 refreshAll();
}):null;
function startScan(){
 scan(d.documentElement);
 if(mutationObserver)mutationObserver.observe(d.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','open','src']});
}
function pageState(active){lifecycleActive=active;refreshAll();}
function parentState(active){parentActive=active;refreshAll();}
d.addEventListener('visibilitychange',function(){refreshAll();});
w.addEventListener('pagehide',function(){pageState(false);});
w.addEventListener('pageshow',function(){pageState(true);});
w.addEventListener('message',function(event){
 if(event.source!==w.parent||event.origin!==w.location.origin||!event.data||event.data.type!=='tsulipa-motion-state')return;
 parentState(event.data.active!==false);
});
w.addEventListener('resize',refreshAll,{passive:true});
w.addEventListener('scroll',refreshAll,{passive:true,capture:true});
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',startScan,{once:true});else startScan();
function watchLoop(el,enabled,onResume,onPause){
 if(typeof el==='string')el=d.querySelector(el);
 if(!el) return {refresh:function(){},destroy:function(){},setEnabled:function(){}};
 var running=null,destroyed=false,observer=null;
 var state={el:el,inView:rectVisible(el),observed:false,refresh:reconcile,destroy:null};
 function reconcile(){
  if(destroyed)return;
  var wanted=pageIsActive()&&state.inView&&elementVisible(el,state.inView)&&(!enabled||enabled());
  if(wanted===running)return;
  running=wanted;
  try{if(wanted){if(onResume)onResume();}else if(onPause)onPause();}catch(e){if(w.console&&console.error)console.error('TWMotionLifecycle:',e);}
 }
 if('IntersectionObserver' in w){
  observer=new IntersectionObserver(function(entries){
   entries.forEach(function(entry){if(entry.target===el)state.inView=entry.isIntersecting&&entry.intersectionRatio>0;});
   reconcile();
  },{threshold:[0,.01]});
  observer.observe(el);state.observed=true;
 }
 var gate={refresh:reconcile,destroyed:false,destroy:function(){
  if(destroyed)return;destroyed=true;gate.destroyed=true;if(observer)observer.disconnect();gates.delete(state);
  var set=loopGates.get(el);if(set){set.delete(state);if(!set.size)loopGates.delete(el);}
  if(running&&onPause)onPause();running=false;
 },setEnabled:function(value){
  if(typeof enabled==='function')return;
  enabled=!!value;reconcile();
 }};
 state.destroy=gate.destroy;
 var set=loopGates.get(el);if(!set){set=new Set();loopGates.set(el,set);}set.add(state);
 gates.add(state);reconcile();return gate;
}
w.TWMotionLifecycle={
 version:1,
 watchLoop:watchLoop,
 refresh:refreshAll,
 isPageActive:function(){return pageIsActive();},
 isVisible:function(el){return elementVisible(el,rectVisible(el));}
};
})(window,document);
