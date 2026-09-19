export const projects = [
  {
    id: 1,
    title: "ANSYS Fluent - NACA 0012 and NACA 2415 Airfoil Analysis | 2026 ",
    description: "•	Simulated 2D airfoils across subsonic, transonic, and supersonic regimes.",
    outcome: "Investigated shock wave behavior, mesh independence, and y+ analysis. Validated lift results with NASA reference data, achieved error below 5%.",
    tools: ["ANSYS Fluent", "MATLAB", "Python"],
    image: null,
    category: "CFD / Aerodynamics",
   
  },
  {
    id: 2,
    title: "COMSOL CFD + Experimental Study - NACA 54118 and Non-Rotating 2D Cylinder | 2025",
    description: "Contributed to CFD and experimental analysis of a NACA 54118 airfoil and flow around a 2D circular cylinder.",
    outcome: "Compared numerical and experimental behavior to support model reliability.",
    tools: ["COMSOL Multiphysics", "Python"],
    image: null,
    category: "CFD / Aerodynamics",

  },
  {
    id: 3,
    title: "Rocket Propulsion Simulation",
    description: "1D thermodynamic model of a solid-fuel rocket motor to predict thrust curve and specific impulse.",
    outcome: "Simulated burn profile matched experimental data within 5% error margin.",
    tools: ["MATLAB", "Python", "NumPy"],
    image: null,
    category: "Propulsion",
    year: "2023",
  },
  {
    id: 4,
    title: "UAV Flight Dynamics Modelling",
    description: "Linearized equations of motion derived for a fixed-wing UAV; lateral and longitudinal stability analysis.",
    outcome: "Identified unstable Dutch roll mode and proposed tail geometry correction.",
    tools: ["MATLAB/Simulink", "Python"],
    image: null,
    category: "Flight Mechanics",
    year: "2023",
  },
  {
    id: 5,
    title: "Heat Shield Ablation Study",
    description: "Thermal protection system sizing for an atmospheric re-entry vehicle at hypersonic speeds.",
    outcome: "Estimated required ablator thickness for a ballistic coefficient of 500 kg/m² entry trajectory.",
    tools: ["Python", "SciPy", "NASA CEA"],
    image: null,
    category: "Thermal / Re-entry",
    year: "2024",
  },
  {
    id: 6,
    title: "Wind Tunnel Test Campaign",
    description: "Designed, tested, and post-processed results from a low-speed wind tunnel experiment on a delta wing model.",
    outcome: "Measured lift and drag polars; validated against XFoil predictions with < 8% deviation.",
    tools: ["LabVIEW", "Python", "MATLAB", "XFoil"],
    image: null,
    category: "Experimental Aerodynamics",
    year: "2023",
  },
]

/* Kategori → ikon eşlemesi.
   Yeni bir kategori kullanırsan buraya bir satır ekle.
   İkon isimleri: https://lucide.dev/icons
   Eşleşme bulunamazsa 'Wind' kullanılır.                */
export const projectCategoryIcons = {
  'CFD / Aerodynamics': 'Wind',
  'Structural / FEA': 'Cpu',
  Propulsion: 'Flame',
  'Flight Mechanics': 'Navigation',
  'Thermal / Re-entry': 'Thermometer',
  'Experimental Aerodynamics': 'FlaskConical',
}
