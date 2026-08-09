(function () {
  if (window.__rwPlatformFaceClarityInstalled) return;
  window.__rwPlatformFaceClarityInstalled = true;

  var faceLayerSelector = '.rw-face-ai-backlight, .rw-face-ai-shell';

  function removeExperimentalLayers() {
    document.querySelectorAll([
      '.rw-cinematic-scene-grade',
      '.rw-cinematic-floor-light',
      '.rw-cinematic-contact-shadows',
      '.rw-cinematic-human-rim',
      '.rw-cinematic-chair-glints',
      '.rw-cinematic-face-glass',
      '.rw-cinematic-face-occlusion'
    ].join(',')).forEach(function (node) {
      node.remove();
    });
  }

  function ensureFaceLayers() {
    var shell = document.querySelector('.rw-v2-shell');
    if (!shell) return;

    if (!shell.querySelector('.rw-face-ai-backlight')) {
      var backlight = document.createElement('div');
      backlight.className = 'rw-face-ai-backlight';
      backlight.setAttribute('aria-hidden', 'true');
      shell.appendChild(backlight);
    }

    if (!shell.querySelector('.rw-face-ai-shell')) {
      var layer = document.createElement('div');
      layer.className = 'rw-face-ai-shell';
      layer.setAttribute('aria-hidden', 'true');
      layer.innerHTML = [
        '<span class="rw-face-ai-ring"></span>',
        '<span class="rw-face-ai-scan"></span>',
        '<span class="rw-face-ai-eye is-left"></span>',
        '<span class="rw-face-ai-eye is-right"></span>',
        '<span class="rw-face-ai-node"></span>',
        '<span class="rw-face-ai-node"></span>',
        '<span class="rw-face-ai-node"></span>',
        '<span class="rw-face-ai-node"></span>',
        '<span class="rw-face-ai-node"></span>'
      ].join('');
      shell.appendChild(layer);
    }
  }

  function syncFaceGeometry() {
    var face = document.querySelector('.rw-v2-assistant-face-video');
    if (!face) return;

    var computed = window.getComputedStyle(face);
    var vars = ['--rw-face-left', '--rw-face-top', '--rw-face-width', '--rw-face-height'];

    document.querySelectorAll(faceLayerSelector).forEach(function (layer) {
      vars.forEach(function (name) {
        var value = computed.getPropertyValue(name).trim();
        if (value && layer.style.getPropertyValue(name) !== value) {
          layer.style.setProperty(name, value);
        }
      });
    });

    if (face.playbackRate !== 1.02) face.playbackRate = 1.02;
  }

  function sync() {
    removeExperimentalLayers();
    ensureFaceLayers();
    syncFaceGeometry();
  }

  function start() {
    sync();
    var frameCount = 0;
    function syncBurst() {
      sync();
      frameCount += 1;
      if (frameCount < 120) window.requestAnimationFrame(syncBurst);
    }
    window.requestAnimationFrame(syncBurst);
    window.setInterval(sync, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
