/* ══════════════════════════════════════════════════════════════
   NACA 4 haneli geometri + Hess–Smith panel yöntemi

   Flow Lab'daki akış animasyonu için sıkıştırılamaz, viskoz olmayan
   potansiyel akış çözümü. Her panelde sabit şiddetli kaynak, tüm
   panellerde ortak tek bir girdap şiddeti ve firar kenarında Kutta
   koşulu. Sonuç bir ızgaraya önceden hesaplanır; parçacıklar bu
   ızgaradan çift doğrusal ara değerle hız okur.

   Katsayılar (CL, CD) buradan DEĞİL, Fluent sonuçlarından gelir.
   ══════════════════════════════════════════════════════════════ */

const TWO_PI = Math.PI * 2

/** NACA 4 haneli profil. Firar kenarından alt yüzey → hücum kenarı →
 *  üst yüzey → firar kenarı sırasında (saat yönü) nokta listesi döner. */
export function nacaPoints({ m, p, t }, n = 60) {
  const upper = []
  const lower = []
  for (let i = 0; i <= n; i++) {
    // kosinüs dağılımı: kenarlarda sık nokta
    const x = 0.5 * (1 - Math.cos((Math.PI * i) / n))
    const yt =
      5 * t * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1036 * x ** 4)
    let yc = 0
    let dyc = 0
    if (m > 0) {
      if (x < p) {
        yc = (m / (p * p)) * (2 * p * x - x * x)
        dyc = ((2 * m) / (p * p)) * (p - x)
      } else {
        yc = (m / ((1 - p) ** 2)) * (1 - 2 * p + 2 * p * x - x * x)
        dyc = ((2 * m) / ((1 - p) ** 2)) * (p - x)
      }
    }
    const th = Math.atan(dyc)
    upper.push([x - yt * Math.sin(th), yc + yt * Math.cos(th)])
    lower.push([x + yt * Math.sin(th), yc - yt * Math.cos(th)])
  }
  // alt yüzey firar → hücum, sonra üst yüzey hücum → firar
  const pts = [...lower.reverse(), ...upper.slice(1)]
  return pts
}

/** Noktaları çeyrek veter etrafında döndürür (burun yukarı = pozitif α) */
export function rotate(pts, aoaDeg, pivot = 0.25) {
  const a = (-aoaDeg * Math.PI) / 180
  const c = Math.cos(a)
  const s = Math.sin(a)
  return pts.map(([x, y]) => {
    const dx = x - pivot
    return [pivot + dx * c - y * s, dx * s + y * c]
  })
}

/** Birim şiddetli kaynak ve girdap panelinin P noktasında oluşturduğu hız */
function panelInfluence(px, py, pn) {
  const dx = px - pn.x0
  const dy = py - pn.y0
  const xl = dx * pn.tx + dy * pn.ty
  const yl = dx * pn.nx + dy * pn.ny
  const r1 = xl * xl + yl * yl
  const r2 = (xl - pn.len) ** 2 + yl * yl
  const lnr = 0.5 * Math.log(r1 / r2) // ln(r1/r2)
  let beta = Math.atan2(yl, xl - pn.len) - Math.atan2(yl, xl)
  if (beta > Math.PI) beta -= TWO_PI
  if (beta < -Math.PI) beta += TWO_PI
  // kaynak: u' = ln/2π, v' = β/2π   girdap: u' = -β/2π, v' = ln/2π
  const su = lnr / TWO_PI
  const sv = beta / TWO_PI
  return {
    sx: su * pn.tx + sv * pn.nx,
    sy: su * pn.ty + sv * pn.ny,
    vx: -sv * pn.tx + su * pn.nx,
    vy: -sv * pn.ty + su * pn.ny,
  }
}

function buildPanels(pts) {
  const panels = []
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[i + 1]
    const len = Math.hypot(x1 - x0, y1 - y0)
    const tx = (x1 - x0) / len
    const ty = (y1 - y0) / len
    panels.push({
      x0, y0, len, tx, ty,
      nx: -ty, // saat yönü dolaşımda dışa bakan normal
      ny: tx,
      cx: (x0 + x1) / 2,
      cy: (y0 + y1) / 2,
    })
  }
  return panels
}

/** Gauss eleme (kısmi pivotlama) */
function solve(A, b) {
  const n = b.length
  for (let k = 0; k < n; k++) {
    let piv = k
    for (let i = k + 1; i < n; i++) if (Math.abs(A[i][k]) > Math.abs(A[piv][k])) piv = i
    ;[A[k], A[piv]] = [A[piv], A[k]]
    ;[b[k], b[piv]] = [b[piv], b[k]]
    for (let i = k + 1; i < n; i++) {
      const f = A[i][k] / A[k][k]
      for (let j = k; j < n; j++) A[i][j] -= f * A[k][j]
      b[i] -= f * b[k]
    }
  }
  const x = new Array(n).fill(0)
  for (let i = n - 1; i >= 0; i--) {
    let s = b[i]
    for (let j = i + 1; j < n; j++) s -= A[i][j] * x[j]
    x[i] = s / A[i][i]
  }
  return x
}

/**
 * Panel çözümü. Serbest akış +x yönünde, hızı 1.
 * Dönen fonksiyon herhangi bir noktadaki (u, v) hızını verir.
 */
export function solvePanels(pts) {
  const P = buildPanels(pts)
  const N = P.length
  const A = Array.from({ length: N + 1 }, () => new Array(N + 1).fill(0))
  const b = new Array(N + 1).fill(0)
  const tan = Array.from({ length: N }, () => new Array(N + 1).fill(0))

  for (let i = 0; i < N; i++) {
    const pi = P[i]
    let vortN = 0
    let vortT = 0
    for (let j = 0; j < N; j++) {
      let sx, sy, vx, vy
      if (i === j) {
        // kendi paneli: kontrol noktası dışarıdan yaklaşırken β = π
        sx = 0.5 * pi.nx
        sy = 0.5 * pi.ny
        vx = -0.5 * pi.tx
        vy = -0.5 * pi.ty
      } else {
        ;({ sx, sy, vx, vy } = panelInfluence(pi.cx, pi.cy, P[j]))
      }
      A[i][j] = sx * pi.nx + sy * pi.ny
      tan[i][j] = sx * pi.tx + sy * pi.ty
      vortN += vx * pi.nx + vy * pi.ny
      vortT += vx * pi.tx + vy * pi.ty
    }
    A[i][N] = vortN
    tan[i][N] = vortT
    b[i] = -pi.nx // V∞ = (1, 0)
  }
  // Kutta: ilk ve son paneldeki teğet hızların toplamı sıfır
  for (let j = 0; j <= N; j++) A[N][j] = tan[0][j] + tan[N - 1][j]
  b[N] = -(P[0].tx + P[N - 1].tx)

  const x = solve(A, b)
  const sigma = x.slice(0, N)
  const gamma = x[N]

  return function velocity(px, py) {
    let u = 1
    let v = 0
    for (let j = 0; j < N; j++) {
      const { sx, sy, vx, vy } = panelInfluence(px, py, P[j])
      u += sigma[j] * sx + gamma * vx
      v += sigma[j] * sy + gamma * vy
    }
    return [u, v]
  }
}

/** Nokta çokgenin içinde mi (ışın atma) */
export function inside(pts, x, y) {
  let c = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i]
    const [xj, yj] = pts[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

/**
 * Hız alanını bir ızgaraya önceden hesaplar.
 * bounds: { x0, x1, y0, y1 }, nx × ny hücre.
 * pg: Prandtl–Glauert çarpanı (bozuntu hızlarını 1/√(1-M²) ile büyütür).
 */
export function velocityGrid(pts, bounds, nx, ny, pg = 1) {
  const vel = solvePanels(pts)
  const U = new Float32Array(nx * ny)
  const V = new Float32Array(nx * ny)
  const solid = new Uint8Array(nx * ny)
  const dx = (bounds.x1 - bounds.x0) / (nx - 1)
  const dy = (bounds.y1 - bounds.y0) / (ny - 1)
  for (let j = 0; j < ny; j++) {
    const y = bounds.y0 + j * dy
    for (let i = 0; i < nx; i++) {
      const x = bounds.x0 + i * dx
      const k = j * nx + i
      if (inside(pts, x, y)) {
        solid[k] = 1
        continue
      }
      const [u, v] = vel(x, y)
      U[k] = 1 + (u - 1) * pg
      V[k] = v * pg
    }
  }
  return {
    sample(x, y) {
      const fx = (x - bounds.x0) / dx
      const fy = (y - bounds.y0) / dy
      const i = Math.floor(fx)
      const j = Math.floor(fy)
      if (i < 0 || j < 0 || i >= nx - 1 || j >= ny - 1) return [1, 0, 0]
      const ax = fx - i
      const ay = fy - j
      const k = j * nx + i
      if (solid[k] || solid[k + 1] || solid[k + nx] || solid[k + nx + 1]) return [0, 0, 1]
      const u =
        U[k] * (1 - ax) * (1 - ay) + U[k + 1] * ax * (1 - ay) + U[k + nx] * (1 - ax) * ay + U[k + nx + 1] * ax * ay
      const v =
        V[k] * (1 - ax) * (1 - ay) + V[k + 1] * ax * (1 - ay) + V[k + nx] * (1 - ax) * ay + V[k + nx + 1] * ax * ay
      return [u, v, 0]
    },
  }
}
