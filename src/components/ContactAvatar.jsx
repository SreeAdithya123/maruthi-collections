import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const C = {
  maroon: 0x6b1f25,
  maroonDeep: 0x4a1418,
  maroonSilk: 0x8b2a30,
  gold: 0xb8895a,
  goldLight: 0xd4ac7e,
  skin: 0xc68a57,
  hair: 0x140d0b,
  jasmine: 0xfff6e6,
};

/** Cylinder spanning two points — used for the Namaskaram arms. */
function limb(p1, p2, radius, material) {
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const len = dir.length();
  const geo = new THREE.CylinderGeometry(radius, radius * 0.92, len, 14);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.copy(p1).add(p2).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );
  return mesh;
}

export default function ContactAvatar() {
  const mountRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let width = mount.clientWidth || 1;
    let height = mount.clientHeight || 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.55, 5.7);
    camera.lookAt(0, 0.35, 0);

    // WebGL may be unavailable (old device, disabled GPU, lost context).
    // Fail gracefully to a CSS emblem instead of crashing the page.
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      mount.appendChild(renderer.domElement);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('WebGL unavailable — showing avatar fallback.', err);
      setFailed(true);
      return undefined;
    }

    // ---- Materials (reused) ----
    const matMaroon = new THREE.MeshStandardMaterial({ color: C.maroon, roughness: 0.45, metalness: 0.1 });
    const matMaroonDeep = new THREE.MeshStandardMaterial({ color: C.maroonDeep, roughness: 0.5 });
    const matSilk = new THREE.MeshStandardMaterial({ color: C.maroonSilk, roughness: 0.35, metalness: 0.15 });
    const matGold = new THREE.MeshStandardMaterial({ color: C.gold, roughness: 0.3, metalness: 0.85 });
    const matGoldLight = new THREE.MeshStandardMaterial({ color: C.goldLight, roughness: 0.25, metalness: 0.9 });
    const matSkin = new THREE.MeshStandardMaterial({ color: C.skin, roughness: 0.6 });
    const matHair = new THREE.MeshStandardMaterial({ color: C.hair, roughness: 0.7 });
    const matJasmine = new THREE.MeshStandardMaterial({ color: C.jasmine, emissive: 0x4a3a1a, roughness: 0.5 });

    const avatar = new THREE.Group();
    scene.add(avatar);

    // ---- Saree skirt (flared) ----
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1.05, 1.75, 44), matMaroon);
    skirt.position.y = -0.55;
    avatar.add(skirt);

    // hem zari ring
    const hem = new THREE.Mesh(new THREE.TorusGeometry(1.03, 0.05, 12, 60), matGold);
    hem.position.y = -1.4;
    hem.rotation.x = Math.PI / 2;
    avatar.add(hem);

    // mid zari ring
    const midRing = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.03, 10, 50), matGoldLight);
    midRing.position.y = -0.55;
    midRing.rotation.x = Math.PI / 2;
    avatar.add(midRing);

    // ---- Blouse ----
    const blouse = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 0.72, 32), matMaroonDeep);
    blouse.position.y = 0.6;
    avatar.add(blouse);

    // ---- Pallu drape across torso ----
    const pallu = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.5, 0.05), matSilk);
    pallu.position.set(-0.08, 0.35, 0.34);
    pallu.rotation.z = 0.32;
    avatar.add(pallu);
    const palluEdge = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.5, 0.06), matGold);
    palluEdge.position.set(0.12, 0.35, 0.35);
    palluEdge.rotation.z = 0.32;
    avatar.add(palluEdge);

    // ---- Neck + head ----
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.24, 18), matSkin);
    neck.position.y = 1.02;
    avatar.add(neck);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.33, 36, 36), matSkin);
    head.position.y = 1.4;
    head.scale.set(1, 1.12, 1);
    avatar.add(head);

    // hair (back + crown)
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.355, 36, 36), matHair);
    hair.position.set(0, 1.45, -0.05);
    hair.scale.set(1.04, 1.12, 0.92);
    avatar.add(hair);
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 24), matHair);
    bun.position.set(0, 1.32, -0.32);
    avatar.add(bun);

    // jasmine flowers around bun
    for (let i = 0; i < 3; i += 1) {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), matJasmine);
      const a = (i / 3) * Math.PI * 2;
      f.position.set(Math.cos(a) * 0.18, 1.32 + Math.sin(a) * 0.16, -0.3);
      avatar.add(f);
    }

    // ---- Face features ----
    const matDark = new THREE.MeshStandardMaterial({ color: 0x140d0b, roughness: 0.5 });
    [-0.12, 0.12].forEach((x) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 12), matDark);
      eye.position.set(x, 1.42, 0.3);
      avatar.add(eye);
    });
    const lips = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), matMaroonSilkLips());
    function matMaroonSilkLips() {
      return new THREE.MeshStandardMaterial({ color: 0x8b2a30, roughness: 0.4 });
    }
    lips.position.set(0, 1.3, 0.31);
    lips.scale.set(1.6, 0.7, 0.6);
    avatar.add(lips);
    const bindi = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 12), matMaroonDeep);
    bindi.position.set(0, 1.5, 0.31);
    avatar.add(bindi);

    // maang tikka
    const tikka = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), matGoldLight);
    tikka.position.set(0, 1.66, 0.18);
    avatar.add(tikka);

    // earrings
    [-0.32, 0.32].forEach((x) => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 14), matGold);
      ear.position.set(x, 1.28, 0.04);
      avatar.add(ear);
    });

    // ---- Necklace arc ----
    for (let i = 0; i <= 12; i += 1) {
      const a = Math.PI * (0.15 + (i / 12) * 0.7);
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 12), matGold);
      bead.position.set(Math.cos(a) * 0.3, 1.0 - Math.sin(a) * 0.04 - 0.02, Math.sin(a) * 0.0 + 0.22 + Math.cos(a) * 0);
      bead.position.x = Math.cos(a) * 0.26;
      bead.position.y = 0.96 - Math.sin(a - Math.PI / 2) * 0.08;
      bead.position.z = 0.24;
      avatar.add(bead);
    }

    // ---- Namaskaram arms ----
    const shoulderL = new THREE.Vector3(-0.46, 0.82, 0.05);
    const shoulderR = new THREE.Vector3(0.46, 0.82, 0.05);
    const elbowL = new THREE.Vector3(-0.4, 0.5, 0.34);
    const elbowR = new THREE.Vector3(0.4, 0.5, 0.34);
    const hands = new THREE.Vector3(0, 1.02, 0.5);

    avatar.add(limb(shoulderL, elbowL, 0.1, matSkin));
    avatar.add(limb(shoulderR, elbowR, 0.1, matSkin));
    avatar.add(limb(elbowL, hands, 0.085, matSkin));
    avatar.add(limb(elbowR, hands, 0.085, matSkin));

    // palms
    const palms = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.32, 0.08), matSkin);
    palms.position.copy(hands).add(new THREE.Vector3(0, 0.02, 0.02));
    palms.rotation.x = -0.18;
    avatar.add(palms);

    // bangles near wrists
    [elbowL, elbowR].forEach((elbow) => {
      for (let b = 0; b < 3; b += 1) {
        const t = 0.62 + b * 0.12;
        const pos = new THREE.Vector3().lerpVectors(elbow, hands, t);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.014, 8, 20), matGoldLight);
        ring.position.copy(pos);
        const dir = new THREE.Vector3().subVectors(hands, elbow).normalize();
        ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
        avatar.add(ring);
      }
    });

    // ---- Mandala ring (behind) ----
    const mandala = new THREE.Group();
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.012, 8, 90), matGold);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.008, 8, 90), matGoldLight);
    mandala.add(ring1, ring2);
    for (let i = 0; i < 36; i += 1) {
      const a = (i / 36) * Math.PI * 2;
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), matGoldLight);
      dot.position.set(Math.cos(a) * 1.85, Math.sin(a) * 1.85, 0);
      mandala.add(dot);
    }
    mandala.position.set(0, 0.4, -0.7);
    scene.add(mandala);

    // ---- Halo particles ----
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const r = 2.0 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = 0.4 + r * Math.cos(phi) * 0.6;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: C.goldLight,
      size: 0.035,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const halo = new THREE.Points(pGeo, pMat);
    scene.add(halo);

    // ---- Lighting ----
    scene.add(new THREE.AmbientLight(0xfff5e0, 0.5));
    const dir = new THREE.DirectionalLight(C.gold, 2.4);
    dir.position.set(2, 4, 3);
    scene.add(dir);
    const fill = new THREE.PointLight(C.maroon, 1.2, 9);
    fill.position.set(-2, 2, 1);
    scene.add(fill);
    const rim = new THREE.PointLight(C.gold, 1.8, 7);
    rim.position.set(0, 3, -2);
    scene.add(rim);

    avatar.rotation.y = -0.12;

    // ---- Animation ----
    const clock = new THREE.Clock();
    let frameId = 0;
    const animate = () => {
      const t = clock.getElapsedTime();
      avatar.position.y = Math.sin(t) * 0.04;
      avatar.rotation.y = -0.12 + Math.sin(t * 0.5) * 0.08;
      halo.rotation.y = t * 0.12;
      mandala.rotation.z = t * 0.06;
      rim.intensity = 1.5 + Math.sin(t * 1.5) * 0.5;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // ---- Resize ----
    const onResize = () => {
      width = mount.clientWidth || 1;
      height = mount.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // ---- Cleanup ----
    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative flex min-h-[480px] flex-col items-center justify-center md:min-h-screen">
      {failed ? (
        // Graceful CSS-mandala fallback when WebGL is unavailable.
        <div className="relative flex h-full w-full flex-col items-center justify-center py-20">
          <div className="relative flex h-64 w-64 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-zari-gold/40 animate-[spin_22s_linear_infinite]" />
            <span className="absolute inset-4 rounded-full border border-dashed border-zari-gold/30 animate-[spin_30s_linear_infinite_reverse]" />
            <span className="absolute inset-10 rounded-full border border-maroon/20" />
            <span className="text-6xl">🙏</span>
          </div>
          <span className="watermark-telugu mt-6 text-3xl" style={{ color: 'rgba(74,20,24,0.12)' }}>
            మారుతి కలెక్షన్స్
          </span>
        </div>
      ) : (
        <div ref={mountRef} className="h-full w-full flex-1" style={{ minHeight: 'inherit' }} />
      )}
      <p className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 animate-pulse font-display text-lg italic text-maroon">
        🙏 Namaskaram
      </p>
    </div>
  );
}
