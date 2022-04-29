//各種デフォルト値
const defaultMemo = "チャプター";

//手動カウンタースタートボタン
let manualCountTimer; //手動カウンター用タイマー
let manualCountStarted; //手動タイマーを開始した日時オブジェクト
document.getElementById('start').addEventListener('click', ()=>{
    const btn = document.getElementById('start');
    if (btn.innerText == "スタート"){
        //スタート処理
        manualCountStarted = new Date();
        manualCountTimer = setInterval(updateManualCounter, 1000);
        btn.innerText = "ストップ"
        toggleControls(false);
    } else {
        //ストップ処理
        clearTimeout(manualCountTimer);
        btn.innerText = "スタート"
        manualCountStarted = null;
        toggleControls(true);
    }
}, false);

//1秒毎に呼び出され手動カウンターを更新
function updateManualCounter() {
    const now = new Date();
    const elapsed = (now.getTime() - manualCountStarted.getTime()); //ミリ秒
    document.getElementById('timecode').innerText = secToHHMMSS(elapsed);   
}

function toggleControls(b) {
    document.getElementById('mark').disabled = b;
    document.getElementById('show_timecode_settings').disabled = !b;
}

//カウンター設定ボタン
document.getElementById('show_timecode_settings').addEventListener('click', ()=>{

});


// マークボタン
document.getElementById('mark').addEventListener('click', ()=>{
    const timecode = document.getElementById('timecode').innerText;
    //console.log(timecode);

    //マーカーオブジェクトの作成
    let marker = document.createElement('div');
    marker.classList.add("record");
    const tc = document.getElementById('timecode').innerText;
    const memo = defaultMemo;
    marker.innerHTML = '<span class="tc">' + tc + '</span><span class="memo">' + memo + '</span>\n';
    document.getElementById('list').appendChild(marker);
    
}, false);

// 保存ボタン
document.getElementById('save').addEventListener('click', (event)=>{
    // テキストファイルオブジェクトを生成
    const records = document.querySelectorAll("#list .record");
    console.log("record count:"+ records.length);
    let text = "";
    records.forEach(r => {
        let line = "";
        line += HHMMSStoSec(r.querySelector(".tc").innerText); //タイムコード
        line += "\t";
        line += r.querySelector(".memo").innerText; //メモ
        line += "\t0\n"; //話者コード
        text += line;
    });
    console.log(text);
    const blob = new Blob([text], { type: 'plain/text' });
 
    // a 要素の href 属性に Object URL を セット
    event.currentTarget.href = window.URL.createObjectURL(blob);
}, false);

/**
 * "時:分:秒"形式のタイムスタンプを秒にして返す
 * @param {*} hhmmss 
 * @returns 秒換算値
 */
function HHMMSStoSec(hhmmss) {
    const tc = hhmmss.split(":");
    return parseInt(tc[0]*360) + parseInt(tc[1]*60) + parseInt(tc[2]);
}

function secToHHMMSS (sec) {
  const hour = Math.floor(sec / 3600000);
  const minute = Math.floor((sec - 3600000 * hour) / 60000);

  const hh = ('00' + hour).slice(-2);
  const mm = ('00' + minute).slice(-2);
  const ms = ('00000' + (sec % 60000)).slice(-5);

  const time = `${hh}:${mm}:${ms.slice(0,2)}`;

  return time
}