export const placeholderImageFromSeed = (seed: string, width = 1200, height = 900) => {
  const safeSeed = seed.trim() ? seed.trim() : "rellia"
  return `https://picsum.photos/seed/${encodeURIComponent(safeSeed)}/${width}/${height}`
}

