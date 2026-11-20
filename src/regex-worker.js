self.onmessage=({data:{pattern,flags,text,replacement}})=>{
 try{
 const regex=new RegExp(pattern,flags);const rows=[];let match;
 while((match=regex.exec(text))!==null){
 rows.push({text:match[0],index:match.index,groups:match.slice(1).map(v=>v??null),named:match.groups??null});
 if(rows.length>=1000||!regex.global)break;
 if(match[0]===''){const cp=text.codePointAt(regex.lastIndex);regex.lastIndex+=(regex.unicode&&cp>0xffff)?2:1;}
 }
 const replaced=text.replace(new RegExp(pattern,flags),replacement);
 self.postMessage({rows,replaced,truncated:rows.length>=1000});
 }catch(e){self.postMessage({error:e.message});}
};
