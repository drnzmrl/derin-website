/* Araç şeridi: Skills bölümünün üstünde sonsuz kayan araç adları.
   Sırası ve içeriği serbest. */
export const toolbelt = [
  'ANSYS Fluent',
  'COMSOL Multiphysics',
  'MATLAB',
  'Python',
  'C',
  'AutoCAD',
  'Autodesk Inventor',
  'YOLO',
  'React',
  'JavaScript',
  'Excel',
  'SolidWorks',
  'CATIA V5',
]

/* Bu sayfadaki projelerde fiilen kullanılanlar. Skills bölümünde
   küçük bir noktayla işaretlenir; kanıtı olan beceri ayrı görünsün. */
export const evidence = new Set([
  'Aerodynamics & CFD',
  'Compressible Flow',
  'Mesh Independence & y⁺',
  'ANSYS Fluent',
  'COMSOL Multiphysics',
  'MATLAB',
  'Python',
  'YOLO (object detection)',
  'React',
  'JavaScript',
  'Validation against experimental data',
  'Technical Report Writing',
  'Teamwork',
  'Team lead on 2 projects',
  'Turkish · Native',
  'English · IELTS C1',
])

export const skillGroups = [
  {
    category: 'Aerospace & Engineering',
    icon: 'Rocket',
    skills: [
      'Aerodynamics & CFD',
      'Compressible Flow',
      'Mesh Independence & y⁺',
      'Structural Analysis (FEA)',
      'Flight Mechanics',
      'Orbital Mechanics',
      'Propulsion Systems',
      'Thermal Analysis',
      'Aircraft Design',
      'Wind Tunnel Testing',
    ],
  },
  {
    category: 'Software & Simulation',
    icon: 'Monitor',
    skills: [
      'ANSYS Fluent',
      'COMSOL Multiphysics',
      'ANSYS Mechanical',
      'AutoCAD',
      'Autodesk Inventor',
      'SolidWorks',
      'CATIA V5',
      'MATLAB / Simulink',
      'NASA CEA',
      'XFoil',
    ],
  },
  {
    category: 'Programming',
    icon: 'Code2',
    skills: [
      'Python',
      'MATLAB',
      'C',
      'YOLO (object detection)',
      'React',
      'JavaScript',
      'NumPy / SciPy',
      'Pandas',
      'Matplotlib',
      'LaTeX',
      'Git',
      'Linux',
    ],
  },
  {
    category: 'Research & Academic',
    icon: 'BookOpen',
    skills: [
      'Validation against experimental data',
      'Technical Report Writing',
      'Literature Review',
      'Data Acquisition (DAQ)',
      'Scientific Visualization',
      'Experimental Design',
      'Peer Review',
    ],
  },
  {
    category: 'Working with People',
    icon: 'Users',
    skills: ['Teamwork', 'Public speaking', 'Communication', 'Adaptability', 'Team lead on 2 projects'],
  },
  {
    category: 'Languages',
    icon: 'Globe',
    skills: ['Turkish · Native', 'English · IELTS C1', 'Spanish · Beginner', 'German · Beginner'],
  },
]
