export const SAVE_KEY = 'morning-path-save-v1';

export const CARD_BOOK = Object.freeze({
  check: { name: '出發檢查', kind: '準備', icon: '☑', desc: '找找需要的用品' },
  support: { name: '夥伴支援', kind: '求助', icon: '♡', desc: '一起想辦法' },
  breathe: { name: '深呼吸', kind: '照顧自己', icon: '☼', desc: '先慢下來，再處理' },
  detour: { name: '彈性改道', kind: '替代方案', icon: '↗', desc: '繞過混亂的小路' },
  together: { name: '一起整理', kind: '合作', icon: '✿', desc: '分工，事情更輕鬆' },
  rest: { name: '小小休息', kind: '照顧自己', icon: '☕', desc: '停一下，喘口氣' },
  memory: { name: '晨光回憶', kind: '重玩卡', icon: '✦', desc: '帶著旅程的溫柔出發', replay: true }
});

export const EVENTS = Object.freeze([
  {
    id: 'supplies', title: '出發前，少了一樣東西', step: '第一段・準備用品', icon: '⌕',
    copy: '背包裡的水壺不見了。小徑旁有幾條岔路，晨風把一張小紙條吹到你腳邊。',
    flavor: '「不用一次找齊所有東西，先看看現在最需要什麼。」',
    cards: ['check', 'together', 'detour', 'breathe', 'memory'], normal: '把背包和附近的小路再看一眼',
    result: {
      check: '你照著清單慢慢檢查，在樹根旁找到了水壺。出發前看一眼，心裡踏實多了。',
      together: '你和小狐狸分頭找了一下。除了水壺，還撿到一條柔軟的小毯子。',
      detour: '你們繞到花叢後面，正好找到水壺。路邊的小花也像是在跟你們打招呼。',
      breathe: '你先停下來深呼吸。心情安定後，很快就看見水壺掛在背包側邊。',
      support: '小狐狸幫忙聞了聞，帶你找到樹根旁的水壺。',
      rest: '你們坐在石頭上歇了一下。水壺就在長椅旁，找東西也不用慌。',
      memory: '晨光回憶讓你想起第一次出發時，小狐狸替你撿起的那片葉子。你們一起找到水壺，心裡也多了一份熟悉的安心。'
    }
  },
  {
    id: 'friend', title: '小狐狸有點不知所措', step: '第二段・夥伴需要幫忙', icon: '♡',
    copy: '小狐狸的圍巾勾在一簇柔軟的藤蔓上。牠試著自己拉了幾次，耳朵都垂下來了。',
    flavor: '「我可以試試看……不過，如果有人一起想辦法，好像也不錯。」',
    cards: ['support', 'breathe', 'together', 'check'], normal: '陪小狐狸一起把圍巾輕輕解開',
    result: {
      support: '你邀請小狐狸一起慢慢解開藤蔓。牠的耳朵又豎了起來：「一起做，真的比較不怕！」',
      breathe: '你們先停一下，等藤蔓不再晃動，再一起把圍巾解了下來。',
      together: '你扶著藤蔓，小狐狸拉住圍巾。合作一下，事情很快就完成了。',
      check: '你仔細看看圍巾卡住的位置，找到最容易鬆開的一端。',
      detour: '你們沿著藤蔓繞到另一邊，圍巾就自然滑了下來。',
      rest: '你們先在草地坐一會兒。藤蔓鬆開了，圍巾也回到小狐狸身上。'
    }
  },
  {
    id: 'tangle', title: '一團忙亂擋住小徑', step: '第三段・通過混亂怪', icon: '❧',
    copy: '一團打結的藤蔓和紙片滾成了圓圓的「混亂怪」，不兇，只是把路口塞得滿滿的。',
    flavor: '「可以繞路、一起整理，或者先歇口氣。路總會有別的走法。」',
    cards: ['detour', 'breathe', 'support', 'together', 'check', 'rest'], normal: '和小狐狸一起找一條走得過去的路',
    result: {
      detour: '你們沿著花叢旁的小徑繞過混亂怪。路邊還藏著一朵小花。',
      breathe: '你先深呼吸，再和小狐狸一起把打結的地方鬆開。混亂怪變成了整齊的小草堆。',
      support: '你請小狐狸幫你扶住藤蔓，兩個人一起把路口清出來。',
      together: '小狐狸扶著紙片，你整理藤蔓。路口很快就變得清爽了。',
      check: '你找到最容易整理的一小段，從那裡開始，混亂怪很快就解開了。',
      rest: '你們先在路邊歇一會兒。混亂怪自己鬆開了一點，前方也出現了空隙。'
    }
  }
]);

export function createWorld() {
  return {
    length: 3100, ground: 0, camera: 0, width: 900, height: 330,
    player: { x: 85, y: 0, vy: 0, onGround: true }, fox: { x: 42 },
    keys: {}, touch: { left: false, right: false },
    obstacles: [{ x: 1010, kind: 'log', seen: false }, { x: 1810, kind: 'stone', seen: false }, { x: 2165, kind: 'log', seen: false }],
    items: [
      { x: 410, name: '晨光葉片', got: false }, { x: 915, name: '水壺', got: false },
      { x: 1290, name: '小狐狸的鈴鐺', got: false }, { x: 1740, name: '柔軟圍巾', got: false },
      { x: 2210, name: '亮亮的羽毛', got: false }, { x: 2590, name: '安靜的苔蘚', got: false }
    ],
    pickups: [{ x: 510, id: 'together', got: false }, { x: 1160, id: 'detour', got: false }, { x: 1950, id: 'rest', got: false }],
    gates: [620, 1450, 2310],
    clouds: [
      { x: 110, y: 50, s: 1 }, { x: 410, y: 95, s: .7 }, { x: 730, y: 55, s: 1.1 },
      { x: 980, y: 110, s: .75 }, { x: 1330, y: 65, s: 1 }, { x: 1690, y: 100, s: .8 },
      { x: 2090, y: 58, s: 1.1 }, { x: 2490, y: 90, s: .8 }, { x: 2890, y: 53, s: 1 }
    ]
  };
}
