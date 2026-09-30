/* ══════════════════════════════════════════════════════════════
   HAKKIMDA BÖLÜMÜ İÇERİĞİ

   Metinleri buradan değiştir. Liste elemanlarını silebilir,
   ekleyebilir, sıralarını değiştirebilirsin.
   ══════════════════════════════════════════════════════════════ */

export const about = {
  /* Fotoğraf: public/images/ içine koy, yolunu buraya yaz.
     Arka planı temizlenmiş (PNG/WebP) bir portre en iyi sonucu verir;
     holografik, imlece göre eğilen kartta gösterilir.
     null bırakırsan görev arması rozeti görünür.            */
  photo: null, // örn: '/images/derin.webp'
  photoAlt: 'Derin İzmirli',

  /* Fotoğrafın / rozetin köşesindeki küçük etiket. Gizlemek için: null */
  badge: { label: 'Based at', value: 'METU NCC' },

  /* Giriş paragrafları.
     tone: 'strong' → ana metin, 'soft' → soluk, 'accent' → vurgulu
     highlight: paragraf içinde renklendirilecek metin parçası    */
  intro: [
    {
      tone: 'strong',
      text: "I'm Derin, a fourth-year aerospace engineering student at METU Northern Cyprus Campus. I work mostly on high-speed aerodynamics and CFD, and I care a lot about whether a simulation actually agrees with the experiment.",
      highlight: 'high-speed aerodynamics and CFD',
    },
    {
      tone: 'soft',
      text: 'This year I modelled the NACA 0012 and 2415 airfoils from Mach 0.13 up to Mach 1.5. In the subsonic validation case my lift results stayed within 5% of NASA wind tunnel data. With a teammate I also took a 3D wing through subsonic, transonic and supersonic flow and ran nine slant angles of the Ahmed body.',
    },
    {
      tone: 'soft',
      text: 'On the TEKNOFEST Fighter UAV team I train the YOLO detector that finds the target aircraft. I also like building software: Quadra Rotate, a puzzle game I helped build, is live on Google Play.',
    },
    {
      tone: 'accent',
      text: 'Looking for internships and research projects in aerodynamics, CFD and space systems.',
    },
  ],

  /* "Şu an üzerinde çalıştıklarım" kartları.
     icon: src/components/ui/icons.js içindeki bir isim         */
  currentWork: {
    title: 'Currently Working On',
    items: [
      {
        icon: 'Zap',
        title: 'High-Speed Aerodynamics',
        items: [
          'Supersonic 3D wing and Ahmed body study in ANSYS Fluent',
          'TEKNOFEST critical design report and CFD analysis',
        ],
      },
      {
        icon: 'Rocket',
        title: 'Propulsion Studies',
        items: [
          'Turbojet and turbofan cycle calculations',
          'Propulsive efficiency and thrust specific fuel consumption',
        ],
      },
      {
        icon: 'Code2',
        title: 'Software Projects',
        items: [
          'Campus Collab, a student collaboration platform',
          'Mindmap, a psychology-based mobile app (in development)',
        ],
      },
    ],
  },

  /* Küçük istatistik kutuları. Tamamen kaldırmak için: stats: [] */
  stats: [
    { icon: 'Rocket', value: '4th Year', label: 'B.Sc. Aerospace Eng.' },
    { icon: 'Users', value: '10+', label: 'Team projects, 2 as lead' },
    { icon: 'Trophy', value: 'TEKNOFEST', label: 'Stage 1 passed' },
    { icon: 'Globe', value: '4', label: 'Languages' },
  ],
}

export default about
