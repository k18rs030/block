// This is a JavaScript file

var ncmbController = {
  APPLICATION_KEY: "3c6aa205aa61cae7ad1eb542e46316832abf4ff517e76240ab929df9942d113f",
  CLIENT_KEY: "43588653503bd7448d16f7a4af4ab65cde09b35b0191508900bf83b7038043e1",

  ncmb: null,
  currentUser: null,
  screenSize: null,

  

  init: function(screenSize) {
      var self = this;
      self.ncmb = new NCMB(self.APPLICATION_KEY, self.CLIENT_KEY);
      self.screenSize = screenSize;
    },
    // スコア送信
sendScore: function(score) {
    var self = this;

    // [1]Score（クラス）を生成
    var Score = self.ncmb.DataStore("ScoreClass");

    // [2]インスタンス生成、スコア数値をフィールド名"score"にセット
    var scoreData = new Score({score: score});

    // [3]送信処理
    scoreData.save()
        .then(function (saved) {
          
      // 順位を求める
// ”score” フィールドの値が score より大きいものを取得
Score.greaterThan("score", score)
    .count()    // 件数を結果に含める
    .fetchAll()
    .then(function(scores){
        // countの結果は、取得データscoresのcountプロパティに含まれる

        // 0件のとき正しく動作するように条件分岐
        var rank = (scores.count !== undefined) ? parseInt(scores.count) + 1 : 1;

        // ダイアログの表示
        if(typeof navigator.notification !== 'undefined'){
            navigator.notification.alert(
                "今回の順位は #" + rank + " でした！",
                function(){},
                "スコア送信完了！"
                );
        } else {
            alert("スコア送信完了！\n今回の順位は #" + rank + " でした！");
        }
    })
        })
       .catch(function(err){
            console.log(err);
        });
},
// ユーザー登録
createUser: function() {
    var self = this;

    //適当なUUIDを作成
    var uuid = self.uuid();

    //ユーザークラスのインスタンスを作成
    //userNameとパスワードにはuuidを設定
    var user = new self.ncmb.User({userName:uuid, password:uuid});

    //会員登録を行うメソッドを実行
    user.signUpByAccount()
        .then(function(user){
            // 登録完了後ログイン
            localStorage.setItem("userName", uuid);
            alert("ユーザー登録に成功しました！");
        })
        .catch(function(err){
            // userName が被った場合はエラーが返る
            alert("ユーザー登録に失敗しました");
        });
},
uuid: function() {
var uuid = "", i, random;
for (i = 0; i < 32; i++) {
random = Math.random() * 16 | 0;
if (i == 8 || i == 12 || i == 16 || i == 20) {
uuid += "-"
}
uuid += (i == 12 ? 4 :
(i == 16 ? (random & 3 | 8) :
random)).toString(16);
}
return uuid;
},

}
          
      