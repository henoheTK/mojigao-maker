/////所得系
//メッセージを伝えたりするところを所得
const resultDivided = document.getElementById('result-area');
//入力欄を所得
const TextInput = document.getElementById("input-text");
//キャンバスを所得
const canvas = document.getElementById('board');

//実行ボタンと、ダウンロードボタンを所得
const JikkouButton = document.getElementById('jikkou_button');
const DownloadButton = document.getElementById("download_button");



//キャンバスに描画するたびにここにキャンバスを入れてる
var nowCanvasURL = "";
//文字顔のURL
var mojigaoURL = "";

//スリープ関数用の、今画像ロード、描画してるか。
var isload = false;

//文字顔に使われている文字。ダウンロード用
var mojigaotext = "";

//文字の場所。パターンがいくつかの中にそれぞれの文字の場所のx座標とy座標
const mojipos =
  [
    [
      [-50, -150],
      [70, -150],
      [-140, 40]
    ],
    [
      [-100, -220],
      [30, -220],
      [60, -60],
      [-60, 130]
    ],
    [
      [-20, -10],
      [100, -10],
      [-20, -70],
      [100, -70],
      [-60, 110]
    ],
    [
      [-40, -20],
      [100, -20],
      [-20, -80],
      [100, -80],
      [60, -50],
      [-60, 130]
    ]
  ];
//パターンがいくつかの中にそれぞれの文字のxのサイズとyのサイズ
const mojisize =
  [
    [
      [400, 300],
      [400, 300],
      [800, 200]
    ],
    [
      [500, 375],
      [500, 375],
      [240, 260],
      [600, 120]
    ],
    [
      [320, 110],
      [320, 110],
      [300, 225],
      [300, 225],
      [600, 120]
    ],
    [
      [320, 110],
      [320, 110],
      [300, 224.10],
      [300, 224.10],
      [240, 260],
      [600, 120]
    ]
  ];




//キャンバスのサイズとりあえず手動
const canvasSize = 300;

//背景画像のサイズ:700*700
const backgrountSize = 700;
//体画像のサイズ:650*650
const bodySize = 650;
//顔のサイズ:300*300
const headSize = 300;
// 帽子画像のサイズ:400*400
const hatSize = 400;

/////たくさん使う数は変数に格納。
//顔が小さくなっちゃうので*30してる
const head_hat_size = (headSize + 30) / hatSize * canvasSize;
//顔が小さくなっちゃうので*30してる
const body_head_size = (headSize + 30) / bodySize * canvasSize;

/////背景と頭と帽子と。みたいな選択肢(？)絵の設定(？)ごとのパーツ(頭とか帽子とか)ごとのくり抜くやつ、サイズ、位置
const koteitrans = {
  head: {
    head: { kurinuki: [headSize, headSize], pos: [0, 0], size: [canvasSize, canvasSize] }
  },
  head_hat: {
    head: { kurinuki: [headSize, headSize], pos: [20, 30], size: [head_hat_size, head_hat_size] },
    hat: { kurinuki: [hatSize, hatSize], pos: [0, 0], size: [canvasSize, canvasSize] }
  },
  body_head: {
    body: { kurinuki: [bodySize, bodySize], pos: [0, 0], size: [canvasSize, canvasSize] },
    head: { kurinuki: [headSize, headSize], pos: [0, 0], size: [body_head_size, body_head_size] }
  },
  background_head: {
    head: { kurinuki: [headSize, headSize], pos: [25, 25], size: [head_hat_size, head_hat_size] },
    background: { kurinuki: [backgrountSize, backgrountSize], pos: [0, 0], size: [canvasSize, canvasSize] }
  },
  body_head_hat: {
    body: { kurinuki: [bodySize, bodySize], pos: [0, 0], size: [canvasSize, canvasSize] },
    head: { kurinuki: [headSize, headSize], pos: [0, 0], size: [body_head_size, body_head_size] },
    hat: { kurinuki: [hatSize, hatSize], pos: [-15, -20], size: [hatSize / bodySize * canvasSize, hatSize / bodySize * canvasSize] }
  },
  background_head_hat: {
    background: { kurinuki: [backgrountSize, backgrountSize], pos: [0, 0], size: [canvasSize, canvasSize] },
    head: { kurinuki: [headSize, headSize], pos: [20, 30], size: [head_hat_size, head_hat_size] },
    hat: { kurinuki: [hatSize, hatSize], pos: [0, 0], size: [canvasSize, canvasSize] }
  },
  background_body_head: {
    background: { kurinuki: [backgrountSize, backgrountSize], pos: [0, 0], size: [canvasSize, canvasSize] },
    body: { kurinuki: [bodySize, bodySize], pos: [0, 0], size: [canvasSize, canvasSize] },
    head: { kurinuki: [headSize, headSize], pos: [0, 0], size: [body_head_size, body_head_size] }
  },
  background_body_head_hat: {
    background: { kurinuki: [backgrountSize, backgrountSize], pos: [0, 0], size: [canvasSize, canvasSize] },
    body: { kurinuki: [bodySize, bodySize], pos: [0, 0], size: [canvasSize, canvasSize] },
    head: { kurinuki: [headSize, headSize], pos: [0, 0], size: [body_head_size, body_head_size] },
    hat: { kurinuki: [hatSize, hatSize], pos: [-10, -20], size: [hatSize / backgrountSize * canvasSize, hatSize / backgrountSize * canvasSize] }
  }
};

////体とかの画像のURL達。
const image_URLs = {
  hat:
  {
    Straw_hat: "https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/sosyoku/%E9%BA%A6%E3%82%8F%E3%82%89%E5%B8%BD%E5%AD%90.png"
  },
  body:
  {
    Sunflower: "https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/karada/%E3%81%B2%E3%81%BE%E3%82%8F%E3%82%8A.png"
  },
  background:
  {
    Sunflower_field: "https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/haike/%E3%81%B2%E3%81%BE%E3%82%8F%E3%82%8A%E7%95%91.png"
  }
}

////体によって顔の位置が違うので、体ごとの頭と帽子の位置。
const posByKarada = {
  Sunflower: [75.5, 45]
}
/////体、帽子、背景の、それぞれどれを使うか。
var image_Num = {
  hat: "none",
  body: "none",
  background: "none"
}





/////ダウンロードボタンがおされたら、ダウンロードする関数
DownloadButton.onclick = () => {
  //aタグを作成
  let link = document.createElement('a');
  //aタグのherf属性にキャンバスをURL化したものを入れる。
  link.href = canvas.toDataURL();
  //ダウンロード時の名前を、入力されたテキスト.pngに設定
  link.download = mojigaotext + '.png';
  //リンクを強制的にクリックさせて、ダウンロード
  link.click();
}



//ロードと描画が終わるまで待つ処理
function wait(callbackFunc) {
  // 0.3秒間隔で無名関数を実行
  var id = setInterval(function () {
    // 画像のロード、描画が終わった、待機終了。
    if (isload === false) {
      // タイマー停止
      clearInterval(id);
      // 完了時、コールバック関数を実行
      if (callbackFunc) callbackFunc();
    }
  }, 300);
}


//実行ボタンが押されたなら
JikkouButton.onclick = () => {
  let text = TextInput.value;
  console.log("ん"+text);
  if (text) {
    //waitするか変数をしてねってする
    isload = true;
    //文字顔の型の番号変数
    let kaotype = 0;
    //描画する画像の配列
    let images = new Array();

    //文字顔の型を指定
    kaotype = whichMojigao(text);
    //一文字ごとの画像を入れる
    images = setMojigao(text, kaotype);


    //画像の、0,0からどこまでくり抜いたものを描画するか。こんな感じの配列を宣言[[150,150],[150,150],[150,150]...]。
    //[150,150]の数は、文字顔の文字パーツの数+1(顔の後ろの白いやつ)。顔の後ろの白丸と、文字のくり抜くサイズは等しいため
    let img_kurinuki = Array(mojipos[kaotype].length + 1).fill(Array(2).fill(150), Array(2).fill(150));
    //パーツごとの位置を設定。白丸の位置と、文字ごとの位置を、つないでる
    let img_pos = images_pos = [koteitrans["head"]["head"].pos].concat(mojipos[kaotype]);
    //上のサイズ版。
    let img_size = images_pos = [koteitrans["head"]["head"].size].concat(mojisize[kaotype]);

    //画像をロードが終わるまでまで待ってから描画
    loadimages(images, img_kurinuki, img_pos, img_size);
    //画像の描画が終わるまで待つ
    wait(function () {
      //背景など使用しているサブパーツの種類を入れる配列。「ひまわり」とかじゃなくて、「体」とかが入る
      let others_array = new Array();
      //こっちは、使用するサブパーツの種類を「_」でつないだ文字列が入る。
      let others = "";

      //描画するサブパーツの種類順に、使うかを判別
      if (image_Num["background"] !== "none") {
        others_array.push("background");
        others += "background_"
      }
      if (image_Num["body"] !== "none") {
        others_array.push("body");
        others += "body_"
      }
      //顔だけは固定であるので、条件なしに追加
      others += "head_"
      others_array.push("head")
      if (image_Num["hat"] !== "none") {
        others_array.push("hat");
        others += "hat_"
      }
      //使用するパーツを全部つなげた文字列を、「head_hat_」から、「head_hat」にする。
      others = others.slice(0, -1);

      //顔以外のサブパーツがあるなら
      if (others !== "head") {
        //文字顔のURLを今のキャンバスに設定
        mojigaoURL = nowCanvasURL;
        ClearCanvas();
        /////描画する画像の配列とか、描画する画像の位置配列とかを初期化
        images = [];
        img_kurinuki = [];
        img_pos = [];
        img_size = [];
        others_array.forEach(other => {
          //頭なら、予め格納しておいたものを。それ以外なら、画像配列から。描画する画像配列に格納。
          if (other === "head") {
            images.push(URLtoImage(mojigaoURL));
          } else {
            images.push(URLtoImage(image_URLs[other][image_Num[other]]));
          }
          //くり抜く場所を、サブパーツの種類ごとに配列からもらい、描画する画像のくり抜き位置配列に格納
          img_kurinuki.push(koteitrans[others][other].kurinuki);
          //画像のサイズを、サブパーツの種類ごとに配列からもらい、描画する画像位置配列に格納
          img_size.push(koteitrans[others][other].size);
          //身体があるかつ、帽子と顔のいちを追加しようとしているなら。どのの体かによって帽子と顔の位置は、変わるため。
          if (image_Num["body"] !== "none" && (other === "hat" || other === "head")) {
            //体ごとの顔の位置＋帽子の位置が若干違うための微調整。
            img_pos.push([posByKarada[image_Num["body"]][0] + koteitrans[others][other].pos[0],
            posByKarada[image_Num["body"]][1] + koteitrans[others][other].pos[1]]);
          } else {
            //画像の場所を、サブパーツの種類ごとに配列からもらい、描画する画像の位置配列に格納  
            img_pos.push(koteitrans[others][other].pos)
          }
        });
        //画像のロードが終わるまで待ってから描画。
        loadimages(images, img_kurinuki, img_pos, img_size);
      }
    });

    mojigaotext = text;//ダウンロードの名前用の変数に、今の文字顔の文字を代入
  }
}

//どの文字顔を使うか関数
function whichMojigao(text) {
  //文字顔の型(文字の位置)配列の長さ分の[0,1,2]みたいな連番の配列を作る
  const mojitypes = [...Array(mojipos.length).keys()];
  //(ずっと)繰り返す！
  while (true) {
    //連番配列の中から、ランダムで一つ取り出す。
    let kaotype = Math.floor(Math.random() * mojitypes.length);
    //ランダムに選んだ文字顔の型が文字数に合いそうなら
    if (((mojipos[mojitypes[kaotype]].length) % (text.length)) === 0) {
      //連番配列の何番目かになってるんで、文字顔の型(文字の位置)の何番目かに変更
      kaotype = mojitypes[kaotype];
      return kaotype;
      //文字顔の型が文字数に合わなかったら
    } else {
      //合わなかったやつを連番配列から消す
      mojitypes.splice(kaotype, 1);
    }
    //(ないはずだけど)番号配列の長さが0(以下)になったら(無限ループ対策)
    if (mojitypes.length <= 0) {
      console.log("文字数に合う文字顔の型がありません。");//ないよーっていう
      return;
    }
  }
}

//入力された文字を、画像にして返す関数
function setMojigao(text, kaotype) {
  //画像の配列
  let teximages = new Array();
  //顔の後ろの白丸みたいなやつを画像配列にいれる。
  teximages.push(URLtoImage("https://raw.githubusercontent.com/henoheTK/mojigao-maker/master/images/%E9%A1%94%E8%83%8C%E6%99%AF.png"));
  ClearCanvas();

  /////短い文字が入力されたときも返せるように二重ループ
  //文字顔のの文字数回繰り返す。入力された文字回足してる。
  for (let i = 0; i < mojipos[kaotype].length; i += text.length) {
    //入力された文字の長さ会繰り返す。
    for (let j = 0; j < text.length; j++) {
      //画像配列に文字を追加
      teximages.push(MakeMojiImage(text[j]));
    }
  }
  return teximages;
}

//文字を画像にするよ関数
function MakeMojiImage(moji) {
  //文字をテキストとしてキャンバスに描画
  DrowText(moji);
  //キャンバスをimageに封じ込める。
  let image = URLtoImage(canvas.toDataURL());
  ClearCanvas();
  return image;
}

//文字をcanvasに書く変数。(一文字ずつでしか使用していない。複数の文字でもいけるはず)
function DrowText(text) {
  //キャンバスの何かを所得(わかってない)
  const ctx = canvas.getContext("2d");
  //フォントを指定
  ctx.font = "48px serif";
  //書く。
  ctx.fillText(text, 30, 150);
}

//URLをimage型(？)に変換して返すよ関数
function URLtoImage(url) {
  var image = new Image();
  //これがないとキャンバスが汚染されてダウンロードとかできなくなる(意味はわかってない)
  image.crossOrigin = "anonymous";
  //キャンバスをURLにしてimageに代入
  image.src = url;
  return image;
}

//画像のロード完了まで待って、描画する関数
function loadimages(teximages, img_kurinuki, img_pos, img_size) {
  //ロードが終わった画像の数
  let imgCount = 0;
  
  //文字顔の型(文字の位置配列)の文字数÷入力された、文字数回繰り返す。
  for (let i = 0; i < teximages.length; i++) {
    //画像の読み込みが終わったら
    teximages[i].onload = function () {
      //いくつ読み込み終わったか変数を+1
      imgCount++;
      // すべての画像読み込みが完了した時
      if (imgCount >= teximages.length) {
        //描画するよ関数
        DrowResults(teximages, img_kurinuki, img_pos, img_size);
      }
    }
  }
}

// 各画像を順番に描画するよ関数
function DrowResults(images, img_kurinuki, img_pos, img_size) {
  //キャンパスのなにかを所得してる
  
  let context = canvas.getContext('2d');
  //文字とかの画像回繰り返す
  for (var i = 0; i < images.length; i++) {
    //配列に入ってる位置とかに画像を描画。
    context.drawImage(images[i], 0, 0, img_kurinuki[i][0], img_kurinuki[i][1], img_pos[i][0], img_pos[i][1], img_size[i][0], img_size[i][1]);
  }
  //今のキャンバスのURLを格納
  nowCanvasURL = canvas.toDataURL();
  isload = false;
}
//キャンバスをまっさらにする関数
function ClearCanvas() {
  //キャンバスの何かを所得
  let context = canvas.getContext('2d');
  //0,0からデカさ分クリア
  context.clearRect(0, 0, canvas.width, canvas.height);
}





/////帽子系のボタンを所得
const noneButton = document.getElementById("none-hat_button");
const mugiwaraButton = document.getElementById("mugiwara_button");

/////帽子系のボタンの押されたら処理
noneButton.onclick = () => {
  image_Num["hat"] = "none";
}
mugiwaraButton.onclick = () => {
  image_Num["hat"] = "Straw_hat";
}



/////体系のボタンを所得
const himawariButton = document.getElementById("himawari_button");

/////体系のボタンの押されたら処理
himawariButton.onclick = () => {
  image_Num["body"] = "Sunflower";
}



/////背景系のボタンを所得
const Sunflower_fieldButton = document.getElementById("Sunflower_field_button");

/////背景系のボタン
Sunflower_fieldButton.onclick = () => {
  image_Num["background"] = "Sunflower_field";

}
