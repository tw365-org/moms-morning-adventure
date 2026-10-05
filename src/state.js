import { SAVE_KEY } from './content.js';

export function createInitialState() {
  return {
    started: false, completed: [], hand: ['check', 'support', 'breathe'], used: [], items: [],
    eventIndex: 0, checkpoint: 85, unlocked: false, replayCount: 0, music: true, sfx: true, bonusUsed: false
  };
}

export function loadSave(storage = window.localStorage) {
  try { return JSON.parse(storage.getItem(SAVE_KEY) || 'null'); }
  catch { return null; }
}

export function saveGame(state, world, storage = window.localStorage) {
  try {
    storage.setItem(SAVE_KEY, JSON.stringify({
      ...state,
      playerX: Math.round(world.player.x), foxX: Math.round(world.fox.x),
      worldItems: world.items.filter(item => item.got).map(item => item.name),
      pickups: world.pickups.filter(item => item.got).map(item => item.id)
    }));
    return true;
  } catch {
    return false;
  }
}

export function restoreSave(state, world, data) {
  if (!data) return state;
  Object.assign(state, data);
  world.player.x = clamp(Number(data.playerX) || state.checkpoint, 50, world.length - 45);
  world.fox.x = Number(data.foxX) || world.player.x - 42;
  world.items.forEach(item => { item.got = (data.worldItems || data.items || []).includes(item.name); });
  world.pickups.forEach(item => { item.got = (data.pickups || []).includes(item.id); });
  state.items = data.items || world.items.filter(item => item.got).map(item => item.name);
  return state;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
