/* 配列の順番をランダムにする仮定 */

// 順番をランダムにしたい配列 array
let array = this.letters
// 連続回数
const roop = array.length 
// ダミー配列
let dammyArray = []

for(let i=0;i<roop;i++) {  
console.log((i + 1) + '回目')
// ランダム番目の要素のindex
let j = Math.floor(Math.random() * array.length)
// ランダム番目の要素を取り出す
let ranYouso = array[j]
console.log('取り出す要素:' + ranYouso)
// ランダム番目の要素を切り取る
array.splice(j,1)
console.log('削たった後のarray：' + array)
console.log('へったあとの長さ:' + array.length)
// dammyArray へランダムな要素を入れ込む
dammyArray.push(ranYouso)
console.log('ダミー' + dammyArray)
}