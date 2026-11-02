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
const playful=cast.find(a=>a._ktPersonality.type==='brincalhao');
assert.equal(personality.profile(playful).tone,'bright','the playful archetype has an expressive conversational tone');
personality.reset(cast);
assert.equal(personality.chooseConversation(cast).length,2,'reset clears conversational memory without losing the cast');
assert(html.includes('<script src="./karaoke-room-personality.js?v=1"></script>'),'the personality module is loaded before room initialization');
assert(html.includes('window.KaraokeRoomPersonality&&window.KaraokeRoomPersonality.create({random:Math.random})'),'the page injects randomness without giving the personality module movement controls');
assert(html.includes('krLoungePersonality.reset(krBots)'),'the current cast receives individual profiles on room reset');
assert(html.includes("krLoungePersonality.delay(b,'wander')"),'personality changes only when each character chooses an autonomous outing');
assert(html.includes('krLoungePersonality.chooseConversation(eligible)'),'personalities influence who naturally starts talking with whom');
assert(html.includes('krLoungePersonality.chooseAudience(eligible)'),'personalities influence individual reactions to the active singer');
assert(html.includes("krLoungePersonality.gesture(first,'talk')")&&html.includes("krLoungePersonality.gesture(second,'listen')"),'conversation gestures are selected per character from existing poses');
assert(html.includes("krLoungePersonality.dialogue(first,'start',LANG)")&&html.includes("krLoungePersonality.dialogue(second,'reply',LANG)"),'conversation lines are selected by personality and current language');
assert(html.includes('krLoungeCriarPasseio(chosen,stopX,freeLanes[0])'),'the existing path controller still owns the actual walking route');
assert(html.includes('krLoungeAvancarAtores(dt,false)'),'the existing movement state machine remains responsible for walking');
assert(html.includes('window.krLoungeAutoMicController=window.KaraokeRoomAutoMic.create({'),'the existing autonomous-mic controller remains intact');
console.log('Karaoke room personality: stable individual traits, varied activity timing, distinct conversation pairs, audience roles, gestures and five-language dialogue passed');
