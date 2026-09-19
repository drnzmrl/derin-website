# Gök verisi

Bu klasördeki dosyalar gerçek astronomik kataloglardan türetildi.
Sahne açılırken tarayıcı bunları ayrıca indirir (JS paketine gömülmez).

## stars.json
- Kaynak: HYG Database v4.4 — https://codeberg.org/astronexus/hyg
- İçerik: Hipparcos + Yale Bright Star + Gliese kataloglarından,
  çıplak gözle görülebilen (mag ≤ 6.5) 8.920 yıldız
- Alanlar: `[ra_saat, dec_derece, kadir, B-V renk indeksi]`
- Lisans: CC BY-SA 4.0

## deepsky.json
- Kaynak: OpenNGC — https://github.com/mattiaverga/OpenNGC
- İçerik: mag ≤ 14.5 olan 6.442 derin gök cismi
  (5.500 galaksi, 485 açık küme, 197 küresel küme, 132 bulutsu,
  128 gezegenimsi bulutsu) + 106 Messier nesnesi
- Alanlar: `r` ra_saat, `d` dec_derece, `t` tür, `m` kadir,
  `s` boyut_yaydakika, `n` ad
- Lisans: CC BY-SA 4.0

Her iki veri seti de CC BY-SA 4.0 — atıf sitenin altbilgisinde yer alıyor.
