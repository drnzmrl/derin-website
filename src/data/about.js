/* ══════════════════════════════════════════════════════════════
   HAKKIMDA BÖLÜMÜ İÇERİĞİ

   Metinleri buradan değiştir. Liste elemanlarını silebilir,
   ekleyebilir, sıralarını değiştirebilirsin.
   ══════════════════════════════════════════════════════════════ */

export const about = {
  /* Fotoğraf: public/images/ içine koy, yolunu buraya yaz.
     null bırakırsan baş harfli yer tutucu görünür.          */
  photo: null, // örn: '/images/derin.jpg'
  photoAlt: 'Derin',

  /* Fotoğrafın köşesindeki küçük rozet. Gizlemek için: null */
  badge: { label: 'Based in', value: 'Turkey 🇹🇷' },

  /* Giriş paragrafları.
     tone: 'strong' → ana metin, 'soft' → soluk, 'accent' → vurgulu
     highlight: paragraf içinde renklendirilecek metin parçası    */
  intro: [
    {
      tone: 'strong',
      text: 'I am Derin — a third-year aerospace engineering student focused on high-speed aerodynamics, CFD, and data-driven problem-solving. I like turning complex flow physics into clear, actionable results.',
      highlight: 'high-speed aerodynamics, CFD, and data-driven problem-solving',
    },
    {
      tone: 'soft',
      text: 'I have run CFD simulations on airfoils and aerodynamic bodies across subsonic, transonic, and supersonic regimes — validating against NASA data with under 5% error. I also build software on the side, from a published mobile game to student platforms.',
    },
    {
      tone: 'accent',
      text: 'Open to internships and research opportunities in aerospace engineering.',
    },
  ],

  /* "Şu an üzerinde çalıştıklarım" kartları.
     icon: https://lucide.dev/icons adresindeki bir isim         */
  currentWork: {
    title: 'Currently Working On',
    items: [
      {
        icon: 'Zap',
        title: 'High-Speed Aerodynamics',
        items: [
          '3D wing & Ahmed body CFD (ANSYS Fluent — supersonic)',
          'TEKNOFEST critical design report + CFD analysis',
        ],
      },
      {
        icon: 'Rocket',
        title: 'Propulsion Studies',
        items: [
          'Turbojet & turbofan cycle calculations',
          'Propulsive efficiency, thrust specific fuel consumption',
        ],
      },
      {
        icon: 'Code2',
        title: 'Software Projects',
        items: [
          'Campus Collab — student collaboration platform',
          'Mindmap — psychology-based mobile app (in dev)',
        ],
      },
    ],
  },

  /* Küçük istatistik kutuları. Tamamen kaldırmak için: stats: [] */
  stats: [
    { icon: 'Rocket', value: '3rd Year', label: 'B.Sc. Student' },
    { icon: 'FlaskConical', value: '3+', label: 'CFD Projects' },
    { icon: 'BookOpen', value: 'TEKNOFEST', label: 'Stage 1 Passed' },
    { icon: 'Globe', value: '4', label: 'Languages' },
  ],
}

export default about
