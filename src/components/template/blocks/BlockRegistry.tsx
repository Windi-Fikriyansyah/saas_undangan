import dynamic from 'next/dynamic';

export const blockRegistry: Record<string, React.ComponentType<any>> = {
  cover: dynamic(() => import('./CoverBlock')),
  home: dynamic(() => import('./HomeBlock')),
  couple: dynamic(() => import('./CoupleBlock')),
  event: dynamic(() => import('./EventBlock')),
  gallery: dynamic(() => import('./GalleryBlock')),
  rsvp: dynamic(() => import('./RsvpBlock')),
  gift: dynamic(() => import('./GiftBlock')),
  souvenir: dynamic(() => import('./SouvenirBlock')),
  closing: dynamic(() => import('./ClosingBlock')),
};
