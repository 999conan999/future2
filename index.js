const Binance = require('node-binance-api');
const binance = new Binance().options({
  reconnect:true,

});
var RSI = require('technicalindicators').RSI;
const TelegramBot = require('node-telegram-bot-api');
const token = '5095801660:AAGoRAKOPnUrLcSowzAmkgGqjQxmxy8aka8';
const chatId=1497494659;
const bot = new TelegramBot(token, {polling: true});
var firebase = require('firebase');
const firebaseConfig = {
  apiKey: "AIzaSyBsi2kXsDKbPYjt-nHXyG0PyCQ_BcJSzjA",
  authDomain: "datafuture-43b1e.firebaseapp.com",
  databaseURL: "https://datafuture-43b1e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "datafuture-43b1e",
  storageBucket: "datafuture-43b1e.appspot.com",
  messagingSenderId: "634877289231",
  appId: "1:634877289231:web:d9f1824bf30429e10d547a"
};
firebase.initializeApp(firebaseConfig)
let firebaseDB = firebase.database().ref('spot');
////////////////////////***value */
  var status={
    is_trading: true,
    status: 0, 
    quantity_price:0.1,
    lock:true
  }
  var symbol='BNBUSDT'//"ETHUSDT";
  var candle_c=102;
///////////////////////End value
// setup data begin 
firebaseDB.once('value').then((snapshot) => {if (snapshot.exists()) {status=(snapshot.val());} else { console.log("No data available");}}).catch((error) => {console.error(error);});
//*******************/ main()
main();
function main(){
  get_data_socket(symbol);
}
//************End Main */

var first_run=true;
var time_final=0;
var gia_vao_len_truoc=0;
// Nguon cung cap data here
  async function get_data_socket(symbol){
    try{
      // binance.futuresChart(symbol, '1m', (symbol, interval, chart) => {
        binance.websockets.chart(symbol, "1h", (symbol, interval, chart) => {
          let data_close=[]
          Object.keys(chart).forEach(function(key) {
            data_close.push({
              close:chart[key].close,
              time:chart[key].time,
            });
          })
          //
          if(first_run){
            first_run=false;
            time_final=data_close[data_close.length-1].time;
          }
          if(time_final!=data_close[data_close.length-1].time){
            // da dong xong nen 1p
            time_final=data_close[data_close.length-1].time;
            let data_close_phu=[...data_close];data_close_phu.pop();
            let _data_close=[];
            data_close_phu.forEach(e => {
              _data_close.push(e.close);
            });
            // return _data_close (da hoan thanh)
            // **** [todo] *** there is woking here!
            // **************************************
            if(status.is_trading){
              check_rsi_and_run_trade(_data_close);
            }
            //***************************************/
          }
          
      },candle_c); 
    }catch(e){
      console.log('loi tai get_data_socket');
      console.log(e);
    }
  }
  //
  function check_rsi_and_run_trade(_data_close){
    var chan_tren_rsi100=52;
    var chan_duoi_rsi100=41;
    var unlock_rsi14=40;
    var chan_duoi_rsi14=27;
    var remove_nhieu_gia=10;
    let data=bo_render_data_rsi100_rsi14(_data_close);
    if(status.status==0){
      // xet vao lenh buy 1
      if(data[0].rsi100<=chan_duoi_rsi100){
        status.status=1;
        status.lock=true;
        gia_vao_len_truoc=data[0].close;
        buy(symbol,status.quantity_price,data[0].close);
        save_data(status);
      }
    }else{
      // xet rsi100 > chan_tren_rsi100, end thoi
      if(data[0].rsi100>=chan_tren_rsi100){
        sell(symbol);
        status.status=0;
        save_data(status);
      }else{
        // xet vao lenh buy 2 3 4
        if(data[0].rsi14<=chan_duoi_rsi14){
          if(!status.lock){
            if(status.status==1){
              if(gia_vao_len_truoc-data[0].close>=remove_nhieu_gia){
                gia_vao_len_truoc=data[0].close;
                status.status=2;
                buy(symbol,status.quantity_price*2,data[0].close);
                status.lock=true;
                save_data(status);
              }
            }else if(status.status==2){
              if(gia_vao_len_truoc-data[0].close>=remove_nhieu_gia){
                gia_vao_len_truoc=data[0].close;
                status.status=3;
                buy(symbol,status.quantity_price*4,data[0].close);
                status.lock=true;
                save_data(status);
              }
            }
            else if(status.status==3){
              if(gia_vao_len_truoc-data[0].close>=remove_nhieu_gia){
                gia_vao_len_truoc=data[0].close;
                status.status=4;
                buy(symbol,status.quantity_price*8,data[0].close);
                status.lock=true;
                save_data(status);
              }
            }
          }
        }else{
          if(data[0].rsi14>unlock_rsi14){
            status.lock=false;
            save_data(status);
          }
        }
      }
    }

  }
//**************xu ly data voi telegram */
bot.on('message',async (msg) => {
  let tx=msg.text.toUpperCase();
  if(tx=='INFO BOT'){
    get_infor(status)
  }else if(tx=="OFF BOT"){
    off_tooll(status);
    if(status.status>0){
      sell(symbol);
    }
    status.is_trading=false;
    status.status=0;
    status.lock=true;
    save_data(status);
    
  }else if(tx=="ON BOT"){
    on_tooll();
    status.is_trading=true;
    save_data(status);
  }else if(tx=="USDT"){
    back_usdt(true);
  }else if(tx[0]=="*"){
    let message_arr=msg.text.toUpperCase().split("=");
    if(message_arr.length==2){
      let coin=Number(message_arr[1]);
      if(!isNaN(coin)){
        status.quantity_price=coin;
        save_data(status);
        bot.sendMessage(chatId,`???? Setup gi?? v??o l???nh ban ?????u.`);
      }else{
        bot.sendMessage(chatId,`B???n g???i th??ng s??? sai r???i.`);
      }

    }
  }else{
    bot.sendMessage(chatId,`
+ "info bot" => th??ng tin setup.
+ "off bot" => d???ng ho???t ?????ng Bot. tho??t c??c v??? th??? hi???n t???i.
+ "on bot" => cho Bot ho???t ?????ng l???i.
+ "*price=40" => 40 l?? s??? coin c???n setup
`);
  }
})

/////////////////////////// function ho tro
function save_data(data){
  firebaseDB.set(data)
}
// buy spot
async function buy(symbol,money,price_current){
  let quantity=Number((money/price_current).toFixed(4));
  let price=price_current-4;
  let buybuy=binance.buy(symbol, quantity, price);
  // let buybuy=await binance.marketBuy(symbol, quantity);
}
// sell future
async function sell(symbol){
  let quantity= await get_bnb_account();
  // console.log("???? ~ quantity", quantity)
  if(quantity>0){
  //  let sellsell= await binance.futuresMarketSell( symbol, quantity );
  let quantity_fix=Number(quantity.toFixed(4));
  let sellsell=await binance.marketSell(symbol, quantity_fix);
  //  console.log("???? ~ sellsell", sellsell);
   back_usdt();
  }
}
//
async function get_usdt_account(){
  let bnb =await binance.balance();
  return bnb.USDT.available;
}
//
async function get_bnb_account(){

  let bnb =await binance.balance();
  return bnb.BNB.available;
}
//

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
  return data;
}
// tra ve thong so hien tai cua tool
async function get_infor(status){
  let usdt= await get_usdt_account();
  bot.sendMessage(chatId,`
+ ${status.is_trading?'Bot ??ang ho???t ?????ng':'Bot ??ang d???ng'}.
+ Gi?? v??o l???nh ban ?????u : ${status.quantity_price}
+ V??? th??? trade: ${status.status}
+ USDT hi???n c?? l?? :${usdt}
`);
}
// Tat tool
async function off_tooll(status){
  bot.sendMessage(chatId,`
Bot ???? ???????c t???t, tuy nhi??n hi???n + V??? th??? trade l?? : ${status.status}.
B???n n??n v??o binance tho??t h???t v??? th??? m?? tool ???? v??o l???nh l??c tr?????c n???u c??, ????? ?????m b???o an to??n nha!
${status.status==0?'Hi???n t???i kh??ng c?? l???nh n??o c???.':'hi???n t???i ??ang c?? l???nh ????.'}
*** L??u ?? : th??ng th?????ng th?? Bot ???? t??? ?????ng tho??t v??? th??? v?? ????ng c??c l???nh l???i lu??n r???i ???? nh??.
`);
}
// bat tool
async function on_tooll(){
  bot.sendMessage(chatId,`Bot_Spot ???? ???????c b???t.`);
}
//
async function back_usdt(is_bot){
  let usdt= await get_usdt_account(); 
  let usdt_fix=Number(usdt).toFixed(3);
  bot.sendMessage(chatId,`usdt ${is_bot?'(check)':'(Bot)'} : ${usdt_fix}$`);
}

// tesst
// setTimeout(async ()=>{
//   // get_bnb_account()
//   console.log("???? ~ file: index.js ~ line 280 ~ setTimeout ~ get_bnb_account()",await get_bnb_account())
// },2000)