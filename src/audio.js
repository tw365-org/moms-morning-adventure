export function createAudio(state) {
  let context = null;
  let melodyTimer = null;

  function getContext() {
    if (!context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) context = new AudioContextClass();
    }
    if (context?.state === 'suspended') context.resume();
    return context;
  }

  function playTone(frequency, duration = .13) {
    if (!state.sfx) return;
    const audio = getContext();
    if (!audio) return;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.0001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(.035, audio.currentTime + .015);
    gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + duration + .02);
  }

  function stopMusic() {
    if (melodyTimer) clearInterval(melodyTimer);
    melodyTimer = null;
  }

  function startMusic() {
    stopMusic();
    if (!getContext()) return;
    const notes = [392, 440, 523, 440, 349, 392, 440, 330];
    let index = 0;
    melodyTimer = setInterval(() => {
      if (!state.music) return;
      const audio = getContext();
      if (!audio) return;
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = notes[index++ % notes.length];
      gain.gain.value = .012;
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start();
      gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + .5);
      oscillator.stop(audio.currentTime + .52);
    }, 620);
  }

  return { playTone, startMusic, stopMusic };
}
