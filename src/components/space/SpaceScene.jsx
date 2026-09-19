import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { buildStars, buildDeepSky, buildDust } from './buildSky'
import { CRAFT_BUILDERS } from './buildSpacecraft'
import { theme } from '../../config/theme.config'
import { motionOff } from '../../config/applyTheme'

/* ══════════════════════════════════════════════════════════════
   Sayfanın arkasındaki gökyüzü — saf three.js (React yok).

   Gerçek kataloglar:
     • 8.920 yıldız        — HYG v4.4
     • 6.442 gök cismi     — OpenNGC (5.500'ü gerçek galaksi)

   Yıldızlar ta baştan, hero'da da görünür; aşağı indikçe
   gökyüzü açılır, galaksiler belirir, bir uydu geçer.

   Ayarlar: theme.config.js → space
   ══════════════════════════════════════════════════════════════ */

const lerp = (a, b, t) => a + (b - a) * t
const ramp = (p, a, b) => Math.min(1, Math.max(0, (p - a) / Math.max(1e-4, b - a)))

export default function SpaceScene() {
  const hostRef = useRef(null)

  useEffect(() => {
    const cfg = theme.space || {}
    if (!cfg.enabled) return

    const host = hostRef.current
    if (!host) return

    // WebGL yoksa sessizce vazgeç — sayfa gradyanla çalışmaya devam eder
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      })
    } catch (e) {
      console.warn('[sky] WebGL baslatilamadi:', e.message)
      return
    }

    const mobile = window.matchMedia('(max-width: 767px)').matches
    const still = motionOff()

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      62,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    )

    // Gök küresi: kaydırdıkça döner, gökyüzünde yol alırsın
    const sky = new THREE.Group()
    scene.add(sky)

    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const key = new THREE.DirectionalLight(0xfff1e0, 1.7)
    key.position.set(5, 3, 5)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0x9dbeff, 0.4)
    fill.position.set(-6, -2, -4)
    scene.add(fill)

    const pixelScale = mobile ? 0.75 : 1

    // Katalog gelene kadar gökyüzü boş kalmasın
    const dust = buildDust(mobile ? 700 : 1400, { scale: pixelScale })
    sky.add(dust)

    let stars = null
    let deepSky = null
    let craft = null

    const build = cfg.craft ? CRAFT_BUILDERS[cfg.craft] : null
    if (build && !mobile) {
      craft = build()
      if (cfg.craftFlame === false && craft.userData.flame) {
        craft.userData.flame.visible = false
      }
      scene.add(craft)
    }

    // Arkada, çok uzakta, geniş bir yörüngede dolanan minik uydu.
    // 3 parça + ışık hesabı yok → kare hızına etkisi yok denecek kadar az.
    let orbiter = null
    if (cfg.orbiter !== false && !mobile) {
      orbiter = CRAFT_BUILDERS.minisat()
      orbiter.scale.setScalar(1.8)
      scene.add(orbiter)
    }

    // ---- Kataloglar (paketin dışında, ayrı indirilir) ----
    let disposed = false
    const load = (url) =>
      fetch(url)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status))))
        .catch((e) => {
          console.warn('[sky] katalog yuklenemedi:', url, e.message)
          return null
        })

    load('/data/stars.json').then((d) => {
      if (disposed || !d) return
      stars = buildStars(d, { scale: pixelScale })
      if (stars) sky.add(stars)
    })

    if (!mobile) {
      load('/data/deepsky.json').then((d) => {
        if (disposed || !d) return
        deepSky = buildDeepSky(d, { scale: pixelScale })
        if (deepSky) sky.add(deepSky)
      })
    }

    // ---- Kaydırma ilerlemesi ----
    let progress = 0
    const readScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    readScroll()

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      readScroll()
    }

    window.addEventListener('scroll', readScroll, { passive: true })
    window.addEventListener('resize', onResize)

    // Sekme arkadayken çizme
    let running = true
    const onVisibility = () => {
      running = !document.hidden
      if (running) tick()
    }
    document.addEventListener('visibilitychange', onVisibility)

    // ---- Çizim döngüsü ----
    const clock = new THREE.Clock()
    let raf = null
    let smoothP = 0

    const setOpacity = (obj, v) => {
      if (obj) obj.material.uniforms.uOpacity.value = v
    }

    function tick() {
      if (!running) return
      raf = requestAnimationFrame(tick)

      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime
      smoothP = lerp(smoothP, progress, Math.min(1, dt * 4))

      // Yıldızlar en baştan görünür (hero dahil), aşağı inince güçlenir.
      // Şafak ışığı yüzünden tepede biraz sönük olmaları doğal duruyor.
      setOpacity(stars, lerp(0.5, 1, ramp(smoothP, 0, 0.45)) * (cfg.opacity ?? 1))
      setOpacity(dust, lerp(0.55, 0.9, ramp(smoothP, 0, 0.5)) * (cfg.opacity ?? 1))
      // Galaksiler biraz daha geç açılır — derinleştikçe ortaya çıkar
      setOpacity(deepSky, ramp(smoothP, 0.08, 0.55) * (cfg.opacity ?? 1))

      // Gök küresi kaydırmaya göre döner + çok yavaş sürekli kayma
      const targetY = smoothP * Math.PI * 0.85 + (still ? 0 : t * 0.005)
      const targetX = -0.22 + smoothP * 0.45
      sky.rotation.y = targetY
      sky.rotation.x = targetX

      if (craft) {
        // Roket, hero'da "Derin" yazısının hemen altında, yakın planda
        // başlar. Kaydırdıkça burnunun baktığı yöne — aşağı, yana ve
        // derine — ilerleyip yıldız alanının içinde küçülür.
        const side = cfg.craftSide === 'right' ? 1 : -1
        const k = smoothP

        craft.position.x = lerp(side * 0.8, side * 7, k) + Math.sin(t * 0.25) * 0.12
        craft.position.y = lerp(-2.4, -7, k)
        craft.position.z = lerp(-9, -26, k)
        craft.scale.setScalar(lerp(0.9, 0.55, k))

        if (!still) craft.userData.spin?.(dt, t)
      }

      if (orbiter && !still) {
        // Eğik bir yörünge düzleminde yavaşça dolanır.
        // Tam tur ~2 dakika; kameranın arkasına geçince doğal olarak kaybolur.
        const a = t * 0.055
        const rx = 16
        const rz = 22
        const tiltY = 0.42 // yörünge düzleminin eğimi
        const ox = Math.cos(a) * rx
        const oz = Math.sin(a) * rz
        orbiter.position.set(ox, 4 + Math.sin(a) * rz * tiltY * 0.35, oz - 14)
        orbiter.userData.spin?.(dt, t)
      }

      renderer.render(scene, camera)
    }
    tick()

    // ---- Temizlik ----
    return () => {
      disposed = true
      running = false
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', readScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)

      scene.traverse((o) => {
        o.geometry?.dispose?.()
        if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose())
        else o.material?.dispose?.()
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  if (!theme.space?.enabled) return null

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}
