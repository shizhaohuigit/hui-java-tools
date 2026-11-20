import {parse, stringify, isLosslessNumber} from 'lossless-json';
import {CronExpressionParser} from 'cron-parser';
import {DateTime} from 'luxon';
export function formatJson(text,indent=2,sort=false){
 if(!text.trim()) throw new Error('请先输入 JSON。');
 if(text.length>2_000_000) throw new Error('请输入小于 2 MB 的 JSON。');
 const value=parse(text);
 const order=x=>{if(Array.isArray(x))return x.map(order);if(x&&typeof x==='object'&&!isLosslessNumber(x)){const out=Object.create(null);Object.keys(x).sort().forEach(k=>out[k]=order(x[k]));return out;}return x;};
 return stringify(sort?order(value):value,null,indent);
}
export function timestampToDate(input,unit,zone){
 if(!/^-?\d+$/.test(input.trim()))throw new Error('时间戳需为整数，支持负数。');
 const n=Number(input); if(!Number.isSafeInteger(n))throw new Error('时间戳超出安全整数范围。');
 const ms=unit==='s'?n*1000:n;
 const dt=DateTime.fromMillis(ms,{zone});
 if(!dt.isValid)throw new Error('无效时间戳或超出日期范围。');
 return {seconds:Math.floor(ms/1000),milliseconds:ms,local:dt.toFormat('yyyy-MM-dd HH:mm:ss.SSS'),iso:dt.toISO(),utc:dt.toUTC().toISO()};
}
export function dateToTimestamp(input,zone){
 const normalized=input.trim().replace(' ','T');
 if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?$/.test(normalized))throw new Error('请输入 YYYY-MM-DD HH:mm:ss 格式的日期。');
 const dt=DateTime.fromISO(normalized,{zone});
 if(!dt.isValid||dt.toFormat("yyyy-MM-dd'T'HH:mm")!==normalized.slice(0,16))throw new Error('日期不存在或位于夏令时跳过的时段。');
 if(dt.getPossibleOffsets().length>1)throw new Error('此时间位于夏令时重复时段，请换用 UTC 明确时间。');
 return timestampToDate(String(dt.toMillis()),'ms',zone);
}
export function cronNext(expression,mode,zone,from=new Date(),count=10){
 let fields=expression.trim().split(/\s+/);const expected=mode==='unix'?5:6;
 if(fields.length!==expected)throw new Error(`${mode==='unix'?'Unix':'Spring'} 模式需要 ${expected} 个字段，当前为 ${fields.length} 个。`);
 if(mode==='unix')fields.unshift('0');
 if(fields.some(f=>/[WH]/i.test(f.replace(/WED/gi,''))))throw new Error('当前版本不支持 W（最近工作日）和 H（散列），请使用具体日期或星期。');
 if(fields[3].includes('L-'))throw new Error('当前版本不支持 L-n，请使用具体日期。');
 if(fields.some((f,i)=>f.includes('?')&&(![3,5].includes(i)||f!=='?')))throw new Error('? 仅可单独用于日或星期字段。');
 if(mode==='unix'&&fields.some(f=>/[?L#]/i.test(f)))throw new Error('Unix 模式仅支持数字、名称、*、,、-、/；L、#、? 请使用 Spring 模式。');
 if(mode==='spring'&&!['*','?'].includes(fields[3])&&!['*','?'].includes(fields[5]))throw new Error('日和星期同时限制的交集语法暂不支持，请将其中一个设为 * 或 ?。');
 const cron=CronExpressionParser.parse(fields.join(' '),{tz:zone,currentDate:from});
 const dates=[];for(let i=0;i<count;i++)dates.push(DateTime.fromJSDate(cron.next().toDate(),{zone}).toFormat('yyyy-MM-dd HH:mm:ss ZZZZ'));
 return {dates,fields};
}
