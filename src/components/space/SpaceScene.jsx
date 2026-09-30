import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { buildStars, buildDeepSky, buildDust } from './buildSky'
import { CRAFT_BUILDERS } from './buildSpacecraft'
import { buildPlanets, setPlanetOpacity } from './buildPlanets'
import { theme } from '../../config/theme.config'
import { motionOff } from '../../config/applyTheme'

/* ══════════════════════════════════════════════════════════════
   Sayfanın arkasındaki gökyüzü — saf three.js (React yok).

   Yıldızlar en baştan, hero dahil her ekranda görünür.
   Kaydırdıkça gökyüzü döner, galaksiler açılır ve kadro geçer:

     hero        Dünya ve Ay; roket ismin yanından yıldızlara iner
     %26–62      Mars
     %52–84      Jüpiter
     %74–100     halkalı Satürn
     her yerde   sağda küçük bir yörüngede dolanan uydu

   Ayarlar: theme.config.js → space
   ══════════════════════════════════════════════════════════════ */

const lerp = (a, b, t) => a + (b - a) * t
const ramp = (p, a, b) => Math.min(1, Math.max(0, (p - a) / Math.max(1e-4, b - a)))
/** Bir aralıkta girip çıkan yumuşak görünürlük (0→1→0) */
const window01 = (p, a, b) => Math.sin(ramp(p, a, b) * Math.PI)

export default function SpaceScene() {
  const hostRef = useRef(null)

  useEffect(() => {
    const cfg = theme.space || {}
    if (!cfg.enabled) return

    const host = hostRef.current
    if (!host) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      })
    } catch (e) {
      console.warn('[sky] WebGL baslatilamadi:', e.message)
      return
    }

    const mobile = window.matchMedia('(max-width: 767px)').matches
    const still = motionOff()
    const craftCfg = cfg.craft || {}

    let dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.25)
    renderer.setPixelRatio(dpr)
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

    const sky = new THREE.Group()
    scene.add(sky)

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const key = new THREE.DirectionalLight(0xfff1e0, 1.8)
    key.position.set(5, 3, 5)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0x9dbeff, 0.45)
    fill.position.set(-6, -2, -4)
    scene.add(fill)

    const pixelScale = mobile ? 0.8 : 1

    const dust = buildDust(mobile ? 450 : 900, { scale: pixelScale })
    sky.add(dust)

    let stars = null
    let deepSky = null

    // ---- Araçlar ----
    const rocket = craftCfg.rocket ? CRAFT_BUILDERS.rocket() : null
    if (rocket) {
      if (cfg.rocketFlame === false && rocket.userData.flame) {
        rocket.userData.flame.visible = false
      }
      scene.add(rocket)
    }

    const minisat = craftCfg.satellite ? CRAFT_BUILDERS.minisat() : null
    if (minisat) {
      // Sağ kenarda, tamamen kadraja girecek kadar içeride ve küçük
      minisat.scale.setScalar(1.15)
      scene.add(minisat)
    }

    const probe = craftCfg.probe && !mobile ? CRAFT_BUILDERS.probe() : null
    if (probe) {
      probe.visible = false
      scene.add(probe)
    }

    // ---- Gezegenler ----
    // Sayfa boyunca sırayla devreye girip çıkıyorlar:
    // Dünya/Ay (hero) → Mars → Jüpiter → halkalı Satürn (final)
    const planetCfg = cfg.planets || {}
    const planets =
      planetCfg.enabled === false
        ? []
        : buildPlanets(planetCfg.list || []).map((p) => {
            // Mobilde küre çözünürlüğü ve boyut biraz küçülsün
            if (mobile) p.scale.setScalar(0.7)
            scene.add(p)
            return p
          })

    // ---- Kataloglar ----
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
      stars = buildStars(d, {
        scale: pixelScale,
        magLimit: mobile ? Math.min(cfg.starMag ?? 5.2, 4.5) : cfg.starMag ?? 5.2,
        boost: cfg.starBoost ?? 1.8,
      })
      if (stars) sky.add(stars)
    })

    if (!mobile) {
      load('/data/deepsky.json').then((d) => {
        if (disposed || !d) return
        deepSky = buildDeepSky(d, {
          scale: pixelScale,
          magLimit: cfg.deepSkyMag ?? 10.5,
          boost: cfg.deepSkyBoost ?? 1.6,
        })
        if (deepSky) sky.add(deepSky)
      })
    }

    // ---- Kaydırma ----
    let progress = 0
    // Sayfa toplam kaç ekran boyu kaydırılabiliyor — "ilk iki ekran"
    // gibi ölçüleri sayfa uzunluğundan bağımsız hesaplamak için.
    let scrollableScreens = 1
    const readScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      scrollableScreens = Math.max(0.001, max / window.innerHeight)
    }
    readScroll()

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      readScroll()
    }
    // "Hareketi azalt" açıkken sürekli döngü yok: sadece kaydırınca çiz
    let stillRaf = null
    const onScroll = () => {
      readScroll()
      if (still && running && !stillRaf) {
        stillRaf = requestAnimationFrame(() => {
          stillRaf = null
          tick()
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    let running = true
    const onVisibility = () => {
      running = !document.hidden
      if (running) {
        clock.getDelta() // birikmiş süreyi at
        tick()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    // ---- Otomatik kalite: ilk saniyeleri ölç, yavaşsa kıs ----
    let frames = 0
    let elapsed = 0
    let degraded = false
    const checkQuality = (dt) => {
      if (!cfg.autoQuality || degraded || still) return
      frames++
      elapsed += dt
      if (elapsed < 3) return
      const fps = frames / elapsed
      if (fps < 45) {
        degraded = true
        // Önce en pahalı katmanı at, sonra çözünürlüğü düşür
        if (deepSky) {
          sky.remove(deepSky)
          deepSky.geometry.dispose()
          deepSky.material.dispose()
          deepSky = null
        }
        dpr = 1
        renderer.setPixelRatio(1)
        console.info(`[sky] ${fps.toFixed(0)} fps — sahne otomatik sadelestirildi`)
      } else {
        // Yeterince akıcı; bir daha ölçme
        degraded = true
      }
    }

    const clock = new THREE.Clock()
    let raf = null
    let smoothP = 0

    const setOpacity = (obj, v) => {
      if (obj) obj.material.uniforms.uOpacity.value = v
    }

    function tick() {
      if (!running) return
      if (!still) raf = requestAnimationFrame(tick)

      const dt = Math.min(clock.getDelta(), 0.05)
      // Hareket azaltılmışsa zamana bağlı her şey (salınım, yörünge) sabit
      const t = still ? 0 : clock.elapsedTime
      checkQuality(dt)

      smoothP = still ? progress : lerp(smoothP, progress, Math.min(1, dt * 4))
      const k = smoothP
      const op = cfg.opacity ?? 1

      // Yıldızlar her ekranda görünür; aşağıda biraz daha güçlenir
      setOpacity(stars, lerp(0.72, 1, ramp(k, 0, 0.4)) * op)
      setOpacity(dust, lerp(0.5, 0.85, ramp(k, 0, 0.5)) * op)
      setOpacity(deepSky, ramp(k, 0.05, 0.5) * op)

      sky.rotation.y = k * Math.PI * 0.85 + (still ? 0 : t * 0.005)
      sky.rotation.x = -0.22 + k * 0.45

      if (rocket) {
        const side = cfg.rocketSide === 'right' ? 1 : -1
        // Hero metninin üstüne binmesin diye isimden biraz uzakta başlar
        const narrow = window.innerWidth < 900
        rocket.position.x = lerp(side * (narrow ? 4.6 : 5.6), side * 8.5, k) + Math.sin(t * 0.25) * 0.12
        rocket.position.y = lerp(0.2, -6.5, k)
        rocket.position.z = lerp(-9, -26, k)
        rocket.scale.setScalar(lerp(0.9, 0.55, k))
        if (!still) rocket.userData.spin?.(dt, t)
      }

      // Gezegenler: kendi kaydırma pencerelerinde belirip kayboluyor,
      // görünürken de hafifçe sürükleniyorlar.
      for (const planet of planets) {
        const c = planet.userData.config
        const vis = window01(k, c.from ?? 0, c.to ?? 1)
        planet.visible = vis > 0.015
        if (!planet.visible) continue

        setPlanetOpacity(planet, Math.min(1, vis * 1.5))

        const [x, y, z] = c.pos || [0, 0, -30]
        const local = ramp(k, c.from ?? 0, c.to ?? 1)
        planet.position.set(x, y + (0.5 - local) * 5, z)

        if (!still) {
          planet.userData.body.rotation.y += dt * (planet.userData.spinSpeed || 0.02)
        }
      }

      if (minisat) {
        // Uydu yalnızca ilk iki ekranda. Sonrasında bir ekran boyunca
        // hem uzaklaşıp küçülüyor hem soluklaşıyor, sonra tamamen gidiyor.
        const screens = k * scrollableScreens
        const stay = cfg.satelliteScreens ?? 2
        const leave = ramp(screens, stay, stay + 1) // 0 → 1 arası çıkış

        minisat.visible = leave < 0.995
        if (minisat.visible) {
          // Sağ tarafta küçük bir yörüngede dolanıyor; elipsin tamamı
          // ekranın sağ yarısında kaldığı için kadrajdan çıkmıyor.
          const a = t * 0.13
          minisat.position.set(
            6.8 + Math.cos(a) * 1.7,
            3.4 - Math.min(screens, stay) * 1.1 + Math.sin(a) * 1.2,
            -15 + Math.sin(a * 0.7) * 3 - leave * 55 // derinlere çekiliyor
          )
          minisat.userData.setFade?.(1 - leave)
          if (!still) minisat.userData.spin?.(dt, t)
        }
      }

      if (probe) {
        const vis = window01(k, 0.62, 1)
        probe.visible = vis > 0.03
        if (probe.visible) {
          probe.position.set(5.5, lerp(3, -1.5, ramp(k, 0.62, 1)), -22)
          probe.scale.setScalar(0.7 + vis * 0.3)
          probe.userData.spin?.(dt, t)
        }
      }

      renderer.render(scene, camera)
    }
    tick()

    // Durağan modda, katalog ve dokular yüklenirken birkaç kez yeniden çiz
    let stillTimer = null
    if (still) {
      stillTimer = setInterval(tick, 500)
      setTimeout(() => clearInterval(stillTimer), 8000)
    }

    return () => {
      disposed = true
      running = false
      if (raf) cancelAnimationFrame(raf)
      if (stillRaf) cancelAnimationFrame(stillRaf)
      if (stillTimer) clearInterval(stillTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)

      const disposeMaterial = (m) => {
        // Gezegen dokularını da bırak, yoksa GPU belleğinde kalıyor
        m.map?.dispose?.()
        m.alphaMap?.dispose?.()
        m.dispose()
      }
      scene.traverse((o) => {
        o.geometry?.dispose?.()
        if (Array.isArray(o.material)) o.material.forEach(disposeMaterial)
        else if (o.material) disposeMaterial(o.material)
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
