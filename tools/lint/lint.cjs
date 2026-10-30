'use strict';
const path=require('node:path');
const {ESLint}=require('eslint');

async function main(){
  const root=path.resolve(__dirname,'../..');
  const eslint=new ESLint({
    cwd:root,
    overrideConfigFile:path.join(__dirname,'eslint.config.cjs')
  });
  const files=[
    'karaoke-room-model.js',
    'karaoke-rhythm.js',
    'karaoke-homol-view.js',
    'karaoke-homol-sync.js',
    'tw-weekly-podium-model.js'
  ];
  const results=await eslint.lintFiles(files);
  const formatter=await eslint.loadFormatter('stylish');
  const output=formatter.format(results);
  if(output)process.stdout.write(output);
  if(results.some(result=>result.errorCount>0))process.exitCode=1;
}

main().catch(error=>{console.error(error);process.exitCode=1;});
