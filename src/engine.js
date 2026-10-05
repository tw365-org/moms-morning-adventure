import { CARD_BOOK, EVENTS } from './content.js';
import { clamp, loadSave, restoreSave, saveGame } from './state.js';

export function createGameController({ state, world, ui, renderer, audio }) {
  let lastTime = 0;
  let toastTimer = 0;

  function save() {
    if (!saveGame(state, world)) ui.toast('這個瀏覽器目前無法保存進度。');
  }

  function restore(data = loadSave()) {
    restoreSave(state, world, data);
    ui.renderHand(state, useEventCard);
    ui.updateProgress(state, world);
  }

  function start(resume = false) {
    if (resume) {
      restore();
    } else {
      const wasUnlocked = state.unlocked;
      const replayCount = state.replayCount;
      Object.assign(state, {
        started: true, completed: [], hand: ['check', 'support', 'breathe'], used: [], items: [],
        eventIndex: 0, checkpoint: 85, unlocked: wasUnlocked,
        replayCount: replayCount + (wasUnlocked ? 1 : 0), bonusUsed: false
      });
      world.items.forEach(item => { item.got = false; });
      world.pickups.forEach(pickup => { pickup.got = false; });
      world.obstacles.forEach(obstacle => { obstacle.seen = false; });
      world.player.x = 85; world.player.y = 0; world.player.vy = 0; world.player.onGround = true;
      world.fox.x = 42; world.camera = 0;
      if (state.unlocked && state.replayCount > 0) {
        state.hand = ['check', 'support', 'memory'];
        state.bonusUsed = true;
        ui.toast('晨光回憶陪你一起出發。');
      }
    }
    if (state.music) audio.startMusic();
    ui.hide('title');
    state.started = true;
    save();
    ui.renderHand(state, useEventCard);
    lastTime = 0;
    requestAnimationFrame(loop);
  }

  function loop(time) {
    if (!state.started || !ui.isHidden('title') || !ui.isHidden('event') || !ui.isHidden('pause') || !ui.isHidden('ending') || document.getElementById('swapScreen')) return;
    const delta = Math.min((time - lastTime) / 16.67 || 1, 2);
    lastTime = time;
    update(delta);
    renderer.draw();
    requestAnimationFrame(loop);
  }

  function update(delta) {
    const player = world.player;
    let direction = 0;
    if (world.keys.ArrowLeft || world.keys.a || world.touch.left) direction--;
    if (world.keys.ArrowRight || world.keys.d || world.touch.right) direction++;
    const previousX = player.x;
    const nextX = clamp(player.x + direction * 1.8 * delta, 28, world.length - 45);
    for (const obstacle of world.obstacles) {
      const crossing = direction > 0
        ? previousX < obstacle.x + 24 && nextX >= obstacle.x - 18
        : direction < 0 ? previousX > obstacle.x - 24 && nextX <= obstacle.x + 18 : false;
      if (crossing && player.y < 25) {
        player.x = direction > 0 ? obstacle.x - 19 : obstacle.x + 19;
        if (!obstacle.seen) {
          obstacle.seen = true;
          ui.toast(obstacle.kind === 'log' ? '一根低低的倒木；跳一下就能輕鬆通過。' : '一顆圓圓的小石頭；跳一下就能輕鬆通過。');
        }
        break;
      }
      player.x = nextX;
    }
    if (direction) world.fox.x += (player.x - 48 - world.fox.x) * Math.min(.09 * delta, .22);
    else world.fox.x += (player.x - 43 - world.fox.x) * .025 * delta;
    if (!player.onGround) {
      player.vy -= .42 * delta;
      player.y += player.vy * delta;
      if (player.y <= 0) { player.y = 0; player.vy = 0; player.onGround = true; }
    }
    world.camera = clamp(player.x - world.width * .32, 0, world.length - world.width * .7);

    world.items.forEach(item => {
      if (!item.got && Math.abs(player.x - item.x) < 24) {
        item.got = true;
        state.items.push(item.name);
        ui.toast(`收下「${item.name}」；它會帶來一點額外故事。`);
        save();
      }
    });
    world.pickups.forEach(pickup => {
      if (!pickup.got && Math.abs(player.x - pickup.x) < 34) {
        pickup.got = true;
        obtainCard(pickup.id);
        save();
      }
    });

    const nextEvent = state.completed.length;
    if (nextEvent < EVENTS.length && player.x >= world.gates[nextEvent] - 3) {
      player.x = world.gates[nextEvent] - 5;
      world.keys = {};
      showEvent(nextEvent);
      return;
    }
    if (state.completed.length === EVENTS.length && player.x > world.length - 95) finish();
    ui.updateProgress(state, world);
  }

  function obtainCard(id) {
    if (state.hand.length < 3) {
      state.hand.push(id);
      ui.renderHand(state, useEventCard);
      ui.toast(`找到「${CARD_BOOK[id].name}」卡牌，放進口袋了。`);
      return;
    }
    world.keys = {};
    world.touch = { left: false, right: false };
    ui.showCardSwap(id, state, {
      onReplace: index => {
        state.hand[index] = id;
        ui.renderHand(state, useEventCard);
        ui.toast(`「${CARD_BOOK[id].name}」加入口袋了。`);
        save();
        requestAnimationFrame(loop);
      },
      onKeep: () => {
        ui.toast('你決定先帶著熟悉的卡牌。');
        save();
        requestAnimationFrame(loop);
      }
    });
  }

  function showEvent(index) {
    state.eventIndex = index;
    ui.showEvent(index, EVENTS[index], state, {
      onCard: useEventCard,
      onCombo: () => resolveEvent(['check', 'together']),
      onOrdinary: () => resolveEvent([])
    });
    renderer.draw();
  }

  function useEventCard(id) { resolveEvent([id]); }

  function resolveEvent(ids) {
    const index = state.eventIndex;
    const event = EVENTS[index];
    let text;
    if (ids.length === 2) {
      text = '你和小狐狸一起檢查、一起整理。水壺找回來了，還多發現一條柔軟的小毯子。';
      if (!state.items.includes('額外小毯子')) state.items.push('額外小毯子');
      ids.forEach(id => {
        const cardIndex = state.hand.indexOf(id);
        if (cardIndex >= 0) state.used.push(state.hand.splice(cardIndex, 1)[0]);
      });
    } else if (ids.length === 0) {
      text = `${event.normal}。${index === 0 ? '水壺安穩地回到背包裡。' : index === 1 ? '圍巾也回到了小狐狸身上。' : '你們找到一條走得過去的路。'}`;
    } else {
      text = event.result[ids[0]] || event.result.support;
      const cardIndex = state.hand.indexOf(ids[0]);
      if (cardIndex >= 0) state.used.push(state.hand.splice(cardIndex, 1)[0]);
    }
    ui.renderHand(state, useEventCard);
    ui.showEventResult(text, () => closeEvent(index));
    save();
  }

  function closeEvent(index) {
    if (!state.completed.includes(index)) state.completed.push(index);
    state.checkpoint = world.gates[index] + 34;
    world.player.x = state.checkpoint;
    world.fox.x = world.player.x - 43;
    ui.hide('event');
    save();
    ui.updateProgress(state, world);
    requestAnimationFrame(loop);
  }

  function finish() {
    state.started = false;
    state.checkpoint = world.length - 80;
    const firstUnlock = !state.unlocked;
    state.unlocked = true;
    save();
    ui.showEnding(state, firstUnlock);
  }

  function jump() {
    if (!state.started || !ui.isHidden('event') || !ui.isHidden('pause') || document.getElementById('swapScreen')) return;
    if (world.player.onGround) {
      world.player.vy = 7;
      world.player.onGround = false;
      audio.playTone(520, .05);
    }
  }

  function pause() {
    if (!state.started) return;
    world.keys = {};
    world.touch = { left: false, right: false };
    state.started = false;
    audio.stopMusic();
    save();
    ui.show('pause');
  }

  function resume() {
    if (ui.isHidden('pause')) return;
    ui.hide('pause');
    state.started = true;
    if (state.music) audio.startMusic();
    save();
    lastTime = 0;
    requestAnimationFrame(loop);
  }

  function toggleSetting(key) {
    state[key] = !state[key];
    if (key === 'music') state.music ? audio.startMusic() : audio.stopMusic();
    save();
    return state[key];
  }

  function isPaused() { return !ui.isHidden('pause'); }
  function initialize() {
    const data = loadSave();
    if (data) restore(data);
    if (data?.started && data.completed?.length < EVENTS.length) document.getElementById('continueButton').classList.remove('hidden');
    return state;
  }

  return { start, pause, resume, jump, toggleSetting, isPaused, initialize, save };
}
