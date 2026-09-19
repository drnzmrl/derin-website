export const drawings = [
  {
    id: 1,
    title: "NACA 2412 Airfoil — Cross-Section Assembly",
    description: "Detailed technical drawing of a NACA 2412 profile with dimensioned chord, thickness distribution, and internal spar locations.",
    tool: "SolidWorks",
    image: null,
    category: "Aerodynamics",
  },
  {
    id: 2,
    title: "1U CubeSat Chassis — Exploded View",
    description: "Isometric exploded view showing panel joints, rail alignment, and PC-104 stack interface for a 1U CubeSat structure.",
    tool: "SolidWorks",
    image: null,
    category: "Spacecraft Structures",
  },
  {
    id: 3,
    title: "Rocket Motor Cross-Section",
    description: "Longitudinal cross-section of a solid propellant motor showing nozzle geometry, propellant grain, and casing structure.",
    tool: "AutoCAD",
    image: null,
    category: "Propulsion",
  },
  {
    id: 4,
    title: "UAV Wing Planform — Three-View Drawing",
    description: "Standard three-view orthographic drawing of a fixed-wing UAV with annotated dimensions, control surface extents, and dihedral angle.",
    tool: "CATIA V5",
    image: null,
    category: "Aircraft Design",
  },
  {
    id: 5,
    title: "Re-entry Capsule Geometry Study",
    description: "Parametric geometry sweep of blunt-body capsule designs showing nose radius vs. drag tradeoff annotations.",
    tool: "SolidWorks",
    image: null,
    category: "Re-entry Vehicles",
  },
  {
    id: 6,
    title: "Wind Tunnel Model — Delta Wing",
    description: "Precision manufacturing drawing of the delta wing wind tunnel model including mounting sting interface and surface finish callouts.",
    tool: "AutoCAD",
    image: null,
    category: "Experimental",
  },
]

/* Kategori → ikon eşlemesi (çizimler).
   İkon isimleri: https://lucide.dev/icons             */
export const drawingCategoryIcons = {
  Aerodynamics: 'Wind',
  'Spacecraft Structures': 'Satellite',
  Propulsion: 'Flame',
  'Aircraft Design': 'Plane',
  'Re-entry Vehicles': 'Orbit',
  Experimental: 'FlaskConical',
}
