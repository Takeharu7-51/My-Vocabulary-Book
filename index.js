'use strict';

let folders = [];
let clearButton = document.getElementById('clearButton');
let menu = document.getElementById('menu');
let folderArea = document.getElementById('folderArea');
let wordArea = document.getElementById('wordArea');
let chooseArea = document.getElementById('chooseArea');
let supportArea = document.getElementById('supportArea');
let firstArea = document.getElementById('firstArea');
let secondArea = document.getElementById('secondArea');
let messageArea = document.getElementById('messageArea');
let messageText = document.getElementById('messageText');
messageArea.style.visibility = 'hidden';

function folderClear() {
  //confirmの結果でデータを削除するかしないかを分岐させる
  let result = confirm('全てのデータを削除します。よろしいですか？');
  if (result == true) {
    localStorage.clear();
    location.reload();
  }
}

// メニューの処理
const array = ['editArea', 'memorizeArea'];
array.forEach((menu) => {
  document.getElementById(menu).style.display = "none";
});

// 選択されたメニューによって項目を切り替える
function switching(data) {
  const menus = ['makeArea', 'editArea', 'memorizeArea'];
  document.getElementById(data).style.display = "block";
  menus.filter(n => n !== data).forEach((menu) => {
    document.getElementById(menu).style.display = "none";
  });
}

// 今あるフォルダーを調べてフォルダーの配列を作成
let alreadyFolder = JSON.parse(localStorage.getItem('folder'));
if (alreadyFolder != null) {
  for (let i = 0; i < alreadyFolder.length; i++) {
    folders.push(alreadyFolder[i]);
  }
  makeOption(folders);
}

// フォルダーの配列をもとにフォームを反映させる
function makeOption(folders) {
  let selectFolder = document.getElementById('selectFolder');
  selectFolder.innerHTML = '';
  let folderCodes = [];
  let folderOptions = [];
  let memorizeCodes = [];
  for (let i = 0; i < folders.length; i++) {
    let option = document.createElement('option');
    option.setAttribute('value', folders[i]);
    option.innerHTML = folders[i];
    selectFolder.appendChild(option);
    // 編集エリアの処理
    folderCodes.push(`<input type="button" value="📂${folders[i]}" onclick="reflectWord('${folders[i]}')" id="editFolder${folders[i]}" class="folderButton">`);
    folderOptions.push(`<option id="${folders[i]}">${folders[i]}</option>`);
    // 覚えるエリアの処理
    memorizeCodes.push(`<input type="button" value="📂${folders[i]}" onclick="startMemorize('${folders[i]}')" id="memorizeFolder${folders[i]}" class="folderButton">`);
  }
  folderArea.innerHTML = '<h2>フォルダーの編集</h2>' + '<p>フォルダーの編集内容を選択してください</p>'
  + '<select id="whichEdit" class="selectDesign"><option value="change">フォルダー名を変更</option><option value="delete">フォルダーを削除</option></select><br>'
  + '<p>どのフォルダーを編集するかを選択して下さい</p>' + `<select id="whichFolder" class="selectDesign">${folderOptions}</select><br>` 
  + '<input type="button" value="編集を実行" onclick="folderEdit()" class="execution"><br>' + '<h2>単語の削除</h2>' + '<p>編集する単語があるフォルダーを選択してください</p>' 
  + folderCodes.join("");
  chooseArea.innerHTML = '<h2>どのフォルダー下の単語を学習しますか？</h2>' + memorizeCodes.join("");
}

// フォルダーの保存の処理
function folderSave() {
  let folderName = document.getElementById('folderName');
  // フォルダー名の入力欄が空でなければフォルダーを作成
  if (folderName.value === '') {
    let message = 'フォルダー名を入力してください！';
    let color = 'red';
    makeMessage(message, color);
  } else {
    folders.push(folderName.value);
    localStorage.setItem('folder', JSON.stringify(folders));
    folderName.value = '';
    let message = 'フォルダーを作成しました';
    let color = 'rgb(74, 250, 4)';
    makeMessage(message, color);
    makeOption(folders);
  }
}

// 単語の保存の処理
function wordSave() {
  let selectFolder = document.getElementById('selectFolder');
  let firstWord = document.getElementById('firstWord');
  let secondWord = document.getElementById('secondWord');
  // 単語の表と裏の入力欄が空でなければ単語を保存
  if (firstWord.value === '' || secondWord.value === '') {
    let message = '単語の表と裏　両方を入力してください！';
    let color = 'red';
    makeMessage(message, color);
  } else {
    let wordArr = [];
    let alredyWord = JSON.parse(localStorage.getItem(selectFolder.value));
    // 既存の単語が一つでも存在したらwordArrに順に格納
    if (alredyWord != null) {
      for (let i = 0; i < alredyWord.length; i++) {
        wordArr.push(alredyWord[i]);
      }
    }
    wordArr.push({ first: firstWord.value, second: secondWord.value });
    localStorage.setItem(selectFolder.value, JSON.stringify(wordArr));
    // 表と裏二つの入力欄を空欄に戻す
    firstWord.value = '';
    secondWord.value = '';
    reflectWord(selectFolder.value);
    let message = '単語を作成しました！';
    let color = 'rgb(74, 250, 4)';
    makeMessage(message, color);
  }
}

// 編集エリアの押されたフォルダーボタンに対応するフォルダーの中の単語を表示
function reflectWord(data) {
  // 編集エリアのフォルダーボタンの色を全て白にした後、選択されたフォルダーボタンの色を変える
  for (let i = 0; i < folders.length; i++) {
    document.getElementById(`editFolder${folders[i]}`).style.backgroundColor = "#fff";
  }
  document.getElementById(`editFolder${data}`).style.backgroundColor = "rgb(172, 222, 238)";

  let wordArr = JSON.parse(localStorage.getItem(data));
  if (wordArr === null || wordArr.length === 0) {
    wordArea.innerHTML = '<h3>このフォルダー下には一つも単語が存在しません</h3>';
  } else {
    let addCodes = [];
    for(let i = 0; i < Object.keys(wordArr).length; i++) {
      addCodes.push(`<div class="unitArea"><p>${wordArr[i].first}　▶︎　${wordArr[i].second}</p><input type="button" value="削除" onclick="wordDelete('${data}', '${i}')" class="deteteButton"></div>`);
    }
    wordArea.innerHTML = addCodes.join("");
  }
  // 単語の表示位置へスクロール
  let position = wordArea.getBoundingClientRect().top;
  setTimeout( function() {
    scrollTo(0, position);
  }, 200);
}

// フォルダーの編集の処理
function folderEdit() {
  let whichEdit = document.getElementById('whichEdit');
  let whichFolder = document.getElementById('whichFolder');
  let index = folders.indexOf(whichFolder.value);
  // フォルダー名の変更の処理
  if (whichEdit.value === 'change') {
    let changeFolder = prompt('変更する名前を入力してください');
    if (changeFolder != null　|| wordArr.length != 0) {
      folders.splice(index, 1, changeFolder);
      localStorage.setItem('folder', JSON.stringify(folders));
      makeOption(folders);
      let wordArr = JSON.parse(localStorage.getItem(whichFolder.value));
      // 名前が変更されたフォルダーを新しく保存し、古いフォルダーを削除
      if (wordArr != null || wordArr.length != 0) {
        localStorage.setItem(changeFolder, JSON.stringify(wordArr));
        localStorage.removeItem(whichFolder.value);
        reflectWord(changeFolder);
      }
    }
  // フォルダーの削除の処理
  } else {
    //confirmの結果でフォルダーを削除するかしないかを分岐させる
    let result = confirm('フォルダーを削除するとフォルダー下の単語も全て削除されます。よろしいですか？');
    if (result == true) {
      folders.splice(index, 1);
      localStorage.setItem('folder', JSON.stringify(folders));
      localStorage.removeItem(whichFolder.value);
      // フォームに削除された情報を反映
      makeOption(folders);
      reflectWord(whichFolder.value);
    }
  }
}

// 単語の削除の処理
function wordDelete(data, i) {
  let wordArr = JSON.parse(localStorage.getItem(data));
  wordArr.splice(i, 1);
  localStorage.setItem(data, JSON.stringify(wordArr));
  reflectWord(data);
  let message = '単語を削除しました！';
  let color = 'rgb(74, 250, 4)';
  makeMessage(message, color);
}

let firstArr = [];
let secondArr = [];

// 覚えるエリアの押されたフォルダーボタンに対応するフォルダーの中の単語のボタンを作成し表示させる
function startMemorize(data) {
  // 選択されたフォルダーボタンの色を変える
  document.getElementById(`memorizeFolder${data}`).style.backgroundColor = "rgb(172, 222, 238)";

  firstArea.innerHTML = '';
  secondArea.innerHTML = '';
  supportArea.innerHTML = '';
  let wordArr = JSON.parse(localStorage.getItem(data));
  if (wordArr === null || wordArr.length === 0) {
    supportArea.innerHTML = '<h3>このフォルダー下には一つも単語が存在しません</h3>';
  } else {
    // 配列の初期化
    firstArr = [];
    secondArr = [];
    // 全てのデータを削除、メニュー、フォルダーのボタンを押せなくし、透明度を下げる
    clearButton.style.pointerEvents = 'none';
    clearButton.style.opacity = '50%';
    menu.style.pointerEvents = 'none'
    menu.style.opacity = '50%';
    chooseArea.style.pointerEvents = 'none';
    chooseArea.style.opacity = '50%';
    // 終了ボタンを作成
    supportArea.innerHTML = '<input type="button" value="終了" onclick="finish()" id="finishButton">';
    // 表の配列：firstArrと裏の配列：　secondArrを作成
    for (let i = 0; i < wordArr.length; i++) {
      firstArr.push(`${wordArr[i].first},${i}`);
      secondArr.push(`${wordArr[i].second},${i}`);
    }
    // 表のボタンを作成しランダムに並び替えて表示
    for (let i = firstArr.length - 1; i >= 0; i--) {
      let rand = Math.floor( Math.random() * ( i + 1 ) );
      [firstArr[i], firstArr[rand]] = [firstArr[rand], firstArr[i]];
      let word = firstArr[i].split(',')[0];
      firstArea.insertAdjacentHTML('afterbegin', `<input type="button" value="${word}" onclick="firstCheck('${firstArr[i]}')" id="${firstArr[i]}" class="firstWord">`);
    }
    // 裏のボタンを作成しランダムに並び替えて表示
    for (let i = secondArr.length - 1; i >= 0; i--) {
      let rand = Math.floor( Math.random() * ( i + 1 ) );
      [secondArr[i], secondArr[rand]] = [secondArr[rand], secondArr[i]];
      let word = secondArr[i].split(',')[0];
      secondArea.insertAdjacentHTML('afterbegin', `<input type="button" value="${word}" onclick="secondCheck('${secondArr[i]}')" id="${secondArr[i]}" class="secondWord">`);
    }
  // 単語の表示位置へスクロール
    let position = supportArea.getBoundingClientRect().top;
    setTimeout( function() {
      scrollTo(0, position);
    }, 200);
  }
}

let matchCard = [];

// 表のボタンが押された際の処理
function firstCheck(data) {
  matchCard.push(data);
  document.getElementById(data).style.backgroundColor = "rgb(247, 183, 9)";
  // 表のボタンを全て押せなくし、透明度を下げる
  firstArea.style.pointerEvents = 'none';
  firstArea.style.opacity = '50%';
  if (matchCard.length == 2) {
    check('first');
  }
}

// 裏のボタンが押された際の処理
function secondCheck(data) {
  matchCard.push(data);
  document.getElementById(data).style.backgroundColor = "rgb(247, 183, 9)";
  // 裏のボタンを全て押せなくし、透明度を下げる
  secondArea.style.pointerEvents = 'none';
  secondArea.style.opacity = '50%';
  if (matchCard.length == 2) {
    check('second');
  } 
}

// 選択された単語の不正解を審査する
function check(data) {
  // 正解だった場合
  if (matchCard[0].split(',')[1] === matchCard[1].split(',')[1]) {
    // 正解した単語のボタン（表と裏）を削除
    document.getElementById(matchCard[0]).style.display = "none";
    document.getElementById(matchCard[1]).style.display = "none";
    // 表・裏のボタンを全て押せるようにし、透明度を元に戻す
    firstArea.style.pointerEvents = '';
    secondArea.style.pointerEvents = '';
    firstArea.style.opacity = '100%';
    secondArea.style.opacity = '100%';
    // 表・裏それぞれの配列から正解した単語を削除
    let indexofZero = firstArr.indexOf(matchCard[0]);
    firstArr.splice(indexofZero, 1);
    let indexofOne = secondArr.indexOf(matchCard[1]);
    secondArr.splice(indexofOne, 1);
    matchCard = []; // matchCardを初期化
    let message = '正解です！';
    let color = '#33CCFF';
    makeMessage(message, color);
    // ゲームをクリアした際の処理
    if (firstArr.length === 0 && secondArr.length === 0) {
      let message = 'GAME CLEAR';
      let color = 'rgb(74, 250, 4)';
      makeMessage(message, color);
      finish();
    }
  // 不正解だった場合
  } else {
    // 表・裏のボタンを全て押せるようにし、透明度を元に戻す
    firstArea.style.pointerEvents = '';
    secondArea.style.pointerEvents = '';
    firstArea.style.opacity = '100%';
    secondArea.style.opacity = '100%';
    // 表・裏の選択されたボタンそれぞれの色を元に戻す
    if (data === 'second') {
      document.getElementById(matchCard[0]).style.backgroundColor = "rgb(240, 113, 113)";
      document.getElementById(matchCard[1]).style.backgroundColor = "#228bc8";
    } else {
      document.getElementById(matchCard[0]).style.backgroundColor = "#228bc8";
      document.getElementById(matchCard[1]).style.backgroundColor = "rgb(240, 113, 113)";
    }
    matchCard = [];
    let message = '不正解です！';
    let color = 'red';
    makeMessage(message, color);
  }
}

// 終了するときの処理
function finish() {
  // 覚えるエリアのフォルダーボタンの色を全て白にする
  for (let i = 0; i < folders.length; i++) {
    document.getElementById(`memorizeFolder${folders[i]}`).style.backgroundColor = "#fff";
  }
  // 押せなくしていたボタンや聡明度を全て元に戻す
  firstArea.innerHTML = '';
  secondArea.innerHTML = '';
  supportArea.innerHTML = '';
  clearButton.style.pointerEvents = '';
  clearButton.style.opacity = '100%';
  menu.style.pointerEvents = ''
  menu.style.opacity = '100%';
  chooseArea.style.pointerEvents = '';
  chooseArea.style.opacity = '100%';
  if (firstArr.length != 0 && secondArr.length != 0) {
    let message = '終了しました！';
    let color = 'red';
    makeMessage(message, color);
  }
}

// 「正解しました！」などのメッセージの処理
function makeMessage(message, color) {
  messageArea.style.visibility = '';
  messageText.innerText = message;
  messageText.style.color = color;
  setTimeout(function(){ messageArea.style.visibility = 'hidden'; }, 2000);
}
