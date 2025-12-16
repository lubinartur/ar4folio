import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}

/**
 * OptimizedImage component with WebP/AVIF support and responsive srcset
 * Improves LCP and reduces bandwidth on mobile
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
  aspectRatio,
  objectFit = 'cover',
  loading,
  fetchPriority,
}) => {
  // Extract base path and extension
  const basePath = src.replace(/\.[^/.]+$/, '');
  const extension = src.split('.').pop()?.toLowerCase() || 'jpg';
  
  // Determine loading strategy
  const loadingAttr = loading || (priority ? 'eager' : 'lazy');
  const fetchPriorityAttr = fetchPriority || (priority ? 'high' : 'auto');
  
  // For hero/priority images, use eager loading
  const isPriority = priority || loadingAttr === 'eager';
  
  // Generate srcset for different formats and sizes
  // Note: In production, you'd want to generate these variants at build time
  // For now, we'll use the original image with proper sizes attribute
  const srcSet = `${src} 1x`;
  
  const style: React.CSSProperties = {
    objectFit,
    ...(aspectRatio && { aspectRatio }),
  };

  return (
    <picture>
      {/* AVIF format (best compression) */}
      <source
        srcSet={`${basePath}.avif`}
        type="image/avif"
        sizes={sizes}
      />
      {/* WebP format (good compression, wider support) */}
      <source
        srcSet={`${basePath}.webp`}
        type="image/webp"
        sizes={sizes}
      />
      {/* Fallback to original */}
      <img
        src={src}
        srcSet={srcSet}
        alt={alt}
        className={className}
        loading={loadingAttr}
        fetchPriority={fetchPriorityAttr}
        decoding={isPriority ? 'sync' : 'async'}
        sizes={sizes}
        style={style}
        width="100%"
        height="auto"
      />
    </picture>
  );
};
