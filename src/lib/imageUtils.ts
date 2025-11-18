/**
 * Utility functions for handling concert images
 * Prioritizes Cloudinary images over imageUrl
 */

export interface ConcertImage {
  url: string;
  publicId?: string;
}

export interface ConcertWithImages {
  images?: ConcertImage[];
  imageUrl?: string | null;
}

/**
 * Get the best available image URL from a concert
 * Priority: images[0].url > imageUrl > fallback
 */
export const getConcertImageUrl = (
  concert: ConcertWithImages | null | undefined,
  fallback: string = "https://via.placeholder.com/800x400?text=No+Image"
): string => {
  if (!concert) return fallback;

  // Priority 1: Use first Cloudinary image if available
  if (concert.images && Array.isArray(concert.images) && concert.images.length > 0) {
    const firstImage = concert.images[0];
    if (firstImage?.url) {
      return firstImage.url;
    }
  }

  // Priority 2: Fallback to imageUrl
  if (concert.imageUrl) {
    return concert.imageUrl;
  }

  // Priority 3: Use fallback
  return fallback;
};

/**
 * Get all image URLs from a concert
 */
export const getAllConcertImages = (concert: ConcertWithImages | null | undefined): string[] => {
  if (!concert) return [];

  const imageUrls: string[] = [];

  // Add Cloudinary images
  if (concert.images && Array.isArray(concert.images)) {
    concert.images.forEach((img) => {
      if (img?.url) {
        imageUrls.push(img.url);
      }
    });
  }

  // Add imageUrl if not already included
  if (concert.imageUrl && !imageUrls.includes(concert.imageUrl)) {
    imageUrls.push(concert.imageUrl);
  }

  return imageUrls;
};

