import { SAVE_KEY, createWorld } from './content.js';
import { createInitialState } from './state.js';
import { createAudio } from './audio.js';
import { createRenderer } from './renderer.js';
import { createUI } from './ui.js';
import { createGameController } from './engine.js';
import { bindInput } from './input.js';

const state = createInitialState();
const world = createWorld();
const ui = createUI();
const audio = createAudio(state);
const renderer = createRenderer(document.getElementById('gameCanvas'), world, state);
const game = createGameController({ state, world, ui, renderer, audio });

function syncSwitch(button, enabled) {
  button.classList.toggle('on', enabled);
  button.setAttribute('aria-checked', String(enabled));
}

function syncMusicButton(enabled) {
  const button = document.getElementById('soundToggle');
  button.textContent = enabled ? '♫' : '♪';
  button.setAttribute('aria-label', enabled ? '關閉音樂' : '開啟音樂');
}

function toggleSetting(key) {
  const enabled = game.toggleSetting(key);
  syncSwitch(document.getElementById(key === 'music' ? 'musicSwitch' : 'sfxSwitch'), enabled);
  if (key === 'music') syncMusicButton(enabled);
}

function bindButtons() {
  const $ = id => document.getElementById(id);
  $('startButton').addEventListener('click', () => game.start(false));
  $('continueButton').addEventListener('click', () => game.start(true));
  $('pauseButton').addEventListener('click', () => game.pause());
  $('resumeButton').addEventListener('click', () => game.resume());
  $('restartButton').addEventListener('click', () => {
    ui.hide('pause');
    game.start(false);
  });
  $('clearSaveButton').addEventListener('click', () => {
    if (window.confirm('要清除這個瀏覽器裡的遊戲進度嗎？這個動作無法復原。')) {
      window.localStorage.removeItem(SAVE_KEY);
      window.location.reload();
    }
  });
  $('replayButton').addEventListener('click', () => {
    ui.hide('ending');
    game.start(false);
  });
  $('endingHomeButton').addEventListener('click', () => {
    ui.hide('ending');
    ui.show('title');
    state.started = false;
    game.save();
  });
  $('cardHelp').addEventListener('click', () => ui.show('help'));
  $('closeHelp').addEventListener('click', () => ui.hide('help'));
  $('closeHelpButton').addEventListener('click', () => ui.hide('help'));
  $('soundToggle').addEventListener('click', () => toggleSetting('music'));
  $('musicSwitch').addEventListener('click', () => toggleSetting('music'));
  $('sfxSwitch').addEventListener('click', () => toggleSetting('sfx'));
}

game.initialize();
ui.renderHand(state, () => {});
ui.updateProgress(state, world);
syncSwitch(document.getElementById('musicSwitch'), state.music);
syncSwitch(document.getElementById('sfxSwitch'), state.sfx);
syncMusicButton(state.music);
renderer.resize();
bindButtons();
bindInput({
  world,
  jump: game.jump,
  pause: game.pause,
  resume: game.resume,
  isPaused: game.isPaused,
  isHelpOpen: () => !ui.isHidden('help'),
  closeHelp: () => ui.hide('help'),
  save: game.save,
  resize: renderer.resize
});
