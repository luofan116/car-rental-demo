// 全部为演示用虚构门店，坐标仅用于地图演示，不代表真实营业场所。
export const demoShops = [
  {id:101,name:'优骑·市民中心体验店（模拟）',address:'深圳市福田区市民中心周边（演示位置）',latitude:22.5438,longitude:114.0575,type:'rent',vehicles:18,status:'open'},
  {id:102,name:'优骑·莲花山服务点（模拟）',address:'深圳市福田区莲花山公园周边（演示位置）',latitude:22.5538,longitude:114.0594,type:'rent',vehicles:9,status:'open'},
  {id:103,name:'优骑·购物公园门店（模拟）',address:'深圳市福田区购物公园周边（演示位置）',latitude:22.5352,longitude:114.0534,type:'rent',vehicles:12,status:'open'},
  {id:104,name:'优骑·会展中心门店（模拟）',address:'深圳市福田区会展中心周边（演示位置）',latitude:22.5310,longitude:114.0599,type:'rent',vehicles:6,status:'open'},
  {id:105,name:'优骑·岗厦换电站（模拟）',address:'深圳市福田区岗厦周边（演示位置）',latitude:22.5405,longitude:114.0681,type:'swap',batteries:14,status:'open'},
  {id:106,name:'优骑·福田口岸换电站（模拟）',address:'深圳市福田区福田口岸周边（演示位置）',latitude:22.5168,longitude:114.0650,type:'swap',batteries:8,status:'open'},
]
export function getDemoShops(mode){return demoShops.filter(s=>!mode||s.type===mode)}
export function mapShopMarkers(items){
  return items.map((s,i)=>({
    id: Number(s.id)||i+1,
    latitude:Number(s.latitude),longitude:Number(s.longitude),
    width:30,height:30,title:s.name,
    callout:{content:s.name,display:'BYCLICK',padding:8,borderRadius:6,bgColor:'#ffffff',color:'#23365b',fontSize:12},
  }))
}
