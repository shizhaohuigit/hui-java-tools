import {build} from 'esbuild';
await build({entryPoints:['src/app.js','src/regex-worker.js'],bundle:true,outdir:'dist',format:'esm',minify:true,target:'es2022',legalComments:'linked'});
