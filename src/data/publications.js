export const publications = [
  {
    id: 1,
    title: "Aerodynamic Performance of Low-Reynolds-Number Airfoils for UAV Applications",
    type: "Research Paper",
    year: "2024",
    venue: "Undergraduate Research Journal — Aerospace Engineering Dept.",
    abstract: "A comparative CFD study of six NACA 4-digit airfoil profiles at Re = 2×10⁵ to 8×10⁵, evaluating lift-to-drag ratios, stall characteristics, and suitability for fixed-wing UAV platforms.",
    link: null,
    pdf: null,
  },
  {
    id: 2,
    title: "Structural Sizing of a CubeSat Chassis Under Launch Loads",
    type: "Technical Report",
    year: "2024",
    venue: "AE 402 — Spacecraft Structures, Course Project",
    abstract: "Finite element analysis report detailing mesh convergence study, boundary condition selection, and safety factor assessment for a 1U CubeSat primary structure under GEVS random vibration levels.",
    link: null,
    pdf: null,
  },
  {
    id: 3,
    title: "An Introduction to Solid Rocket Propulsion: From Grain Design to Thrust Curve",
    type: "Article",
    year: "2023",
    venue: "Engineering Student Blog — Medium",
    abstract: "A technical introduction to solid rocket motor fundamentals written for engineering students, covering propellant chemistry, burn rate, nozzle expansion, and performance metrics.",
    link: null,
    pdf: null,
  },
  {
    id: 4,
    title: "Stability and Control Derivatives of a Tailless UAV Configuration",
    type: "Technical Report",
    year: "2023",
    venue: "AE 315 — Flight Mechanics, Course Project",
    abstract: "Derivation and numerical evaluation of static and dynamic stability derivatives for a blended-wing UAV. Identifies unstable modes and recommends control surface sizing adjustments.",
    link: null,
    pdf: null,
  },
  {
    id: 5,
    title: "Thermal Protection System Design for a Sub-Orbital Re-entry Vehicle",
    type: "Research Paper",
    year: "2024",
    venue: "Undergraduate Aerospace Symposium — Poster Presentation",
    abstract: "Sizing study for ablative heat shield materials under a defined entry trajectory. Peak heating rates and integrated heat loads are computed using engineering correlations and compared across three candidate TPS materials.",
    link: null,
    pdf: null,
  },
]

/* Yayın türü → rozet görünümü.
   Yeni bir tür kullanırsan buraya bir satır ekle.
   icon: https://lucide.dev/icons   tone: accent | warm | horizon */
export const publicationTypes = {
  'Research Paper': { icon: 'BookOpen', tone: 'accent' },
  'Technical Report': { icon: 'FileText', tone: 'warm' },
  Article: { icon: 'Newspaper', tone: 'horizon' },
}
