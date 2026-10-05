import { CARD_BOOK } from './content.js';

const byId = id => document.getElementById(id);

export function createUI() {
  let toastTimer = 0;
  const elements = {
    title: byId('titleScreen'), event: byId('eventScreen'), pause: byId('pauseScreen'),
    ending: byId('endingScreen'), help: byId('helpScreen'), hand: byId('hand'),
    count: byId('handCount'), progress: byId('progressFill'), progressLabel: byId('progressLabel'),
    sceneTitle: byId('sceneTitle'), toast: byId('toast')
  };

  function toast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => elements.toast.classList.remove('show'), 2200);
  }

  function renderHand(state, onUseCard) {
    elements.hand.innerHTML = '';
    for (const id of state.hand) {
      const card = CARD_BOOK[id];
      const button = document.createElement('button');
      button.className = `card${card.replay ? ' replay' : ''}`;
      button.setAttribute('role', 'listitem');
      button.innerHTML = `<span class="card-icon">${card.icon}</span><strong>${card.name}</strong><small>${card.kind} · ${card.desc}</small>`;
      button.addEventListener('click', () => {
        if (!elements.event.classList.contains('hidden')) onUseCard(id);
      });
      elements.hand.appendChild(button);
    }
    for (let index = state.hand.length; index < 3; index++) {
      const empty = document.createElement('div');
      empty.className = 'empty-card';
      empty.textContent = '沿路還有新卡';
      elements.hand.appendChild(empty);
    }
    elements.count.textContent = `${state.hand.length} / 3`;
  }

  function updateProgress(state, world) {
    const percent = Math.min(100, world.player.x / world.length * 100);
    elements.progress.style.width = `${Math.max(2, percent)}%`;
    elements.progressLabel.textContent = state.completed.length === 3
      ? '快到休息的地方了'
      : `沿著小徑慢慢走　${Math.round(percent)}%`;
    elements.sceneTitle.textContent = state.completed.length === 3 ? '林間休息地' : '晨光啟程';
  }

  function showCardSwap(id, state, { onReplace, onKeep }) {
    const screen = document.createElement('div');
    screen.className = 'screen';
    screen.id = 'swapScreen';
    screen.setAttribute('role', 'dialog');
    screen.setAttribute('aria-modal', 'true');
    screen.innerHTML = `<section class="small-modal"><span class="eyebrow">口袋裡已經有三張卡</span><h2>要帶上「${CARD_BOOK[id].name}」嗎？</h2><p>選一張舊卡放下；也可以先不替換。</p><div class="event-choices">${state.hand.map((old, index) => `<button class="choice-button" data-swap="${index}"><span>${CARD_BOOK[old].name}<small>${CARD_BOOK[old].kind}</small></span><span>替換 →</span></button>`).join('')}</div><button class="ordinary-button" id="keepCards">先不替換</button></section>`;
    document.body.appendChild(screen);
    screen.querySelectorAll('[data-swap]').forEach(button => button.addEventListener('click', () => {
      onReplace(Number(button.dataset.swap));
      screen.remove();
    }));
    screen.querySelector('#keepCards').addEventListener('click', () => {
      onKeep();
      screen.remove();
    });
  }

  function showEvent(index, event, state, { onCard, onCombo, onOrdinary }) {
    const byEventId = id => byId(id);
    byEventId('eventStep').textContent = event.step;
    byEventId('eventTitle').textContent = event.title;
    byEventId('eventCopy').textContent = event.copy;
    byEventId('eventFlavor').textContent = event.flavor;
    byEventId('eventIllustration').querySelector('span').textContent = event.icon;
    byEventId('comboNote').classList.toggle('hidden', index !== 0);
    const choices = byEventId('eventChoices');
    choices.innerHTML = '';
    const available = [...new Set(event.cards.filter(id => state.hand.includes(id)))];
    available.forEach(id => {
      const card = CARD_BOOK[id];
      const button = document.createElement('button');
      button.className = 'choice-button';
      button.innerHTML = `<span>${card.name}<small>${card.kind} · ${card.desc}</small></span><span>使用 →</span>`;
      button.addEventListener('click', () => onCard(id));
      choices.appendChild(button);
    });
    if (index === 0 && state.hand.includes('check') && state.hand.includes('together')) {
      const combo = document.createElement('button');
      combo.className = 'choice-button';
      combo.innerHTML = '<span>出發檢查 ＋ 一起整理<small>卡牌搭配 · 多找到一件用品</small></span><span>一起使用 →</span>';
      combo.addEventListener('click', onCombo);
      choices.appendChild(combo);
    }
    const ordinary = byEventId('ordinaryButton');
    ordinary.textContent = `普通做法：${event.normal}`;
    ordinary.onclick = onOrdinary;
    elements.event.classList.remove('hidden');
  }

  function showEventResult(text, onContinue) {
    byId('eventFlavor').textContent = text;
    byId('eventChoices').innerHTML = '';
    const ordinary = byId('ordinaryButton');
    ordinary.textContent = '繼續往前走';
    ordinary.onclick = onContinue;
  }

  function showEnding(state, firstUnlock) {
    byId('endingCopy').textContent = '小狐狸把毯子鋪好，接手整理剩下的東西。你靠在樹下，聽風穿過樹梢，安心地休息了一會兒。';
    byId('endingCollection').innerHTML = state.items.length
      ? state.items.map(item => `<span class="collect-chip">✦ ${item}</span>`).join('')
      : '<span class="collect-chip">今天沒有收集任何東西，也很好。</span>';
    byId('unlockNote').classList.toggle('hidden', !firstUnlock);
    elements.ending.classList.remove('hidden');
  }

  function show(screen) { elements[screen].classList.remove('hidden'); }
  function hide(screen) { elements[screen].classList.add('hidden'); }
  function isHidden(screen) { return elements[screen].classList.contains('hidden'); }

  return { elements, toast, renderHand, updateProgress, showCardSwap, showEvent, showEventResult, showEnding, show, hide, isHidden };
}
