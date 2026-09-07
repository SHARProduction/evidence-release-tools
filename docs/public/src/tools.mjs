export const evaluators={
  'evidence-package-manifest-builder': i=>{const rows=[...(i.files||[])].map(x=>({path:String(x.path),sha256:String(x.sha256),bytes:Number(x.bytes)})).sort((a,b)=>a.path.localeCompare(b.path)),valid=rows.length>0&&rows.every(x=>/^[a-f0-9]{64}$/.test(x.sha256)&&x.bytes>=0);return{valid,files:rows,totalBytes:rows.reduce((s,x)=>s+x.bytes,0),manifestId:rows.map(x=>x.sha256).join('').slice(0,16)}},
  'public-release-readiness-gate': i=>{const req=i.required||[],g=i.gates||{},rows=req.map(name=>({name,passed:g[name]===true})),missing=rows.filter(x=>!x.passed).map(x=>x.name);return{valid:req.length>0&&!missing.length,decision:missing.length?'HOLD':'RELEASE',rows,missing}}
};
export function evaluate(slug,input){const fn=evaluators[slug];if(!fn)throw new Error('Unknown tool');return fn(input)}
