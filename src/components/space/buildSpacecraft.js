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

/** İki kademeli roket */
export function buildRocket() {
  const g = new THREE.Group()

  const stage1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 1.7, 20),
    metal('#EDEFF6', 0.35, 0.42)
  )
  stage1.position.y = -0.7
  g.add(stage1)

  const stage2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.38, 0.75, 20),
    metal('#DDE2EE', 0.4, 0.4)
  )
  stage2.position.y = 0.5
  g.add(stage2)

  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.72, 20),
    metal('#F5F7FC', 0.3, 0.38)
  )
  nose.position.y = 1.15
  g.add(nose)

  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.5, 0.05),
      metal('#C2452F', 0.3, 0.5)
    )
    fin.position.set(Math.cos(a) * 0.45, -1.35, Math.sin(a) * 0.45)
    fin.rotation.y = -a
    g.add(fin)
  }

  const nozzle = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.35, 16, 1, true),
    metal('#5A5F6E', 0.85, 0.35, { side: THREE.DoubleSide })
  )
  nozzle.position.y = -1.68
  g.add(nozzle)

  // ---- Egzoz alevi ----
  // İki iç içe koni: içte sıcak beyaz-sarı çekirdek,
  // dışta yumuşak turuncu hale. Toplamalı karışım ile parlar.
  const flame = new THREE.Group()
  flame.position.y = -1.9

  const core = new THREE.Mesh(
    new THREE.ConeGeometry(0.2, 1.1, 14, 1, true),
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
    new THREE.ConeGeometry(0.42, 2.1, 16, 1, true),
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
  const flat = (color, opacity = 1) =>
    new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity })

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

  g.userData.spin = (dt) => {
    g.rotation.y += dt * 0.18
    g.rotation.z += dt * 0.05
  }
  return g
}

/**
 * Serbest yüzen astronot — düşük poligonlu, yavaşça takla atıyor.
 * Kask altın vizörlü; gövde ve uzuvlar basit kapsüller.
 */
export function buildAstronaut() {
  const g = new THREE.Group()
  const suit = metal('#EDF0F7', 0.15, 0.75)
  const joint = metal('#AFB8CC', 0.3, 0.6)

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.42, 4, 10), suit)
  g.add(torso)

  // Sırt yaşam destek ünitesi
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.5, 0.2), metal('#8B94A8', 0.5, 0.5))
  pack.position.z = -0.32
  g.add(pack)

  // Kask
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.27, 16, 12), suit)
  helmet.position.y = 0.58
  g.add(helmet)

  // Altın vizör
  const visor = new THREE.Mesh(
    new THREE.SphereGeometry(0.255, 16, 10, -0.9, 1.8, 0.7, 1.0),
    new THREE.MeshStandardMaterial({
      color: '#D9A03C',
      metalness: 0.95,
      roughness: 0.12,
      side: THREE.DoubleSide,
    })
  )
  visor.position.y = 0.58
  visor.position.z = 0.02
  g.add(visor)

  // Kollar ve bacaklar
  const limb = (x, y, z, rz) => {
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.38, 3, 8), joint)
    m.position.set(x, y, z)
    m.rotation.z = rz
    g.add(m)
  }
  limb(-0.42, 0.12, 0, 0.75)
  limb(0.42, 0.06, 0, -1.05)
  limb(-0.17, -0.62, 0, 0.2)
  limb(0.17, -0.6, 0, -0.32)

  g.userData.spin = (dt, t) => {
    g.rotation.y += dt * 0.16
    g.rotation.z = Math.sin(t * 0.22) * 0.35
    g.rotation.x = Math.cos(t * 0.17) * 0.22
  }
  return g
}

/**
 * Hero'nun tepesinden geçen uçak.
 * 4 parça + ince bir iz; maliyeti ihmal edilebilir.
 */
export function buildPlane() {
  const g = new THREE.Group()
  const shell = metal('#E4E9F4', 0.4, 0.45)

  const fuselage = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.85, 3, 8), shell)
  fuselage.rotation.z = Math.PI / 2
  g.add(fuselage)

  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.025, 1.5), shell)
  wing.position.x = -0.05
  g.add(wing)

  const tailWing = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, 0.55), shell)
  tailWing.position.x = -0.5
  g.add(tailWing)

  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.02), shell)
  fin.position.set(-0.5, 0.13, 0)
  g.add(fin)

  // Arkada bırakılan ince yoğuşma izi (2 üçgen)
  const trail = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 0.06),
    new THREE.MeshBasicMaterial({
      color: '#FFFFFF',
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  )
  trail.position.x = -3.1
  g.add(trail)
  g.userData.trail = trail

  g.userData.spin = (dt, t) => {
    g.rotation.z = Math.sin(t * 0.6) * 0.04
  }
  return g
}

export const CRAFT_BUILDERS = {
  satellite: buildSatellite,
  rocket: buildRocket,
  probe: buildProbe,
  minisat: buildMiniSat,
  astronaut: buildAstronaut,
  plane: buildPlane,
}
