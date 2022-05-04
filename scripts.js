//各種デフォルト値
const defaultMemo = "チャプター";
// $tの位置に記入済みのテキストが挿入される
let snippets = ["","タスク開始:$t$c","参加者「$t$c」","進行役「$t$c」","見所！:$t$c","タスク完了:$t$c"];

document.getElementById('snippet1').innerText = "F1:"+snippets[1].replace("$t","").replace("$c","");
document.getElementById('snippet2').innerText = "F2:"+snippets[2].replace("$t","").replace("$c","");
document.getElementById('snippet3').innerText = "F3:"+snippets[3].replace("$t","").replace("$c","");
document.getElementById('snippet4').innerText = "F4:"+snippets[4].replace("$t","").replace("$c","");
document.getElementById('snippet5').innerText = "F5:"+snippets[5].replace("$t","").replace("$c","");

//ブラウザウインドウを閉じる時に警告を表示する
window.onbeforeunload = function(e) {
    return " ";
}


//キーボードショートカット
document.body.addEventListener('keydown', (event)=>{
    if (event.code == "F1") {
        if (document.getElementById('snippet1').disabled == false){
            insertSnippet(1);
            event.preventDefault();
        }
    } else if (event.code == "F2") {
        if (document.getElementById('snippet2').disabled == false){
            insertSnippet(2);
            event.preventDefault();
        }
    } else if (event.code == "F3") {
        if (document.getElementById('snippet3').disabled == false){
            insertSnippet(3);
            event.preventDefault();
        }
    } else if (event.code == "F4") {
        if (document.getElementById('snippet4').disabled == false){
            insertSnippet(4);
            event.preventDefault();
        }
    } else if (event.code == "F5") {
        if (document.getElementById('snippet5').disabled == false){
            insertSnippet(5);
            event.preventDefault();
        }
    }
});

//メモ欄でShift + Enterを押したら記録実行
document.getElementById('newMemo').addEventListener('keydown', (event)=>{
    console.log(event.keyCode);
    if (event.keyCode === 13) {
        document.getElementById('mark').click();
    }
});

//Fスニペットの挿入
function insertSnippet(num) {
    console.log("F" + num);
    let snippet = snippets[num];
    const memoField = document.getElementById('newMemo');
    const currentMemo = memoField.value;
    memoField.value = snippet.replace("$t", currentMemo);
    const pos = memoField.value.indexOf("$c");
    memoField.value = memoField.value.replace("$c", "");
    memoField.focus();
    memoField.setSelectionRange(pos,pos);
}

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
    document.getElementById('timecode').innerText = secToHHMMSS(elapsed + document.getElementById('manual_timecode_offset').value * 1000);   
}

//各UIのグレーアウトを解除／復帰
function toggleControls(b) {
    document.getElementById('newMemo').disabled = b;
    document.getElementById('mark').disabled = b;
    document.getElementById('snippet1').disabled = b;
    document.getElementById('snippet2').disabled = b;
    document.getElementById('snippet3').disabled = b;
    document.getElementById('snippet4').disabled = b;
    document.getElementById('snippet5').disabled = b;

    document.getElementById('show_timecode_settings').disabled = !b;
}

//カウンター設定ボタン（設定エリアを表示／非表示）
document.getElementById('show_timecode_settings').addEventListener('click', ()=>{
    const block = document.getElementById('timecode_settings_block');
    const main = document.getElementById('main');
    if (block.style.display == "none") {
        main.style.gridTemplateRows = "2.5em 5em auto 3em 1em";
        block.style.display = "block";
    } else {
        main.style.gridTemplateRows = "2.5em 0em auto 3em 1em";
        block.style.display = "none";
    }
});

//同期方法の切り替え
document.getElementById('syncMethod').addEventListener('change', ()=>{
    console.log(document.getElementById('syncMethod').value);
    switch (document.getElementById('syncMethod').value) {
        case 'manual':
            console.log('manual');
            document.getElementById('obs_settings').style.display = 'none';
            document.getElementById('atem_settings').style.display = 'none';
            document.getElementById('manual_settings').style.display = 'block';
            break;
        case 'obs':
            console.log('obs');
            document.getElementById('manual_settings').style.display = 'none';
            document.getElementById('atem_settings').style.display = 'none';
            document.getElementById('obs_settings').style.display = 'block';
            break;
        case 'atem':
            console.log('atem');
            document.getElementById('obs_settings').style.display = 'none';
            document.getElementById('manual_settings').style.display = 'none';
            document.getElementById('atem_settings').style.display = 'block';
            break;
    }
});

// 記録実行ボタン
document.getElementById('mark').addEventListener('click', ()=>{
    const timecode = document.getElementById('timecode').innerText;
    //console.log(timecode);

    //マーカーオブジェクトの作成
    let marker = document.createElement('div');
    marker.classList.add("record");
    const tc = document.getElementById('timecode').innerText;
    let memo = "";
    if (document.getElementById('newMemo').value != "") {
        memo = document.getElementById('newMemo').value;
    } else {
        memo = defaultMemo;
    }
    document.getElementById('newMemo').value = "";
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