'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends ImageProps {
  fallbackSrc?: string;
}

export default function SafeImage({ fallbackSrc = 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?q=80&w=1600&auto=format&fit=crop', src, alt, ...rest }: SafeImageProps) {
  const [error, setError] = useState(false);

  return (
    <Image
      src={error ? fallbackSrc : src}
      alt={alt || ''}
      onError={() => setError(true)}
      {...rest}
    />
  );
}
