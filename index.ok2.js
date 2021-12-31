//***************bang nang cap xu ly trader pro */
const Binance = require('node-binance-api');
const binance = new Binance().options({reconnect:true});
var RSI = require('technicalindicators').RSI;
var _ = require('lodash');
////////////////////////////////////////
var symbol='BNBUSDT'//"ETHUSDT";
var candle_c=999;

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
 var chan_duoi_rsi100=40;
 var unlock_rsi14=40;
 var chan_duoi_rsi14=27;
 var so_luong_coin_mua_ban_dau=0.3;
 xu_ly_voi_data(data_cl,chan_tren_rsi100,chan_duoi_rsi100,unlock_rsi14,chan_duoi_rsi14,so_luong_coin_mua_ban_dau)
  
},5000)

// BO XU LY thong minh hoc thuat

function xu_ly_voi_data(data_cl,chan_tren_rsi100,chan_duoi_rsi100,unlock,chan_duoi_rsi14,so_luong_coin_mua_ban_dau){
  let data=bo_render_data_rsi100_rsi14(data_cl);
  let status={
     type:0,//0 // 1 // 2 // 3 // 4
     price:[]
  };
  let loi_nhuan=0;
  let lock=true;
  let muc_chiu_dung_price=0;
  let price_ss=0;
 var remove_nhieu_gia=3;

  data.forEach(e => {
    // tinh toan muc chiu dung
      if(e.close<muc_chiu_dung_price) muc_chiu_dung_price=e.close;
    //
    if(status.type==0){
      // quet rsi100 de vao len dau tien

      if(e.rsi100<=chan_duoi_rsi100){
        let price=status.price;
        price.push(e.close);
        muc_chiu_dung_price=e.close;
        status={
          type:1,
          price:price
        }
        console.log('Buy 1 : ',e.close);
         lock=true;
      }
    }else{
      // xet rsi100 > chan_tren_rsi100, end thoi
      if(e.rsi100>=chan_tren_rsi100){
        // tinh loi nhuan o day
        if(status.type!=0){
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
          console.log('Muc gong lo la  : ',muc_chiu_dung_result.toFixed(2));
          console.log("🚀 " + symbol+' : ___ ', loi_nhuan_lim)
          console.log('================');
          console.log('================');
          status={
            type:0,//none // buy1 // buy2 // buy3
            price:[]
          };
          muc_chiu_dung_price=0;
        }
      }else{
        // quet rsi4 de vao cac lenh tiep theo
        if(e.rsi14<=chan_duoi_rsi14){
          if(!lock){
            if(status.type==1){
              if(price_ss-e.close>remove_nhieu_gia){
                price_ss=e.close;
                let price=status.price;
                price.push(e.close);
                status={
                  type:2,
                  price:price
                }
                console.log('Buy 2 : ',e.close);
                lock=true;
              }
            }else if(status.type==2){
              if(price_ss-e.close>remove_nhieu_gia){
                price_ss=e.close;
                let price=status.price;
                price.push(e.close);
                status={
                  type:3,
                  price:price
                }
                console.log('Buy 3 : ',e.close);
                lock=true;
              }
            }
            else if(status.type==3){
              if(price_ss-e.close>remove_nhieu_gia){
                price_ss=e.close;
                let price=status.price;
                price.push(e.close);
                status={
                  type:4,
                  price:price
                }
                console.log('Buy 4 : ',e.close);
                lock=true;
              }
            }
            
          }
        }else{
          if(e.rsi14>unlock){
            lock=false;
          }
        }
      }

    }
  });
  console.log("🚀 ===>>> Tong loi nhuan la: ", loi_nhuan.toFixed(2))
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

