const IMAGE_MAP: { keywords: string[]; path: string }[] = [
  {
    keywords: ["pikachu"],
    path: "/assets/generated/pokemon-pikachu-gold.dim_400x560.jpg",
  },
  {
    keywords: ["charizard"],
    path: "/assets/generated/pokemon-charizard-gold.dim_400x560.jpg",
  },
  {
    keywords: ["mewtwo"],
    path: "/assets/generated/pokemon-mewtwo-gold.dim_400x560.jpg",
  },
  {
    keywords: ["eevee"],
    path: "/assets/generated/pokemon-eevee-gold.dim_400x560.jpg",
  },
  {
    keywords: ["naruto uzumaki", "naruto"],
    path: "/assets/generated/naruto-uzumaki-gold.dim_400x560.jpg",
  },
  {
    keywords: ["sasuke uchiha", "sasuke"],
    path: "/assets/generated/naruto-sasuke-gold.dim_400x560.jpg",
  },
  {
    keywords: ["itachi uchiha", "itachi"],
    path: "/assets/generated/naruto-itachi-gold.dim_400x560.jpg",
  },
  {
    keywords: ["kakashi hatake", "kakashi"],
    path: "/assets/generated/naruto-kakashi-gold.dim_400x560.jpg",
  },
];

export function getProductImage(name: string): string {
  const lower = name.toLowerCase();
  for (const entry of IMAGE_MAP) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) return entry.path;
    }
  }
  return "/assets/generated/pokemon-charizard-gold.dim_400x560.jpg";
}
