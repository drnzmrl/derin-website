import * as THREE from 'three'

/* Uzay araçları three.js primitifleriyle çiziliyor —
   hazır model indirmek yok: lisans derdi ve dosya boyutu sıfır. */

const metal = (color, metalness = 0.75, roughness = 0.35, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra })

/** Gövde + güneş panelleri + çanak anten: iletişim uydusu */
export function buildSatellite() {
  const g = new THREE.Group()

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.15, 1),
    metal('#C9D2E8', 0.7, 0.35)
  )
  g.add(body)

  const foil = new THREE.Mesh(
    new THREE.BoxGeometry(1.04, 0.28, 1.04),
    metal('#C89B3C', 0.9, 0.28)
  )
  foil.position.y = -0.35
  g.add(foil)

  for (const s of [-1, 1]) {
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.04, 0.9),
      metal('#2B3F7A', 0.45, 0.25, {
        emissive: new THREE.Color('#2B3F7A'),
        emissiveIntensity: 0.25,
      })
    )
    panel.position.x = s * 1.85
    g.add(panel)

    const arm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.85, 8),
      metal('#8792AB', 0.8, 0.4)
    )
    arm.position.set(s * 0.72, 0, 0)
    arm.rotation.z = Math.PI / 2
    g.add(arm)
  }

  const dish = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2.6),
    metal('#E6EAF5', 0.5, 0.3, { side: THREE.DoubleSide })
  )
  dish.position.set(0, 0.85, 0.15)
  dish.rotation.x = -0.5
  g.add(dish)

  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.35, 6),
    metal('#8792AB', 0.8, 0.4)
  )
  mast.position.set(0, 0.66, 0.1)
  g.add(mast)

  g.userData.spin = (dt, t) => {
    g.rotation.y += dt * 0.12
    g.rotation.x = Math.sin(t * 0.15) * 0.12
  }
  return g
}

/** Von Kármán burun profili (LD-Haack, C = 0): taban yarıçapı R, boy L */
function vonKarman(R, L, n = 24) {
  const pts = []
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * L // tabandan uca
    const th = Math.acos(1 - (2 * (L - x)) / L)
    const r = (R / Math.sqrt(Math.PI)) * Math.sqrt(th - Math.sin(2 * th) / 2)
    pts.push(new THREE.Vector2(Math.max(r, 0.0005), x))
  }
  return pts
}

/**
 * İki kademeli fırlatma aracı. Oranlar gerçek araçlara yakın:
 * ~0.3 çap, ~4.2 boy (incelik oranı ~14), gövdeden biraz geniş faring,
 * koyu ara kademe, ızgara kanatçıklar, katlanmış iniş bacakları ve
 * 1 + 8 dizilimli dokuz motor çanı. Boya beyaz ve mat, krom değil.
 */
export function buildRocket() {
  const g = new THREE.Group()
  const R = 0.15
  const paint = metal('#EEF1F6', 0.12, 0.55)
  const dark = metal('#1C2030', 0.35, 0.6)
  const steel = metal('#6A7080', 0.8, 0.35)

  // 1. kademe
  const stage1 = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 2.2, 28), paint)
  stage1.position.y = -0.9
  g.add(stage1)

  // ince sıcak renkli bant (tek renk vurgusu)
  const band = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.005, R * 1.005, 0.05, 28), metal('#E0703A', 0.2, 0.5))
  band.position.y = -0.1
  g.add(band)

  // ara kademe
  const inter = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.26, 28), dark)
  inter.position.y = 0.33
  g.add(inter)

  // 2. kademe
  const stage2 = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.6, 28), paint)
  stage2.position.y = 0.76
  g.add(stage2)

  // faring: kısa geçiş konisi, silindir ve von Kármán burun
  const RF = 0.185
  const boat = new THREE.Mesh(new THREE.CylinderGeometry(RF, R, 0.08, 28), paint)
  boat.position.y = 1.1
  g.add(boat)
  const fairing = new THREE.Mesh(new THREE.CylinderGeometry(RF, RF, 0.42, 28), paint)
  fairing.position.y = 1.35
  g.add(fairing)
  const nose = new THREE.Mesh(new THREE.LatheGeometry(vonKarman(RF, 0.62), 28), paint)
  nose.position.y = 1.56
  g.add(nose)

  // ızgara kanatçıklar (1. kademenin tepesinde)
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.1, 0.018), steel)
    fin.position.set(Math.cos(a) * (R + 0.06), 0.1, Math.sin(a) * (R + 0.06))
    fin.rotation.y = -a + Math.PI / 2
    g.add(fin)
  }

  // katlanmış iniş bacakları
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.62, 0.02), dark)
    leg.position.set(Math.cos(a) * (R + 0.008), -1.62, Math.sin(a) * (R + 0.008))
    leg.rotation.y = -a + Math.PI / 2
    g.add(leg)
  }

  // motor bölmesi ve dokuz çan
  const octa = new THREE.Mesh(new THREE.CylinderGeometry(R, R * 0.92, 0.06, 28), dark)
  octa.position.y = -2.03
  g.add(octa)
  const bellProfile = []
  for (let i = 0; i <= 8; i++) {
    const k = i / 8
    bellProfile.push(new THREE.Vector2(0.022 + 0.026 * Math.sqrt(k), -k * 0.1))
  }
  const bellGeo = new THREE.LatheGeometry(bellProfile, 14)
  const bellMat = metal('#4A4F5C', 0.85, 0.3, { side: THREE.DoubleSide })
  const spots = [[0, 0]]
  for (let i = 0; i < 8; i++) spots.push([Math.cos((i / 8) * Math.PI * 2) * 0.1, Math.sin((i / 8) * Math.PI * 2) * 0.1])
  for (const [x, z] of spots) {
    const bell = new THREE.Mesh(bellGeo, bellMat)
    bell.position.set(x, -2.06, z)
    g.add(bell)
  }

  // ---- Egzoz alevi ----
  // İki iç içe koni: içte sıcak beyaz-sarı çekirdek,
  // dışta yumuşak turuncu hale. Toplamalı karışım ile parlar.
  const flame = new THREE.Group()
  flame.position.y = -2.2

  const core = new THREE.Mesh(
    new THREE.ConeGeometry(0.13, 1.1, 14, 1, true),
    new THREE.MeshBasicMaterial({
      color: '#FFE9C4',
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  )
  core.rotation.x = Math.PI
  core.position.y = -0.55
  flame.add(core)

  const halo = new THREE.Mesh(
    new THREE.ConeGeometry(0.26, 2.1, 16, 1, true),
    new THREE.MeshBasicMaterial({
      color: '#FF8A3C',
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  )
  halo.rotation.x = Math.PI
  halo.position.y = -1.05
  flame.add(halo)

  const glow = new THREE.PointLight('#FFA45C', 3, 8)
  glow.position.y = -0.4
  flame.add(glow)

  g.add(flame)
  g.userData.flame = flame

  // Burun aşağı — sayfa aşağı indikçe karanlığa, yıldızlara doğru gidiyor.
  // Alev otomatik olarak arkada (yukarıda) kalır.
  // Düz durmasın diye hafif bir yan eğim de var.
  g.userData.baseTilt = Math.PI + 0.26

  g.userData.spin = (dt, t) => {
    g.rotation.y += dt * 0.25
    g.rotation.z = g.userData.baseTilt + Math.sin(t * 0.5) * 0.03

    // Alev titreşimi
    const f = 0.85 + Math.sin(t * 22) * 0.1 + Math.sin(t * 37) * 0.05
    flame.scale.set(1, f, 1)
    core.material.opacity = 0.8 + Math.sin(t * 30) * 0.15
    halo.material.opacity = 0.3 + Math.sin(t * 17) * 0.12
    glow.intensity = 2.4 + Math.sin(t * 25) * 0.9
  }
  return g
}

/** Derin uzay sondası */
export function buildProbe() {
  const g = new THREE.Group()

  const bus = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 0.7, 16),
    metal('#D6DCEC', 0.75, 0.32)
  )
  g.add(bus)

  const hga = new THREE.Mesh(
    new THREE.SphereGeometry(0.78, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2.8),
    metal('#F0F3FA', 0.4, 0.25, { side: THREE.DoubleSide })
  )
  hga.position.y = 0.62
  hga.rotation.x = Math.PI
  g.add(hga)

  const boom = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 1.6, 6),
    metal('#8792AB', 0.8, 0.45)
  )
  boom.position.set(1.25, -0.2, 0)
  boom.rotation.z = Math.PI / 2
  g.add(boom)

  const rtg = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.22, 0.22),
    metal('#3A3F4D', 0.6, 0.5)
  )
  rtg.position.set(2.1, -0.2, 0)
  g.add(rtg)

  g.userData.spin = (dt, t) => {
    g.rotation.z += dt * 0.08
    g.rotation.y = Math.sin(t * 0.1) * 0.5
  }
  return g
}

/**
 * Uzakta, yörüngede yavaşça dönen minik uydu.
 * Sadece 3 parça ve ışık hesabı yapmayan MeshBasicMaterial —
 * kare hızına etkisi ihmal edilebilir.
 */
export function buildMiniSat() {
  const g = new THREE.Group()
  const materials = []
  // Hepsi transparent: uydu sahneden çıkarken soluklaşabilsin
  const flat = (color, baseOpacity = 1) => {
    const m = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: baseOpacity,
    })
    m.userData.baseOpacity = baseOpacity
    materials.push(m)
    return m
  }

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.4, 0.34), flat('#B9C4DD'))
  g.add(body)

  for (const s of [-1, 1]) {
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.02, 0.26),
      flat('#4D6BB5', 0.9)
    )
    panel.position.x = s * 0.5
    g.add(panel)
  }

  g.userData.materials = materials
  /** 0 = tamamen kaybolmuş, 1 = tam görünür */
  g.userData.setFade = (v) => {
    for (const m of materials) m.opacity = m.userData.baseOpacity * v
  }

  g.userData.spin = (dt) => {
    g.rotation.y += dt * 0.18
    g.rotation.z += dt * 0.05
  }
  return g
}

export const CRAFT_BUILDERS = {
  satellite: buildSatellite,
  rocket: buildRocket,
  probe: buildProbe,
  minisat: buildMiniSat,
}
