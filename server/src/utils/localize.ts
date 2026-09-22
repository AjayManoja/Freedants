import { Request } from 'express';

export const SUPPORTED_LANGS = ['en', 'hi'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
const DEFAULT_LANG: Lang = 'en';

/** Language from ?lang=hi, else the Accept-Language header, else English. */
export function resolveLang(req: Request): Lang {
  const fromQuery = String(req.query.lang ?? '').toLowerCase();
  if ((SUPPORTED_LANGS as readonly string[]).includes(fromQuery)) return fromQuery as Lang;
  const fromHeader = req.acceptsLanguages(...SUPPORTED_LANGS);
  return (fromHeader as Lang) || DEFAULT_LANG;
}

const nonEmpty = <T>(arr: T[] | undefined): arr is T[] => Array.isArray(arr) && arr.length > 0;

/**
 * Overlay a competition's stored translation onto its base (English) content.
 * Any field the translation leaves out falls back to the base value, so a
 * partial translation never produces blanks.
 */
export function localizeCompetition(comp: any, lang: Lang) {
  const { translations, ...base } = comp;
  const tr = translations?.[lang];
  if (lang === DEFAULT_LANG || !tr) return base;

  return {
    ...base,
    title: tr.title || base.title,
    tags: nonEmpty(tr.tags) ? tr.tags : base.tags,
    perks: nonEmpty(tr.perks) ? tr.perks : base.perks,
    about: nonEmpty(tr.about) ? tr.about : base.about,
    judgingParameters: nonEmpty(tr.judgingParameters) ? tr.judgingParameters : base.judgingParameters,
    rules: nonEmpty(tr.rules) ? tr.rules : base.rules,
    disclaimer: tr.disclaimer || base.disclaimer,
    judge: { ...base.judge, ...(tr.judge || {}) },
    rewards: (base.rewards || []).map((r: any) => ({
      ...r,
      label: tr.rewards?.[String(r.position)] || r.label,
    })),
    previousWinners: (base.previousWinners || []).map((w: any, i: number) => ({
      ...w,
      ...(tr.previousWinners?.[i] || {}),
    })),
  };
}

/** Same overlay for a testimonial ({ name, meta, text }). */
export function localizeTestimonial(t: any, lang: Lang) {
  const { translations, ...base } = t;
  const tr = translations?.[lang];
  if (lang === DEFAULT_LANG || !tr) return base;
  return { ...base, name: tr.name || base.name, meta: tr.meta || base.meta, text: tr.text || base.text };
}
