export const uid=()=>Math.random().toString(36).slice(2,9);
export const P=s=>{if(!s)return null;const d=new Date(s+"T00:00:00");return isNaN(d)?null:d;};
export const F=d=>d?d.toISOString().split("T")[0]:"";
export const AD=(d,n)=>new Date(d.getTime()+n*864e5);
export const FM=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
export const FL=m=>{const[y,mo]=m.split("-");return["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+mo-1]+" '"+y.slice(2);};
export const GM=(s,e)=>{if(!s||!e)return[];const r=[];let d=new Date(s.getFullYear(),s.getMonth(),1);while(d<=e){r.push(FM(d));d=new Date(d.getFullYear(),d.getMonth()+1,1);}return r;};
export const $=v=>"$"+Number(v||0).toLocaleString(undefined,{maximumFractionDigits:0});
export const PCT=v=>(v||0).toFixed(1)+"%";

export function parseCSV(text){const lines=text.trim().split(/\r?\n/);const dl=lines[0]?.includes("\t")?"\t":",";return lines.map(l=>{const r=[];let q=false,c="";for(let i=0;i<l.length;i++){const ch=l[i];if(ch==='"')q=!q;else if(ch===dl&&!q){r.push(c.trim());c="";}else c+=ch;}r.push(c.trim());return r;});}
export const normS=h=>{const l=h.toLowerCase().replace(/[^a-z0-9]/g,"");if(["taskname","task","name","description","activity"].includes(l))return"desc";if(["start","startdate","begin"].includes(l))return"sd";if(["finish","end","enddate","finishdate"].includes(l))return"ed";return l;};
export const normB=h=>{const l=h.toLowerCase().replace(/[^a-z0-9]/g,"");if(["code","itemcode","no"].includes(l))return"code";if(["description","desc","item","name"].includes(l))return"desc";if(["unit","uom"].includes(l))return"unit";if(["qty","quantity","totalqty","amount"].includes(l))return"qty";if(["rate","unitrate","price","cost"].includes(l))return"rate";return l;};
export function mapCSV(rows,norm){if(rows.length<2)return[];const h=rows[0].map(norm);return rows.slice(1).filter(r=>r.some(c=>c?.trim())).map(r=>{const o={};h.forEach((k,i)=>{o[k]=r[i]||"";});return o;});}

export function calcStats(p){
  const ds=p.li.map(l=>P(l.sd)).filter(Boolean);
  const de=p.li.map(l=>P(l.ed)).filter(Boolean);
  const pS=ds.length?new Date(Math.min(...ds)):new Date();
  const pE=de.length?new Date(Math.max(...de)):AD(new Date(),365);
  const am=GM(pS,pE);
  let tpv=0,tev=0,el=0,fu=0;
  p.sli.forEach(s=>{const t=p.ti.find(x=>x.id===s.tiId);const r=t?.rate||0;tpv+=s.alloc*r;let ta=0;p.act.forEach(a=>{if(a.slId===s.id)ta+=a.qty;});tev+=ta*r;am.forEach(m=>{let aq=0;p.act.forEach(a=>{if(a.slId===s.id&&a.mo===m)aq+=a.qty;});if(p.lm[m])el+=aq*r;else fu+=aq*r;});});
  return{pS,pE,am,tpv,tev,el,fu,op:tpv>0?(tev/tpv)*100:0};
}

export function mkSample(name,mgr,off,sc){
  const b=new Date(2026,3+off,1);
  const li=[{id:uid(),rn:1,desc:"Foundation Works",sd:F(b),ed:F(AD(b,120))},{id:uid(),rn:2,desc:"Structural Steel",sd:F(AD(b,60)),ed:F(AD(b,240))},{id:uid(),rn:3,desc:"MEP Rough-In",sd:F(AD(b,150)),ed:F(AD(b,330))}];
  const ti=[{id:uid(),code:"T-001",desc:"Concrete Supply",unit:"m³",qty:Math.round(2400*sc),rate:185},{id:uid(),code:"T-002",desc:"Steel Erection",unit:"ton",qty:Math.round(580*sc),rate:2100},{id:uid(),code:"T-003",desc:"Mechanical Piping",unit:"m",qty:Math.round(3200*sc),rate:95}];
  const sli=ti.map((t,i)=>({id:uid(),liId:li[i].id,tiId:t.id,alloc:t.qty}));
  const months=GM(P(li[0].sd),P(li[2].ed));const act=[];
  sli.forEach((s,si)=>{const t=ti[si];const pm=Math.round(t.qty/6);months.slice(si*2,si*2+3).forEach(m=>{act.push({id:uid(),slId:s.id,mo:m,qty:Math.round(pm*(0.5+Math.random()*0.5))});});});
  const lm={};months.slice(0,3).forEach(m=>{lm[m]=true;});
  return{id:uid(),name,mgr,li,ti,sli,act,lm};
}

export const USERS=[
  {id:"a1",name:"Sarah Admin",role:"admin",email:"sarah@navacon.com",pw:"admin123"},
  {id:"p1",name:"John Smith",role:"pm",email:"john@navacon.com",pw:"john123"},
  {id:"p2",name:"Lisa Chen",role:"pm",email:"lisa@navacon.com",pw:"lisa123"},
  {id:"p3",name:"Ahmed Khan",role:"pm",email:"ahmed@navacon.com",pw:"ahmed123"},
];