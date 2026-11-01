/* TsuLiPa⭐World — page/viewport motion lifecycle.
   Pauses CSS motion and opt-in canvas loops when the document, view or owner
   panel is not visible. It never advances or rewrites a game's simulation. */
(function(w,d){
'use strict';
if(w.TWMotionLifecycle)return;
var pageActive=true,gates=new Set(),cssNodes=new Set(),cssMap=new WeakMap();
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
function rectVisible(el){
 if(!el||!el.isConnected||!el.getBoundingClientRect)return false;
 var r=el.getBoundingClientRect(),vw=w.innerWidth||d.documentElement.clientWidth,vh=w.innerHeight||d.documentElement.clientHeight;
 return r.width>0&&r.height>0&&r.bottom>0&&r.right>0&&r.top<vh&&r.left<vw;
}
function domVisible(el){
 if(!el||!el.isConnected||d.hidden||!pageActive)return false;
 for(var n=el;n&&n.nodeType===1;n=n.parentElement){
  if(n.hidden)return false;
  var cs=w.getComputedStyle(n);
  if(cs.display==='none'||cs.visibility==='hidden'||cs.contentVisibility==='hidden'||parseFloat(cs.opacity)===0)return false;
 }
 return rectVisible(el);
}
function unobscured(el){
 if(!el||!d.elementFromPoint)return true;
 if(w.getComputedStyle(el).pointerEvents==='none')return true;
 var r=el.getBoundingClientRect(),xs=[.2,.5,.8],ys=[.2,.5,.8];
 for(var yi=0;yi<ys.length;yi++)for(var xi=0;xi<xs.length;xi++){
  var px=r.left+r.width*xs[xi],py=r.top+r.height*ys[yi];
  if(px<0||py<0||px>=(w.innerWidth||0)||py>=(w.innerHeight||0))continue;
  var top=d.elementFromPoint(px,py);if(!top)continue;
  var cover=top.closest&&top.closest('[aria-modal="true"],[role="dialog"],dialog[open],.tw-modal,.modal,.overlay');
  if(cover&&cover!==el&&!cover.contains(el))continue;
  if(top===el||el.contains(top))return true;
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
 var paused=!pageActive||d.hidden||!elementVisible(state.el,state.inView);
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
function scan(root){
 if(!root)return;
 if(root.nodeType===1)inspectCss(root);
 if(root.querySelectorAll){var all=root.querySelectorAll('*');for(var i=0;i<all.length;i++)inspectCss(all[i]);}
}
function refreshAll(){
 cssNodes.forEach(applyCss);
 gates.forEach(function(g){g.refresh();});
}
var mutationObserver=('MutationObserver' in w)?new MutationObserver(function(records){
 records.forEach(function(rec){
  if(rec.type==='attributes')inspectCss(rec.target);
  else for(var i=0;i<rec.addedNodes.length;i++)scan(rec.addedNodes[i]);
 });
 refreshAll();
}):null;
function startScan(){
 scan(d.documentElement);
 if(mutationObserver)mutationObserver.observe(d.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden','open']});
}
function pageState(active){
 pageActive=active;
 d.documentElement.classList.toggle('tw-motion-page-paused',!active||d.hidden);
 refreshAll();
}
d.addEventListener('visibilitychange',function(){pageState(!d.hidden);});
w.addEventListener('pagehide',function(){pageState(false);});
w.addEventListener('pageshow',function(){pageState(!d.hidden);});
w.addEventListener('resize',refreshAll,{passive:true});
w.addEventListener('scroll',refreshAll,{passive:true,capture:true});
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',startScan,{once:true});else startScan();
function watchLoop(el,enabled,onResume,onPause){
 if(typeof el==='string')el=d.querySelector(el);
 if(!el) return {refresh:function(){},destroy:function(){},setEnabled:function(){}};
 var inView=rectVisible(el),running=null,destroyed=false,observer=null;
 var state={el:el,refresh:reconcile};
 function reconcile(){
  if(destroyed)return;
  var wanted=pageActive&&!d.hidden&&inView&&elementVisible(el,inView)&&(!enabled||enabled());
  if(wanted===running)return;
  running=wanted;
  try{if(wanted){if(onResume)onResume();}else if(onPause)onPause();}catch(e){if(w.console&&console.error)console.error('TWMotionLifecycle:',e);}
 }
 if('IntersectionObserver' in w){
  observer=new IntersectionObserver(function(entries){
   entries.forEach(function(entry){if(entry.target===el)inView=entry.isIntersecting&&entry.intersectionRatio>0;});
   reconcile();
  },{threshold:[0,.01]});
  observer.observe(el);
 }
 var gate={refresh:reconcile,destroy:function(){
  if(destroyed)return;destroyed=true;if(observer)observer.disconnect();gates.delete(state);
  if(running&&onPause)onPause();running=false;
 },setEnabled:function(value){
  if(typeof enabled==='function')return;
  enabled=!!value;reconcile();
 }};
 gates.add(state);reconcile();return gate;
}
w.TWMotionLifecycle={
 version:1,
 watchLoop:watchLoop,
 refresh:refreshAll,
 isPageActive:function(){return pageActive&&!d.hidden;}
};
})(window,document);
