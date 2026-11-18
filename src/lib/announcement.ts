import type { Obituary } from '../types'
import { formatDate, formatDateTime, locationLine, obituaryShareUrl } from './format'

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

/** Generate a ready-to-forward announcement image (1080×1350) from an
 *  obituary, drawn locally on a canvas — no server, no design tool. */
export function downloadAnnouncementCard(o: Obituary): void {
  const W = 1080
  const H = 1350
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, '#064e3b')
  grad.addColorStop(1, '#052e22')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = '#b45309'
  ctx.lineWidth = 6
  ctx.strokeRect(36, 36, W - 72, H - 72)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#d4af37'
  ctx.font = '110px serif'
  ctx.fillText('☾', W / 2, 190)

  ctx.fillStyle = '#ecfdf5'
  ctx.font = '44px serif'
  ctx.fillText('إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', W / 2, 290)
  ctx.font = '30px sans-serif'
  ctx.fillStyle = '#a7f3d0'
  ctx.fillText("Inna lillahi wa inna ilayhi raji'un", W / 2, 345)

  let y = 480
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 64px sans-serif'
  for (const line of wrap(ctx, o.name, W - 180)) {
    ctx.fillText(line, W / 2, y)
    y += 76
  }
  if (o.arabicName) {
    ctx.font = '52px serif'
    ctx.fillStyle = '#fde68a'
    ctx.fillText(o.arabicName, W / 2, y + 10)
    y += 80
  }
  ctx.font = '34px sans-serif'
  ctx.fillStyle = '#d1fae5'
  ctx.fillText(`${formatDate(o.dateOfPassing)} · ${locationLine(o)}`, W / 2, y + 30)
  y += 130

  if (o.janazah) {
    ctx.font = 'bold 40px sans-serif'
    ctx.fillStyle = '#fbbf24'
    ctx.fillText('Janazah Prayer', W / 2, y)
    y += 58
    ctx.font = '36px sans-serif'
    ctx.fillStyle = '#ffffff'
    for (const line of wrap(ctx, formatDateTime(o.janazah.datetime), W - 180)) {
      ctx.fillText(line, W / 2, y)
      y += 48
    }
    ctx.font = '34px sans-serif'
    for (const line of wrap(ctx, `${o.janazah.mosque}${o.janazah.address ? ` — ${o.janazah.address}` : ''}`, W - 180)) {
      ctx.fillText(line, W / 2, y)
      y += 46
    }
    if (o.janazah.cemetery) {
      y += 16
      ctx.fillStyle = '#d1fae5'
      ctx.font = '32px sans-serif'
      ctx.fillText(`Burial: ${o.janazah.cemetery}`, W / 2, y)
      y += 44
    }
  }

  ctx.font = '30px sans-serif'
  ctx.fillStyle = '#a7f3d0'
  ctx.fillText('Please keep them in your duas 🤲', W / 2, H - 170)
  ctx.font = '26px sans-serif'
  ctx.fillStyle = '#6ee7b7'
  ctx.fillText(`Al-Baqaa · ${obituaryShareUrl(o.id)}`, W / 2, H - 110)

  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Janazah-announcement-${o.name.replace(/\s+/g, '-')}.png`
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}
