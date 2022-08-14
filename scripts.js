//各種デフォルト値
const defaultMemo = "チャプター";
let syncMethod = "timeofday"; //デフォルト同期方法

// $tの位置に記入済みのテキストが挿入される
let snippets = ["","タスク開始:$t$c","参加者「$t$c」","進行役「$t$c」","見所！:$t$c","タスク完了:$t$c"];

document.getElementById('snippet1').innerHTML = "<span class=\"fLabel\">F1:</span>"+snippets[1].replace("$t","").replace("$c","");
document.getElementById('snippet2').innerHTML = "<span class=\"fLabel\">F2:</span>"+snippets[2].replace("$t","").replace("$c","");
document.getElementById('snippet3').innerHTML = "<span class=\"fLabel\">F3:</span>"+snippets[3].replace("$t","").replace("$c","");
document.getElementById('snippet4').innerHTML = "<span class=\"fLabel\">F4:</span>"+snippets[4].replace("$t","").replace("$c","");
document.getElementById('snippet5').innerHTML = "<span class=\"fLabel\">F5:</span>"+snippets[5].replace("$t","").replace("$c","");

//ページを開いた時に実行
window.onload = function() {
    //URLパラメーター取得
    console.log("onload");
    const params = (new URL(document.location)).searchParams;
    console.log(params.get('sync'));
    switch (params.get('sync')) {
        case 'timeofday':
            syncMethod = "timeofday";
            document.getElementById('syncMethod').value = 'timeofday';
            break;
        case 'manual':
            syncMethod = "manual";            
            document.getElementById('syncMethod').value = 'manual';
    }
    if (syncMethod == 'timeofday') {
        //同期方法が時刻の場合
        document.getElementById('start').style.display = 'none';
        toggleControls(false);
        document.getElementById('timecode').style.color = "#33d";
        setInterval(updateTimeOfDayCounter, 1000);
    }

}


//ブラウザウインドウを閉じる時に警告を表示する
window.onbeforeunload = function(e) {
    return " ";
}

//「使い方」ボタン
document.getElementById('guide').addEventListener('click', ()=>{
    let guide = "（ブラウザ上で完結して動作しており、入力内容がサーバーに送信／保存されることはありません）\n\n";
    guide += "（このダイアログはスクロールします）\n\n";
    guide += "■使い方\n\n";
    guide += "1) 録画ツールとタイミングを合わせて「スタート」を押しカウンターを同期させます。\n";
    guide += "2) ピンクのエリアのテキスト欄にメモ内容を入れ（空欄でも可）、Enterまたはペンアイコンのクリックで記録します。\n";
    guide += "3) セッションが終わったらパープルのエリアの保存ボタンからファイルとして保存します。\n";
    guide += "4) 動画ファイルと同じ場所、同じ名前で拡張子を.dggn.txtとして保存すれば、動画眼3で読み込まれます。\n\n";
    guide += "■便利技\n\n";
    guide += "・録画開始と同時に「スタート」を押すのが難しい場合は、水色エリアの歯車ボタンからオフセット秒数を指定できます。\n";
    guide += "・画面最下部のボタンまたはF1〜5キーで定型文を入力できます。\n";
    guide += "・Shift + F1〜5キーで定型文入力と同時に記録できます（入力中テキストには影響しません）。\n";
    guide += "・既存のチャプターラベルをクリックして編集できます。[NEW]\n";
    alert(guide);
});

//キーボードショートカット
document.body.addEventListener('keydown', (event)=>{
    if (event.code == "F1") {
        if (document.getElementById('snippet1').disabled == false){
            insertSnippet(1,event.shiftKey);
            event.preventDefault();
        }
    } else if (event.code == "F2") {
        if (document.getElementById('snippet2').disabled == false){
            insertSnippet(2,event.shiftKey);
            event.preventDefault();
        }
    } else if (event.code == "F3") {
        if (document.getElementById('snippet3').disabled == false){
            insertSnippet(3,event.shiftKey);
            event.preventDefault();
        }
    } else if (event.code == "F4") {
        if (document.getElementById('snippet4').disabled == false){
            insertSnippet(4,event.shiftKey);
            event.preventDefault();
        }
    } else if (event.code == "F5") {
        if (document.getElementById('snippet5').disabled == false){
            insertSnippet(5,event.shiftKey);
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
function insertSnippet(num, isShiftKeyDown) {
    console.log("F" + num + " ShiftKey:" + isShiftKeyDown);
    let snippet = snippets[num];
    const memoField = document.getElementById('newMemo');
    const currentMemo = memoField.value;
    if (isShiftKeyDown == false) {
        //Shiftキーが押されていない
        memoField.value = snippet.replace("$t", currentMemo);
        const pos = memoField.value.indexOf("$c");
        memoField.value = memoField.value.replace("$c", "");
        memoField.focus();
        memoField.setSelectionRange(pos,pos);
    } else {
        //Shiftキーが押されていた
        memoField.value = snippets[num].replace("$t","").replace("$c","");
        document.getElementById('mark').click();
        memoField.value = currentMemo; //元々あったテキストを戻す
        
    }
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
        document.getElementById('timecode').style.color = "#c33";
        toggleControls(false);
    } else {
        //ストップ処理
        clearTimeout(manualCountTimer);
        btn.innerText = "スタート"
        document.getElementById('timecode').style.color = "#000";
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

//1秒毎に呼び出され時刻カウンターを更新
function updateTimeOfDayCounter() {
    const now = new Date();
    const hh = ('00' + now.getHours()).slice(-2);
    const mm = ('00' + now.getMinutes()).slice(-2);
    const ss = ('00' + now.getSeconds()).slice(-2);
    document.getElementById('timecode').innerText = hh+":"+mm+":"+ss;   
}

//各UIのグレーアウトを解除／復帰
function toggleControls(b) {
    console.log("hoge");
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
    const mediaQuery = window.matchMedia('(max-width: 600px)');
    if (block.style.display != "block") {
        if (mediaQuery.matches) {
            //SP （スニペットブロックの高さで調整）
            main.style.gridTemplateRows = "3em auto 3.5em 5.5em 3.5em 0.5em";
        } else {
            //PC
            main.style.gridTemplateRows = "3em auto 3.5em 5.5em 3.5em 1em";
        }
        block.style.display = "block";
    } else {
        if (mediaQuery.matches) {
            //SP （スニペットブロックの高さで調整）
            main.style.gridTemplateRows = "3em auto 3.5em 0em 3.5em 0.5em";
        } else {
            //PC
            main.style.gridTemplateRows = "3em auto 3.5em 0em 3.5em 1em";
        }
        block.style.display = "none";
    }
});

//同期方法の切り替え
document.getElementById('syncMethod').addEventListener('change', ()=>{
    //GETパラメーターを変更してリロード
    window.location.href = "?sync="+document.getElementById('syncMethod').value;
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
    marker.innerHTML = '<span class="tc">' + tc + '</span><span class="memo" onClick="editText(this);">' + memo + '</span>\n';
    document.getElementById('list').appendChild(marker);    
}, false);

// 保存用テキスト生成（ファイル保存、コピー両用
function prepareRecordToSave() {
    const records = document.querySelectorAll("#list .record");
    console.log("record count:"+ records.length);
    let text = "";
    records.forEach(r => {
        let line = "";
        switch (syncMethod) {
            case 'timeofday':
                line += r.querySelector(".tc").innerText; //時:分:秒のまま
                break;
            case 'manual':
                line += HHMMSStoSec(r.querySelector(".tc").innerText); //秒換算値
                break;
        }
        line += "\t";
        line += r.querySelector(".memo").innerText; //メモ
        line += "\t0\n"; //話者コード
        text += line;
    });
    return text;

}


// 保存ボタン
document.getElementById('save').addEventListener('click', (event)=>{
    // テキストファイルオブジェクトを生成
    const text = prepareRecordToSave();
    const blob = new Blob([text], { type: 'plain/text' });
 
    // a 要素の href 属性に Object URL を セット
    event.currentTarget.href = window.URL.createObjectURL(blob);
}, false);

// コピーボタン
document.getElementById('copy').addEventListener('click', (event)=>{
    if (navigator.clipboard) {
        navigator.clipboard.writeText(prepareRecordToSave())
        .then(() => {
        alert("クリップボードにコピーしました。")
        })
        .catch(err => {
            alert('クリップボードへのコピーに失敗しました。', err);
        })
    } else {
        alert("このブラウザではコピーできません。ファイルダウンロードをご利用ください。")
    }
},false);

//スマホ用共有ボタン
document.getElementById('share').addEventListener('click', async (event)=>{
    if (!window.navigator.share) {
        alert("ご利用のブラウザでは共有できません。");
        return;
    }
    
    // テキストファイルオブジェクトを生成
    const text = prepareRecordToSave();
    const shareData = {
        title: 'do-gagan Marker',
        text: text
    }
    try {
        await navigator.share(shareData);
      } catch(e) {
        alert('Error: ' + e);
    }

}, false);


/**
 * "時:分:秒"形式のタイムスタンプを秒にして返す
 * @param {*} hhmmss 
 * @returns 秒換算値
 */
function HHMMSStoSec(hhmmss) {
    const tc = hhmmss.split(":");
    return parseInt(tc[0]*3600) + parseInt(tc[1]*60) + parseInt(tc[2]);
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

function editText(obj) {
    var res = window.prompt("チャプターラベルの編集", obj.innerText);
    if (res != "") {
        obj.innerText = res;
    } else {
        obj.innerText = "チャプター";
    }
}