/* ══════════════════════════════════════════════════════════════
   FLOW LAB VERİSİ

   ANSYS Fluent (k-ω SST) sonuçları, Derin'in MATLAB betiklerinden
   (derinAeroProje/naca0012.m, naca2415.m) birebir aktarıldı.
   Hücum açıları: 0°, 8°, 16°.

   NASA referansları:
     NACA 0012 → Ladson (1988), NASA TM-4074, Re = 6×10⁶
     NACA 2415 → Abbott & von Doenhoff, Re = 6×10⁶
   ══════════════════════════════════════════════════════════════ */

export const AOA = [0, 8, 16]

export const airfoils = {
  '0012': {
    label: 'NACA 0012',
    note: 'Symmetric, 12% thick',
    m: 0,
    p: 0,
    t: 0.12,
    runs: [
      { mach: 0.258, regime: 'Subsonic', CL: [5.1850344e-9, 0.8520954, 1.5387783], CD: [0.0081590295, 0.012250995, 0.029122727] },
      { mach: 0.8, regime: 'Transonic', CL: [8.3886469e-8, 0.5186102, 0.71891749], CD: [0.015128896, 0.09997651, 0.25389123] },
      { mach: 1.2, regime: 'Supersonic', CL: [-4.1062249e-6, 0.67259616, 1.1397108], CD: [0.10110528, 0.24429834, 0.39709217] },
      { mach: 1.5, regime: 'Supersonic', CL: [-1.2494692e-6, 0.43046154, 0.85643893], CD: [0.10045082, 0.15635093, 0.32540726] },
    ],
    nasa: {
      source: 'NASA TM-4074 (Ladson, 1988)',
      aoa: [-3.99, -1.98, -0.03, 0.04, 2.0, 4.06, 6.09, 8.09, 10.18, 11.13, 12.1, 13.31, 14.08, 15.24, 16.33, 17.13],
      CL: [-0.4363, -0.2213, -0.0115, -0.0013, 0.2213, 0.4365, 0.6558, 0.8689, 1.0809, 1.1731, 1.2644, 1.3676, 1.4316, 1.5169, 1.5855, 1.6219],
    },
  },
  '2415': {
    label: 'NACA 2415',
    note: '2% camber, 15% thick',
    m: 0.02,
    p: 0.4,
    t: 0.15,
    runs: [
      { mach: 0.129, regime: 'Subsonic', CL: [0.20376304, 1.0226104, 1.5802642], CD: [0.0099797602, 0.014898805, 0.036517524] },
      { mach: 0.8, regime: 'Transonic', CL: [-0.055439491, 0.43795432, 0.84921466], CD: [0.048570356, 0.10978321, 0.2599748] },
      { mach: 1.2, regime: 'Supersonic', CL: [-0.0079356712, 0.55494699, 1.1329494], CD: [0.14585789, 0.20959438, 0.42524621] },
      { mach: 1.5, regime: 'Supersonic', CL: [-0.015228848, 0.39211442, 0.82874658], CD: [0.14213364, 0.1878453, 0.34670793] },
    ],
    nasa: {
      source: 'Abbott & von Doenhoff, Theory of Wing Sections',
      aoa: [-8, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
      CL: [-0.58, -0.18, 0.02, 0.2, 0.42, 0.63, 0.84, 1.04, 1.2, 1.32, 1.38, 1.28, 1.0],
    },
  },
}

/** Doğrusal ara değer (NASA eğrisini seçilen açıda okumak için) */
export function interp(xs, ys, x) {
  if (x <= xs[0]) return ys[0]
  for (let i = 1; i < xs.length; i++) {
    if (x <= xs[i]) {
      const k = (x - xs[i - 1]) / (xs[i] - xs[i - 1])
      return ys[i - 1] + k * (ys[i] - ys[i - 1])
    }
  }
  return ys[ys.length - 1]
}

/** Doğrusallaştırılmış süpersonik (Ackeret) teori, ince düz levha */
export function ackeret(mach, aoaDeg) {
  const a = (aoaDeg * Math.PI) / 180
  const b = Math.sqrt(mach * mach - 1)
  return { CL: (4 * a) / b, CD: (4 * a * a) / b }
}
