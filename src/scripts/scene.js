// Three.js scenes for the portfolio. Loaded lazily, one chunk, only when a scene container is near the viewport.
// Variants: 'stack' (home hero, skills), 'orbit' (about), 'lattice' (contact), 'cubes' (projects), 'prism' (education).
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, BoxGeometry, EdgesGeometry, LineSegments, LineBasicMaterial,
  MeshPhysicalMaterial, MeshStandardMaterial, IcosahedronGeometry, WireframeGeometry, TorusGeometry, CylinderGeometry,
  SphereGeometry, OctahedronGeometry, Points, PointsMaterial, BufferGeometry, Float32BufferAttribute, CanvasTexture, GridHelper, FogExp2,
  PMREMGenerator, HemisphereLight, PointLight, Raycaster, Vector2, Vector3, Color, MathUtils, AdditiveBlending, SRGBColorSpace,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { qualityFor, isSoftwareRenderer, forcedByUrl } from '../lib/scene-config.js';

const PAL = { black: 0x000000, aubergine: 0x502f4c, purple: 0x70587c, lavender: 0xc8b8db, porcelain: 0xf5eaec };
const clamp = MathUtils.clamp;
const lerp = MathUtils.lerp;

function glowSprite() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(245,234,236,1)');
  grd.addColorStop(0.25, 'rgba(200,184,219,0.8)');
  grd.addColorStop(1, 'rgba(200,184,219,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function dust(count, radius, size, tex) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(Math.random());
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.cos(ph) * 0.7;
    pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  const mat = new PointsMaterial({ color: PAL.lavender, size, map: tex, transparent: true, opacity: 0.55, depthWrite: false, blending: AdditiveBlending, sizeAttenuation: true });
  return new Points(geo, mat);
}

function lights(scene, strong = 1) {
  scene.add(new HemisphereLight(PAL.purple, PAL.black, 0.55));
  const key = new PointLight(PAL.lavender, 38 * strong, 22, 1.6);
  key.position.set(4, 5, 5);
  const rim = new PointLight(PAL.aubergine, 60 * strong, 22, 1.4);
  rim.position.set(-5, 1.5, -4);
  scene.add(key, rim);
  return { key, rim };
}

export function mountScene(container, opts = {}) {
  const variant = opts.variant || container.dataset.scene || 'stack';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const quality = qualityFor({ coarsePointer: coarse, width: innerWidth });
  const mobile = quality.mobile;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: quality.antialias, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    opts.onFallback && opts.onFallback(e);
    return null;
  }
  // Software-rendered WebGL (no GPU) would block the main thread, so keep the static poster instead.
  // Add ?scene=force to the URL to override, for example when testing in a headless browser.
  try {
    const gl = renderer.getContext();
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const gpu = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    if (isSoftwareRenderer(gpu) && !forcedByUrl(location.search)) {
      renderer.dispose(); renderer.forceContextLoss();
      opts.onFallback && opts.onFallback(new Error('software renderer'));
      return null;
    }
  } catch { /* if the check itself fails, carry on with WebGL */ }
  renderer.setClearColor(0x000000, 0);
  let dprCap = quality.dprCap;
  const setSize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, dprCap));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    layout();
  };

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 60);
  const pmrem = new PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.28;

  const sprite = glowSprite();
  const root = new Group();
  scene.add(root);
  const disposables = [envTex, sprite];
  const track = (o) => (disposables.push(o), o);

  const state = { px: 0, py: 0, tx: 0, ty: 0, hover: -1, selected: -1, scroll: 0, t: 0, pulse: 0 };
  let tick = () => {};
  let layout = () => {};
  const slabs = [];
  let raycaster;

  if (variant === 'stack') {
    scene.fog = new FogExp2(PAL.black, 0.04);
    lights(scene);
    camera.position.set(0, 1.1, 10.8);
    const N = 5;
    const stack = new Group();
    root.add(stack);
    const edgeMat = track(new LineBasicMaterial({ color: PAL.lavender, transparent: true, opacity: 0.8 }));
    for (let i = 0; i < N; i++) {
      const s = 1 - i * 0.07;
      const geo = track(new BoxGeometry(2.9 * s, 0.17, 2.9 * s));
      const mat = track(new MeshPhysicalMaterial({
        color: 0x4a2a46, metalness: 0.35, roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.3,
        emissive: PAL.purple, emissiveIntensity: 0.05,
      }));
      const m = new Mesh(geo, mat);
      const e = new LineSegments(track(new EdgesGeometry(geo)), edgeMat.clone());
      track(e.material);
      m.add(e);
      m.userData = { i, base: -0.95 + i * 0.5, edge: e, lift: 0 };
      m.rotation.y = (i - 2) * 0.1;
      m.position.y = m.userData.base;
      stack.add(m);
      slabs.push(m);
    }
    // spine: the "pipeline" visible between slabs
    const spine = new Mesh(track(new CylinderGeometry(0.014, 0.014, 4.2, 8)), track(new MeshStandardMaterial({ color: PAL.lavender, emissive: PAL.lavender, emissiveIntensity: 0.7 })));
    spine.position.y = 0.9;
    stack.add(spine);
    // core + shell + rings
    const core = new Mesh(track(new IcosahedronGeometry(0.5, 0)), track(new MeshPhysicalMaterial({
      color: PAL.lavender, emissive: PAL.lavender, emissiveIntensity: 0.55, metalness: 0.15, roughness: 0.12, clearcoat: 1, flatShading: true,
    })));
    core.position.y = 2.45;
    const shell = new LineSegments(track(new WireframeGeometry(new IcosahedronGeometry(0.82, 1))), track(new LineBasicMaterial({ color: PAL.lavender, transparent: true, opacity: 0.35 })));
    shell.position.y = 2.45;
    const ring = new Mesh(track(new TorusGeometry(1.35, 0.006, 6, 120)), track(new MeshStandardMaterial({ color: PAL.lavender, emissive: PAL.lavender, emissiveIntensity: 0.8 })));
    ring.position.y = 2.45;
    ring.rotation.x = Math.PI / 2.3;
    const coreLight = new PointLight(PAL.lavender, 9, 7, 1.5);
    coreLight.position.y = 2.45;
    stack.add(core, shell, ring, coreLight);
    // packets travelling up the spine
    const PK = 7;
    const pkGeo = new BufferGeometry();
    const pkPos = new Float32Array(PK * 3);
    pkGeo.setAttribute('position', new Float32BufferAttribute(pkPos, 3));
    const packets = new Points(track(pkGeo), track(new PointsMaterial({ color: PAL.porcelain, size: 0.22, map: sprite, transparent: true, depthWrite: false, blending: AdditiveBlending })));
    stack.add(packets);
    const phase = Array.from({ length: PK }, (_, i) => i / PK);
    // floor grid + dust
    const grid = new GridHelper(16, 32, PAL.purple, PAL.aubergine);
    grid.position.y = -1.45;
    grid.material.transparent = true;
    grid.material.opacity = 0.45;
    track(grid.material); track(grid.geometry);
    root.add(grid);
    const d = dust(quality.dust, 7, 0.06, sprite);
    track(d.geometry); track(d.material);
    root.add(d);

    layout = () => {
      const a = camera.aspect;
      const visH = 2 * camera.position.z * Math.tan(MathUtils.degToRad(camera.fov / 2));
      const visW = visH * a;
      if (a > 1.15) { root.scale.setScalar(0.92); root.position.set(visW * 0.25, -0.2, 0); }
      else { root.scale.setScalar(clamp(a * 0.9, 0.5, 0.95)); root.position.set(0, -0.1, 0); }
    };
    tick = (dt) => {
      state.t += dt;
      const t = state.t;
      const sc = state.scroll;
      stack.rotation.y = (reduced ? 0.5 : t * 0.14) + state.px * 0.35;
      stack.rotation.x = -state.py * 0.07;
      core.rotation.y = t * 0.6; core.rotation.x = t * 0.3;
      shell.rotation.y = -t * 0.25; shell.rotation.z = t * 0.12;
      ring.rotation.z = t * 0.2;
      core.position.y = shell.position.y = ring.position.y = coreLight.position.y = 2.45 + Math.sin(t * 0.9) * 0.06 + sc * 0.5;
      const pulse = state.pulse; state.pulse = Math.max(0, pulse - dt * 1.6);
      core.material.emissiveIntensity = 0.55 + pulse * 1.2 + (state.selected >= 0 ? 0.25 : 0);
      for (const m of slabs) {
        const { i, base, edge } = m.userData;
        const on = state.selected === i, hov = state.hover === i;
        const target = (on ? 0.22 : hov ? 0.1 : 0);
        m.userData.lift = reduced ? target : lerp(m.userData.lift, target, 1 - Math.exp(-dt * 9));
        m.position.y = base * (1 + sc * 0.45) + m.userData.lift;
        const glow = on ? 0.9 : hov ? 0.5 : 0;
        const eT = 0.05 + glow * 0.5; m.material.emissiveIntensity = reduced ? eT : lerp(m.material.emissiveIntensity, eT, 1 - Math.exp(-dt * 9));
        edge.material.opacity = on ? 1 : hov ? 0.95 : 0.8;
      }
      const top = 2.2, bot = -1;
      const arr = packets.geometry.attributes.position.array;
      for (let k = 0; k < PK; k++) {
        phase[k] = (phase[k] + dt * 0.16) % 1;
        arr[k * 3] = 0; arr[k * 3 + 1] = lerp(bot, top, phase[k]) * (1 + sc * 0.2); arr[k * 3 + 2] = 0;
      }
      packets.geometry.attributes.position.needsUpdate = true;
      d.rotation.y = t * 0.02;
      camera.position.x = state.px * 0.5;
      camera.position.y = 1.1 - state.py * 0.35 + sc * 0.4;
      camera.position.z = 10.8 + sc * 2.2;
      const focusY = state.selected >= 0 ? slabs[state.selected].position.y * 0.4 + 0.5 : 0.7;
      camera.lookAt(root.position.x * 0.35, focusY + root.position.y * 0.5, 0);
    };
    raycaster = new Raycaster();
    state.pick = (ndc) => {
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(slabs, false)[0];
      return hit ? hit.object.userData.i : -1;
    };
  }

  if (variant === 'orbit') {
    lights(scene, 0.9);
    camera.position.set(0, 0.4, 8);
    const core = new Mesh(track(new IcosahedronGeometry(0.6, 1)), track(new MeshPhysicalMaterial({ color: PAL.lavender, emissive: PAL.purple, emissiveIntensity: 0.7, metalness: 0.2, roughness: 0.2, clearcoat: 1, flatShading: true })));
    root.add(core);
    const rings = [];
    [1.15, 1.65, 2.2].forEach((r, i) => {
      const g = new Group();
      const ring = new Mesh(track(new TorusGeometry(r, 0.007, 6, 140)), track(new MeshStandardMaterial({ color: i === 1 ? PAL.lavender : PAL.purple, emissive: i === 1 ? PAL.lavender : PAL.purple, emissiveIntensity: 0.7 })));
      ring.rotation.x = Math.PI / 2;
      const sat = new Mesh(track(new SphereGeometry(0.06, 12, 12)), track(new MeshStandardMaterial({ color: PAL.porcelain, emissive: PAL.porcelain, emissiveIntensity: 0.9 })));
      sat.position.x = r;
      const pivot = new Group();
      pivot.add(sat);
      g.add(ring, pivot);
      g.rotation.x = 0.5 + i * 0.35; g.rotation.z = i * 0.6;
      root.add(g);
      rings.push({ pivot, speed: 0.5 - i * 0.12 });
    });
    const d = dust(mobile ? 80 : 220, 5, 0.05, sprite);
    track(d.geometry); track(d.material);
    root.add(d);
    layout = () => { root.scale.setScalar(clamp(camera.aspect * 0.9, 0.55, 1)); };
    tick = (dt) => {
      state.t += dt;
      core.rotation.y = state.t * 0.5; core.rotation.x = state.t * 0.2;
      rings.forEach((r) => { r.pivot.rotation.y = reduced ? 0.8 : state.t * r.speed; });
      root.rotation.y = state.px * 0.5; root.rotation.x = -state.py * 0.25;
      core.material.emissiveIntensity = 0.7 + state.pulse; state.pulse = Math.max(0, state.pulse - dt * 1.5);
    };
  }

  if (variant === 'lattice') {
    lights(scene, 0.9);
    camera.position.set(0, 0, 7);
    const base = new IcosahedronGeometry(1.7, 1);
    const eg = new EdgesGeometry(base);
    const pos = eg.attributes.position;
    const col = new Float32Array(pos.count * 3);
    eg.setAttribute('color', new Float32BufferAttribute(col, 3));
    const lines = new LineSegments(track(eg), track(new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 })));
    root.add(lines);
    const nodes = new Points(track(new BufferGeometry().setAttribute('position', pos.clone())), track(new PointsMaterial({ color: PAL.lavender, size: 0.2, map: sprite, transparent: true, depthWrite: false, blending: AdditiveBlending })));
    root.add(nodes);
    const inner = new Mesh(track(new IcosahedronGeometry(0.45, 0)), track(new MeshStandardMaterial({ color: PAL.aubergine, emissive: PAL.purple, emissiveIntensity: 0.9, flatShading: true })));
    root.add(inner);
    const cBase = new Color(PAL.purple), cHot = new Color(PAL.porcelain), tmp = new Color();
    const origin = new Vector3(1.7, 0, 0);
    let wave = -1;
    state.fire = () => { origin.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(1.7); wave = 0; };
    layout = () => { root.scale.setScalar(clamp(camera.aspect * 0.95, 0.6, 1.05)); };
    const paint = () => {
      const c = eg.attributes.color;
      for (let i = 0; i < pos.count; i++) {
        const dist = origin.distanceTo(new Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
        const k = wave < 0 ? 0 : Math.max(0, 1 - Math.abs(dist - wave * 3.6) * 1.4);
        tmp.copy(cBase).lerp(cHot, k);
        c.setXYZ(i, tmp.r, tmp.g, tmp.b);
      }
      c.needsUpdate = true;
    };
    paint();
    tick = (dt) => {
      state.t += dt;
      root.rotation.y = (reduced ? 0.4 : state.t * 0.18) + state.px * 0.6;
      root.rotation.x = 0.25 - state.py * 0.35;
      inner.rotation.y = -state.t * 0.5;
      if (wave >= 0) { wave += dt * 0.9; if (wave > 1.6) wave = -1; paint(); }
    };
    opts.onClickScene = () => state.fire && state.fire();
  }


  if (variant === 'cubes') {
    lights(scene, 0.9);
    camera.position.set(0, 0, 7.4);
    const cubes = [];
    const edgeGeo = track(new EdgesGeometry(new BoxGeometry(0.62, 0.62, 0.62)));
    const boxGeo = track(new BoxGeometry(0.62, 0.62, 0.62));
    for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) for (let z = 0; z < 2; z++) {
      const mat = track(new MeshStandardMaterial({ color: 0x3a2037, metalness: 0.4, roughness: 0.45, emissive: PAL.lavender, emissiveIntensity: 0.04 }));
      const m = new Mesh(boxGeo, mat);
      const e = new LineSegments(edgeGeo, track(new LineBasicMaterial({ color: PAL.lavender, transparent: true, opacity: 0.45 })));
      m.add(e);
      m.position.set((x - 1) * 0.95, (y - 1) * 0.95, (z - 0.5) * 0.95);
      m.userData = { lit: 0, phase: Math.random() * 6.28, edge: e };
      root.add(m);
      cubes.push(m);
    }
    const d = dust(mobile ? 60 : 160, 4, 0.045, sprite);
    track(d.geometry); track(d.material);
    root.add(d);
    layout = () => { root.scale.setScalar(clamp(camera.aspect * 0.95, 0.6, 1.1)); };
    tick = (dt) => {
      state.t += dt;
      root.rotation.y = (reduced ? 0.6 : state.t * 0.16) + state.px * 0.5;
      root.rotation.x = 0.4 - state.py * 0.3;
      for (const m of cubes) {
        const u = m.userData;
        u.lit = Math.max(0, u.lit - dt * 0.9);
        const twinkle = reduced ? 0 : Math.max(0, Math.sin(state.t * 0.7 + u.phase)) ** 6 * 0.5;
        m.material.emissiveIntensity = 0.04 + Math.max(u.lit, twinkle) * 0.9;
        u.edge.material.opacity = 0.4 + Math.max(u.lit, twinkle) * 0.6;
      }
    };
    state.fire = () => { for (let k = 0; k < 5; k++) cubes[Math.floor(Math.random() * cubes.length)].userData.lit = 1; };
    opts.onClickScene = () => state.fire();
  }

  if (variant === 'prism') {
    lights(scene, 0.9);
    camera.position.set(0, 0.3, 7.2);
    const count = clamp(Number(container.dataset.count) || 8, 3, 24);
    const core = new Mesh(track(new OctahedronGeometry(0.85, 0)), track(new MeshPhysicalMaterial({ color: PAL.lavender, emissive: PAL.purple, emissiveIntensity: 0.6, metalness: 0.25, roughness: 0.15, clearcoat: 1, flatShading: true })));
    const shell = new LineSegments(track(new WireframeGeometry(new OctahedronGeometry(1.3, 1))), track(new LineBasicMaterial({ color: PAL.lavender, transparent: true, opacity: 0.35 })));
    const ring = new Group();
    const satGeo = track(new OctahedronGeometry(0.16, 0));
    const satMat = track(new MeshStandardMaterial({ color: PAL.porcelain, emissive: PAL.lavender, emissiveIntensity: 0.8, flatShading: true }));
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const sat = new Mesh(satGeo, satMat);
      sat.position.set(Math.cos(a) * 2.2, 0, Math.sin(a) * 2.2);
      ring.add(sat);
    }
    const track2 = new Mesh(track(new TorusGeometry(2.2, 0.006, 6, 140)), track(new MeshStandardMaterial({ color: PAL.purple, emissive: PAL.purple, emissiveIntensity: 0.7 })));
    track2.rotation.x = Math.PI / 2;
    ring.add(track2);
    ring.rotation.x = 0.5;
    root.add(core, shell, ring);
    const d = dust(mobile ? 60 : 160, 5, 0.045, sprite);
    track(d.geometry); track(d.material);
    root.add(d);
    layout = () => { root.scale.setScalar(clamp(camera.aspect * 0.9, 0.55, 1)); };
    tick = (dt) => {
      state.t += dt;
      core.rotation.y = state.t * 0.5; core.rotation.x = state.t * 0.25;
      shell.rotation.y = -state.t * 0.2;
      ring.children.forEach((c) => { if (c !== track2) c.rotation.y = state.t * 1.4; });
      ring.rotation.y = reduced ? 0.4 : state.t * 0.25;
      root.rotation.y = state.px * 0.5; root.rotation.x = -state.py * 0.25;
      core.material.emissiveIntensity = 0.6 + state.pulse; state.pulse = Math.max(0, state.pulse - dt * 1.5);
    };
    opts.onClickScene = () => { state.pulse = 1; };
  }

  // ---- shared plumbing -----------------------------------------------------
  container.appendChild(canvas);
  canvas.className = 'scene-canvas';
  setSize();

  let running = false, raf = 0, last = 0, visible = true, frames = 0, acc = 0, downgraded = false;
  const draw = (dt) => { tick(dt); renderer.render(scene, camera); };
  const loop = (now) => {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    draw(dt);
    if (!downgraded && frames++ > 20) { // device-aware quality: drop pixel ratio once if frames are slow
      acc += dt;
      if (frames > 80) {
        if (acc / 60 > 0.03) { dprCap = 1; setSize(); }
        downgraded = true;
      }
    }
  };
  const start = () => {
    if (reduced || running || !visible || document.hidden) return;
    running = true; last = performance.now(); raf = requestAnimationFrame(loop);
  };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  const requestRender = () => { if (!running) requestAnimationFrame(() => draw(0.016)); };

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }, { rootMargin: '80px' });
  io.observe(container);
  const ro = new ResizeObserver(() => { setSize(); requestRender(); });
  ro.observe(container);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVis);

  const rectNdc = (ev) => {
    const r = canvas.getBoundingClientRect();
    return new Vector2(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  };
  const host = opts.pointerHost || container;
  const onMove = (ev) => {
    if (coarse || reduced) return;
    const r = host.getBoundingClientRect();
    state.px = clamp(((ev.clientX - r.left) / r.width) * 2 - 1, -1, 1);
    state.py = clamp(((ev.clientY - r.top) / r.height) * 2 - 1, -1, 1);
    if (state.pick) {
      const i = state.pick(rectNdc(ev));
      if (i !== state.hover) { state.hover = i; canvas.style.cursor = i >= 0 ? 'pointer' : ''; opts.onHover && opts.onHover(i); }
    }
    requestRender();
  };
  const onLeave = () => { state.px = state.py = 0; if (state.hover !== -1) { state.hover = -1; opts.onHover && opts.onHover(-1); } requestRender(); };
  const onClick = (ev) => {
    if (state.pick) { const i = state.pick(rectNdc(ev)); if (i >= 0) api.select(i, true); }
    if (opts.onClickScene) { opts.onClickScene(); state.pulse = 1; requestRender(); }
  };
  host.addEventListener('pointermove', onMove);
  host.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('click', onClick);

  const onScroll = () => {
    if (!opts.scrollLinked) return;
    const h = container.clientHeight || 1;
    state.scroll = clamp(scrollY / h, 0, 1);
    container.style.setProperty('--p', state.scroll.toFixed(3));
    requestRender();
  };
  if (opts.scrollLinked) addEventListener('scroll', onScroll, { passive: true });

  const api = {
    select(i, fromScene = false) {
      state.selected = i; state.pulse = 1;
      opts.onSelect && opts.onSelect(i, fromScene);
      requestRender();
    },
    hover(i) { state.hover = i; requestRender(); },
    dispose() {
      stop(); io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      host.removeEventListener('pointermove', onMove); host.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('click', onClick); removeEventListener('scroll', onScroll);
      disposables.forEach((o) => o.dispose && o.dispose());
      pmrem.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };
  // first frame immediately, then the loop takes over when visible
  draw(0.016);
  canvas.classList.add('is-ready');
  opts.onReady && opts.onReady();
  start();
  addEventListener('pagehide', () => api.dispose(), { once: true });
  return api;
}
