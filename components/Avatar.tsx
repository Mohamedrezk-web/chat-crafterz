import React from 'react';
import Image from 'next/image';
import { createAvatar } from '@dicebear/core';
import {
  bottts,
  botttsNeutral,
  funEmoji,
  personas,
  rings,
  shapes,
} from '@dicebear/collection';

function Avatar({ seed, className }: { seed: string; className?: string }) {
  const avatar = createAvatar(personas, {
    seed,
  });
  const svg = avatar.toString();

  const imageUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString(
    'base64'
  )}`;
  return (
    <Image
      src={imageUrl}
      alt='avatar'
      width={50}
      height={50}
      className={className}
    />
  );
}

export default Avatar;
