export const TONE_COLORS: Record<string, string> = {
  clay:       '#d9b39a',
  sand:       '#e6dac4',
  moss:       '#afa980',
  stone:      '#c8c1b1',
  umber:      '#7a5a48',
  cream:      '#f0e7d4',
  terracotta: '#c08160',
  olive:      '#7d7a55',
  rosewood:   '#9b6660',
  dune:       '#cdb893',
}

const CATEGORY_TONES: Record<string, string> = {
  dresses:    'clay',
  tops:       'sand',
  scarves:    'cream',
  outer:      'umber',
  outerwear:  'umber',
  sets:       'olive',
  clothing:   'stone',
  shoes:      'dune',
  accessories:'moss',
  new:        'sand',
}

const TONE_LIST = Object.keys(TONE_COLORS)

export function getTone(category: string, id?: string): string {
  const cat = category.toLowerCase()
  if (CATEGORY_TONES[cat]) return CATEGORY_TONES[cat]
  if (id) {
    const charCode = id.charCodeAt(id.length - 1)
    return TONE_LIST[charCode % TONE_LIST.length]
  }
  return 'sand'
}

export function getToneColor(category: string, id?: string): string {
  return TONE_COLORS[getTone(category, id)] ?? TONE_COLORS.sand
}
