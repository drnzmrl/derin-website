import { site } from '../config/site.config'

/** Sitenin kendi adresi (QR kod, paylaşım ve vCard için).
 *  Yayındaki alan adını kendiliğinden alır. */
export function siteUrl() {
  if (typeof window === 'undefined') return ''
  return window.location.origin + window.location.pathname.replace(/index\.html$/, '')
}

const esc = (s) => String(s).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')

/** Rehbere kaydet: vCard 3.0 dosyası oluşturup indirir.
 *  Telefon numarası bilerek eklenmez. */
export function downloadVCard() {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N;CHARSET=UTF-8:${esc(site.surname)};${esc(site.name)};;;`,
    `FN;CHARSET=UTF-8:${esc(site.fullName)}`,
    'TITLE:Aerospace Engineering Student',
    'ORG;CHARSET=UTF-8:Middle East Technical University\\, Northern Cyprus Campus',
    `EMAIL;TYPE=INTERNET,PREF:${site.email}`,
    `URL;TYPE=LinkedIn:${site.linkedin}`,
    `URL;TYPE=Website:${siteUrl()}`,
    `NOTE;CHARSET=UTF-8:${esc('CFD and high-speed aerodynamics. ' + site.availability + '.')}`,
    'END:VCARD',
  ]
  const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'Derin-Izmirli.vcf'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export const canShare = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function'

export function sharePage() {
  return navigator
    .share({ title: `${site.fullName} | Aerospace Engineering`, url: siteUrl() })
    .catch(() => {})
}
