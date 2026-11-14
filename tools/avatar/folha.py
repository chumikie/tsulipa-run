"""Folha de auditoria do avatar 2D: desenha cortes, franjas, olhos, roupas (saia e bermuda), expressões,
peles e acessórios em tamanho grande, para comparar antes e depois de mexer no drawChar.

Uso: com o site servido localmente (python3 -m http.server 8765 na raiz do repositório),
    python3 tools/avatar/folha.py [saida.png] [url]
Precisa do Playwright para Python e de um Chrome/Chromium (ajuste CHROME se precisar)."""
import asyncio, base64, sys
from playwright.async_api import async_playwright

CHROME = '/usr/bin/google-chrome'
SAIDA = sys.argv[1] if len(sys.argv) > 1 else 'folha-avatar.png'
URL = sys.argv[2] if len(sys.argv) > 2 else 'http://localhost:8765/index.html?demo=1'

JS = r"""
()=>{
 const S=5,CW=200,CH=290;
 const linhas=[
  ['Cortes', ['','pixie','onduladom','onduladom2','onduladof','chanel','longo','marias','rabo','cacheado','lateral','trancas','coque','princesa','hime'].map(b=>({back:b,front:'bagunca',hair:'#7b3ff0'}))],
  ['Franjas', ['bagunca','reta','lateral','espetada','arcoiris','ondulada','risca','repicada','cortina','curta','pontas','cacheada'].map(f=>({back:'longo',front:f,hair:'#ff6fb5'})).concat([{back:'hime',front:'reta',hair:'#2a1a12'},{back:'coque',front:'cortina',mecha:'uma',streak:true,hair2:'#4dd8ff'}])],
  ['Olhos', ['','redondo','brilhante','pontinho','gatinho','sereno'].flatMap(o=>[{olho:o,eye:'#4169e1',back:'chanel'},{olho:o,eye:'#7a3b1e',expr:3,back:'chanel'}])],
  ['Bocas e bochechas', ['','sorriso','gato','aberta','dentinho'].flatMap(b=>[{boca:b,back:'rabo'},{boca:b,expr:2,back:'rabo'}]).concat(['sem','forte','sardas','estrelinha'].map(k=>({bochecha:k,back:'marias'})))],
  ['Roupas', ['','seifuku','estrelado','y2k','zipper','sweet','citypop'].flatMap(o=>[{out:o,baixo:'saia',back:'chanel'},{out:o,baixo:'bermuda',back:''}])],
  ['Expressões e poses', [0,1,2,3,4,5,6].map(e=>({expr:e,back:'rabo'})).concat(['v','tchau','coracao'].map(p=>({pose:p,back:'marias'})))],
  ['Peles, detalhes, acessórios', ['#ffe0c7','#f1c27d','#c68642','#8d5524','#5a3825'].map(s=>({skin:s,back:'cacheado',hair:'#2a1a12'})).concat(['coques','gato','elfo','chifres','tulipa'].map(d=>({det:d,back:'longo'})),['presilhas','fones','boina','coala','capitao','palha'].map(h=>({hat:h,back:''})),[{gl:'redonda'},{gl:'quadrada'},{legcol:'#ffffff'},{legcol:'#ff9ccd'}])]
 ];
 const maxN=Math.max(...linhas.map(l=>l[1].length));
 const cv=document.createElement('canvas');cv.width=CW*maxN;cv.height=(CH+30)*linhas.length;const x=cv.getContext('2d');
 x.fillStyle='#f7f2ff';x.fillRect(0,0,cv.width,cv.height);
 state='menu';pw=null;dpw=null;rankI=0;sash=false;accSel='';frame=0;
 linhas.forEach((l,r)=>{const y0=r*(CH+30);x.fillStyle='#3c2a8f';x.font='22px sans-serif';x.fillText(l[0],10,y0+24);
  l[1].forEach((o,i)=>{const av={c:Object.assign({hair:'#4b2b1a',skin:'#ffd5bd',eye:'#4a2b8a',out:'seifuku',outcol:'#ffffff',back:'',front:'bagunca'},o)};
   const c=perfChar(av);charPose=o.pose||'';const ox=i*CW+CW/2-15*S,oy=y0+40+(CH-60)/2-26*S+20;
   x.save();try{perfCharContorno(x,ox,oy,S,function(){drawChar(c,0,0,0,o.expr!=null?o.expr:0,false);});}catch(e){x.fillStyle='red';x.fillText(String(e).slice(0,30),i*CW+5,y0+60);}x.restore();
   x.fillStyle='#555';x.font='14px sans-serif';x.textAlign='center';x.fillText(JSON.stringify(o).replace(/["{}]/g,'').slice(0,26),i*CW+CW/2,y0+CH+18);x.textAlign='left';});});
 charPose='';
 return cv.toDataURL('image/png');
}
"""

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME)
        pg = await b.new_page()
        await pg.goto(URL); await pg.wait_for_timeout(2500)
        d = await pg.evaluate(JS)
        open(SAIDA, 'wb').write(base64.b64decode(d.split(',')[1]))
        await b.close()
        print('gravado', SAIDA)

asyncio.run(main())
