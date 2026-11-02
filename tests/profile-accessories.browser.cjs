/* Isolated Canvas 2D visual QA. No account, purchases, SQL, or game saves. */
'use strict';
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const output=process.argv[2]||'/tmp/profile-accessories-browser';
fs.mkdirSync(output,{recursive:true});
const server=http.createServer((req,res)=>{
  const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1)||'index.html';
  const file=path.resolve(root,name);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404).end();return;}
    res.setHeader('Content-Type',name.endsWith('.html')?'text/html; charset=utf-8':name.endsWith('.js')?'text/javascript; charset=utf-8':name.endsWith('.css')?'text/css; charset=utf-8':'application/octet-stream');
    res.end(data);
  });
});
async function main(){
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  try{
    for(const width of [1440,390,320]){
      const page=await browser.newPage({viewport:{width,height:width===1440?960:844},deviceScaleFactor:1});
      await page.route(/^https?:\/\/(?!127\.0\.0\.1)/,route=>route.abort());
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto(`http://127.0.0.1:${server.address().port}/index.html`,{waitUntil:'domcontentloaded'});
      const report=await page.evaluate(()=>{
        if(typeof drawChar!=='function')throw Error('drawChar unavailable');
        const oldG=g,oldState=state,oldPose=charPose,oldRank=rankI,oldAcc=accSel;
        const styles=[['curto','pixie','lateral'],['longo','longo','reta'],['volumoso','cacheado','bagunca'],['franja espetada','pixie','espetada']];
        const accessories=[['Coroa de Tulipas','tulipa',''],['Torrada de Anime','torrada',''],['Chapéu de Palha','','palha']];
        const colors=['#ff6fb5','#4dd8ff'];
        const width=900,height=710,canvas=document.createElement('canvas');
        canvas.width=width;canvas.height=height;canvas.style.cssText='max-width:100%;width:100%;height:auto;display:block;margin:auto;border-radius:16px';
        const ctx=canvas.getContext('2d',{willReadFrequently:true});
        ctx.fillStyle='#201a38';ctx.fillRect(0,0,width,height);
        ctx.font='bold 16px system-ui';ctx.fillStyle='#fff';ctx.fillText('TsuLiPa World — acessórios Canvas 2D • QA isolado',24,28);
        const metrics=[];
        try{
          g=ctx;state='menu';charPose='';rankI=0;accSel='';
          accessories.forEach(([label,det,hat],row)=>{
            ctx.fillStyle='#fff';ctx.font='bold 16px system-ui';ctx.fillText(label,24,66+row*212);
            styles.forEach(([style,back,front],col)=>{
              const left=28+col*215,top=84+row*212;
              ctx.fillStyle='rgba(255,255,255,.07)';ctx.fillRect(left,top,194,174);
              ctx.fillStyle='#e7dbff';ctx.font='13px system-ui';ctx.fillText(style,left+7,top+19);
              colors.forEach((luz,i)=>{
                const x=left+31+i*90,y=top+59;
                ctx.save();ctx.translate(x,y);ctx.scale(1.8,1.8);
                drawChar({hair:'#6c3299',skin:'#f5c9ae',eye:'#3562c9',luz,back,front,det,hat,out:'seifuku'},0,0,0,0,false);
                ctx.restore();
                const pixels=ctx.getImageData(x-12,y-25,90,110).data;
                const expected=det==='tulipa'?luz:(det==='torrada'?'#f5c574':'#f7d88b');
                const rgb=expected.match(/[\da-f]{2}/gi).map(n=>parseInt(n,16));
                let matching=0;
                for(let n=0;n<pixels.length;n+=4)
                  if(pixels[n]===rgb[0]&&pixels[n+1]===rgb[1]&&pixels[n+2]===rgb[2])matching++;
                metrics.push({accessory:label,style,color:luz,matching});
              });
            });
          });
        }finally{g=oldG;state=oldState;charPose=oldPose;rankI=oldRank;accSel=oldAcc;}
        document.body.replaceChildren(canvas);
        document.body.style.cssText='background:#141029;margin:0;padding:10px;box-sizing:border-box';
        return {metrics,logicalSize:[width,height]};
      });
      assert.equal(report.metrics.length,24,'four hairstyles × three items × two colors');
      for(const entry of report.metrics)assert(entry.matching>2,`missing accessory color ${JSON.stringify(entry)}`);
      await page.screenshot({path:path.join(output,`accessories-${width}.png`),fullPage:true});
      assert.equal(errors.length,0,`page errors: ${errors.join('; ')}`);
      console.log(JSON.stringify({viewport:width,combos:report.metrics.length,errors,output:`accessories-${width}.png`}));
      await page.close();
    }
  }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>server.close());
