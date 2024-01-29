# 動画眼マーカー
UTを見学しながら動画眼用のマーカーを作成するインデクサWebアプリ。
UTの記録ツール（レコーダー、OBS Studio、ATEM Miniなど）とタイムコードを同期させ、セッションの節目や見所にインデックスを打ちます。作成したインデックスリストをローカルに保存し、記録ツールで録画した動画ファイルと一緒に動画眼に読み込むことができます。

ブラウザ上で完結動作し、サーバーにデータを保存することはありません（記入後は必ずファイルを保存してください）。

実際の使い方は[こちらの記事](https://do-gugan.com/blog/archives/2023/12/do-gagan_timestamp_sync.html)にまとめています。

## 動作環境
一般的なモダンブラウザで動作することを想定していますが、開発はMicrosoft Edge/Google Chromeを中心に行っており、意図通りに機能する可能性が高いです。

## 実装目標
- ローカルネットワーク上のOBS Studio、ATEM Miniとタイムコードを同期
- 外部サーバーを使いづらい環境／組織向けに、PCのローカルフォルダに一式ダウンロードして運用できること

## リンク
- 利用ページ： https://do-gugan.com/tools/marker/
- 旧バージョン（末尾にバージョン番号）： https://do-gugan.com/tools/marker/1.0/
- サポートページ: https://do-gugan.com/tools/do-gagan3/marker.html
