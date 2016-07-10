# README

現在の線幅に対する割合（パーセント）を指定すると、オブジェクトが持っている線すべての幅を一気に変更します。

<div class="fig center" style="margin-bottom: 20px;"><img src="http://www.graphicartsunit.com/saucer/images/resize-all-stroke-width/eye.png" alt="イメージ" class="noshadow"></div>


### 更新履歴

* **0.6.0：数値調整用のスライダーを追加**
* 0.5.5：0.5.4でプレビューが動作しなくなったのを修正
* 0.5.4：値の先頭に0が入力できてしまう問題を修正／最大値の警告文を修正
* 0.5.3：修飾キーでのプレビュー更新の対応をCC以降に変更
* 0.5.2：CS6で数値の入力が逆になる不具合に対処
* 0.5.1：新規作成（公開）

----

### 対応バージョン

* Illustrator CS5／CS6／CC／CC 2014／CC 2015

----

### ダウンロード

* [スクリプトをダウンロードする](https://github.com/gau/resize-all-stroke-width/archive/master.zip)

----

### インストール方法

1. ダウンロードしたファイルを解凍します。
2. 所定の場所に「すべての線幅を変更.jsx」をコピーします。Windows版ではお使いのIllustratorの種類によって保存する場所が異なりますのでご注意ください。
3. Illustratorを再起動します。
4. `ファイル > スクリプト > すべての線幅を変更`と表示されていればインストール成功です。

#### ファイルをコピーする場所

| OS | バージョン | フォルダの場所 |
|:-----|:-----|:-----|
| Mac | 全 | /Applications/Adobe Illustrator *(ver)*/Presets/ja_JP/スクリプト/ |
| 32bit Win | CS5まで | C:\Program Files\Adobe\Adobe Illustrator *(ver)*\Presets\ja_JP\スクリプト\ |
| 64bit Win | CS5, CS6（32bit版） | C:\Program Files (x86)\Adobe\Adobe Illustrator *(ver)*\Presets\ja_JP\スクリプト\ |
| 64bit Win | CS6（64bit版）以降 | C:\Program Files\Adobe\Adobe Illustrator *(ver)* (64 Bit)\Presets\ja_JP\スクリプト\ |

* *(ver)*にはお使いのIllustratorのバージョンが入ります
* 本スクリプトは、CS4以前では動作を検証しておりません

----

### 通常操作で線幅を変更する

<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/resize-all-stroke-width/fig01.png" alt="通常操作で線幅を変更する" class="noshadow"></div>

上図左端のように、2つの線が追加されたオブジェクトがあるとします。［線パネル］を使って、このオブジェクトの線幅を調整すると、どちらか一方だけが変更されることになります。変更されなかったほうの線幅を変えるには、［アピアランスパネル］で一度クリックして選択してから作業する必要があります。例えば、これが5本の線を持つオブジェクトなら、同じ操作を5回繰り返すことになるわけです。

----

### このスクリプトを使うと

<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/resize-all-stroke-width/fig02.png" alt="このスクリプトを使うと" class="noshadow"></div>

オブジェクトを選択した状態でスクリプトを実行すると、比率を入力するダイアログが表示されます。現在の線幅に対し、変更したい比率（パーセント単位）を半角数字で入力して実行すると、オブジェクトが持つすべての線の幅を一気に変更できます。複数のオブジェクトを選択した状態でも実行可能です。バージョン0.6.0からは、スライダーによる数値調整が可能となりました。

----

### テキストの基本属性は対象外

<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/resize-all-stroke-width/fig03.png" alt="テキストの基本属性は対象外" class="noshadow"></div>

テキストオブジェクトの線には2つの種類があります。長くなるのでここでは詳細に触れませんが、ざっくり言うと［アピアランスパネル］を使って追加した線と、もともとテキストオブジェクトが持っている基本属性としての線です。基本属性の線は、スクリプト側から操作するのが難しいため、現時点では対象外としています。［アピアランスパネル］で追加した線だけが対象です。いい方法を思いついたら、後日追加してバージョンアップするかもしれません（しないかもしれません）。

----

### プレビューをカスタマイズする

このスクリプトでは、ダイアログで数値を1文字入力するごとにリアルタイムで結果がプレビューされます。しかし、処理に時間がかかるものなどは、待ち時間が発生して負担に感じるかもしれません。プレビューの方法は2種類用意していますので、希望する動作に合わせてカスタマイズしてご利用ください。

スクリプトの14行目にある`onChanging`の値（boolean型）を変更します。内容は以下の通りです。

|値|内容|
|:-----|:-----|
|true|値を変更するたびにプレビュー更新（初期値）|
|false|比率のテキストフィールドからフォーカスがはずれたとき、または、<strike>CS6</strike>CC以降では、command（Windows）、control（Ctrl）、option（Alt）のいずれかのキーを押したタイミングでプレビュー更新|

* 値を変更するたびに更新する場合 → `'onChanging' : true`  
* 値を変更するたびに更新しない場合 → `'onChanging' : false`

----

### 注意

* **データが多い時は処理に時間がかかります。必ず事前にドキュメントを保存してから実行してください。**
* 必要なオブジェクトが選択されていないときは、警告を表示して処理を中断します。
* テキスト基本属性の線や、スタティックシンボル内の線などは処理できません。
* ダイナミックシンボルは、インスタンス内のオブジェクトが選択されているときだけ処理します。インスタンス全体が選択されているときは処理できません。
* グループ内のオブジェクトも処理されます。
* オブジェクトの種類や構造によって意図しない結果になる可能性もゼロではありません。

----

### 免責事項

* このスクリプトを使って起こったいかなる現象についても制作者は責任を負えません。すべて自己責任にてお使いください。
* CS5からCC 2015で動作の確認はしましたが、OSのバージョンやその他の状況によって実行できないことがあるかもしれません。もし動かなかったらごめんなさい。

----

### ライセンス

* すべての線幅を変更.jsx
* Copyright (c) 2016 Toshiyuki Takahashi
* Released under the MIT license
* [http://opensource.org/licenses/mit-license.php](http://opensource.org/licenses/mit-license.php)
* Created by Toshiyuki Takahashi ([Graphic Arts Unit](http://www.graphicartsunit.com/))
* [Twitter](https://twitter.com/gautt)