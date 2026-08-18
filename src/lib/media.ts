export type MediaDoc = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  sizes?: {
    card?: { url?: string | null }
    banner?: { url?: string | null }
  }
}

export function mediaUrl(input: unknown, size?: 'card' | 'banner'): string | null {
  if (!input || typeof input !== 'object') return null
  const media = input as MediaDoc
  if (size === 'card' && media.sizes?.card?.url) return media.sizes.card.url
  if (size === 'banner' && media.sizes?.banner?.url) return media.sizes.banner.url
  return media.url ?? null
}

export function mediaAlt(input: unknown, fallback: string): string {
  if (input && typeof input === 'object' && 'alt' in input && typeof input.alt === 'string' && input.alt) {
    return input.alt
  }
  return fallback
}

export function heroSlides(
  primary: unknown,
  gallery: { image?: unknown }[] | null | undefined,
  fallbackAlt: string,
): { src: string; alt: string }[] {
  const seen = new Set<string>()
  const slides: { src: string; alt: string }[] = []

  for (const item of [primary, ...(gallery ?? []).map((entry) => entry.image)]) {
    const src = mediaUrl(item, 'banner')
    if (!src || seen.has(src)) continue
    seen.add(src)
    slides.push({ src, alt: mediaAlt(item, fallbackAlt) })
  }

  return slides
}

export function splitParagraphs(text?: string | null): string[] {
  if (!text) return []
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
}
