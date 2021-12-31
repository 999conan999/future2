const Binance = require('node-binance-api');
const binance = new Binance().options({reconnect:true});
var RSI = require('technicalindicators').RSI;
const TelegramBot = require('node-telegram-bot-api');
const token = '2117499364:AAF0rSayZUp4pU3w5z2j0tY5_tCRN6CbnXM';
const chatId=1497494659;
const bot = new TelegramBot(token, {polling: true});
var rsi_set=43;
var so_sanh='<';

var data=[];

//t.me/News_signal_bot

var data_all=[];
////////////////////////////////
// down
// const time="1w"
const time="15m"
////////////////////////////////
////////////////////////////////
const api = require('kucoin-node-api');
var firebase = require('firebase')
api.init({
  environment: 'live'
})
const firebaseConfig = {
  apiKey: "AIzaSyBuI8FyKsLnP1A35BmKttD4W-5-hZnUbZM",
  authDomain: "data-kucoin.firebaseapp.com",
  databaseURL: "https://data-kucoin-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "data-kucoin",
  storageBucket: "data-kucoin.appspot.com",
  messagingSenderId: "509969784439",
  appId: "1:509969784439:web:65f99a79ed57a3a9dbf072"
};
firebase.initializeApp(firebaseConfig)
let firebaseDB = firebase.database().ref('data');
let day_update_ku=0;
//////////////////////////////
main();
// data_set();
async function main(){
  try{
    let symbols=await get_symbols();
    bot.sendMessage(chatId, `Các lệnh có thể hỗ trợ : 
checksocket;
n ; 
t ;
Rsi < 43 ;
btc ;
* 100 d < 34`);
    let list_symbol=symbols;
    get_data_socket(list_symbol);
  }catch(e){
    console.log("loi main()")
    console.log(e)
  }
}
// khoi tao socket lay data
//
async function get_data_socket(list_symbol){

  try{
    binance.futuresChart(list_symbol, time, (symbol, interval, chart) => {
      try{
        let array_data=[];
        Object.keys(chart).forEach(function(key) {
          array_data.push(chart[key].close);
        })
        array_data.pop();
        //
        data_all[symbol]={
          list_close:array_data,
        };
        ///
      }catch(e){
        console.log('loi data trong socket 15m')
      }
    },500);
    setTimeout(()=>{
      binance.futuresChart(list_symbol,'1d', (symbol, interval, chart) => {
        try{
        let array_data=[];
        Object.keys(chart).forEach(function(key) {
          array_data.push(chart[key].close);
        })
        // array_data.pop();
        //
        data[symbol]={
          list_close:array_data,
        };
        ///
        }catch(e){
          console.log('loi data trong socket ngay')
        }
      },500);
  },5000)
  }catch(e){
    console.log(e)
  }

}

// Bot telegram here
try{
bot.on('message',async (msg) => {

  let tx=msg.text.toUpperCase();
  if(tx=='CHECKSOCKET'){
    if(check_socket_run()==true){
      bot.sendMessage(chatId,'Socket đang chạy!')
    } else{
      bot.sendMessage(chatId,'Có lỗi đang xảy ra và socket đang dừng, chờ tí nhá, tôi sẽ kết nối lại ngay lập tức.');
      main();
    }
  }else if(tx[0]=="?"){ // ? 10.3 8.3 4.3 400
    let message_arr=msg.text.toUpperCase().split(" ");
    if(message_arr.length==5){
try{
      let p_start=Number(message_arr[1]);
      let p_end=Number(message_arr[2]);
      let p_out=Number(message_arr[3]);
      let v=Number(message_arr[4]);
      let he_so=message_arr[1].length-(message_arr[1].indexOf('.')+1);
      let a=((p_start-p_end)/12).toFixed(he_so);
      let n=(v*0.95/(972*a+376*(p_end-p_out))).toFixed(he_so);
      let t_sl=(376*n).toFixed(he_so);
//
bot.sendMessage(chatId,`
Vốn của bạn là ${v}$ , vùng giá mà bạn sẽ đầu tư ${p_start}$ đến ${p_end}$, và có thể gồng lỗ đến vùng giá ${p_out} thì:
========================
Số lượng Full-slot: ${t_sl} 
+💱 đạt 50% slot, và giá hồi về điểm giá bắt đầu(${p_start}$) thì bạn lời :${(74*a*n).toFixed(he_so)}$
+💰 đạt 100% slot, và giá hồi về điểm giá bắt đầu(${p_start}$) thì bạn lời :${(960*a*n).toFixed(he_so)}$
*❗❗ Bạn có thể mất ${v}$ nếu giá chạm stoploss;
=======1️⃣ vòng 1 =======
+💲  Mua tại điểm giá : ${(p_start-a*0).toFixed(he_so)}$
+💢 Với số lượng : ${(n*1).toFixed(1)}
+⚠️ Nhớ cài stoploss tại ${p_out}$ 
=======2️⃣ vòng 2 =======
+💲  Mua tại điểm giá : ${(p_start-a*1).toFixed(he_so)}$
+💢 Với số lượng : ${(n*1).toFixed(1)}
+⚠️ Nhớ cài stoploss tại ${p_out}$ 
=======3️⃣ vòng 3 =======
+💲  Mua tại điểm giá : ${(p_start-a*2).toFixed(he_so)}$
+💢 Với số lượng : ${(n*2).toFixed(1)}
+⚠️ Nhớ cài stoploss tại ${p_out}$ 
=======4️⃣ vòng 4 =======
+💲  Mua tại điểm giá : ${(p_start-a*3).toFixed(he_so)}$
+💢 Với số lượng : ${(n*3).toFixed(1)}
+⚠️ Nhớ cài stoploss tại ${p_out}$ 
=======5️⃣ vòng 5 =======
+💲  Mua tại điểm giá : ${(p_start-a*4).toFixed(he_so)}$
+💢 Với số lượng : ${(n*5).toFixed(1)}
+⚠️ Nhớ cài stoploss tại ${p_out}$ 
=======6️⃣ vòng 6 =======
+💲  Mua tại điểm giá : ${(p_start-a*5).toFixed(he_so)}$
+💢 Với số lượng : ${(n*8).toFixed(1)}
+⚠️ Nhớ cài stoploss tại ${p_out}$ 
=======7️⃣ vòng 7 =======
+💲  Mua tại điểm giá : ${(p_start-a*6).toFixed(he_so)}$
+💢 Với số lượng : ${(n*13).toFixed(1)}
+⚠️ Nhớ cài stoploss tại ${p_out}$ 
=======8️⃣ vòng 8 =======
+💲  Mua tại điểm giá : ${(p_start-a*7).toFixed(he_so)}$
+💢 Với số lượng : ${(n*21).toFixed(1)}
+⚠️ Nhớ cài stoploss tại ${p_out}$ 
=======9️⃣ vòng 9 =======
+💲  Mua tại điểm giá : ${(p_start-a*8).toFixed(he_so)}$
+💢 Với số lượng : ${(n*34).toFixed(1)}
+⚠️ Nhớ cài stoploss tại ${p_out}$ 
=======🔟 vòng 10 =======
+💲  Mua tại điểm giá : ${(p_start-a*9).toFixed(he_so)}$
+💢 Với số lượng : ${(n*55).toFixed(1)}
+⚠️ Nhớ cài stoploss tại ${p_out}$ 
=======1️⃣1️⃣ vòng 11 =======
+💲  Mua tại điểm giá : ${(p_start-a*10).toFixed(he_so)}$
+💢 Với số lượng : ${(n*89).toFixed(1)}
+⚠️ Nhớ cài stoploss tại ${p_out}$ 
=======1️⃣2️⃣ vòng 12 =======
+💲  Mua tại điểm giá : ${(p_start-a*11).toFixed(he_so)}$
+💢 Với số lượng : ${(n*144).toFixed(1)}
+⚠️ Nhớ cài stoploss tại ${p_out}$ 
============================
`);
//
}catch(e){
  console.log("🚀 ~ file: index.js ~ line 190 ~ bot.on ~ e", e)
  bot.sendMessage(chatId,`Cú pháp của bạn không chính xác : 
  [?__điểm khởi đầu d.start __ điểm kết thúc d.end __ điểm cắt lỗ _ số vốn ]`); 
}
    }else if(message_arr.length==4){ // ? 10.3 8.3 400
try{
      let p_start=Number(message_arr[1]);
      let p_end=Number(message_arr[2]);
      let v=Number(message_arr[3]);
      let he_so=message_arr[1].length-(message_arr[1].indexOf('.')+1);
      let a=((p_start-p_end)/12).toFixed(he_so);
      let n=(v/376).toFixed(1);
      //
bot.sendMessage(chatId,`
Vốn của bạn là ${v}$ , vùng giá mà bạn sẽ đầu tư ${p_start}$ đến ${p_end}$ thì:
========================
Số lượng Full-slot: ${(1*n/(p_start-a*0)+1*n/(p_start-a*1)+2*n/(p_start-a*2)+3*n/(p_start-a*3)+5*n/(p_start-a*4)+8*n/(p_start-a*5)+13*n/(p_start-a*6)+21*n/(p_start-a*7)+34*n/(p_start-a*8)+55*n/(p_start-a*9)+89*n/(p_start-a*10)+144*n/(p_start-a*11)).toFixed(1)} 
+💱 đạt 50% slot, và giá hồi về điểm giá bắt đầu(${p_start}$) thì bạn lời :${((1*n/(p_start-a*1)+2*2*n/(p_start-a*2)+3*3*n/(p_start-a*3)+5*4*n/(p_start-a*4)+8*5*n/(p_start-a*5))*a).toFixed(he_so)}$
+💰 đạt 100% slot, và giá hồi về điểm giá bắt đầu(${p_start}$) thì bạn lời :${((1*n/(p_start-a*1)+2*2*n/(p_start-a*2)+3*3*n/(p_start-a*3)+5*4*n/(p_start-a*4)+8*5*n/(p_start-a*5)+13*6*n/(p_start-a*6)+21*7*n/(p_start-a*7)+34*8*n/(p_start-a*8)+55*9*n/(p_start-a*9)+89*10*n/(p_start-a*10)+144*11*n/(p_start-a*11))*a).toFixed(he_so)}$
=======1️⃣ vòng 1 =======
+💲  Mua tại điểm giá : ${(p_start-a*0).toFixed(he_so)}$
+💢 Với sô tiền : ${(n*1).toFixed(he_so)}$
=======2️⃣ vòng 2 =======
+💲  Mua tại điểm giá : ${(p_start-a*1).toFixed(he_so)}$
+💢 Với sô tiền : ${(n*1).toFixed(he_so)}$
=======3️⃣ vòng 3 =======
+💲  Mua tại điểm giá : ${(p_start-a*2).toFixed(he_so)}$
+💢 Với sô tiền : ${(n*2).toFixed(he_so)}$
=======4️⃣ vòng 4 =======
+💲  Mua tại điểm giá : ${(p_start-a*3).toFixed(he_so)}$
+💢 Với sô tiền : ${(n*3).toFixed(he_so)}$
=======5️⃣ vòng 5 =======
+💲  Mua tại điểm giá : ${(p_start-a*4).toFixed(he_so)}$
+💢 Với sô tiền : ${(n*5).toFixed(he_so)}$
=======6️⃣ vòng 6 =======
+💲  Mua tại điểm giá : ${(p_start-a*5).toFixed(he_so)}$
+💢 Với sô tiền : ${(n*8).toFixed(he_so)}$
=======7️⃣ vòng 7 =======
+💲  Mua tại điểm giá : ${(p_start-a*6).toFixed(he_so)}$
+💢 Với sô tiền : ${(n*13).toFixed(he_so)}$
=======8️⃣ vòng 8 =======
+💲  Mua tại điểm giá : ${(p_start-a*7).toFixed(he_so)}$
+💢 Với sô tiền : ${(n*21).toFixed(he_so)}$
=======9️⃣ vòng 9 =======
+💲  Mua tại điểm giá : ${(p_start-a*8).toFixed(he_so)}$
+💢 Với sô tiền : ${(n*34).toFixed(he_so)}$
=======🔟 vòng 10 =======
+💲  Mua tại điểm giá : ${(p_start-a*9).toFixed(he_so)}$
+💢 Với sô tiền : ${(n*55).toFixed(he_so)}$
=======1️⃣1️⃣ vòng 11 =======
+💲  Mua tại điểm giá : ${(p_start-a*10).toFixed(he_so)}$
+💢 Với sô tiền : ${(n*89).toFixed(he_so)}$
=======1️⃣2️⃣ vòng 12 =======
+💲  Mua tại điểm giá : ${(p_start-a*11).toFixed(he_so)}$
+💢 Với sô tiền : ${(n*144).toFixed(1)}$
============================
`);
//
}catch(e){
  console.log("🚀 ~ file: index.js ~ line 190 ~ bot.on ~ e", e)
  bot.sendMessage(chatId,`Cú pháp của bạn không chính xác : 
  [?__điểm khởi đầu d.start __ điểm kết thúc d.end __ điểm cắt lỗ _ số vốn ]`); 
}
    }else{
      bot.sendMessage(chatId,`Cú pháp của bạn không chính xác : 
[?__điểm khởi đầu d.start __ điểm kết thúc d.end __ điểm cắt lỗ _ số vốn ]`); 
  }

//     if(message_arr.length==4){
//       let d_start=Number(message_arr[1]);
//       let d_end=Number(message_arr[2]);
//       let von=Number(message_arr[3]);
//       // tinh he so lam tron\
//       let he_so=message_arr[1].length-(message_arr[1].indexOf('.')+1);
//       if(d_start>d_end){
        
//         let a_trung_diem=((d_start-d_end)/2).toFixed(he_so);
//         let p_trung_diem=d_start-a_trung_diem;
//         let a=(0.2*a_trung_diem).toFixed(he_so);
//         let a_von=0.2*von;
//         //
//         let v1_count=(a_von/(4*a)).toFixed(1);
//         let v1_price=(d_start-a).toFixed(he_so);
//         //
//         let v2_count=(a_von/(3*a)).toFixed(1);
//         let v2_price=(d_start-a*2).toFixed(he_so);
//         //
//         let v3_count=(a_von/(2*a)).toFixed(1);
//         let v3_price=(d_start-a*3).toFixed(he_so);
//         //
//         let v4_count=(a_von/(a)).toFixed(1);
//         let v4_price=(d_start-a*4).toFixed(he_so);
//         // diem gong lo
//         let gong_lo=(v1_count*(v1_price-d_end)+v2_count*(v2_price-d_end)+v3_count*(v3_price-d_end)+v4_count*(v4_price-d_end)).toFixed(1);
//         let loc_phat_max=(v1_count*(d_start-v1_price)+v2_count*(d_start-v2_price)+v3_count*(d_start-v3_price)+v4_count*(d_start-v4_price)).toFixed(1);
//         let loc_phat_min=(v1_count*(d_start-v1_price)).toFixed(1);
//         bot.sendMessage(chatId,`
// Vốn của bạn là ${von}$ , bạn dự định sẽ đầu tư tại giá ${d_start}$ và stoploss của bạn tại giá ${d_end}$ thì:
// =======1️⃣ vòng 1 =======
// +💢 Mua số lượng : ${v1_count}
// +💲 Tại điểm giá : ${v1_price}$
// +⚠️ Nhớ cài stoploss tại ${d_end}$ 
// =======2️⃣ vòng 2 =======
// +💢 Mua số lượng : ${v2_count}
// +💲 Tại điểm giá : ${v2_price}$
// +⚠️ Nhớ cài stoploss tại ${d_end}$ 
// =======3️⃣ vòng 3 =======
// +💢 Mua số lượng : ${v3_count}
// +💲 Tại điểm giá : ${v3_price}$
// +⚠️ Nhớ cài stoploss tại ${d_end}$ 
// =======4️⃣ vòng 4 =======
// +💢 Mua số lượng : ${v4_count}
// +💲 Tại điểm giá : ${v4_price}$
// +⚠️ Nhớ cài stoploss tại ${d_end}$ 
// ============================
// *❗❗ Bạn có thể mất ${gong_lo}$ nếu giá chạm stoploss;
// *💱 Bèo Bèo bạn có thể lời nhỏ tầm ${loc_phat_min}$;
// *💰 Cao hơn xíu bạn có thể lời đến ${loc_phat_max}$ và ~~ chốt lời tùy "LÒNG THAM"
// `);


//       }else{
//         bot.sendMessage(chatId,`Cú pháp của bạn không chính xác : 
// Điểm d_start phải lớn hơn d_end !`);
//       }
//     }else{
//       bot.sendMessage(chatId,`Cú pháp của bạn không chính xác : 
// [*__điểm khởi đầu d.start__điểm stoploss d.end__ số vốn ]`); 
//     }
  }else if(tx[0]=="*"){// * 100 d < 34
    
    let message_arr=msg.text.toUpperCase().split(" ");
    if(message_arr.length==5){
      let rsi_c=Number(message_arr[1]);
      let timeval=message_arr[2];
      let ss=message_arr[3];
      let rsi_r=Number(message_arr[4]);
      if(timeval=="D"||timeval=="15M"){
        let result =rsi(rsi_c,rsi_r,ss,timeval);
        bot.sendMessage(chatId,`Những đồng thỏa điều kiện  RSI_${timeval}(${rsi_c}) < ${rsi_r} :
${result}`); 
      }else{
        bot.sendMessage(chatId,`
        Cú pháp của bạn không chính xác : 
        [*_rsi số bao nhiêu_(d or 15m)_(< or >)_rsi kết quả]
        `); 
      }
    }else{
      bot.sendMessage(chatId,`
Cú pháp của bạn không chính xác : 
[*_rsi số bao nhiêu_(d or 15m)_(< or >)_rsi kết quả]
`); 
    }

  }else if(tx=="N"){
    bot.sendMessage(chatId,`"Tất cả các thông tin RSI ${so_sanh}  ${rsi_set}, sẽ được nhắc nhở nếu được phát hiện!"`);
    check_symbol_ok(true);
  }else if(tx=="T"){
    check_rsi_day();
  }else if(tx[0]=="/"){// / 100 < 34
    let data=[]
    let message_arr=msg.text.toUpperCase().split(" ");
    if(message_arr.length==4){
      await firebaseDB.once('value').then((snapshot) => {if (snapshot.exists()) {data=(snapshot.val());} else { console.log("No data available");}}).catch((error) => {console.error(error);});
      check_rsi_day_kucoin(message_arr[1],message_arr[2],message_arr[3],data);
    }else{
      bot.sendMessage(chatId,`Cú pháp của bạn không chính xác : 
Ví dụ : / 100 < 45`); 
    }
    
    // console.log(data)

  }else{
    // const chatId = msg.chat.id;
    // console.log(chatId)
    let message_arr=msg.text.toUpperCase().split(" ");
    if(message_arr[0] == "RSI"){
      if(message_arr.length != 3 || message_arr[0] != "RSI"){
        bot.sendMessage(chatId, `Bạn điền không đúng cú pháp rồi:
    "[RSI][cách][ký tự so sánh > or <][cách][số RSI cần so sánh]"`);
      }else{
        let pp_ss="[ERROR]";
        if(message_arr[1]==">") pp_ss="LỚN HƠN";
        if(message_arr[1]=="<") pp_ss="NHỎ HƠN";
        if(pp_ss!="[ERROR]"){
          so_sanh=message_arr[1];
          rsi_set=Number(message_arr[2]);
          bot.sendMessage(chatId, `Ok, tìm kiếm những thông tin rsi ${pp_ss} ${message_arr[2]}; chúng tôi sẽ thông báo!`);
          check_symbol_ok(true);
        }else{
          bot.sendMessage(chatId, `Có gì đó sai sót trong cú pháp của bạn, bạn cần nên xem lại!`);
        }
      }
    }else{
      check_symbol_ok(true,true,msg.text.toUpperCase());
    }
  }
});
}catch(e){
  console.log('loi bot.on(message, (msg) => {')
}



setTimeout(()=>{
    check_symbol_ok(true);
},60000)
setInterval(()=>{
  let d = new Date();
  let minute = d.getMinutes();
  if(minute==1||minute==16||minute==31||minute==46){
    check_symbol_ok(false);
  }
},40000)




// function xu ly data
function check_symbol_ok(is_show_no,is_all=false,name_symbol){
  let symbol=name_symbol+'USDT';
  let result_symbols_rsi='';
  let rsi_set_private=rsi_set;
  let so_sanh_private=so_sanh;
  // if(is_all) rsi_set_private=1;
  // if(is_all) so_sanh_private='>';
if(is_all==false){
  Object.keys(data_all).forEach(function(key) {
    let array_close_prices=data_all[key].list_close;
    let rsi=RSI.calculate({values:array_close_prices,period : 100});
    let l= rsi.length-1;
    let show_icon='';
    // tinh toan rsi day de note rang dong do rat tiem nang hien tai
    if(data[key]!=undefined){
      let list_close=data[key].list_close;
      let rsi_d=RSI.calculate({values:list_close,period : 4});
      let k=rsi_d.length-1;
      if(rsi_d[k]<=20||rsi_d[k-1]<=20||rsi_d[k-2]<=20){
        show_icon='🚩';
      }
    }

    if(so_sanh_private==">"){
      if(rsi[l]>rsi_set_private){
        result_symbols_rsi+=(`🔥-----${key.replace("USDT", "/USDT")}-----: RSI = ${rsi[l]} ${show_icon}
`)
      }
    }else if(so_sanh_private=="<"){
      if(rsi[l]<rsi_set_private){
        result_symbols_rsi+=(`🔥-----${key.replace("USDT", "/USDT")}-----: RSI = ${rsi[l]} ${show_icon}
`)
      }
    }
  })
}else{
  try{
  if(data_all[symbol]!=undefined){//[todo]
    let array_close_prices=data_all[symbol].list_close;
    let price=data_all[symbol].list_close;
    let rsi=RSI.calculate({values:array_close_prices,period : 100});
    let l= rsi.length-1; let rs_d=''; let rs_10d='';let u=100;leng_array_close_prices=array_close_prices.length-1;
    price=price[leng_array_close_prices];
    let rsi_s=RSI.calculate({values:array_close_prices,period : 100});
    while(1){
      if(rsi_s[l]<=43||u<=0){
        break;
      }else{
        array_close_prices[leng_array_close_prices]=array_close_prices[leng_array_close_prices]*u/100;
        rsi_s=RSI.calculate({values:array_close_prices,period : 100});
        u--;
      };
    }
    let price_rsi_43=Number(array_close_prices[leng_array_close_prices]).toFixed(3);
    // day 
    if(data[symbol]!=undefined){
    let list_close_day=data[symbol].list_close;
    let rsi_d=RSI.calculate({values:list_close_day,period : 4});
    let t=rsi_d.length-1;let j=100; let leng_list_close_D=list_close_day.length-1;
    let rsi_d_s=RSI.calculate({values:list_close_day,period : 4});
        // test rsi
        while(1){
          if(rsi_d_s[t]<=18||j<=0){
            break;
          }else{
            list_close_day[leng_list_close_D]=list_close_day[leng_list_close_D]*j/100;
            rsi_d_s=RSI.calculate({values:list_close_day,period : 4});
            j--;
          };
        }
        let price_rsi_18=Number(list_close_day[leng_list_close_D]).toFixed(3);
    rs_d=`🍑 RSI_d(4) =( ${rsi_d[t-2]} - ${rsi_d[t-1]} - ${rsi_d[t]})
* "price < ${price_rsi_18}" => RSI_day(10) < 18;`;
// rsi 10d
    let list_close_10day=data[symbol].list_close;
    let rsi_10d=RSI.calculate({values:list_close_10day,period : 10});
    let tt=rsi_10d.length-1;let jj=100; let leng_list_close_10D=list_close_10day.length-1;
    let rsi_10d_s=RSI.calculate({values:list_close_10day,period : 10});
    // test rsi
    if(tt>2){
      while(1){
        if(rsi_10d_s[tt]<=33||jj<=0){
          break;
        }else{ 
          list_close_10day[leng_list_close_10D]=list_close_10day[leng_list_close_10D]*j/100;
          rsi_10d_s=RSI.calculate({values:list_close_10day,period : 10});
          jj--;
        };
      }
      let price_rsi_33=Number(list_close_10day[leng_list_close_10D]).toFixed(3);
rs_10d=`🍑 RSI_d(10) =( ${rsi_10d[tt-2]} - ${rsi_10d[tt-1]} - ${rsi_10d[tt]})
* "price < ${price_rsi_33}" => RSI_day(10) < 33;`;
  }
}
    result_symbols_rsi+=(`🍒-----${symbol.replace("USDT", "/USDT")}-----🍒
===============
price = ${price}
===============
🍑 RSI_15m = ${rsi[l]}
* "price < ${price_rsi_43}" => RSI_15m < 43;
===============
${rs_d}
===============
${rs_10d}`)
  }else{
    result_symbols_rsi+=(`Thông tin : "${name_symbol}" không có dữ liệu hoặc không chính xác!`)
  }
  }catch(e){
    console.log(e)
  }
}
  if(result_symbols_rsi!=''){
    bot.sendMessage(chatId, result_symbols_rsi);
  }else{
    if(is_show_no==true){
      bot.sendMessage(chatId, `Hiện tại chưa có data nào thỏa điều kiện RSI ${so_sanh} ${rsi_set} `);
    }
  }
}

async function get_symbols(){
  let rs=[];
  let prevDay= await binance.futuresPrices()
    // if(symbol.indexOf(basic_name)>0){
    Object.keys(prevDay).forEach(function(symbol) {
      if(symbol.indexOf('USDT')>0&&symbol.indexOf('_')==-1&&symbol.indexOf('1000XECUSDT')==-1&&symbol.indexOf('1000SHIBUSDT')==-1){
        rs.push(symbol)
      }
    })
  return rs;
}

function check_socket_run(){
  let check_socket_run=binance.futuresSubscriptions();
  let result=false; let i=0;
  Object.keys(check_socket_run).forEach(function(id_key) {
    i++;
  });
  if(i==2) result=true;
  return result;
}

// 
function check_rsi_day(){
// chua get data ngay hom nay
      let ms=`[`;
      Object.keys(data).forEach(function(key) {
        let array_close_prices=data[key].list_close;
        let rsi=RSI.calculate({values:array_close_prices,period : 4});
        let l= rsi.length-1;
        let t= rsi.length-2;
        let z= rsi.length-3;
        if(rsi[l]<=33||rsi[t]<=33||rsi[z]<=33){
          ms+=`
`;
          ms+='"'+key.replace("USDT", " ")+'('+rsi[z]+' - '+rsi[t]+' - '+rsi[l]+')"; ';
        }
      })
      ms+=`
]`;

      let mss=ms==""?"[không có đồng nào tìm năng]":ms;
      bot.sendMessage(chatId,`🔥 Những đồng tìm năng cần theo dõi trong hôm nay là: 
${mss}`);
}
//
function check_rsi_day_kucoin(c,ss,rsi_ss,data){
  let ms_l=`[`;
  let ms_n=`[`;
  Object.keys(data).forEach(function(key) {
    let array_close_prices=data[key].list_close;
    let rsi=RSI.calculate({values:array_close_prices,period : c});
    let l= rsi.length-1;
    let t= rsi.length-2;
    let z= rsi.length-3;
    if(ss=='>'){
      if(rsi[l]>=rsi_ss||rsi[t]>=rsi_ss||rsi[z]>=rsi_ss){
        ms_l+=`
`;
        ms_l+='"'+key.replace("-USDT", " - ")+'('+rsi[z]+' - '+rsi[t]+' - '+rsi[l]+')"; ';
      }

    }else if(ss=='<'){
      if(rsi[l]<=rsi_ss||rsi[t]<=rsi_ss||rsi[z]<=rsi_ss){
        ms_n+=`
`;
        ms_n+='"'+key.replace("-USDT", " - ")+'('+rsi[z]+' - '+rsi[t]+' - '+rsi[l]+')"; ';
      }

    }
  })
  ms_l+=`]`;
  ms_n+=`]`;
  if(ss=='>'){
    let mss_l=ms_l=="[]"?"[không có đồng nào tìm năng]":ms_l;
    bot.sendMessage(chatId,`🔥[Kucoin] Những đồng tìm năng cần theo dõi trong hôm nay là: 
${mss_l}`);
  }else if(ss=='<'){
    let mss_n=ms_n=="[]"?"[không có đồng nào tìm năng]":ms_n;
    bot.sendMessage(chatId,`🔥[Kucoin] Những đồng tìm năng cần theo dõi trong hôm nay là: 
${mss_n}`);
  }
};
//
function rsi(rsi_c,rsi_r,ss,timeval){
  let result='';
  if(timeval=='D'){
  Object.keys(data).forEach(function(key) {
    let array_close_prices=data[key].list_close;
    let rsi=RSI.calculate({values:array_close_prices,period : rsi_c});
    let l= rsi.length-1;
    if(ss=="<"){
    if(rsi[l]<=rsi_r ||rsi[l-1]<=rsi_r ||rsi[l-2]<=rsi_r ||rsi[l-3]<=rsi_r ||rsi[l-4]<=rsi_r){
      result+=`
${key.replace("USDT", " - ")} RSI(Now)=${rsi[l]}`;
    }
    }else if(ss=='>'){
    if(rsi[l]>=rsi_r ||rsi[l-1]>=rsi_r ||rsi[l-2]>=rsi_r ||rsi[l-3]>=rsi_r ||rsi[l-4]>=rsi_r){
      result+=`
${key.replace("USDT", " - ")} RSI(Now)=${rsi[l]}`;
    }
    }
  })
}else if(timeval=="15M"){
  Object.keys(data_all).forEach(function(key) {
    let array_close_prices=data_all[key].list_close;
    let rsi=RSI.calculate({values:array_close_prices,period : rsi_c});
    let l= rsi.length-1;
  if(ss=="<"){
    if(rsi[l]<=rsi_r ||rsi[l-1]<=rsi_r ||rsi[l-2]<=rsi_r ||rsi[l-3]<=rsi_r ||rsi[l-4]<=rsi_r){
      result+=`
${key.replace("USDT", " - ")} RSI(Now)=${rsi[l]}`;
    }
    }else if(ss=='>'){
    if(rsi[l]>=rsi_r ||rsi[l-1]>=rsi_r ||rsi[l-2]>=rsi_r ||rsi[l-3]>=rsi_r ||rsi[l-4]>=rsi_r){
      result+=`
${key.replace("USDT", " - ")} RSI(Now)=${rsi[l]}`;
    }
    }
  })
}
  return result;
}

setInterval(()=>{
  let d = new Date();
  let day = d.getDate();
  let hour = d.getHours();
  if(day_update_ku!=day&& hour >7){
    day_update_ku=day;
    update_data_kucoin();
  }
},600000)
async function update_data_kucoin(){
  if(time_check!=undefined)  clearInterval(time_check);
  let data=[]
  await firebaseDB.once('value').then((snapshot) => {
    if (snapshot.exists()) {
      data=(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  let list_symbol_kucoin=await get_symbol_kucoin();
  let y=0; let time_delay=30000;let dept=list_symbol_kucoin.length;
  
  var time_check=setInterval(async () => {
    let symbol= list_symbol_kucoin[y];
    // xu ly data here
    let d = new Date();
    let day = d.getDate();
    if(data[symbol]!=undefined){
      if(data[symbol].day!=day){
          let list_close=await get_symbol_infor_kucoin(symbol);
          firebaseDB.child(`${symbol}`).set({
            day:day,
            list_close:list_close
          })
      }
    }else{
      let list_close=await get_symbol_infor_kucoin(symbol);
      firebaseDB.child(`${symbol}`).set({
        day:day,
        list_close:list_close
      })
    }
    // end xu ly data
    y++;
    if(y>=dept) clearInterval(time_check);
  }, time_delay);
   
}
async function get_symbol_kucoin(){
  let result=[];
 let rs=await api.getSymbols('USDS');
    rs.data.forEach(obj => {
      if(obj.symbol.indexOf('USDT')>-1){
        result.push(obj.symbol)
      }
    });
  return(result);
}
async function get_symbol_infor_kucoin(symbol){
  let d = new Date();
  let t = d.getTime();
  var priorDate =  d.setDate(d.getDate()-150)
  params = {
    symbol: symbol,
    startAt: priorDate,
    endAt: t,
    type: '1day'
  }
  let result=await  api.getKlines(params);
  let data=result.data;
  let close_price=[];
  data.forEach(arr => {
    close_price.push(arr[2]);
  });
  let close_Revert=close_price.reverse();
  return close_Revert;
}
