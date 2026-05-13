import { useEffect, useRef } from 'react';
import {
  AssetManager, AtlasAttachmentLoader, SkeletonBinary,
  SkeletonRenderer, Skeleton, AnimationState, AnimationStateData, Physics
} from '@esotericsoftware/spine-canvas';

const ANIM_MAP = {
  '': 'walk', walk: 'walk', jump: 'jump',
  dance: 'run', worry: 'idle', surprise: 'shoot',
};

const W = 130, H = 150;

const _cache = { mgr: null, p: null };
function loadAssets() {
  if (!_cache.p) {
    const mgr = new AssetManager('/spine/');
    mgr.loadBinary('spineboy-pro.skel');
    mgr.loadTextureAtlas('spineboy-pma.atlas');
    _cache.p = mgr.loadAll().then(() => { _cache.mgr = mgr; return mgr; });
  }
  return _cache.p;
}

export function SpineFarmer({ anim = '' }) {
  const canvasRef = useRef(null);
  const animRef = useRef(anim);
  animRef.current = anim;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let dead = false, raf = null;

    // Draw loading placeholder
    const ctx0 = canvas.getContext('2d');
    ctx0.fillStyle = 'rgba(100,200,120,0.15)';
    ctx0.fillRect(0, 0, W, H);

    loadAssets().then(mgr => {
      if (dead) return;
      const ctx = canvas.getContext('2d');
      const renderer = new SkeletonRenderer(ctx);
      const atlas = mgr.require('spineboy-pma.atlas');
      const binary = new SkeletonBinary(new AtlasAttachmentLoader(atlas));
      binary.scale = 0.22;
      const data = binary.readSkeletonData(mgr.require('spineboy-pro.skel'));
      const skeleton = new Skeleton(data);
      skeleton.setToSetupPose();
      const sData = new AnimationStateData(data);
      sData.defaultMix = 0.15;
      const state = new AnimationState(sData);
      state.setAnimation(0, 'walk', true);

      let cur = 'walk', last = performance.now(), firstFrame = true;

      function loop(ts) {
        if (dead) return;
        const dt = Math.min((ts - last) / 1000, 0.1);
        last = ts;

        const want = ANIM_MAP[animRef.current] ?? 'walk';
        if (want !== cur) {
          const loops = (want === 'walk' || want === 'run' || want === 'idle');
          state.setAnimation(0, want, loops);
          if (!loops) state.addAnimation(0, 'walk', true, 0);
          cur = want;
        }

        ctx.clearRect(0, 0, W, H);
        skeleton.x = W / 2;
        skeleton.y = H - 12;
        state.update(dt);
        state.apply(skeleton);
        skeleton.updateWorldTransform(firstFrame ? Physics.reset : Physics.update);
        firstFrame = false;
        renderer.draw(skeleton);
        raf = requestAnimationFrame(loop);
      }
      raf = requestAnimationFrame(loop);
    }).catch(e => console.error('SpineFarmer error:', e));

    return () => { dead = true; if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      style={{ display: 'block', imageRendering: 'auto' }}
    />
  );
}
