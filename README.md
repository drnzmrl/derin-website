# Derin — Havacılık ve Uzay Mühendisliği Portfolyosu

Kişisel portfolyo sitesi. Sayfa bir fırlatma gibi okunur: en üstte şafak
vakti rampa, aşağı indikçe atmosfer incelir, en altta derin uzay.

Arka plandaki gökyüzü uydurma değil — **gerçek astronomik kataloglardan**
çiziliyor. Takımyıldızlar olması gereken yerde.

**Vite · React 18 · Tailwind CSS · Framer Motion · three.js**

---

## Öne çıkanlar

- **Gerçek yıldız haritası** — HYG v4.4 kataloğundan yıldızlar; konumlar
  gerçek RA/Dec, renkler gerçek B-V renk indeksinden (mavi devlerden
  kırmızı cücelere), boyutlar gerçek görünür kadirden.
- **Gerçek derin gök cisimleri** — OpenNGC kataloğundan galaksiler,
  bulutsular ve yıldız kümeleri; tür renkleriyle (galaksi mavi-beyaz,
  bulutsu Hα kırmızısı, gezegenimsi bulutsu OIII turkuazı).
- **Gezegenler** — Dünya, Ay, Mars, Jüpiter ve halkalı Satürn; NASA
  görüntü verisine dayalı dokularla, sayfa boyunca sırayla.
- **Kaydırmaya bağlı sahne** — gökyüzü döner, roket yıldızlara doğru
  ilerler, gradyan şafaktan uzaya geçer.
- **Baştan sona ayarlanabilir** — bölüm, renk, dosya, efekt; hepsi üç
  ayar dosyasından. Kod yazmadan bölüm ekleyip çıkarabilirsin.

---

## Çalıştırma

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

---

## Yapı

```
src/
  config/        ayar dosyaları — siteyi buradan yönetirsin
  sections/      sayfa bölümleri (Hero, About, Projects…)
  components/
    layout/      Navbar, Footer, Section kabuğu
    ui/          Button, Tag, Modal, Icon…
    motion/      hareket bileşenleri (InView, Tilt, Magnetic…)
    space/       3B gökyüzü sahnesi (saf three.js)
    canvas/      2B katmanlar (imleç roketi, ufuk parıltısı)
  data/          içerik: projeler, çizimler, yayınlar, yetenekler
public/
  data/          yıldız ve gök cismi katalogları (JSON)
  textures/      gezegen dokuları
  cv/            CV dosyası
```

---

## Siteyi değiştirme

Kod yazmadan değiştirebileceğin her şey **[CONFIG.md](CONFIG.md)** içinde
anlatılıyor — bölüm ekleme/çıkarma, renkler, dosyalar, gezegenler,
performans ayarları.

Kısaca:

| Ne | Nerede |
|---|---|
| Kimlik, bağlantılar, dosyalar | `src/config/site.config.js` |
| Renkler, gökyüzü, 3B sahne | `src/config/theme.config.js` |
| Bölümler ve sıraları | `src/config/sections.config.js` |
| İçerik (projeler, yayınlar…) | `src/data/` |

---

## Performans

3B sahne arka planda çalışır ve kendini duruma göre kısar:

- Mobilde sadeleşir, sekme arkaya geçince çizmeyi durdurur
- Sistem "hareketi azalt" diyorsa hiç açılmaz
- İlk 3 saniyede 45 fps altını görürse galaksileri atıp çözünürlüğü düşürür
- three.js ayrı parça olarak yüklenir; ilk açılışı yavaşlatmaz
- Kataloglar JS paketine gömülmez, sahne açılınca indirilir

Ayar tablosu için [CONFIG.md](CONFIG.md#kasıyorsa-ne-yapmalı).

---

## Kaynaklar ve lisanslar

Bu proje üç açık veri/kod kaynağından yararlanıyor:

| Kaynak | Ne için | Lisans |
|---|---|---|
| [HYG Database v4.4](https://codeberg.org/astronexus/hyg) | Yıldız konumları, parlaklık, renk indeksi | CC BY-SA 4.0 |
| [OpenNGC](https://github.com/mattiaverga/OpenNGC) | Galaksi, bulutsu ve küme katalogları | CC BY-SA 4.0 |
| [Solar System Scope](https://www.solarsystemscope.com/textures/) | Gezegen dokuları (NASA verisine dayalı) | CC BY 4.0 |

Hareket bileşenleri [motion-primitives](https://github.com/ibelick/motion-primitives)
(MIT) fikirlerinden uyarlandı.

Atıflar sitenin altbilgisinde de yer alıyor.
