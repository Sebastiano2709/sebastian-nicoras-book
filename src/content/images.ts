// Single source of truth for every photo on the site (confirmed list and order: Phase 1 brief).
// Alt texts approved 2026-11-02 (Phase 1, Q5 default). Width/height are the web masters' real pixels,
// written after running scripts/optimize-images.mjs. Plain, erasable TypeScript so Node can import it.

const L = {
  IMG_1604: "data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAACQBACdASoYAB4APu1kpk2ppaMiMBgMATAdiWcAAC6N7Znel65RJknTE4q89SAA/u1RN14+HJ7ksRUvX4banmJnpjfoUFELNOk4eajnMJK+6VnZMABtt3q2fgcSXszud5hS2o04KRgqkuTP5TMBJbZWyfhR1oza3McfBPXm5+brcOaBwAA=",
  IMG_1611: "data:image/webp;base64,UklGRrwAAABXRUJQVlA4ILAAAAAQBQCdASoYAB4APu1kq06ppaQiKA1RMB2JZwDKtBEc1dS4SXhqJmQktgYEf3lukYswAP7tRS4lrZRR0OVejm1imf7LwB2UchopKPnEnZKe17w8ZYKd/gcUGcOvxjVLiSMNYKJJag8+lo3tAEISB75KAq8lQqS7x47ZAgohFiIy68bFMlNx1WPh6iiegxVA5Ki0Le+/kq4tzDncsMP80cptZIwmCmQWjCaZqZPwkoAAAA==",
  IMG_1619: "data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAAAQBQCdASoVACAAPu1mqk2ppaQiMAgBMB2JZwDE2B4ZKdf79BAY5ZuFos40v9d4Gr/AAP65+ftaUABt1ynjI+B5eu+KJUy1dTwYXNXK/3OWQsHGlCeFsrLUG9BJvwLl5mODZVUZaLWsOZYAiwYZj3CpHZ9Nn/ll42wBJtn6XO523yhYAAA=",
  IMG_1622: "data:image/webp;base64,UklGRpYAAABXRUJQVlA4IIoAAABQBQCdASoYAB4APu1qrlCppiQiqAqpMB2JZwDH5DT3GBZ2htX82kexYeZqKSdYaVkAxAAA/rlyqlF5di1jx0Ch/TPyPO7iLUnO1BfJAOft5XEh7kG4TbJM46D8rTr7vUDobtWy1/+6bUyKqMi7cFetJVtnHNH2w0O8moZyoGF+E5WCi11FI2qBwAA=",
  IMG_1714: "data:image/webp;base64,UklGRpgAAABXRUJQVlA4IIwAAACwBACdASoYABgAPu1mpk4ppaMiMBgMATAdiWMAVH6DwB9xr+WXxIZVhIs6CogAAP7zdPRNJWt0D0F+H7SV0jeeCf6zDfq69Bn45Qk6wCwZDPdmPoyVR2/GZzBk2ib4kfML6WldoU8jb05lmXwlohbx9g1QfjqYA5CY2QFQxYjKxCZYPi8aFWN+bFAAAA==",
  IMG_1732: "data:image/webp;base64,UklGRt4AAABXRUJQVlA4INIAAAAQBQCdASoVACAAPu1gp02ppSOiMAgBMB2JYwDFC1ZGoiEEDv6hXNeqszb/liGjmkWoAPMgqSbZEc9Lbl8+FQ7yzK3GRWlnQAR3ik/4kk7y5js1JI8Nin5NCiH0tuPxe2nwx7g6R7kgu6j+HAvADtAMRD6Zo46fMn+fsE+kU4ph93lk2S2LSMdu/2M8GJadmQ7GYwBd/YBdehVHEqzCvKJfKuBDCx5hdcSLsPnhFOdF/rePZorJGCKUzvxUBm1Ua2PwOJwXDnjE4eHRjicx8iy4AgA=",
  IMG_1745: "data:image/webp;base64,UklGRgQBAABXRUJQVlA4IPgAAACwBQCdASoVACAAPu1kqU2ppaOiMAgBMB2JZQCvDdwNGSKWiWxpLw9SmcVpvxl7awqGWVeHk2AA/up+TWlXAqOqAd8nFoHlJnrtc3lX70qKaiHUCthFuzhJztpsvlXW4sfl/RtVsX8+XSUGwR5nZMHnKZUA4jsb3jZT9YDx15sHHbvJdt5ht3adZC5fAe85RpIb7Z/+EXesGVc3b/sYyR+0apmJHgDvgaEFR2LapVIvM31LMSu3Hy5jsycYd/brMETO/IDLKXpDiNNCNdfNtekF7S3+Pgqs8PVPzulozB9MaNRc05pUPJzmtEmEBGoTSHnAA8JK0AAAAA==",
  IMG_1915: "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAAAQBACdASoVACAAPu1mqU2ppaQiMAgBMB2JZwAAWp6mriDviEyDexzpoAD+6Ohf6jc5kv5XRUKbploN6C7N/9++DYntj9ZCsq2bkIVVDYRbuuG1+ZMmgXq6CBAAAA==",
  IMG_3813: "data:image/webp;base64,UklGRhIBAABXRUJQVlA4IAYBAACQBgCdASoYACAAPu1gq1AppKOisBgIATAdiWoAnTKEgr/Fha6fvLM/D4XIZrzMPwCD6rHGyO3NjYG/t42AAP73u8l+l21nD3HM/VvNQ8Wg8NLvWzR52CZV7q/jFVUp1vC99ST3ahv9L3fnXc215qUBi9dwIo0tgeOj2bQOO1+In85lm3bs/w3o0oI15jyysX+3C/Gn6T88iOCew+SeMz2h1Iw83rntI9EKx7z1hENGz90s4K0EziO9vxfPWIlQjjRFQbFmxzBToMgy6nBWQdKm5lKcacoQK45LGU7DoUHXAY8yciD7R4qWBKrHppmuwEnH1tsjVvkzUbRcB/xqHqssXJnXUAAA",
  IMG_8164: "data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAADwAwCdASoVACAAPu1kqk2ppaQiMAgBMB2JaQAAWlFwUq/fHBQc6HkAAP7tR+akqXFRMCZTs91/oqRQ5ykEYizCbI9DxIUHYr5xDDHTZ59LuOeTCH6itR17oOFY9CjpdMcMGtmNBQbT+uJcQ5vOE29Tnl7hFXu4Evj1NVI+I9fBzAAA",
  RBV_4860: "data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAAAwBQCdASoYACAAPu1mqk4ppaQiMAgBMB2JYwDLLCP/9fGv+ia4YAGljhdEAuFZSLKMwAD+WZRePykn8HMSLVEgXYFkQOxLWS9Pjz5pQFkPUEfpnmn8XGHhUr7H4blnN8Bd0X3TeUlaHV6AkkWLNjTxzO/p2/CHDHodKBAasHrAw4KzGi4NgV6PMmeYCTWqHkGYMR4zDFqAAA==",
  RBV_4862: "data:image/webp;base64,UklGRqgAAABXRUJQVlA4IJwAAABwBQCdASoYACAAPuFgpk2opaOiN/VYARAcCUAZmgIe7hfGBR71llwX+lfHjvUJMAwgkGuAAP6MVctUplCZvH2C4297kNkDEurD2SRtT2Hizzp/lB9LQAX3PjAnDJjbjQXzg4hP+49mAw56/kQVsoPzjVvwE4NgJ69OqqhaGzjfjTxR4d4WZSQ7IJF0tcJMvax4DuzYpAfu1oMAAAA=",
  RBV_4867: "data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAAAQBQCdASoYACAAPuVgpk2pJaOiMAwBIByJZwDE2CPs1R2Ogq925PKLljUNoo56q6egAP5ZlIda2n4PWqQD8LNwAWs+Nmy0IYPKMMOCC4ZT8DxRGArqRJA2C7l4kWo+p9ai8Dx/KvKI1PrcJcros9bBI+IFgiAbnfs1bzxcwcRX20GlxLh9i9wUvEGugzXgIVAAAA==",
  RBV_4872: "data:image/webp;base64,UklGRsIAAABXRUJQVlA4ILYAAABQBQCdASoYACAAPu1qrlCppaQiqAqpMB2JZAAALG/Svsr+F1Iw710kv6OFyu6jGxVMNlwA/q7rrhm6d+FbpeHVUUZEZrFJWHx+XT0vBlfiE7CjntmlxPsRwPE4GwuhK0C7/3IXOLPXQL05NlgL1XB5LdU9z/gGrdBTbUOT1BMqhDHDSjiLWyQ61JPNgYGmT8ZrrIia4b01xPRQP7+GYxLg9pZWOysWlCg0XazPz7fU2wU5ngAAAA==",
  RBV_4895: "data:image/webp;base64,UklGRrgAAABXRUJQVlA4IKwAAADwBACdASoYACAAPu1srVEppaQiqAqpMB2JYgDMHBDWiQyTeHdC/JHsY5MxiITpggAA/oxQ1NwLubjhHgTuWkJRw3xkUFn02ZYszO5glrmHateGT8g7Yf7WRDkx/BZ/iE8azb2b2rFqh7uoZ/ngdKS4uIUSLQv2Zdj8LLi3NuIQ6kF5m7vqE/JLOPOpzrWIi/lj8c8fG+6fSmSTQa+V9pI/4GYolxGER/IsAAAA",
  RBV_4897: "data:image/webp;base64,UklGRr4AAABXRUJQVlA4ILIAAAAQBQCdASoYACAAPu1sqlGppaOiqAqpMB2JQAAFtzAgq9s//K0gJQYCBvCf/v3r73i8AP6MOTtNmJi9kjUwBTcevXFu+g34llipwEcQb09+w9eZCzb3f8H9jepCf809+0jFPVa90ReJfJ8lnaQQctqwZfUOTTjRbMGc6383Q6890eMLPyPiUJpjF9AzofbDKcpJ3RMSOlfn8RaqstKHbbn8X/a2Djb3popCBCU1iJD/wAAA",
  STUDIO_01: "data:image/webp;base64,UklGRrwAAABXRUJQVlA4ILAAAACQBQCdASogABUAPu1orE+ppiQiMBgIATAdiWUAzfwwlTdHliLqOc61IEmRNy0kg9Laf6D+AAD+5oEH/jFxHYGVaDD9QuYTfZ9CYSfP7YRFMoVm3LXbN2HrqTZ1+K4WA+vDusbxvIXaWsTrRKM5ti6OyqFGZEtK03Q+LrgakAopfNRTe/1uqRwUHO1rHkx4KIL/NjcNoRJr3mzHM5dBWOPGShfwLVmzY8BUG8lqNpmgAA==",
} as const;

export type Photo = {
  dir: "portfolio" | "polaroids";
  file: string;
  width: number;
  height: number;
  alt: { en: string; ro: string };
  /** Tiny blurred WebP shown while the photo loads (generated from the same master). */
  lqip: string;
};

// Cover photo (studio, landscape) — replaced the runway shot on 2026-11-03 at the owner's request.
export const cover: Photo = {
  dir: "portfolio",
  file: "STUDIO_01.jpg",
  width: 2000,
  height: 1333,
  lqip: L.STUDIO_01,
  alt: {
    en: "Sebastiano Nicoras in the studio, black tuxedo with bow tie and white shirt, leaning on a grey wall",
    ro: "Sebastiano Nicoras în studio, în smoching negru cu papion și cămașă albă, sprijinit de un perete gri",
  },
};

// Runway shot: the v2-starter hero, now the last photo of the portfolio (confirmed order).
export const hero: Photo = {
  dir: "portfolio",
  file: "IMG_1745.jpg",
  width: 1367,
  height: 2048,
  lqip: L.IMG_1745,
  alt: {
    en: "Sebastiano Nicoras walking a runway in a dark green jacquard tuxedo jacket, black shirt and bow tie",
    ro: "Sebastiano Nicoras defilând pe podium într-un sacou de smoching verde-închis din jacard, cămașă neagră și papion",
  },
};

export const portfolio: Photo[] = [
  {
    dir: "portfolio", file: "IMG_8164.jpg", width: 1334, height: 2000, lqip: L.IMG_8164,
    alt: {
      en: "Full-length, black suit, white shirt and black tie, arms crossed, white studio backdrop",
      ro: "Corp întreg, costum negru, cămașă albă și cravată neagră, brațele încrucișate, fundal alb de studio",
    },
  },
  {
    dir: "portfolio", file: "IMG_1915.jpg", width: 1334, height: 2000, lqip: L.IMG_1915,
    alt: {
      en: "Three-quarter portrait, black suit jacket open over bare chest, dark grey backdrop",
      ro: "Portret trei sferturi, sacou negru deschis peste pieptul gol, fundal gri-închis",
    },
  },
  {
    dir: "portfolio", file: "IMG_1732.jpg", width: 1600, height: 2400, lqip: L.IMG_1732,
    alt: {
      en: "Walking down outdoor steps in a teal three-piece suit, white villa and clouds behind",
      ro: "Coborând trepte în aer liber într-un costum în trei piese verde-petrol, cu o vilă albă și nori în spate",
    },
  },
  {
    dir: "portfolio", file: "IMG_1622.jpg", width: 1600, height: 2000, lqip: L.IMG_1622,
    alt: {
      en: "Seated on a wooden stool in a black suit, jacket open, grey studio",
      ro: "Așezat pe un taburet de lemn, în costum negru cu sacoul deschis, studio gri",
    },
  },
  {
    dir: "portfolio", file: "IMG_1619.jpg", width: 1334, height: 2000, lqip: L.IMG_1619,
    alt: {
      en: "Close crop, seated in an open black jacket, forearm on knee, looking into the camera",
      ro: "Cadru strâns, așezat, în sacou negru deschis, cu antebrațul pe genunchi, privind spre cameră",
    },
  },
  {
    dir: "portfolio", file: "IMG_1611.jpg", width: 1600, height: 2000, lqip: L.IMG_1611,
    alt: {
      en: "Leaning on a white wall in a black suit and black-framed glasses, hand at chin",
      ro: "Sprijinit de un perete alb, în costum negru și ochelari cu ramă neagră, cu mâna la bărbie",
    },
  },
  {
    dir: "portfolio", file: "IMG_1604.jpg", width: 1600, height: 2000, lqip: L.IMG_1604,
    alt: {
      en: "Full-length on white, black suit jacket open over bare torso, looking to the side",
      ro: "Corp întreg pe fundal alb, sacou negru deschis peste bustul gol, privind în lateral",
    },
  },
  {
    dir: "portfolio", file: "IMG_1714.jpg", width: 2000, height: 2000, lqip: L.IMG_1714,
    alt: {
      en: "Smiling, beige jacket over a blue shirt, white background",
      ro: "Zâmbind, jachetă bej peste o cămașă albastră, fundal alb",
    },
  },
  {
    dir: "portfolio", file: "IMG_3813.jpg", width: 1802, height: 2400, lqip: L.IMG_3813,
    alt: {
      en: "Beauty close-up holding a clear glass sphere to one eye, red background",
      ro: "Prim-plan beauty, ținând o sferă de sticlă transparentă în dreptul unui ochi, fundal roșu",
    },
  },
  hero,
];

export const polaroids: Photo[] = [
  {
    dir: "polaroids", file: "RBV_4872.jpg", width: 1800, height: 2400, lqip: L.RBV_4872,
    alt: { en: "Digital headshot, white T-shirt, grey backdrop", ro: "Digital: portret, tricou alb, fundal gri" },
  },
  {
    dir: "polaroids", file: "RBV_4860.jpg", width: 1800, height: 2400, lqip: L.RBV_4860,
    alt: { en: "Digital full-length front, white T-shirt and black trousers", ro: "Digital: corp întreg din față, tricou alb și pantaloni negri" },
  },
  {
    dir: "polaroids", file: "RBV_4862.jpg", width: 1800, height: 2400, lqip: L.RBV_4862,
    alt: { en: "Digital profile facing left, white T-shirt", ro: "Digital: profil spre stânga, tricou alb" },
  },
  {
    dir: "polaroids", file: "RBV_4895.jpg", width: 1800, height: 2400, lqip: L.RBV_4895,
    alt: { en: "Digital full-length front, shirtless, black trousers", ro: "Digital: corp întreg din față, fără tricou, pantaloni negri" },
  },
  {
    dir: "polaroids", file: "RBV_4897.jpg", width: 1800, height: 2400, lqip: L.RBV_4897,
    alt: { en: "Digital full-length back view, shirtless", ro: "Digital: corp întreg din spate, fără tricou" },
  },
  {
    dir: "polaroids", file: "RBV_4867.jpg", width: 1800, height: 2400, lqip: L.RBV_4867,
    alt: { en: "Digital full-length profile facing right, white T-shirt", ro: "Digital: corp întreg, profil spre dreapta, tricou alb" },
  },
];

export const src = (p: Photo) => `/${p.dir}/${p.file}`;
