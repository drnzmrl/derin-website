/* ══════════════════════════════════════════════════════════════
   ÇİZİMLER

   image     → public/ altındaki görsel yolu
   blueprint → görsel yoksa çizilecek teknik çizim
               (components/effects/Blueprints.jsx içindeki anahtar)
   light     → görselin zemini beyazsa true (kağıt gibi gösterilir)
   ══════════════════════════════════════════════════════════════ */

const W = '/images/work/'

export const drawings = [
  {
    id: 'swept-domain',
    title: 'Swept Wing and Subsonic Domain',
    description:
      'Computational domain for the subsonic runs with the 30° swept NACA 0012 wing. The dimensions keep the far-field boundaries well away from the wing.',
    tool: 'ANSYS',
    image: W + 'wing-swept-geometry.webp',
    light: true,
    category: 'CFD Geometry',
  },
  {
    id: 'tapered-domain',
    title: 'Swept-Tapered Wing, Supersonic Domain',
    description:
      'Domain and planform used for the Mach 1.5 simulations of the swept-tapered wing, with the refinement region around the wing.',
    tool: 'ANSYS',
    image: W + 'wing-tapered-geometry.webp',
    light: true,
    category: 'CFD Geometry',
  },
  {
    id: 'wing-mesh',
    title: 'Wing Mesh and Near-Wall Detail',
    description:
      'Unstructured mesh used for the subsonic wing runs, with the refined zone and a close-up of the cells around the airfoil section.',
    tool: 'ANSYS Meshing',
    image: W + 'wing-mesh.webp',
    category: 'Mesh',
  },
  {
    id: 'ahmed-geometry',
    title: 'Ahmed Body, Baseline Geometry',
    description:
      'The simplified car model used to study bluff-body aerodynamics. The slant angle at the rear was varied from 0° to 80° in 10° steps.',
    tool: 'ANSYS',
    image: W + 'ahmed-geometry.webp',
    light: true,
    category: 'CFD Geometry',
  },
  {
    id: 'ahmed-diffuser',
    title: 'Ahmed Body with Undertray Diffuser',
    description:
      'The second geometry, with an undertray diffuser added to study downforce generation.',
    tool: 'ANSYS',
    image: W + 'ahmed-diffuser-geometry.webp',
    light: true,
    category: 'CFD Geometry',
  },
  {
    id: 'ahmed-inflation',
    title: 'Inflation Layer',
    description: 'Prism layers grown from the wall to resolve the boundary layer on the Ahmed body.',
    tool: 'ANSYS Meshing',
    image: W + 'ahmed-inflation.webp',
    light: true,
    category: 'Mesh',
  },
  {
    id: 1,
    track: 'coursework',
    title: 'NACA 2412 Airfoil, Cross-Section Assembly',
    description: 'Detailed technical drawing of a NACA 2412 profile with dimensioned chord, thickness distribution, and internal spar locations.',
    tool: 'SolidWorks',
    blueprint: 'naca2412',
    category: 'Aerodynamics',
  },
  {
    id: 2,
    track: 'coursework',
    title: '1U CubeSat Chassis, Exploded View',
    description: 'Isometric exploded view showing panel joints, rail alignment, and PC-104 stack interface for a 1U CubeSat structure.',
    tool: 'SolidWorks',
    blueprint: 'cubesat',
    category: 'Spacecraft Structures',
  },
  {
    id: 3,
    track: 'coursework',
    title: 'Rocket Motor Cross-Section',
    description: 'Longitudinal cross-section of a solid propellant motor showing nozzle geometry, propellant grain, and casing structure.',
    tool: 'AutoCAD',
    blueprint: 'motor',
    category: 'Propulsion',
  },
  {
    id: 4,
    track: 'coursework',
    title: 'UAV Wing Planform, Three-View Drawing',
    description: 'Standard three-view orthographic drawing of a fixed-wing UAV with annotated dimensions, control surface extents, and dihedral angle.',
    tool: 'CATIA V5',
    blueprint: 'uav',
    category: 'Aircraft Design',
  },
  {
    id: 5,
    track: 'coursework',
    title: 'Re-entry Capsule Geometry Study',
    description: 'Parametric geometry sweep of blunt-body capsule designs showing nose radius vs. drag tradeoff annotations.',
    tool: 'SolidWorks',
    blueprint: 'capsule',
    category: 'Re-entry Vehicles',
  },
  {
    id: 6,
    track: 'coursework',
    title: 'Wind Tunnel Model, Delta Wing',
    description: 'Precision manufacturing drawing of the delta wing wind tunnel model including mounting sting interface and surface finish callouts.',
    tool: 'AutoCAD',
    blueprint: 'delta',
    category: 'Experimental',
  },
]

/* Kategori → ikon eşlemesi (çizimler). */
export const drawingCategoryIcons = {
  'CFD Geometry': 'Box',
  Mesh: 'Grid3x3',
  Aerodynamics: 'Wind',
  'Spacecraft Structures': 'Satellite',
  Propulsion: 'Flame',
  'Aircraft Design': 'Plane',
  'Re-entry Vehicles': 'Orbit',
  Experimental: 'FlaskConical',
}
