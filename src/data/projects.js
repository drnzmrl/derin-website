/* ══════════════════════════════════════════════════════════════
   PROJELER

   Alanlar:
     title, category, year, description, outcome, tools
     credit    → ortak çalışma notu (örn. 'with Ufuk Karacan')
     featured  → true ise en üstte geniş kart olarak görünür
     metrics   → kartın altındaki küçük rakam kutuları
     cover     → kapak türü:
        { kind: 'image',     src }              düz görsel
        { kind: 'cutout',    src, backdrop }    arka planı saydam 3B görsel
        { kind: 'detection', src, box }         YOLO hedef kutusu
        { kind: 'phones',    shots, icon }      telefon yelpazesi
        { kind: 'blueprint', draw }             çizim (components/effects/Blueprints.jsx)
     gallery   → karta dokununca açılan görseller [{ src, caption }]
     links     → [{ label, href, icon }]
     playStore → Google Play bağlantısı (varsa özel buton çıkar)

   Görseller public/images/work/ ve public/images/shared/ altında.
   ══════════════════════════════════════════════════════════════ */

const W = '/images/work/'
const S = '/images/shared/'

export const projects = [
  {
    id: 'wing-ahmed',
    featured: true,
    title: '3D Wing and Ahmed Body CFD Analysis',
    category: 'CFD / Aerodynamics',
    year: '2026',
    credit: 'with Ufuk Karacan · ASE 342 Aerodynamics II',
    figureCredit: 'Figures: D. İzmirli & U. Karacan, ASE 342 report, METU NCC, 2026',
    description:
      'Straight, swept and tapered NACA 0012 wings at 30 m/s, Mach 0.85 and Mach 1.5, then the Ahmed body at nine slant angles from 0° to 80°, with and without an undertray diffuser. Mesh independence study, inflation layers sized for y⁺ ≈ 1, and transient runs to resolve the wake.',
    outcome:
      'The straight wing at 0° and 30 m/s matched reference drag within 0.22%. At 8° in subsonic flow the tapered wing reached L/D ≈ 17 against ≈ 15 for the swept wing. On the Ahmed body at 30° we got Cd = 0.178 against 0.260 measured by Ahmed et al. (1984); we traced most of the gap to our moving ground versus their fixed floor. The undertray diffuser moved CL from -0.150 to -0.643 at 0° slant.',
    tools: ['ANSYS Fluent', 'k-ω SST', 'MATLAB'],
    metrics: [
      { value: '0.22%', label: 'CD error, 0° validation' },
      { value: 'L/D 17', label: 'tapered wing, 8°' },
      { value: '9', label: 'slant angles' },
    ],
    cover: {
      kind: 'cutout',
      src: W + 'wing-tapered-surface.webp',
      backdrop: W + 'wing-m15-mach.webp',
      caption: 'surface static pressure · tapered wing',
    },
    gallery: [
      { src: W + 'wing-m15-mach.webp', caption: 'Mach number around the swept wing at M = 1.5, α = 4°. Oblique shocks leave the leading and trailing edges.' },
      { src: W + 'wing-tapered-vortex.webp', caption: 'Streamlines and wing-tip vortices on the tapered wing at M = 1.5.', cutout: true },
      { src: W + 'wing-swept-pathlines.webp', caption: 'Pathlines over the swept wing at M = 1.5, rolling up into the tip vortex.', cutout: true },
      { src: W + 'wing-swept-surface.webp', caption: 'Surface static pressure on the swept wing.', cutout: true },
      { src: W + 'wing-tapered-surface.webp', caption: 'Surface static pressure on the tapered wing.', cutout: true },
      { src: W + 'wing-m085-mach.webp', caption: 'Mach number on the swept wing at M = 0.85, where the transonic shock sits on the upper surface.' },
      { src: W + 'naca0012-m085-pressure.webp', caption: 'Static pressure around the NACA 0012 section at M = 0.85, showing the shock on the upper surface.' },
      { src: W + 'ahmed-vortex-30.webp', caption: 'Ahmed body at 30° slant: the two counter-rotating C-pillar vortices trail far downstream.', cutout: true },
      { src: W + 'ahmed-vortex-0.webp', caption: 'Ahmed body at 0° slant: the recirculation region sits right behind the square base.', cutout: true },
      { src: W + 'ahmed-velocity-30.webp', caption: 'Velocity magnitude around the Ahmed body at 30° slant.' },
      { src: W + 'ahmed-streamlines-30.webp', caption: 'Velocity streamlines over the 30° slant body and into the wake.' },
      { src: W + 'ahmed-turbulence.webp', caption: 'Turbulence in the wake behind the slant.' },
      { src: W + 'ahmed-surface-pressure.webp', caption: 'Static pressure on the body at 0° slant, with the stagnation region on the nose.', cutout: true },
    ],
  },
  {
    id: 'naca',
    title: 'NACA 0012 and NACA 2415 Airfoil Analysis',
    category: 'CFD / Aerodynamics',
    year: '2026',
    figureCredit: 'Figures: D. İzmirli, 2026',
    description:
      'Steady 2D RANS simulations (k-ω SST) of both airfoils at 0°, 8° and 16° across subsonic, transonic and supersonic regimes in ANSYS Fluent, with a mesh independence study and y⁺ control near the wall.',
    outcome:
      'Subsonic lift stayed within 5% of NASA wind tunnel data: 0.8% off at 8° and 1.7% at 16° for the NACA 0012 (Ladson, 1988). The one outlier is the NACA 2415 at 16°, where the experiment has already stalled and the steady solution has not. At Mach 1.2, linearized theory overpredicts lift by 20 to 34%, which fits a thick, cambered section.',
    tools: ['ANSYS Fluent', 'k-ω SST', 'MATLAB'],
    metrics: [
      { value: '0.8%', label: 'CL error at 8°, NACA 0012' },
      { value: '4', label: 'Mach numbers' },
      { value: '24', label: 'Fluent cases' },
    ],
    cover: { kind: 'image', src: W + 'naca0012-m15-pressure.webp' },
    links: [{ label: 'Try it in the Flow Lab', href: '#flowlab', icon: 'Wind' }],
    gallery: [
      { src: W + 'naca0012-validation.webp', caption: 'NACA 0012 lift coefficient, CFD (k-ω SST) against NASA experimental data at Re = 6 × 10⁶.', plot: true },
      { src: W + 'naca2415-validation.webp', caption: 'NACA 2415 lift coefficient, CFD against NASA experimental data.', plot: true },
      { src: W + 'naca0012-cl-mach.webp', caption: 'NACA 0012 lift coefficient against angle of attack at four Mach numbers.', plot: true },
      { src: W + 'naca0012-cd-mach.webp', caption: 'NACA 0012 drag coefficient against angle of attack at four Mach numbers.', plot: true },
      { src: W + 'naca0012-m12-theory.webp', caption: 'Mach 1.2: CFD compared with NASA data and linearized (Ackeret) theory.', plot: true },
      { src: W + 'naca0012-m15-pressure.webp', caption: 'Static pressure around the NACA 0012 at M = 1.5. A detached bow shock stands in front of the leading edge.' },
      { src: W + 'naca0012-m15-mach.webp', caption: 'Mach number around the NACA 0012 at M = 1.5.' },
    ],
  },
  {
    id: 'teknofest',
    title: 'TEKNOFEST Fighter UAV',
    category: 'Autonomy / Vision',
    year: '2026',
    description:
      'Six-person multidisciplinary team building an autonomous UAV for the TEKNOFEST Fighter UAV competition. I work on the CFD and aerodynamic analysis and train the YOLO-based models that detect and lock onto the target aircraft.',
    outcome: 'The team passed the first stage of the competition.',
    tools: ['YOLO', 'Python', 'ANSYS Fluent'],
    metrics: [
      { value: '6', label: 'team members' },
      { value: 'Stage 1', label: 'passed' },
    ],
    cover: {
      kind: 'detection',
      src: S + 'uav-stock.webp',
      box: { left: 38.5, top: 24, width: 17.5, height: 23 },
      badge: S + 'teknofest-logo.png',
      credit: 'Stock photo · Unsplash',
      label: 'DETECTION OVERLAY · ILLUSTRATIVE',
    },
  },
  {
    id: 'comsol',
    title: 'COMSOL CFD and Experimental Study: NACA 54118 and a 2D Cylinder',
    category: 'CFD / Aerodynamics',
    year: '2025',
    description:
      'Contributed to CFD and experimental analysis of a NACA 54118 airfoil and of the flow around a non-rotating 2D circular cylinder.',
    outcome: 'Compared the numerical and experimental behaviour to check how far the model can be trusted.',
    tools: ['COMSOL Multiphysics', 'Python'],
    cover: { kind: 'blueprint', draw: 'cylinder' },
  },
  {
    id: 'quadra',
    title: 'Quadra Rotate',
    category: 'Software',
    year: '2026',
    description:
      'A rotation-based puzzle game, published on Google Play. Built with React functional components and hooks; the rotation logic and game state are plain JavaScript. Playable in 9 languages.',
    tools: ['React', 'JavaScript', 'Mobile'],
    cover: {
      kind: 'phones',
      shots: [S + 'combos.webp', S + 'rotation.webp', S + 'languages.webp'],
      icon: S + 'quadra-cover.webp',
    },
    playStore: 'https://play.google.com/store/apps/details?id=con.derbar.quadra',
  },
  {
    id: 'campus-collab',
    title: 'Campus Collab',
    category: 'Software',
    year: '2025, in progress',
    description:
      'A student collaboration platform with a component-based React frontend. I designed the interactive modules for course tracking, projects, societies and task management.',
    tools: ['React', 'JavaScript', 'UI/UX'],
    cover: { kind: 'blueprint', draw: 'board' },
  },
  {
    id: 'rocket',
    track: 'coursework',
    title: 'Rocket Propulsion Simulation',
    category: 'Propulsion',
    year: '2023',
    description:
      '1D thermodynamic model of a solid-fuel rocket motor to predict thrust curve and specific impulse.',
    outcome: 'Simulated burn profile matched experimental data within 5% error margin.',
    tools: ['MATLAB', 'Python', 'NumPy'],
    cover: { kind: 'blueprint', draw: 'thrust' },
  },
  {
    id: 'uav-dynamics',
    track: 'coursework',
    title: 'UAV Flight Dynamics Modelling',
    category: 'Flight Mechanics',
    year: '2023',
    description:
      'Linearized equations of motion derived for a fixed-wing UAV; lateral and longitudinal stability analysis.',
    outcome: 'Identified unstable Dutch roll mode and proposed tail geometry correction.',
    tools: ['MATLAB/Simulink', 'Python'],
    cover: { kind: 'blueprint', draw: 'dutchroll' },
  },
  {
    id: 'heat-shield',
    track: 'coursework',
    title: 'Heat Shield Ablation Study',
    category: 'Thermal / Re-entry',
    year: '2024',
    description:
      'Thermal protection system sizing for an atmospheric re-entry vehicle at hypersonic speeds.',
    outcome: 'Estimated required ablator thickness for a ballistic coefficient of 500 kg/m² entry trajectory.',
    tools: ['Python', 'SciPy', 'NASA CEA'],
    cover: { kind: 'blueprint', draw: 'reentry' },
  },
  {
    id: 'wind-tunnel',
    track: 'coursework',
    title: 'Wind Tunnel Test Campaign',
    category: 'Experimental Aerodynamics',
    year: '2023',
    description:
      'Designed, tested, and post-processed results from a low-speed wind tunnel experiment on a delta wing model.',
    outcome: 'Measured lift and drag polars; validated against XFoil predictions with < 8% deviation.',
    tools: ['LabVIEW', 'Python', 'MATLAB', 'XFoil'],
    cover: { kind: 'blueprint', draw: 'polar' },
  },
]

/* Kategori → ikon eşlemesi.
   Yeni bir kategori kullanırsan buraya bir satır ekle.
   Eşleşme bulunamazsa 'Wind' kullanılır.                */
export const projectCategoryIcons = {
  'CFD / Aerodynamics': 'Wind',
  'Autonomy / Vision': 'Crosshair',
  Software: 'Code2',
  'Structural / FEA': 'Cpu',
  Propulsion: 'Flame',
  'Flight Mechanics': 'Navigation',
  'Thermal / Re-entry': 'Thermometer',
  'Experimental Aerodynamics': 'FlaskConical',
}
