// Device-aware 3D quality decisions, kept out of the renderer so they can be tested.

/**
 * @param {{coarsePointer: boolean, width: number}} device
 */
export const qualityFor = ({ coarsePointer, width }) => {
  const mobile = coarsePointer || width < 768;
  return { mobile, dprCap: mobile ? 1.25 : 1.5, antialias: !mobile, dust: mobile ? 140 : 480 };
};

/** True when the WebGL renderer is software (CPU) rendered: the static poster is better than a janky scene. */
export const isSoftwareRenderer = (/** @type {string} */ name) => /swiftshader|llvmpipe|softpipe|software|basic render/i.test(String(name));

/** Add ?scene=force to the URL to override the software-renderer fallback, for example in headless tests. */
export const forcedByUrl = (/** @type {string} */ search) => /scene=force/.test(search);
