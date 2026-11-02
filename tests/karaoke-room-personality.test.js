'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Personality=require('../karaoke-room-personality.js');
const html=fs.readFileSync(path.join(__dirname,'..','karaoke-time.html'),'utf8');
const names=['Momo','Nene','Lirika','Pati','Nanamaru','Hiruru','Fuji','Acádia','Kiko','Hana'];
const cast=names.map((nick,i)=>({nick,playerId:'npc-'+i}));
const personality=Personality.create({random:()=>.2});
personality.prepare(cast);
assert.equal(new Set(cast.map(actor=>actor._ktPersonality.type)).size,7,'the current ten-character fallback cast receives a broad, deterministic personality mix');
for(const actor of cast){
 const again=personality.profile({nick:actor.nick,playerId:actor.playerId});
 assert.deepEqual({...again},{...actor._ktPersonality},'the same stable identity receives the same temperament');
 assert(actor._ktPersonality.wanderlust>=.05&&actor._ktPersonality.wanderlust<=.98,'personality values remain bounded');
}
const shy=cast.find(a=>a._ktPersonality.type==='timido'),party=cast.find(a=>a._ktPersonality.type==='festeiro');
assert(party&&shy&&personality.delay(party,'wander')<personality.delay(shy,'wander'),'a lively Idol tends to choose an outing earlier than a shy Idol');
assert.equal(personality.choose([], 'wander'),null,'empty candidate lists do not create an activity');
assert(cast.includes(personality.choose(cast,'wander')),'the activity chooser returns an eligible character');
const pair=personality.chooseConversation(cast);
assert(pair&&pair.length===2&&pair[0]!==pair[1],'spontaneous conversations always use two distinct characters');
const nextPair=personality.chooseConversation(cast);
assert(nextPair&&nextPair[0]!==nextPair[1],'conversation selection remains valid after remembering the previous pair');
const audience=personality.chooseAudience(cast);
assert.equal(audience.length,2,'a singer receives one expressive supporter and one additional audience member');
assert.notEqual(audience[0],audience[1],'audience reactions never assign one character twice');
for(const actor of cast){
 assert(['talk','look','applause'].includes(personality.gesture(actor,'talk')),'conversation gestures use an existing room pose');
 assert(['look','applause'].includes(personality.gesture(actor,'cheer')),'show reactions use existing room poses');
 for(const locale of ['pt','en','es','th','ja'])for(const role of ['start','reply','cheer'])assert(personality.dialogue(actor,role,locale),'each personality can speak in every supported room language');
}
const talkDecision=personality.decideSocial(cast,null,'pt');
assert(talkDecision&&talkDecision.first!==talkDecision.second&&talkDecision.secondLine,'conversation decisions return two distinct speakers and individualized dialogue');
assert(['talk','look'].includes(talkDecision.firstKind)&&['talk','look'].includes(talkDecision.secondKind),'conversation decisions use supported individual gestures');
const showDecision=personality.decideSocial(cast.slice(1),cast[0],'en');
assert(showDecision&&showDecision.firstLine&&['applause','look'].includes(showDecision.firstKind),'show decisions choose a supporter and a localized reaction');
const playful=cast.find(a=>a._ktPersonality.type==='brincalhao');
assert.equal(personality.profile(playful).tone,'bright','the playful archetype has an expressive conversational tone');
personality.reset(cast);
assert.equal(personality.chooseConversation(cast).length,2,'reset clears conversational memory without losing the cast');
assert(html.includes('<script src="./karaoke-room-personality.js?v=1"></script>'),'the personality module is loaded before room initialization');
assert(html.includes('window.KaraokeRoomPersonality&&window.KaraokeRoomPersonality.create({random:Math.random})'),'the page injects randomness without giving the personality module movement controls');
assert(html.includes('krLoungePersonality.reset(krBots)'),'the current cast receives individual profiles on room reset');
assert(html.includes("krLoungePersonality.delay(b,'wander')"),'personality changes only when each character chooses an autonomous outing');
assert(html.includes('krLoungePersonality.decideSocial(eligible,singer,LANG)'),'the personality layer decides conversations and audience reactions');



assert(html.includes('krLoungeCriarPasseio(chosen,stopX,freeLanes[0])'),'the existing path controller still owns the actual walking route');
assert(html.includes('krLoungeAvancarAtores(dt,false)'),'the existing movement state machine remains responsible for walking');
assert(html.includes('window.krLoungeAutoMicController=window.KaraokeRoomAutoMic.create({'),'the existing autonomous-mic controller remains intact');
assert.equal(cast.every(actor=>actor._ktPersonality.favoriteStyles.length===2&&actor._ktPersonality.gestureFavorites.length===3),true,'each NPC receives stable music preferences and favorite gestures');
assert(cast.some(actor=>actor._ktPersonality.musicPreferences.pop!==actor._ktPersonality.musicPreferences.ballad),'music affinity varies by character and style');
assert(['walk','drink','dance','observe','seat'].includes(personality.decideActivity(cast[0],{seatAvailable:true})),'the activity director returns a supported intention');
assert(personality.activityDuration(cast[0],'dance')>0,'activity duration is personality-dependent and positive');
const reactionPersonality=Personality.create({random:()=>0});
for(const event of ['start','hit','combo','miss','finish','record']){
 const reactions=reactionPersonality.decideReactions(cast,event,{song:{style:'pop'},language:'pt'});
 assert(reactions.length>0,'the audience can react individually to '+event);
 assert(reactions.every(item=>cast.includes(item.actor)&&['banzai','coracao','neon','v'].includes(item.pose)&&item.duration>0&&item.emoji),'each response contains an actor, supported pose, duration and emoji');
}
const silent=Personality.create({random:()=>.999999});
assert.equal(silent.decideReactions(cast,'combo',{song:{style:'ballad'}}).length,0,'quiet audience members may keep observing without a forced reaction');
const playPersonality=Personality.create({random:()=>0});
assert.equal(playPersonality.decideSocial(cast,null,'pt').interaction,'play','playful personalities can turn a conversation into a small joke');
assert(html.includes('function krLoungeReactToShow(event,details)'),'show events reach the audience reaction coordinator');
assert(html.includes("krLoungeReactToShow('start'"),'the actual music start reaches the audience');
assert(html.includes("krLoungeReactToShow(isSessionRecord?'record':'finish'"),'finishes and session records have distinct audience events');
assert(html.includes('showReactionActive=!!(j._ktShowReaction&&j._ktShowReaction.until>t)'),'audience reactions render without moving characters');
assert(html.includes("krLoungePersonality.decideActivity(chosen,{seatAvailable:!!freeSeat})"),'the activity director checks for a genuinely free sofa');
assert(html.includes("activity==='drink'")&&html.includes("activity==='dance'"),'drink and dance activities use the existing movement controller');
assert(!html.includes("b.danca='banzai';krBolhas.push({emo:i%2"),'the show result no longer forces a synchronized audience pose');
console.log('Karaoke room personality: individual music preferences, audience events, social play and natural activities passed');
