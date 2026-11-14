const {chromium}=require('playwright');(async()=>{const [,,nome,w,h]=process.argv;const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w,height:+h}});
await p.goto('file://'+__dirname+'/'+nome+'.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);await p.screenshot({path:__dirname+'/'+nome+'.png'});await b.close();})();
