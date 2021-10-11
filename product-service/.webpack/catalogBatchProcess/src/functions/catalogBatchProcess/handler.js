(()=>{"use strict";var e={963:(e,t,o)=>{(0,o(334).config)()},249:(e,t,o)=>{o.d(t,{w:()=>a});const{PG_HOST:r,PG_PORT:s,PG_DBNAME:c,PG_USERNAME:i,PG_PASSWORD:n}=process.env,a={host:r,port:s,database:c,user:i,password:n,ssl:{rejectUnauthorized:!1},connectionTimeoutMillis:5e3}},782:(e,t,o)=>{o.d(t,{L:()=>r});const r=(e,t)=>({statusCode:e,headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Credentials":!0},body:JSON.stringify(t)})},444:(e,t,o)=>{o.d(t,{z:()=>n});var r=o(806),s=o.n(r),c=o(657),i=o.n(c);const n=e=>s()(e).use(i()())},745:(e,t,o)=>{o.d(t,{Ag:()=>r,nM:()=>s,dN:()=>c}),o(963);const r=o(33).Ag,s=o(33).nM,c=o(33).dN},33:(e,t,o)=>{o.d(t,{Ag:()=>r,dN:()=>s,nM:()=>c}),console.log("product-service imported");const r=async(e,t)=>{const{rows:o}=await e.query("SELECT * FROM public.products WHERE title = $1",[t]);return o.length?o[0]:null},s=async(e,t)=>{const{title:o,description:r,price:s,count:c}=t;try{await e.query("BEGIN");const t="INSERT INTO public.products(title, description, price) VALUES($1, $2, $3) RETURNING id",i=await e.query(t,[o,r,s]),n="INSERT INTO public.stocks(product_id, count) VALUES ($1, $2)",a=[i.rows[0].id,c];return await e.query(n,a),await e.query("COMMIT"),i.rows[0].id}catch(t){return await e.query("ROLLBACK"),"0"}},c=async(e,t,o)=>{const{title:r,description:s,price:c,count:i}=t;try{await e.query("BEGIN");const t="UPDATE public.products SET title = $1, description = $2, price = $3 WHERE id = $4";await e.query(t,[r,s,c,o]);const n="UPDATE public.stocks SET count = $1 WHERE product_id = $2",a=[i,o];return await e.query(n,a),await e.query("COMMIT"),o}catch(t){return await e.query("ROLLBACK"),"0"}}},806:e=>{e.exports=require("@middy/core")},657:e=>{e.exports=require("@middy/http-json-body-parser")},480:e=>{e.exports=require("aws-sdk")},334:e=>{e.exports=require("dotenv")},723:e=>{e.exports=require("pg")},43:e=>{e.exports=require("source-map-support/register")}},t={};function o(r){var s=t[r];if(void 0!==s)return s.exports;var c=t[r]={exports:{}};return e[r](c,c.exports,o),c.exports}o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var r={};(()=>{o.r(r),o.d(r,{main:()=>u}),o(43);var e=o(723),t=o(782),s=o(444),c=o(480),i=o.n(c),n=o(249),a=o(745);const u=(0,s.z)((async o=>{console.log("catalogBatchProcess lambda launched"),console.log(o);const r={region:"eu-west-1"};try{i().config.update(r);const s=new(i().SNS),c=o.Records.map((({body:e})=>JSON.parse(e)));let u;o.Records.forEach((e=>{console.log("messageAttributes",e.messageAttributes)})),u=new e.Client(n.w),await u.connect();for(const e of c){console.log("product",e);const{title:t}=e,o=await(0,a.Ag)(u,t);console.log("check product from repository with title: "+t+", result = ",o),o?(console.log("update product by id",o.id),await(0,a.nM)(u,e,o.id)):(console.log("insert new product",e),await(0,a.dN)(u,e));const r={Subject:"Products import finished",Message:JSON.stringify(e),TopicArn:process.env.SNS_ARN};s.publish(r,(t=>{t?console.log("Error",t):console.log("Send product to SNS queue",e)}))}return(0,t.L)(200,{message:"Products import finished"})}catch(e){return console.log("Failed to import products",e),(0,t.L)(500,{message:"Failed to import products"})}}))})();var s=exports;for(var c in r)s[c]=r[c];r.__esModule&&Object.defineProperty(s,"__esModule",{value:!0})})();
//# sourceMappingURL=handler.js.map