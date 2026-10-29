/* Karaoke 3A.8 - version-only, private Postgres Changes signals. */
(function(root,factory){
 'use strict';
 var api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.TsuKaraokeHomolSync=api;
})(typeof window==='object'?window:null,function(){
 'use strict';
 function create(opts){
   var client=opts.client,channel=null,connecting=false,serial=0;
   var timer=null,queuedRevision=-1,seenRevision=-1,lastFetch=0,retryAfter=0;
   var now=opts.now||function(){return Date.now();};
   var delay=opts.setTimeout||setTimeout,clear=opts.clearTimeout||clearTimeout;
   function active(){return opts.canListen()&&!opts.hidden();}
   function status(s){if(opts.onStatus)opts.onStatus(s);}
   function mark(v){if(Number.isSafeInteger(v)&&v>=0)seenRevision=Math.max(seenRevision,v);}
   function stop(){
     serial++;connecting=false;queuedRevision=-1;
     if(timer!==null){clear(timer);timer=null;}
     var old=channel;channel=null;
     if(old)Promise.resolve(client.removeChannel(old)).catch(function(){});
     status('🌸 Sincronização aguardando entrada');
   }
   function notice(revision){
     if(!active()||!Number.isSafeInteger(revision)||revision<=seenRevision)return;
     queuedRevision=Math.max(revision,queuedRevision);
     if(timer!==null)return;
     timer=delay(async function(){
       timer=null;
       if(!active()){queuedRevision=-1;return;}
       if(opts.busy()){notice(queuedRevision);return;}
       queuedRevision=-1;lastFetch=now();
       try{await opts.refresh();}
       catch(e){status('🌸 Conexão intermitente · consulta periódica ativa');}
     },Math.max(300,2000-(now()-lastFetch)));
   }
   async function start(){
     if(!active()||channel||connecting||now()<retryAfter)return;
     connecting=true;var generation=++serial;
     try{
       var answer=await client.auth.getSession();
       var session=answer&&answer.data&&answer.data.session;
       if(!session||!session.access_token)throw new Error('No session');
       if(client.realtime&&typeof client.realtime.setAuth==='function')
         await client.realtime.setAuth(session.access_token);
       if(generation!==serial||!active()){connecting=false;return;}
       var ch=client.channel('tsulipa-karaoke-lab-sync')
         .on('postgres_changes',{
            event:'UPDATE',schema:'public',table:'tsulipa_karaoke_lab_signal',
            filter:'room_key=eq.main'
         },function(packet){
            // Never draw using WebSocket fields; request signed RPC instead.
            var revision=Number(packet&&packet.new&&packet.new.revision);
            notice(revision);
         });
       channel=ch;connecting=false;
       ch.subscribe(function(state){
         if(channel!==ch)return;
         if(state==='SUBSCRIBED'){status('✨ Sincronização da sala ativa');return;}
         if(state==='CHANNEL_ERROR'||state==='TIMED_OUT'||state==='CLOSED'){
           retryAfter=now()+60000;
           stop();
           status('🌸 Consulta periódica ativa');
         }
       });
     }catch(e){connecting=false;retryAfter=now()+60000;status('🌸 Consulta periódica ativa');}
   }
   return Object.freeze({start:start,stop:stop,mark:mark,notice:notice});
 }
 return Object.freeze({create:create});
});