//***************bang nang cap xu ly trader pro */
const Binance = require('node-binance-api');
const binance = new Binance().options({reconnect:true});
var RSI = require('technicalindicators').RSI;
var _ = require('lodash');
////////////////////////////////////////
var symbol='C98USDT'//"ETHUSDT";
var candle_c=999;
var status={
  is_trading: true,
  status: 0, 
  quatity_coin:1,
  lock:true
}
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
          data_close.push(chart[key].close);
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
 var chan_tren_rsi100=52;
 var chan_duoi_rsi100=43;
 var unlock_rsi14=40;
 var chan_duoi_rsi14=27;
 var so_luong_coin_mua_ban_dau=50;
 xu_ly_voi_data(data_cl,chan_tren_rsi100,chan_duoi_rsi100,unlock_rsi14,chan_duoi_rsi14,so_luong_coin_mua_ban_dau)
  
},3000)

// BO XU LY thong minh hoc thuat

function xu_ly_voi_data(data_cl,chan_tren_rsi100,chan_duoi_rsi100,unlock_rsi14,chan_duoi_rsi14,so_luong_coin_mua_ban_dau){
  let data=bo_render_data_rsi100_rsi14(data_cl);

  data.forEach(e => {
    if(status.status==0){
      // xet vao lenh buy 1
      if(e.rsi100<=chan_duoi_rsi100){
        // [todo] 
        //status.lock=true
        console.log('BUY 1 : ', status.quatity_coin);
        console.log('o gia : ', e.close);
        console.log('---------------------- ');
        status.status=1;
        status.lock=true
      }
    }else{ 
      // xet rsi100 > chan_tren_rsi100, end thoi
      if(e.rsi100>=chan_tren_rsi100){
        console.log('SELL all  ');
        console.log('o gia : ', e.close);
        console.log('---------------------- ');
        status.status=0;
      }else{
        // xet vao lenh buy 2 3 4
        if(e.rsi14<=chan_duoi_rsi14){
          if(!status.lock){
            if(status.status==1){
              console.log('BUY 2 : ', status.quatity_coin*2);
              console.log('o gia : ', e.close);
              console.log('---------------------- ');
              status.status=2;
            }else if(status.status==2){
              console.log('BUY 3 : ', status.quatity_coin*4);
              console.log('o gia : ', e.close);
              console.log('---------------------- ');
              status.status=3;
            }
            else if(status.status==3){
              console.log('BUY 4 : ', status.quatity_coin*8);
              console.log('o gia : ', e.close);
              console.log('---------------------- ');
              status.status=4;
            }
            status.lock=true;
          }
        }else{
          if(e.rsi14>unlock_rsi14){
            status.lock=false;
          }
        }
      }
    }
  });
//   //return loi_nhuan;
}
// BO TAO DATA  
 function bo_render_data_rsi100_rsi14(data_cl){
  let rsi100=RSI.calculate({values:data_cl,period : 100});
  let rsi14=RSI.calculate({values:data_cl,period : 14});
  let data=[];
  rsi100.forEach((e,i) => {
    data.push({
      rsi100:e,
      rsi14:rsi14[i+86],
      close:data_cl[i+100]
    })
  });
  return data
}

