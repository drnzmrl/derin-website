import * as THREE from 'three'

/* Gezegenler — Solar System Scope dokularıyla (CC BY 4.0, NASA verisi).
   Her biri tek bir küre; maliyeti neredeyse yok.
   Listeyi theme.config.js → space.planets.list yönetiyor. */

const loader = new THREE.TextureLoader()

/**
 * Halka geometrisinin UV'lerini yeniden yazar.
 * Varsayılan RingGeometry UV'leri doku için uygun değil —
 * u'yu yarıçapa göre dağıtmak gerekiyor, yoksa halka bulanık çıkar.
 */
function radialRingUVs(geometry, inner, outer) {
  const pos = geometry.attributes.position
  const uv = geometry.attributes.uv
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const r = v.length()
    uv.setXY(i, (r - inner) / (outer - inner), 0.5)
  }
  uv.needsUpdate = true
}

/**
 * Tek bir gezegen üretir.
 *
 * @param {object} p  theme.config.js → space.planets.list içindeki satır
 *   key, texture, radius, tilt, spin, ring, ringTexture,
 *   from / to (kaydırma penceresi), pos [x,y,z]
 */
export function buildPlanet(p, { segments = 32 } = {}) {
  const group = new THREE.Group()

  const material = new THREE.MeshStandardMaterial({
    // Doku gelene kadar (veya gelmezse) düz renkli küre görünür
    color: p.color || '#8C9AB5',
    roughness: 0.92,
    metalness: 0.02,
    transparent: true,
    opacity: 0,
  })

  if (p.texture) {
    loader.load(
      p.texture,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 4
        material.map = tex
        material.color.set('#ffffff')
        material.needsUpdate = true
      },
      undefined,
      () => console.warn('[sky] doku yuklenemedi:', p.texture)
    )
  }

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(p.radius ?? 3, segments, Math.round(segments / 2)),
    material
  )
  group.add(body)
  group.userData.materials = [material]

  // Satürn halkaları
  if (p.ring) {
    const r = p.radius ?? 3
    const inner = r * 1.35
    const outer = r * 2.25
    const geo = new THREE.RingGeometry(inner, outer, 96)
    radialRingUVs(geo, inner, outer)

    const ringMat = new THREE.MeshBasicMaterial({
      color: '#D9CBAE',
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    })

    if (p.ringTexture) {
      loader.load(p.ringTexture, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        ringMat.map = tex
        ringMat.alphaMap = tex
        ringMat.color.set('#ffffff')
        ringMat.needsUpdate = true
      })
    }

    const ring = new THREE.Mesh(geo, ringMat)
    ring.rotation.x = Math.PI / 2
    group.add(ring)
    group.userData.materials.push(ringMat)
  }

  // Eksen eğikliği
  group.rotation.z = p.tilt ?? 0.3

  group.userData.body = body
  group.userData.spinSpeed = p.spin ?? 0.02
  group.userData.config = p
  group.visible = false

  return group
}

/** theme.config.js listesinden tüm gezegenleri kurar */
export function buildPlanets(list = []) {
  return list
    .filter((p) => p.enabled !== false)
    .map((p) => buildPlanet(p))
}

/** Bir gezegenin opaklığını ayarlar (gövde + halka birlikte) */
export function setPlanetOpacity(planet, v) {
  for (const m of planet.userData.materials) {
    // Halka gövdeden biraz daha soluk dursun
    m.opacity = m.isMeshBasicMaterial ? v * 0.85 : v
  }
}
