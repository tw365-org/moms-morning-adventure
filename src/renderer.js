import { CARD_BOOK } from './content.js';
import { clamp } from './state.js';

export function createRenderer(canvas, world, state) {
  const ctx = canvas.getContext('2d');

  function roundedRect(x, y, width, height, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
  }

  function drawTree(x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#816d50';
    ctx.fillRect(-5, 8, 10, 49);
    ctx.fillStyle = '#77936d';
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.arc(-17, 9, 17, 0, Math.PI * 2);
    ctx.arc(16, 11, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#92a681';
    ctx.beginPath();
    ctx.arc(-6, -6, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawCharacter(x, y, fox = false) {
    ctx.save();
    ctx.translate(x, y);
    if (fox) {
      ctx.scale(.72, .72);
      ctx.fillStyle = '#bd7953';
      ctx.beginPath();
      ctx.ellipse(0, -11, 20, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-14, -21); ctx.lineTo(-19, -39); ctx.lineTo(-4, -27);
      ctx.moveTo(5, -26); ctx.lineTo(19, -39); ctx.lineTo(15, -19);
      ctx.fill();
      ctx.fillStyle = '#edc39a';
      ctx.beginPath(); ctx.ellipse(3, -8, 11, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#374c3a';
      ctx.beginPath(); ctx.arc(8, -14, 1.7, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#bd7953'; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(-13, -10); ctx.quadraticCurveTo(-32, -21, -25, -35); ctx.stroke();
      ctx.fillStyle = '#faf5e8';
      ctx.beginPath(); ctx.arc(-27, -37, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#5d714f'; ctx.fillRect(-10, 1, 5, 9); ctx.fillRect(7, 1, 5, 9);
    } else {
      ctx.fillStyle = '#465f49';
      ctx.beginPath(); ctx.ellipse(0, -11, 18, 23, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e8b999';
      ctx.beginPath(); ctx.arc(0, -39, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#4e4039';
      ctx.beginPath(); ctx.arc(0, -43, 15, Math.PI, Math.PI * 2); ctx.lineTo(14, -38);
      ctx.quadraticCurveTo(6, -47, -8, -45); ctx.fill();
      ctx.beginPath(); ctx.arc(9, -52, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#d68e70';
      ctx.beginPath(); ctx.arc(-5, -39, 1.4, 0, Math.PI * 2); ctx.arc(5, -39, 1.4, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#9c624e'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, -35, 3, .15, Math.PI - .15); ctx.stroke();
      ctx.strokeStyle = '#c98967'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(-7, 8); ctx.lineTo(-8, 18); ctx.moveTo(8, 8); ctx.lineTo(9, 18); ctx.stroke();
      ctx.fillStyle = '#b4784d'; ctx.fillRect(-12, 17, 10, 4); ctx.fillRect(6, 17, 10, 4);
    }
    ctx.restore();
  }

  function draw() {
    if (!ctx || !world.width) return;
    const width = world.width;
    const height = world.height;
    const ground = world.ground;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#d7e8df');
    gradient.addColorStop(.7, '#f3e7c5');
    gradient.addColorStop(1, '#d8dcb9');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    const camera = world.camera;

    ctx.fillStyle = '#f7d788';
    ctx.beginPath(); ctx.arc(width * .79, height * .18, 31, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff3c166';
    ctx.beginPath(); ctx.arc(width * .79, height * .18, 48, 0, Math.PI * 2); ctx.fill();

    world.clouds.forEach(cloud => {
      const x = ((cloud.x - camera * .12) % (world.length + 250) + world.length + 250) % (world.length + 250) - 60;
      ctx.fillStyle = '#fffdf4a6';
      ctx.beginPath();
      ctx.ellipse(x, cloud.y + 10, 35 * cloud.s, 9 * cloud.s, 0, 0, Math.PI * 2);
      ctx.ellipse(x - 15 * cloud.s, cloud.y + 5, 15 * cloud.s, 12 * cloud.s, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 4 * cloud.s, cloud.y, 20 * cloud.s, 15 * cloud.s, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#b5c8a6';
    ctx.beginPath(); ctx.moveTo(0, ground - 77);
    for (let x = 0; x <= width + 70; x += 70) ctx.lineTo(x, ground - 52 - Math.sin((x + camera * .12) / 93) * 22);
    ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.fill();
    for (let i = -1; i < Math.ceil(width / 150) + 2; i++) {
      const x = i * 150 - ((camera * .32) % 150);
      drawTree(x, ground - 39, .8 + ((i + 10) % 3) * .12);
    }

    ctx.fillStyle = '#a5b889'; ctx.fillRect(0, ground, width, height - ground);
    ctx.fillStyle = '#7c9b69'; ctx.fillRect(0, ground, width, 5);
    ctx.fillStyle = '#e1d4ae'; ctx.fillRect(0, ground + 8, width, height - ground - 8);
    for (let i = 0; i < Math.ceil(width / 38) + 1; i++) {
      const x = i * 38 - ((camera * .9) % 38);
      ctx.strokeStyle = '#839b6e'; ctx.lineWidth = 1.2; ctx.beginPath();
      ctx.moveTo(x, ground + 13); ctx.quadraticCurveTo(x - 4, ground + 4, x - 7, ground + 3);
      ctx.moveTo(x + 3, ground + 14); ctx.quadraticCurveTo(x + 6, ground + 5, x + 10, ground + 2); ctx.stroke();
      if (i % 4 === 0) {
        ctx.fillStyle = '#e4b483'; ctx.beginPath(); ctx.arc(x, ground + 12, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff0d2'; ctx.beginPath(); ctx.arc(x + 2, ground + 13, 1.7, 0, Math.PI * 2); ctx.fill();
      }
    }

    world.obstacles.forEach(obstacle => {
      const x = obstacle.x - camera;
      if (x < -35 || x > width + 35) return;
      if (obstacle.kind === 'log') {
        ctx.save(); ctx.translate(x, ground - 10); ctx.rotate(-.06);
        roundedRect(-24, -7, 48, 14, 7, '#9c7954');
        ctx.fillStyle = '#c09c70'; ctx.beginPath(); ctx.ellipse(-18, 0, 5, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      } else {
        ctx.fillStyle = '#9ca38a'; ctx.beginPath(); ctx.ellipse(x, ground - 8, 19, 11, -.16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#c0c1a5'; ctx.beginPath(); ctx.ellipse(x - 5, ground - 11, 7, 4, -.2, 0, Math.PI * 2); ctx.fill();
      }
    });

    world.items.forEach((item, index) => {
      if (item.got) return;
      const x = item.x - camera;
      if (x < -30 || x > width + 30) return;
      ctx.fillStyle = index % 2 ? '#f4d58d' : '#d8ad66';
      ctx.beginPath(); ctx.ellipse(x, ground - 7, 8, 5, Math.sin(x) * .15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#78936c'; ctx.beginPath(); ctx.ellipse(x + 4, ground - 12, 3, 6, -.6, 0, Math.PI * 2); ctx.fill();
    });

    world.pickups.forEach(pickup => {
      if (pickup.got) return;
      const x = pickup.x - camera;
      if (x < -30 || x > width + 30) return;
      ctx.fillStyle = '#fff7db'; ctx.beginPath(); ctx.arc(x, ground - 41, 17, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#66855e'; ctx.font = '15px system-ui'; ctx.textAlign = 'center'; ctx.fillText(CARD_BOOK[pickup.id].icon, x, ground - 36);
      ctx.fillStyle = '#68785f'; ctx.font = '9px system-ui'; ctx.fillText(CARD_BOOK[pickup.id].name, x, ground - 16);
    });

    world.gates.forEach((gate, index) => {
      if (state.completed.includes(index)) return;
      const x = gate - camera;
      if (x < -40 || x > width + 40) return;
      ctx.strokeStyle = '#a5b889'; ctx.lineWidth = 5; ctx.beginPath();
      ctx.moveTo(x - 19, ground); ctx.quadraticCurveTo(x, ground - 67, x + 19, ground); ctx.stroke();
      ctx.fillStyle = '#fff5d7'; ctx.beginPath(); ctx.arc(x, ground - 54, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#d9a251'; ctx.font = '14px system-ui'; ctx.textAlign = 'center'; ctx.fillText('✦', x, ground - 49);
    });

    drawCharacter(world.fox.x - camera, ground - world.player.y + 3, true);
    drawCharacter(world.player.x - camera, ground - world.player.y, false);
    if (state.completed.length === 3) {
      const endX = world.length - 80 - camera;
      if (endX < width + 80) {
        ctx.fillStyle = '#e6c77c'; ctx.beginPath(); ctx.arc(endX, ground - 48, 24, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff8df'; ctx.font = '24px system-ui'; ctx.textAlign = 'center'; ctx.fillText('☼', endX, ground - 40);
      }
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    world.width = rect.width;
    world.height = rect.height;
    world.ground = rect.height * .77;
    draw();
  }

  return { draw, resize };
}
