import { isSoftwareRenderer, forcedByUrl } from '../../lib/scene-config.js';

/** Renderer name from a throwaway WebGL context, or null when WebGL is unavailable. Cheap: no 3D code is loaded yet. */
function probeGpu() {
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (!gl) return null;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const name = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return name;
  } catch {
    return null;
  }
}

// Mounts a Three.js scene only when its container is near the viewport and the device can afford it.
// Resolves with the scene API, or null when the static poster should stay (no WebGL, save-data, error).
export function lazyScene(el, opts = {}) {
  return new Promise((resolve) => {
    const saveData = navigator.connection && navigator.connection.saveData;
    if (saveData) return resolve(null);
    const go = async () => {
      // Skip downloading the 3D code at all when it could not run well: no WebGL, or a software renderer.
      const gpu = probeGpu();
      if (gpu === null || (isSoftwareRenderer(gpu) && !forcedByUrl(location.search))) {
        el.classList.add('no-webgl');
        return resolve(null);
      }
      try {
        const { mountScene } = await import('../scene.js');
        const api = mountScene(el, {
          ...opts,
          onFallback: () => el.classList.add('no-webgl'),
          onReady: () => el.classList.add('has-webgl'),
        });
        resolve(api);
      } catch {
        el.classList.add('no-webgl');
        resolve(null);
      }
    };
    if (!('IntersectionObserver' in window)) return go();
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        (window.requestIdleCallback || ((f) => setTimeout(f, 60)))(go);
      }
    }, { rootMargin: '300px' });
    io.observe(el);
  });
}
