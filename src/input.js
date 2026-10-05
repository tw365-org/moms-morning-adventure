export function bindInput({ world, jump, pause, resume, isPaused, isHelpOpen, closeHelp, save, resize }) {
  const movementButtons = document.querySelectorAll('[data-move]');
  const keyDown = event => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      return;
    }
    const key = event.key === ' ' ? 'Space' : event.key;
    if (['ArrowLeft', 'ArrowRight', ' ', 'a', 'd', 'A', 'D'].includes(event.key)) event.preventDefault();
    if (key === 'Escape') {
      if (document.getElementById('swapScreen')) return;
      if (isHelpOpen()) closeHelp();
      else if (isPaused()) resume();
      else pause();
      return;
    }
    world.keys[key] = true;
    if (key === 'Space') jump();
  };
  const keyUp = event => {
    world.keys[event.key] = false;
    world.keys[event.key.toLowerCase()] = false;
  };
  const blur = () => {
    world.keys = {};
    world.touch = { left: false, right: false };
    save();
  };
  const visibilityChange = () => { if (document.hidden) save(); };
  const onResize = () => resize();

  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);
  window.addEventListener('blur', blur);
  window.addEventListener('resize', onResize);
  window.addEventListener('beforeunload', save);
  document.addEventListener('visibilitychange', visibilityChange);

  movementButtons.forEach(button => {
    const direction = button.dataset.move;
    button.addEventListener('pointerdown', event => {
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      world.touch[direction] = true;
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => {
      button.addEventListener(type, () => { world.touch[direction] = false; });
    });
  });
  document.getElementById('jumpButton').addEventListener('pointerdown', event => {
    event.preventDefault();
    jump();
  });

  return () => {
    window.removeEventListener('keydown', keyDown);
    window.removeEventListener('keyup', keyUp);
    window.removeEventListener('blur', blur);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('beforeunload', save);
    document.removeEventListener('visibilitychange', visibilityChange);
  };
}
