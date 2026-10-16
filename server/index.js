import http from 'node:http'
import crypto from 'node:crypto'
const port=Number(process.env.PORT||3100)
const secret=crypto.randomBytes(32).toString('hex')
const shops=[
{id:101,name:'优骑·市民中心体验店（模拟）',address:'深圳福田市民中心周边',latitude:22.5438,longitude:114.0575,type:'rent',vehicles:18},
{id:102,name:'优骑·莲花山服务点（模拟）',address:'深圳莲花山公园周边',latitude:22.5538,longitude:114.0594,type:'rent',vehicles:9},
{id:103,name:'优骑·购物公园门店（模拟）',address:'深圳购物公园周边',latitude:22.5352,longitude:114.0534,type:'rent',vehicles:12},
{id:104,name:'优骑·会展中心门店（模拟）',address:'深圳会展中心周边',latitude:22.531,longitude:114.0599,type:'rent',vehicles:6},
{id:105,name:'优骑·岗厦换电站（模拟）',address:'深圳岗厦周边',latitude:22.5405,longitude:114.0681,type:'swap',batteries:14},
{id:106,name:'优骑·福田口岸换电站（模拟）',address:'深圳福田口岸周边',latitude:22.5168,longitude:114.065,type:'swap',batteries:8}]
const orders=[],reservations=[]
function token(){const p=Buffer.from(JSON.stringify({sub:'demo-001',exp:Date.now()+86400000})).toString('base64url');return p+'.'+crypto.createHmac('sha256',secret).update(p).digest('base64url')}
function authorized(req){try{const [p,s]=(req.headers.authorization||'').replace(/^Bearer\s+/,'').split('.');if(!p||!s)return false;const expected=crypto.createHmac('sha256',secret).update(p).digest('base64url');return s===expected&&JSON.parse(Buffer.from(p,'base64url').toString()).exp>Date.now()}catch{return false}}
function send(res,code,data){res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Authorization,Content-Type','Access-Control-Allow-Methods':'GET,POST,OPTIONS'});res.end(JSON.stringify(data))}
async function read(req){let s='';for await(const c of req){s+=c;if(s.length>32768)throw Error('请求体过大')}return s?JSON.parse(s):{}}
http.createServer(async(req,res)=>{if(req.method==='OPTIONS')return send(res,204,{})
try{
const url=new URL(req.url,'http://localhost'),p=url.pathname
if(p==='/health')return send(res,200,{ok:true,demo:true})
if(p==='/shops')return send(res,200,{items:shops.filter(x=>!url.searchParams.get('mode')||x.type===url.searchParams.get('mode'))})
if(p==='/products')return send(res,200,{items:[{id:1,name:'骑行体验券（模拟）',price:9.9}]})
if(p==='/auth/demo/login'&&req.method==='POST'){if(process.env.DEMO_AUTH_ENABLED==='false')return send(res,403,{message:'演示模式已关闭'});return send(res,200,{token:token(),user:{id:'demo-001',nickname:'演示用户',demo:true}})}
if(p==='/auth/wechat/login'||p==='/auth/alipay/login')return send(res,501,{message:'真实平台授权后端未配置，请使用演示登录'})
if(!authorized(req))return send(res,401,{message:'请先登录'})
if(p==='/auth/me')return send(res,200,{id:'demo-001',nickname:'演示用户',demo:true})
if(p==='/orders'&&req.method==='GET')return send(res,200,{items:orders})
if(p==='/rentals'&&req.method==='POST'){const data=await read(req);if(!data.vehicleCode)return send(res,400,{message:'请输入车辆编号'});const record={id:crypto.randomUUID(),number:'D'+Date.now(),vehicleCode:data.vehicleCode,status:'demo_created',type:'rental'};orders.push(record);return send(res,201,record)}
if(p==='/reservations'&&req.method==='POST'){const data=await read(req);if(!data.date)return send(res,400,{message:'请选择日期'});const record={id:crypto.randomUUID(),date:data.date,vehicleCode:data.vehicleCode||'',status:'reserved',type:'reservation'};reservations.push(record);orders.push(record);return send(res,201,record)}
return send(res,404,{message:'接口不存在'})
}catch(e){return send(res,400,{message:e.message})}
}).listen(port,'0.0.0.0',()=>console.log('演示服务已启动 http://localhost:'+port))
