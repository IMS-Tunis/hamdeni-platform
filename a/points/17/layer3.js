import initLayer3 from '../../../layer3-shared.js';

if (window.authSessionReady) {
  await window.authSessionReady;
}

initLayer3('17');
