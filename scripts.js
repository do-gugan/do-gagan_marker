//各種デフォルト値
const defaultMemo = "チャプター";
let syncMethod = "timeofday"; //デフォルト同期方法

// $tの位置に記入済みのテキストが挿入される
const snippets_default = ["","タスク開始:$t$c","参加者「$t$c」","進行役「$t$c」","見所！:$t$c","タスク完了:$t$c"];
//let snippets = ["","タスク開始:$t$c","参加者「$t$c」","進行役「$t$c」","見所！:$t$c","タスク完了:$t$c"];
let snippets = [];

//localstrageからカスタム定型文を読み込む
snippets[1] = localStorage.getItem('snippet1') || snippets_default[1];
snippets[2] = localStorage.getItem('snippet2') || snippets_default[2];
snippets[3] = localStorage.getItem('snippet3') || snippets_default[3];
snippets[4] = localStorage.getItem('snippet4') || snippets_default[4];
snippets[5] = localStorage.getItem('snippet5') || snippets_default[5];

//話者コードの読み込み
document.getElementById('speaker_code').value = localStorage.getItem('speaker_code') || "0";

document.getElementById('snippet1').innerHTML = "<span class=\"fLabel\">F1:</span>"+snippets[1].replace("$t","").replace("$c","");
document.getElementById('snippet2').innerHTML = "<span class=\"fLabel\">F2:</span>"+snippets[2].replace("$t","").replace("$c","");
document.getElementById('snippet3').innerHTML = "<span class=\"fLabel\">F3:</span>"+snippets[3].replace("$t","").replace("$c","");
document.getElementById('snippet4').innerHTML = "<span class=\"fLabel\">F4:</span>"+snippets[4].replace("$t","").replace("$c","");
document.getElementById('snippet5').innerHTML = "<span class=\"fLabel\">F5:</span>"+snippets[5].replace("$t","").replace("$c","");

//ページを開いた時に実行
window.onload = function() {
    //URLパラメーター取得
    //console.log("onload");
    const params = (new URL(document.location)).searchParams;
    //console.log(params.get('sync'));
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
    } else {
        //同期方法が手動の場合
        document.getElementById('timeOfDayOffsetBlock').style.display = 'none';
    }

}


//ブラウザウインドウを閉じる時に警告を表示する
//キャンセルした場合はなにもしない
window.onbeforeunload = function(e) {
    if (document.getElementById('list').childElementCount > 0) {
        return;
    }
}

//「使い方」ボタン
document.getElementById('guide').addEventListener('click', ()=>{
    let guide = "（ブラウザ上で完結して動作しており、入力内容がサーバーに送信／保存されることはありません）\n\n";
    guide += "（このダイアログはスクロールします）\n\n";
    guide += "■同期方法「現在時刻」\n";
    guide += "・事前の同期は必要ありません。動画眼3で読み込む際に開始時刻を指定することで同期します。\n\n";
    guide += "■同期方法「手動」\n";
    guide += "・録画ツールとタイミングを合わせて「スタート」を押しカウンターを同期させます。\n\n";
    guide += "■使い方　共通\n";
    guide += "1) ピンクのエリアのテキスト欄にメモ内容を入れ（空欄でも可）、Enterまたはペンアイコンのクリックで記録します。\n";
    guide += "2) セッションが終わったらパープルのエリアの保存ボタンからファイルとして保存します。\n";
    guide += "3) 動画ファイルと同じ場所、同じ名前で拡張子を.dggn.txtとして保存すれば、動画眼3で読み込まれます。\n\n";
    guide += "■便利技\n\n";
    guide += "・録画開始と同時に「スタート」を押すのが難しい場合は、水色エリアの歯車ボタンからオフセット秒数を指定できます。\n";
    guide += "・画面最下部のボタンまたはF1〜5キーで定型文を入力できます。\n";
    guide += "　　・定型文編集は左上の「設定」から行えます[NEW]\n";
    guide += "・Shift + F1〜5キーで定型文入力と同時に記録できます（入力中テキストには影響しません）。\n";
    guide += "・既存のチャプターラベルをクリックして編集できます。\n";
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

//1秒毎に呼び出され手動カウンターを更新（手動同期版）
function updateManualCounter() {
    const now = new Date();
    const elapsed = (now.getTime() - manualCountStarted.getTime()); //ミリ秒
    document.getElementById('timecode').innerText = secToHHMMSS(elapsed + document.getElementById('manual_timecode_offset').value * 1000);   
}

//1秒毎に呼び出され時刻カウンターを更新（現在時刻時刻版）
function updateTimeOfDayCounter() {
    const now = new Date();

    //指定秒数の補正
    const seconds = now.getSeconds();
    if (Number.isInteger(document.getElementById("timeOfDayOffset").value) || document.getElementById("timeOfDayOffset").value == ""){
        document.getElementById("timeOfDayOffset").value = 0;
    }
    now.setSeconds(seconds + parseInt(document.getElementById("timeOfDayOffset").value));

    const hh = ('00' + now.getHours()).slice(-2);
    const mm = ('00' + now.getMinutes()).slice(-2);
    const ss = ('00' + now.getSeconds()).slice(-2);
    document.getElementById('timecode').innerText = hh+":"+mm+":"+ss;
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

// 保存用テキスト生成（ファイル保存、コピー両用）
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
        line += "\t" + localStorage.getItem("speaker_code") + "\n"; //話者コード
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

/**
 * メモをクリックして編集ダイアログを表示
 * @param {*} obj 
 */
function editText(obj) {
    var res = window.prompt("チャプターラベルの編集", obj.innerText);
    if (res.length > 0) {
        obj.innerText = res;
    } else {
        obj.innerText = "チャプター";
    }
}


/**
 * スニペット編集オーバーレイ関連
 */
//「設定」ボタンで定型文シート表示
document.getElementById('open_snippet_setting').addEventListener('click', ()=>{
    edit_snippet1.value = snippets[1];
    edit_snippet2.value = snippets[2];
    edit_snippet3.value = snippets[3];
    edit_snippet4.value = snippets[4];
    edit_snippet5.value = snippets[5];

    //編集イベントをキャッチして更新処理を呼び出す
    document.getElementById('edit_snippet1').addEventListener('input', updateSnippet);
    document.getElementById('edit_snippet2').addEventListener('input', updateSnippet);
    document.getElementById('edit_snippet3').addEventListener('input', updateSnippet);
    document.getElementById('edit_snippet4').addEventListener('input', updateSnippet);
    document.getElementById('edit_snippet5').addEventListener('input', updateSnippet);

    //リセットボタンの処理
    document.getElementById('reset_snippet1').addEventListener('click', resetSnippet);
    document.getElementById('reset_snippet2').addEventListener('click', resetSnippet);
    document.getElementById('reset_snippet3').addEventListener('click', resetSnippet);
    document.getElementById('reset_snippet4').addEventListener('click', resetSnippet);
    document.getElementById('reset_snippet5').addEventListener('click', resetSnippet);

    document.getElementById('snippet_setting').style.display="block";
});

//「×」ボタンで定型文シートを非表示
document.getElementById('close_snippet_setting').addEventListener('click', ()=>{
    //イベントリスナーを削除
    document.getElementById('edit_snippet1').removeEventListener('input', updateSnippet);
    document.getElementById('edit_snippet2').removeEventListener('input', updateSnippet);
    document.getElementById('edit_snippet3').removeEventListener('input', updateSnippet);
    document.getElementById('edit_snippet4').removeEventListener('input', updateSnippet);
    document.getElementById('edit_snippet5').removeEventListener('input', updateSnippet);

    document.getElementById('reset_snippet1').removeEventListener('click', resetSnippet);
    document.getElementById('reset_snippet2').removeEventListener('click', resetSnippet);
    document.getElementById('reset_snippet3').removeEventListener('click', resetSnippet);
    document.getElementById('reset_snippet4').removeEventListener('click', resetSnippet);
    document.getElementById('reset_snippet5').removeEventListener('click', resetSnippet);

    //非表示
    document.getElementById('snippet_setting').style.display="none";

});

//定型文を更新
function updateSnippet(InputEvent) {
    let target = InputEvent.currentTarget.id.replace('edit_',''); //「snippet1〜5」
    let num = target.replace('snippet','');
    let snippet = document.getElementById(InputEvent.currentTarget.id).value;
    console.log("target:"+target+" snippet:"+snippet);

    localStorage.setItem(target, snippet); //localstrageに永続保存
    snippets[num] = snippet;
    document.getElementById(target).innerHTML = "<span class=\"fLabel\">F"+num+":</span>"+snippet.replace("$t","").replace("$c",""); //表示を更新
}

//定型文を初期化
function resetSnippet(InputEvent) {
    let target = InputEvent.currentTarget.id.replace('reset_','');//「snippet1〜5」
    localStorage.removeItem(target); //localstrageを削除
    switch (target) {
        case "snippet1":
            document.getElementById('edit_'+target).value = snippets_default[1];
            snippets[1] = snippets_default[1];
            document.getElementById(target).innerHTML = "<span class=\"fLabel\">F1:</span>"+snippets_default[1].replace("$t","").replace("$c",""); //表示を更新
            break;
        case "snippet2":
            document.getElementById('edit_'+target).value = snippets_default[2];
            snippets[2] = snippets_default[2];
            document.getElementById(target).innerHTML = "<span class=\"fLabel\">F2:</span>"+snippets_default[2].replace("$t","").replace("$c",""); //表示を更新
            break;
        case "snippet3":
            document.getElementById('edit_'+target).value = snippets_default[3];
            snippets[3] = snippets_default[3];
            document.getElementById(target).innerHTML = "<span class=\"fLabel\">F3:</span>"+snippets_default[3].replace("$t","").replace("$c",""); //表示を更新
            break;
        case "snippet4":
            document.getElementById('edit_'+target).value = snippets_default[4];
            snippets[4] = snippets_default[4];
            document.getElementById(target).innerHTML = "<span class=\"fLabel\">F4:</span>"+snippets_default[4].replace("$t","").replace("$c",""); //表示を更新
            break;
        case "snippet5":
            document.getElementById('edit_'+target).value = snippets_default[5];
            snippets[5] = snippets_default[5];
            document.getElementById(target).innerHTML = "<span class=\"fLabel\">F5:</span>"+snippets_default[5].replace("$t","").replace("$c",""); //表示を更新
           break;
    }

}


/*
 * 話者コード設定の保存
*/
document.getElementById('speaker_code').addEventListener('change', ()=>{    
    console.log("speaker code:"+document.getElementById('speaker_code').value);
    localStorage.setItem('speaker_code', document.getElementById('speaker_code').value);
});

