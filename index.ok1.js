const Binance = require('node-binance-api');
const binance = new Binance().options({reconnect:true});
var RSI = require('technicalindicators').RSI;
var _ = require('lodash');
////////////////////////////////////////
var symbol='BNBUSDT'//"ETHUSDT";
var candle_c=16;

/////////////////


///////////////////////////////////////
var data_close=[];
// Nguon cung cap data here
get_data_socket(symbol)
async function get_data_socket(symbol){
  try{
    binance.futuresChart(symbol, '1m', (symbol, interval, chart) => {
       
        data_close=[]
        Object.keys(chart).forEach(function(key) {
          data_close.push(chart[key].open);
        })
        data_close.pop();

        //
    },candle_c); 
  }catch(e){
    console.log(e)
  }
}



// // //
setTimeout(()=>{
 let data_cl=[...data_close];
//  var rsi=100;
//  var chan_tren=54;
//  var chan_duoi=44;
//  var unlock=45;
//  var so_luong_coin_mua_ban_dau=3;
//  xu_ly_voi_data(rsi,chan_tren,chan_duoi,unlock,so_luong_coin_mua_ban_dau,data_cl)
  let rsi14= bo_render_data(14,data_cl)
  console.log("🚀 ~ file: index.ok1.js ~ line 45 ~ setTimeout ~ rsi14", rsi14)
},5000)

// BO XU LY thong minh hoc thuat
//  function bo_xu_ly(rsi_from,rsi_to,so_luong_coin_mua,chan_tren_from,chan_tren_to,chan_duoi_from,chan_duoi_to,data_cl){


// }
function xu_ly_voi_data(rsi,chan_tren,chan_duoi,unlock,so_luong_coin_mua_ban_dau,data_cl){
  let data=bo_render_data(rsi,data_cl);
  let status={
     type:'none',//none // buy1 // buy2 // buy3
     price:[]
  };
  let loi_nhuan=0;
  let lock=false;
  let muc_chiu_dung_price=0;
//
  data.forEach(e => {
    // tinh toan muc chiu dung
    if(status.type!='none'){
      if(e.close<muc_chiu_dung_price) muc_chiu_dung_price=e.close;
    }
    //
    if(e.rsi<chan_duoi){
      if(!lock){
        if(status.type=="none"){
          let price=status.price;
          price.push(e.close);
          muc_chiu_dung_price=e.close;
          status={
            type:'buy1',
            price:price
          }
          console.log('Buy 1 : ',e.close);
        }else if(status.type=="buy1"){
          let price=status.price;
          price.push(e.close)
          status={
            type:'buy2',
            price:price
          }
          console.log('Buy 2 : ',e.close);
        }else if(status.type=="buy2"){
          let price=status.price;
          price.push(e.close)
          status={
            type:'buy3',
            price:price
          }
          console.log('Buy 3 : ',e.close);
        }
        // else if(status.type=="buy3"){
        //   let price=status.price;
        //   price.push(e.close)
        //   status={
        //     type:'buy4',
        //     price:price
        //   }
        //   console.log('Buy 4 : ',e.close);
        // }
        lock=true;
      }
      
    }else{
      if(e.rsi>unlock){
        lock=false;
      }
      if(e.rsi>chan_tren){
        lock=false;
        // tinh toan gia loi nhuan
        if(status.type!='none'){
          let i=0;
          let he_so=[1,2,4,8,16,32,64]
          let current_price=e.close;
          let loi_nhuan_lim=0;
          let muc_chiu_dung_result=0;
          status.price.forEach(price => {
            loi_nhuan_lim+=(current_price-price)*so_luong_coin_mua_ban_dau*he_so[i];
            muc_chiu_dung_result+=(muc_chiu_dung_price-price)*so_luong_coin_mua_ban_dau*he_so[i];
            i++;
          });
          loi_nhuan+=loi_nhuan_lim;
          console.log('Chot loi  : ',e.close);
          console.log('Muc gong lo la  : ',muc_chiu_dung_result);
          console.log("🚀 " + symbol+' : ___ ', loi_nhuan_lim)
          console.log('================');
          console.log('================');
          status={
            type:'none',//none // buy1 // buy2 // buy3
            price:[]
          };
          muc_chiu_dung_price=0;
        }
      }
    }
  });
  console.log("🚀 ===>>> Tong loi nhuan la: ", loi_nhuan)
  //return loi_nhuan;
}
// BO TAO DATA  
 function bo_render_data(rsi,data_cl){
  //  let data=[...data_close]
  let result_rsi=RSI.calculate({values:data_cl,period : rsi});
  let data=[];
  result_rsi.forEach((e,i) => {
    data.push({
      rsi:e,
      close:data_cl[i+rsi]
    })
  });
  return data
}

