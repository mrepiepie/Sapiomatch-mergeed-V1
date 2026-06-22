import * as THREE from "three";

export default class SuperGlobeEngine {
  constructor(canvasId, sidebarId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.sidebar = document.getElementById(sidebarId);
    this.titleId = options.titleId || "globe-sidebar-title-heading";
    this.contentId = options.contentId || "globe-sidebar-content-area";
    this.closeButtonId = options.closeButtonId || "globe-sidebar-close-btn";
    const initialSize = this.getCanvasSize();
    this.width = initialSize.width;
    this.height = initialSize.height;
    this.hoveredHub = null;
    this.focusedHub = null;
    this.isDragging = false;
    this.lastPointer = { x: 0, y: 0 };
    this.dragVelocity = { x: 0, y: 0 };
    this.autoSpinSpeed = 0.0016;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.markerMeshes = [];
    this.cameraBaseZ = 5.85;
    this.cameraFocusZ = 3.05;
    this.targetCameraZ = this.cameraBaseZ;

    this.hubs = {
      uae: {
        name: "United Arab Emirates",
        monogram: "UAE",
        lat: 25.2,
        lon: 55.27,
        polygon: [[25.8, 56.2], [24.4, 56.3], [24.0, 54.0], [24.2, 51.6], [25.2, 51.5], [26.0, 54.0]],
        description: "Premier Middle East higher education node featuring accredited branch campuses under KHDA supervision.",
        universities: [
          { name: "Amity University Dubai", slug: "amity-university-dubai", type: "University", location: "Dubai Academic City" },
          { name: "University of Birmingham Dubai", slug: "university-of-birmingham-dubai", type: "University", location: "Dubai Academic City" },
          { name: "Middlesex University Dubai", slug: "middlesex-university-dubai", type: "University", location: "Dubai Knowledge Park" }
        ]
      },
      uk: {
        name: "United Kingdom",
        monogram: "UK",
        lat: 54.0,
        lon: -2.5,
        polygon: [[59, -6], [58, -2], [55, -1], [50, 1], [50, -5], [54, -5], [55, -8]],
        description: "Renowned global educational standard offering undergraduate foundation courses and specialized master programs.",
        universities: [
          { name: "London Business School", slug: "london-business-school", type: "University", location: "London, UK" },
          { name: "De Montfort University", slug: "de-montfort-university", type: "University", location: "Leicester, UK" },
          { name: "Heriot-Watt University", slug: "heriot-watt-university", type: "University", location: "Edinburgh / Dubai" }
        ]
      },
      usa: {
        name: "United States",
        monogram: "USA",
        lat: 38.0,
        lon: -97.0,
        polygon: [[49, -125], [49, -95], [45, -70], [30, -80], [25, -80], [25, -97], [32, -117], [32, -124]],
        description: "Prestigious universities featuring cutting-edge research opportunities, tech bootcamps, and career accelerators.",
        universities: [
          { name: "Hult International Business School", slug: "hult-international-business-school", type: "University", location: "Boston / San Francisco" },
          { name: "Rochester Institute of Technology- Dubai", slug: "rochester-institute-of-technology-dubai", type: "University", location: "Silicon Oasis, Dubai" }
        ]
      },
      canada: {
        name: "Canada",
        monogram: "CAN",
        lat: 56.0,
        lon: -106.0,
        polygon: [[49, -125], [70, -130], [70, -60], [47, -52], [45, -70], [49, -95]],
        description: "High student quality indices, safe urban centers, and extensive post-graduation work opportunities.",
        universities: [
          { name: "Curtin University", slug: "curtin-university", type: "University", location: "Canada / global branch paths" }
        ]
      },
      australia: {
        name: "Australia",
        monogram: "AUS",
        lat: -25.0,
        lon: 133.0,
        polygon: [[-10, 142], [-15, 136], [-12, 130], [-21, 114], [-35, 115], [-35, 138], [-37, 150], [-28, 153]],
        description: "Top-tier Southern Hemisphere study destination with excellent lifestyle, work rights, and research excellence.",
        universities: [
          { name: "Murdoch University, Dubai", slug: "murdoch-university-dubai", type: "University", location: "Dubai Knowledge Park" }
        ]
      }
    };

    this.initScene();
    this.bindEvents();
    this.startAnimationLoop();
    this.loadUniversityDirectory();
  }

  getCanvasSize() {
    const rect = this.canvas.getBoundingClientRect();
    return {
      width: Math.max(1, Math.round(rect.width || this.canvas.width)),
      height: Math.max(1, Math.round(rect.height || this.canvas.height))
    };
  }

  resizeRendererToDisplaySize() {
    const { width, height } = this.getCanvasSize();
    if (width === this.width && height === this.height) return;

    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  async loadUniversityDirectory() {
    try {
      const response = await fetch("/api/globe/universities");
      if (!response.ok) {
        throw new Error(`Globe directory request failed: ${response.status}`);
      }

      const payload = await response.json();
      Object.entries(payload.countries || {}).forEach(([key, data]) => {
        if (!this.hubs[key] || !Array.isArray(data.universities) || !data.universities.length) return;
        this.hubs[key].universities = data.universities;
        this.hubs[key].dataSource = payload.source;
      });

      if (this.focusedHub) {
        this.openSidebar(this.focusedHub);
      }
    } catch (error) {
      console.warn("Using fallback globe directory data.", error);
    }
  }

  initScene() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, this.cameraBaseZ);

    this.earthGroup = new THREE.Group();
    this.earthGroup.rotation.x = 0.2;
    this.scene.add(this.earthGroup);

    this.addLights();
    this.addEarth();
    this.addAtmosphere();
    this.addStarfield();
    this.addHubMarkers();
  }

  addLights() {
    this.scene.add(new THREE.AmbientLight(0x5b7da5, 0.75));

    const sun = new THREE.DirectionalLight(0xffffff, 3.6);
    sun.position.set(-4, 3, 5);
    this.scene.add(sun);

    const rim = new THREE.DirectionalLight(0x38bdf8, 1.6);
    rim.position.set(4, -1, -3);
    this.scene.add(rim);
  }

  addEarth() {
    const fallbackTexture = new THREE.CanvasTexture(this.createEarthTexture());
    fallbackTexture.colorSpace = THREE.SRGBColorSpace;
    fallbackTexture.anisotropy = 8;

    this.earthMaterial = new THREE.MeshStandardMaterial({
      map: fallbackTexture,
      color: 0x9fb8ff,
      roughness: 0.78,
      metalness: 0.02,
      emissive: 0x06142f,
      emissiveIntensity: 0.28
    });

    this.earth = new THREE.Mesh(
      new THREE.SphereGeometry(1.72, 128, 128),
      this.earthMaterial
    );
    this.earthGroup.add(this.earth);

    new THREE.TextureLoader()
      .setCrossOrigin("anonymous")
      .load("/textures/earth/earth-blue-marble.jpg", (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
        this.earthMaterial.map = texture;
        this.earthMaterial.needsUpdate = true;
      });
  }

  addAtmosphere() {
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.82, 96, 96),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        uniforms: {
          glowColor: { value: new THREE.Color(0x38bdf8) }
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(glowColor, intensity * 0.55);
          }
        `
      })
    );
    this.earthGroup.add(atmosphere);
  }

  addStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < 700; i++) {
      const radius = 18 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    }

    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: 0xe0f2fe,
        size: 0.035,
        transparent: true,
        opacity: 0.72,
        depthWrite: false
      })
    );
    this.scene.add(stars);
  }

  addHubMarkers() {
    Object.entries(this.hubs).forEach(([key, hub]) => {
      const marker = this.createMarkerSprite(hub.monogram);
      marker.position.copy(this.latLonToVector3(hub.lat, hub.lon, 1.93));
      marker.userData.hubKey = key;
      marker.userData.baseScale = 0.33;
      marker.scale.set(0.33, 0.33, 0.33);
      this.markerMeshes.push(marker);
      this.earthGroup.add(marker);
    });

    this.selectedCountryLabel = this.createCountryLabelSprite("");
    this.selectedCountryLabel.visible = false;
    this.selectedCountryLabel.scale.set(0.82, 0.28, 1);
    this.earthGroup.add(this.selectedCountryLabel);
  }

  createEarthTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    const ocean = ctx.createLinearGradient(0, 0, 0, canvas.height);
    ocean.addColorStop(0, "#0c4a6e");
    ocean.addColorStop(0.28, "#0369a1");
    ocean.addColorStop(0.5, "#075985");
    ocean.addColorStop(0.72, "#0b4a75");
    ocean.addColorStop(1, "#082f49");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 9000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const alpha = 0.015 + Math.random() * 0.035;
      ctx.fillStyle = `rgba(186, 230, 253, ${alpha})`;
      ctx.fillRect(x, y, 1, 1);
    }

    const land = [
      [[40, -168], [62, -150], [72, -105], [66, -60], [48, -58], [30, -82], [18, -100], [28, -130]],
      [[8, -82], [22, -75], [9, -48], [-18, -42], [-55, -68], [-38, -78], [-8, -80]],
      [[36, -10], [58, 8], [70, 52], [61, 104], [52, 152], [30, 142], [8, 112], [10, 76], [22, 48], [5, 26], [16, -8]],
      [[34, 18], [18, 44], [-9, 42], [-34, 22], [-27, 8], [4, 2], [20, -16]],
      [[-12, 112], [-22, 122], [-35, 116], [-42, 136], [-32, 154], [-14, 146], [-10, 130]],
      [[74, -60], [82, -42], [78, -18], [66, -28], [62, -52]],
      [[-64, -180], [-70, -90], [-66, 0], [-72, 95], [-64, 180]]
    ];

    land.forEach((poly, index) => {
      this.drawTexturePolygon(ctx, canvas, poly, index === 6 ? "#dbeafe" : "#3f8f5d", index === 6 ? "#eff6ff" : "#86efac");
    });

    this.drawTextureHubCountries(ctx, canvas);
    this.drawTextureRelief(ctx, canvas);
    return canvas;
  }

  createBumpTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#777";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const ranges = [
      [[40, -168], [62, -150], [72, -105], [66, -60], [48, -58], [30, -82], [18, -100], [28, -130]],
      [[8, -82], [22, -75], [9, -48], [-18, -42], [-55, -68], [-38, -78], [-8, -80]],
      [[36, -10], [58, 8], [70, 52], [61, 104], [52, 152], [30, 142], [8, 112], [10, 76], [22, 48], [5, 26], [16, -8]],
      [[34, 18], [18, 44], [-9, 42], [-34, 22], [-27, 8], [4, 2], [20, -16]],
      [[-12, 112], [-22, 122], [-35, 116], [-42, 136], [-32, 154], [-14, 146], [-10, 130]]
    ];

    ranges.forEach((poly) => this.drawTexturePolygon(ctx, canvas, poly, "#9a9a9a", "#cccccc"));

    for (let i = 0; i < 1800; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + Math.random() * 0.12})`;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    return canvas;
  }

  drawTexturePolygon(ctx, canvas, latLonPoly, lowColor, highColor) {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, highColor);
    gradient.addColorStop(0.5, lowColor);
    gradient.addColorStop(1, "#2f6f47");
    ctx.fillStyle = gradient;
    ctx.strokeStyle = "rgba(236, 253, 245, 0.55)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    latLonPoly.forEach(([lat, lon], index) => {
      const point = this.latLonToTexture(lat, lon, canvas);
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawTextureHubCountries(ctx, canvas) {
    Object.values(this.hubs).forEach((hub) => {
      ctx.save();
      ctx.shadowColor = "rgba(56, 189, 248, 0.85)";
      ctx.shadowBlur = 14;
      this.drawTexturePolygon(ctx, canvas, hub.polygon, "#d9f99d", "#f8fafc");
      ctx.restore();
    });
  }

  drawTextureRelief(ctx, canvas) {
    for (let i = 0; i < 520; i++) {
      const lat = -58 + Math.random() * 126;
      const lon = -175 + Math.random() * 350;
      const { x, y } = this.latLonToTexture(lat, lon, canvas);
      ctx.strokeStyle = `rgba(21, 94, 59, ${0.06 + Math.random() * 0.12})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(
        x + 18 + Math.random() * 52,
        y - 12 + Math.random() * 24,
        x + 60 + Math.random() * 80,
        y + 12 - Math.random() * 24,
        x + 110 + Math.random() * 90,
        y + Math.random() * 28 - 14
      );
      ctx.stroke();
    }
  }

  createMarkerSprite(label) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    const glow = ctx.createRadialGradient(128, 128, 6, 128, 128, 112);
    glow.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    glow.addColorStop(0.18, "rgba(56, 189, 248, 0.95)");
    glow.addColorStop(0.45, "rgba(14, 165, 233, 0.34)");
    glow.addColorStop(1, "rgba(14, 165, 233, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(128, 128, 112, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(128, 128, 38, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
    ctx.beginPath();
    ctx.arc(128, 128, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 34px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 128, 129);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        depthTest: true
      })
    );
  }

  createCountryLabelSprite(label) {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    this.paintCountryLabel(ctx, canvas, label);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      opacity: 0.98
    });
    const sprite = new THREE.Sprite(material);
    sprite.userData.textureCanvas = canvas;
    sprite.userData.textureContext = ctx;
    sprite.userData.texture = texture;
    return sprite;
  }

  paintCountryLabel(ctx, canvas, label) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!label) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 250);
    glow.addColorStop(0, "rgba(56, 189, 248, 0.38)");
    glow.addColorStop(0.55, "rgba(37, 99, 235, 0.16)");
    glow.addColorStop(1, "rgba(37, 99, 235, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 330, 86, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "800 56px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(2, 6, 23, 0.95)";
    ctx.lineWidth = 12;
    ctx.strokeText(label, cx, cy);
    ctx.shadowColor = "rgba(56, 189, 248, 0.95)";
    ctx.shadowBlur = 24;
    ctx.fillStyle = "#e0f2fe";
    ctx.fillText(label, cx, cy);
    ctx.shadowBlur = 0;
  }

  updateCountryLabel(hub) {
    if (!this.selectedCountryLabel || !hub) return;
    const label = hub.monogram === "CAN" ? "CANADA" : hub.monogram;
    const { textureCanvas, textureContext, texture } = this.selectedCountryLabel.userData;
    this.paintCountryLabel(textureContext, textureCanvas, label);
    texture.needsUpdate = true;
    this.selectedCountryLabel.position.copy(this.latLonToVector3(hub.lat, hub.lon, 2.08));
    this.selectedCountryLabel.visible = true;
  }

  latLonToTexture(lat, lon, canvas) {
    return {
      x: ((lon + 180) / 360) * canvas.width,
      y: ((90 - lat) / 180) * canvas.height
    };
  }

  latLonToVector3(lat, lon, radius) {
    const latRad = THREE.MathUtils.degToRad(lat);
    const lonRad = THREE.MathUtils.degToRad(lon);
    return new THREE.Vector3(
      radius * Math.cos(latRad) * Math.cos(lonRad),
      radius * Math.sin(latRad),
      -radius * Math.cos(latRad) * Math.sin(lonRad)
    );
  }

  bindEvents() {
    this.canvas.addEventListener("pointerdown", (event) => {
      this.isDragging = true;
      this.canvas.setPointerCapture(event.pointerId);
      this.lastPointer = { x: event.clientX, y: event.clientY };
      this.dragVelocity = { x: 0, y: 0 };
      this.canvas.style.cursor = "grabbing";
    });

    this.canvas.addEventListener("pointermove", (event) => {
      this.updatePointer(event);

      if (this.isDragging) {
        const dx = event.clientX - this.lastPointer.x;
        const dy = event.clientY - this.lastPointer.y;

        this.earthGroup.rotation.y += dx * 0.006;
        this.earthGroup.rotation.x += dy * 0.004;
        this.earthGroup.rotation.x = THREE.MathUtils.clamp(this.earthGroup.rotation.x, -0.9, 0.9);

        this.dragVelocity = { x: dx * 0.0008, y: dy * 0.00045 };
        this.lastPointer = { x: event.clientX, y: event.clientY };
      }

      this.updateHoveredMarker();
    });

    this.canvas.addEventListener("pointerup", (event) => {
      this.isDragging = false;
      if (this.canvas.hasPointerCapture(event.pointerId)) {
        this.canvas.releasePointerCapture(event.pointerId);
      }
      this.canvas.style.cursor = this.hoveredHub ? "pointer" : "grab";
    });

    this.canvas.addEventListener("pointerleave", () => {
      if (!this.isDragging) {
        this.hoveredHub = null;
        this.updateMarkerScales();
        this.canvas.style.cursor = "grab";
      }
    });

    this.canvas.addEventListener("click", () => {
      if (this.hoveredHub) {
        this.focusOnHub(this.hoveredHub);
      } else {
        this.closeSidebar();
      }
    });

    const closeBtn = document.getElementById(this.closeButtonId);
    if (closeBtn) {
      closeBtn.onclick = () => this.closeSidebar();
    }
  }

  updatePointer(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  }

  updateHoveredMarker() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.markerMeshes, false);
    const frontHit = hits.find((hit) => hit.object.visible);
    this.hoveredHub = frontHit ? frontHit.object.userData.hubKey : null;
    this.canvas.style.cursor = this.hoveredHub ? "pointer" : (this.isDragging ? "grabbing" : "grab");
    this.updateMarkerScales();
  }

  updateMarkerScales() {
    this.markerMeshes.forEach((marker) => {
      const active = marker.userData.hubKey === this.hoveredHub || marker.userData.hubKey === this.focusedHub;
      const target = active ? 0.44 : marker.userData.baseScale;
      marker.scale.lerp(new THREE.Vector3(target, target, target), 0.22);
    });
  }

  updateMarkerVisibility() {
    const cameraDirection = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDirection);

    this.markerMeshes.forEach((marker) => {
      if (marker.userData.hubKey === this.focusedHub && this.selectedCountryLabel?.visible) {
        marker.visible = false;
        return;
      }

      const world = new THREE.Vector3();
      marker.getWorldPosition(world);
      marker.visible = world.clone().normalize().dot(cameraDirection.clone().negate()) > 0.1;
    });
  }

  focusOnHub(key) {
    this.focusedHub = key;
    const hub = this.hubs[key];
    const target = this.latLonToVector3(hub.lat, hub.lon, 1);
    const equatorDistance = Math.sqrt((target.x * target.x) + (target.z * target.z));
    const targetRotY = -Math.atan2(target.x, target.z);
    const targetRotX = THREE.MathUtils.clamp(Math.atan2(target.y, equatorDistance), -1.2, 1.2);

    this.targetFocus = { x: targetRotX, y: targetRotY };
    this.targetCameraZ = this.cameraFocusZ;
    this.dragVelocity = { x: 0, y: 0 };
    this.updateCountryLabel(hub);
    this.openSidebar(key);
  }

  closeSidebar() {
    this.focusedHub = null;
    this.targetFocus = null;
    this.targetCameraZ = this.cameraBaseZ;
    if (this.selectedCountryLabel) {
      this.selectedCountryLabel.visible = false;
    }
    if (this.sidebar) {
      this.sidebar.classList.remove("active");
    }
  }

  escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[char]);
  }

  getUniversityLink(university) {
    return {
      href: `#/institutions/${university.slug || ""}`,
      label: "View Profile",
      attributes: ""
    };
  }

  bindDirectoryCardEvents(contentArea) {
    contentArea.querySelectorAll("[data-globe-university]").forEach((button) => {
      button.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("sapio:navigate-institution", {
          detail: {
            slug: button.dataset.slug || "",
            name: button.dataset.name || ""
          }
        }));
      });
    });
  }

  openSidebar(key) {
    if (!this.sidebar) return;
    const hub = this.hubs[key];
    const heading = document.getElementById(this.titleId);
    if (heading) {
      heading.innerHTML = `
        <i data-lucide="map-pin" style="width:18px; color:var(--accent);"></i>
        <span>${hub.name} Hub</span>
      `;
    }

    const contentArea = document.getElementById(this.contentId);
    if (contentArea) {
      contentArea.innerHTML = `
        <p style="font-size:12px; color:var(--muted-foreground); line-height:1.5; margin-bottom:16px;">
          ${this.escapeHTML(hub.description)}
        </p>
        <div class="directory-section-title" style="margin-bottom:12px;">Registered Partners</div>
        ${hub.universities.map((u) => `
          <button
            type="button"
            class="directory-uni-card directory-uni-card-action"
            data-globe-university="true"
            data-slug="${this.escapeHTML(u.slug || "")}"
            data-name="${this.escapeHTML(u.name)}"
          >
            <span class="directory-uni-card-topline">
              <span class="directory-uni-card-name">${this.escapeHTML(u.name)}</span>
              <span class="directory-uni-card-badge">Active</span>
            </span>
            <span class="directory-uni-card-meta">
              <span><i data-lucide="building" style="width:12px;"></i> ${this.escapeHTML(u.type || "University")}</span>
              <span><i data-lucide="map-pin" style="width:12px;"></i> ${this.escapeHTML(u.location || hub.name)}</span>
            </span>
            <span class="directory-uni-card-footer">
              <span>View university profile</span>
              <i data-lucide="arrow-right" style="width:13px;"></i>
            </span>
          </button>
        `).join("")}
      `;
      this.bindDirectoryCardEvents(contentArea);
    }

    this.sidebar.classList.add("active");
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  startAnimationLoop() {
    const tick = () => {
      if (!this.canvas || !document.contains(this.canvas)) return;

      this.resizeRendererToDisplaySize();

      if (this.targetFocus) {
        this.earthGroup.rotation.x += (this.targetFocus.x - this.earthGroup.rotation.x) * 0.08;
        let diffY = this.targetFocus.y - this.earthGroup.rotation.y;
        diffY = Math.atan2(Math.sin(diffY), Math.cos(diffY));
        this.earthGroup.rotation.y += diffY * 0.08;
      } else if (!this.isDragging) {
        this.earthGroup.rotation.y += this.autoSpinSpeed + this.dragVelocity.x;
        this.earthGroup.rotation.x += this.dragVelocity.y;
        this.earthGroup.rotation.x = THREE.MathUtils.clamp(this.earthGroup.rotation.x, -0.9, 0.9);
        this.dragVelocity.x *= 0.93;
        this.dragVelocity.y *= 0.93;
      }

      this.camera.position.z += (this.targetCameraZ - this.camera.position.z) * 0.08;
      this.updateMarkerVisibility();
      this.updateMarkerScales();
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }
}
