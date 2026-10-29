// Home hero: the five layer buttons and the readout, kept in sync with the 3D stack.
import { createStore } from '../../lib/store.js';
import { safe } from '../../lib/safe.js';
import { lazyScene } from './lazy-scene.js';

export function initHeroLayers() {
  safe('hero-layers', () => {
    const hero = document.getElementById('hero');
    const data = document.getElementById('layers-data');
    if (!hero || !data) return;
    const layers = JSON.parse(data.textContent || '[]');
    const buttons = /** @type {HTMLButtonElement[]} */ ([...hero.querySelectorAll('.layers__list button')]);
    const text = /** @type {HTMLElement} */ (hero.querySelector('[data-text]'));
    const link = /** @type {HTMLAnchorElement} */ (hero.querySelector('[data-link]'));
    const store = createStore({ selected: -1, hovered: -1 });
    /** @type {any} */
    let scene = null;

    store.subscribe(({ selected, hovered }) => {
      const shown = hovered >= 0 ? hovered : selected;
      buttons.forEach((b, k) => { b.setAttribute('aria-pressed', String(k === selected)); b.dataset.hover = String(k === hovered); });
      if (shown < 0) { text.textContent = 'Nothing selected yet.'; link.hidden = true; return; }
      const layer = layers[shown];
      text.replaceChildren();
      const name = document.createElement('strong');
      name.style.color = 'var(--text)';
      name.textContent = `${layer.name}. `;
      text.append(name, layer.text);
      link.href = layer.href;
      link.hidden = false;
    });

    buttons.forEach((b, i) => {
      b.addEventListener('click', () => {
        const selected = store.get().selected === i ? -1 : i;
        store.set({ selected });
        scene?.select(selected);
      });
      b.addEventListener('mouseenter', () => { store.set({ hovered: i }); scene?.hover(i); });
      b.addEventListener('mouseleave', () => { store.set({ hovered: -1 }); scene?.hover(-1); });
    });

    const stage = /** @type {HTMLElement} */ (hero.querySelector('.hero__scene'));
    lazyScene(stage, {
      variant: 'stack',
      scrollLinked: true,
      pointerHost: hero,
      onHover: (/** @type {number} */ i) => store.set({ hovered: i }),
      onSelect: (/** @type {number} */ i, /** @type {boolean} */ fromScene) => { if (fromScene) store.set({ selected: i }); },
    }).then((api) => { scene = api; });
  });
}
