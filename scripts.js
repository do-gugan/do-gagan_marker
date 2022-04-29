// マークボタン
document.getElementById('mark').addEventListener('click', ()=>{
    const timecode = document.getElementById('timecode').innerText;
    console.log(timecode);

    //マーカーオブジェクトの作成
    let marker = document.createElement('div');
    marker.classList.add("record");
    const tc = document.getElementById('timecode').innerText;
    const memo = "あああ";
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

function HHMMSStoSec(hhmmss) {
    const tc = hhmmss.split(":");
    return parseInt(tc[0]*360) + parseInt(tc[1]*60) + parseInt(tc[2]);
}