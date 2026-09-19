import * as THREE from 'three'
import {
  raDecToVec3,
  bvToRgb,
  magToSize,
  magToBrightness,
  DEEP_SKY_COLORS,
} from './skyMath'

/* Katalog verisinden three.js nesneleri üretir.
   React'e bağlı değil — sahne saf three.js olarak çalışıyor. */

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  uniform float uScale;

  void main() {
    vColor = aColor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale;
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  uniform float uOpacity;
  uniform float uHalo;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    float a = mix(core * core, pow(core, 0.65), uHalo);
    gl_FragColor = vec4(vColor, a * uOpacity);
  }
`

function makePoints({ positions, colors, sizes, halo, scale }) {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 2000)

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uOpacity: { value: 0 },
      uScale: { value: scale },
      uHalo: { value: halo },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  })

  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  return points
}

/**
 * HYG kataloğundaki gerçek yıldızlar.
 * Konum gerçek RA/Dec, renk gerçek B-V renk indeksinden,
 * boyut gerçek görünür kadirden — takımyıldızlar yerli yerinde.
 */
export function buildStars(data, { radius = 900, scale = 1 } = {}) {
  const list = data?.stars
  if (!list?.length) return null

  const n = list.length
  const positions = new Float32Array(n * 3)
  const colors = new Float32Array(n * 3)
  const sizes = new Float32Array(n)

  for (let i = 0; i < n; i++) {
    const [ra, dec, mag, ci] = list[i]
    const [x, y, z] = raDecToVec3(ra, dec, radius)
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    const [r, g, b] = bvToRgb(ci)
    const br = magToBrightness(mag)
    colors[i * 3] = r * br
    colors[i * 3 + 1] = g * br
    colors[i * 3 + 2] = b * br

    sizes[i] = magToSize(mag)
  }

  return makePoints({ positions, colors, sizes, halo: 0.2, scale })
}

/**
 * OpenNGC kataloğundaki gerçek galaksiler, bulutsular, kümeler.
 * Renk türe göre, boyut gerçek açısal büyüklükten.
 */
export function buildDeepSky(data, { radius = 880, scale = 1 } = {}) {
  const list = data?.objects
  if (!list?.length) return null

  const n = list.length
  const positions = new Float32Array(n * 3)
  const colors = new Float32Array(n * 3)
  const sizes = new Float32Array(n)

  for (let i = 0; i < n; i++) {
    const o = list[i]
    const [x, y, z] = raDecToVec3(o.r, o.d, radius)
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    const [r, g, b] = DEEP_SKY_COLORS[o.t] || DEEP_SKY_COLORS.g
    const mag = o.m ?? 13
    const br = Math.max(0.12, Math.min(1, (15.5 - mag) / 8))
    colors[i * 3] = r * br
    colors[i * 3 + 1] = g * br
    colors[i * 3 + 2] = b * br

    const arcmin = o.s ?? 2
    sizes[i] = Math.min(16, 2 + Math.sqrt(arcmin) * 1.7)
  }

  return makePoints({ positions, colors, sizes, halo: 1, scale })
}

/**
 * Katalog gelene kadar (veya veri yoksa) gökyüzü boş kalmasın:
 * hafif, procedural bir toz/uzak yıldız katmanı.
 * Gerçekçilik iddiası yok — sadece derinlik hissi.
 */
export function buildDust(count = 1400, { radius = 950, scale = 1 } = {}) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    // Küre üzerinde düzgün dağılım
    const u = Math.random() * 2 - 1
    const th = Math.random() * Math.PI * 2
    const s = Math.sqrt(1 - u * u)
    positions[i * 3] = radius * s * Math.cos(th)
    positions[i * 3 + 1] = radius * u
    positions[i * 3 + 2] = radius * s * Math.sin(th)

    const warm = Math.random() < 0.15
    const b = 0.18 + Math.random() * 0.4
    colors[i * 3] = (warm ? 1.0 : 0.72) * b
    colors[i * 3 + 1] = (warm ? 0.82 : 0.8) * b
    colors[i * 3 + 2] = (warm ? 0.62 : 1.0) * b

    sizes[i] = 0.5 + Math.random() * 1.3
  }

  return makePoints({ positions, colors, sizes, halo: 0.3, scale })
}
