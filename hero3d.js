(function () {
  const container = document.getElementById("hero3d");
  if (!container || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 1.1, 7.5);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  const rig = new THREE.Group();
  scene.add(rig);

  const matBody = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.35 });
  const matGlass = new THREE.MeshStandardMaterial({ color: 0x0b1020, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.85 });
  const matDark = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.4, roughness: 0.6 });

  // ---------- RGB helpers (rainbow cycling) ----------
  const rgbMats = [];
  function rgbMat(offset) {
    const m = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 1.8,
      metalness: 0.3,
      roughness: 0.3
    });
    m.userData.offset = offset || 0;
    rgbMats.push(m);
    return m;
  }

  function applyHue(m, t) {
    const h = (t * 0.07 + m.userData.offset) % 1;
    m.color.setHSL(h, 0.95, 0.55);
    m.emissive.setHSL(h, 1, 0.5);
  }

  // ---------- GAMING TOWER ----------
  const tower = new THREE.Group();
  tower.position.set(-2.7, 0, 0);
  tower.rotation.y = 0.15;

  const pcCase = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.8, 1.2), matBody);
  tower.add(pcCase);

  const glass = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.3, 0.9), matGlass);
  glass.position.set(-0.86, 0.1, 0);
  tower.add(glass);

  const ventTop = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.3, 0.6), matDark);
  ventTop.position.set(0, 1.32, 0.35);
  tower.add(ventTop);

  const ventBottom = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.25, 0.5), matDark);
  ventBottom.position.set(0, -1.25, 0.45);
  tower.add(ventBottom);

  // RGB front corner strips
  const stripL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.4, 0.06), rgbMat(0));
  stripL.position.set(0.84, 0.05, 0.55);
  tower.add(stripL);
  const stripR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.4, 0.06), rgbMat(0.15));
  stripR.position.set(0.84, 0.05, -0.55);
  tower.add(stripR);

  // RGB fans
  function makeFan(x, y) {
    const g = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.045, 12, 32), rgbMat(Math.random()));
    g.add(ring);
    const blades = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.12, 0.03), matBody);
      blade.position.x = 0.23;
      blade.rotation.z = (i * Math.PI) / 2;
      blades.add(blade);
    }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 16), rgbMat(0.3));
    hub.rotation.x = Math.PI / 2;
    blades.add(hub);
    g.add(blades);
    g.position.set(x, y, 0.62);
    tower.add(g);
    return blades;
  }
  const fan1 = makeFan(-0.4, 0.8);
  const fan2 = makeFan(0.4, 0.8);
  const fan3 = makeFan(0, -0.55);

  // RGB bottom LED strips
  function ledStrip(y, offset) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.06, 0.03), rgbMat(offset));
    m.position.set(0, y, 0.61);
    tower.add(m);
  }
  ledStrip(-0.95, 0);
  ledStrip(-1.05, 0.12);
  ledStrip(-1.15, 0.24);

  rig.add(tower);

  // ---------- GAMING MONITOR ----------
  const monitor = new THREE.Group();
  monitor.position.set(1.7, 0.6, 0);

  const screenMat = new THREE.MeshBasicMaterial({ color: 0x00bfff });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 1.55), screenMat);
  screen.position.set(0, 0.3, 0.58);
  monitor.add(screen);

  const bezel = new THREE.Mesh(new THREE.BoxGeometry(2.85, 1.72, 0.12), matDark);
  bezel.position.set(0, 0.3, 0.5);
  monitor.add(bezel);

  const logoGlow = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.02), rgbMat(0.5));
  logoGlow.position.set(0, 0.3, 0.575);
  monitor.add(logoGlow);

  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.55, 0.16), matBody);
  stand.position.set(0, -0.38, 0.4);
  monitor.add(stand);

  const base = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.1, 0.5), matBody);
  base.position.set(0, -0.65, 0.4);
  monitor.add(base);

  rig.add(monitor);

  // ---------- RGB KEYBOARD ----------
  const kb = new THREE.Group();
  kb.position.set(1.7, -0.95, 1.0);
  kb.rotation.x = -0.25;
  kb.rotation.y = 0.35;
  const kbBase = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.14, 0.62), matBody);
  kb.add(kbBase);
  const kbGlow = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.02, 0.46), rgbMat(0.1));
  kbGlow.position.y = 0.08;
  kb.add(kbGlow);
  rig.add(kb);

  // ---------- RGB MOUSE ----------
  const mouse = new THREE.Group();
  mouse.position.set(2.9, -0.95, 1.25);
  mouse.rotation.x = -0.15;
  mouse.rotation.y = -0.4;
  const mBody = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.7), matBody);
  mBody.position.y = 0.05;
  mouse.add(mBody);
  const mStrip = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.03, 0.55), rgbMat(0.2));
  mStrip.position.y = 0.16;
  mouse.add(mStrip);
  const mScroll = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.14), rgbMat(0.4));
  mScroll.position.y = 0.15;
  mouse.add(mScroll);
  rig.add(mouse);

  // ---------- LIGHTS ----------
  scene.add(new THREE.AmbientLight(0x334155, 0.7));
  const lightA = new THREE.PointLight(0xef4444, 2.4, 20);
  lightA.position.set(-4.5, 1.5, 3);
  scene.add(lightA);
  const lightB = new THREE.PointLight(0x2563eb, 2.4, 20);
  lightB.position.set(4.5, -1, 3);
  scene.add(lightB);

  // ---------- PARTICLES ----------
  function makeParticles(count, spreadX, spreadY, spreadZ, size) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spreadX;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spreadZ - 1;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0x93c5fd, size, transparent: true, opacity: 0.85 });
    const points = new THREE.Points(geo, mat);
    scene.add(points);
    return points;
  }
  const cloud1 = makeParticles(180, 18, 9, 8, 0.05);
  const cloud2 = makeParticles(160, 18, 9, 8, 0.045);
  const cloud3 = makeParticles(140, 18, 9, 8, 0.04);

  // ---------- INTERACTION ----------
  let mx = 0;
  let my = 0;
  container.addEventListener("mousemove", function (e) {
    const r = container.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    my = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    rig.rotation.y = Math.sin(t * 0.25) * 0.5 + mx * 0.35;
    rig.rotation.x = my * 0.15 + Math.sin(t * 0.2) * 0.04;
    rig.position.y = Math.sin(t * 0.6) * 0.1;

    fan1.rotation.z = t * 6;
    fan2.rotation.z = -t * 5;
    fan3.rotation.z = t * 7;

    rgbMats.forEach(function (m) {
      applyHue(m, t);
    });

    const h = (t * 0.05) % 1;
    screenMat.color.setHSL(h, 0.95, 0.55);

    lightA.color.setHSL((t * 0.05) % 1, 1, 0.5);
    lightB.color.setHSL((t * 0.05 + 0.5) % 1, 1, 0.5);

    cloud1.material.color.setHSL((t * 0.03) % 1, 0.8, 0.7);
    cloud2.material.color.setHSL((t * 0.03 + 0.33) % 1, 0.8, 0.7);
    cloud3.material.color.setHSL((t * 0.03 + 0.66) % 1, 0.8, 0.7);
    cloud1.rotation.y = t * 0.02;
    cloud2.rotation.y = -t * 0.025;
    cloud3.rotation.y = t * 0.03;

    camera.position.y = 1.1 + Math.sin(t * 0.5) * 0.15;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();
})();
