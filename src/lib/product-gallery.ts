export const ensureProductGallery = (images: string[]) => {
  const baseImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&h=1100&fit=crop"];

  const gallery = [...baseImages];
  let variantIndex = 0;

  while (gallery.length < 4) {
    const source = baseImages[variantIndex % baseImages.length];
    const separator = source.includes("?") ? "&" : "?";
    gallery.push(`${source}${separator}gallery=${variantIndex + 1}&sig=${variantIndex + 1}`);
    variantIndex += 1;
  }

  return gallery.slice(0, Math.max(4, gallery.length));
};
