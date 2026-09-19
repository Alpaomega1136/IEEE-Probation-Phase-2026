"use client";

import { useState } from "react";
import Image from "next/image";

export function EventImage({
  src,
  alt,
  priority = false,
  className = "",
}: {
  src?: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`event-image ${className}`}>
      <Image
        src={failed || !src ? "/images/conference.jpg" : src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
        unoptimized
        priority={priority}
        onError={() => setFailed(true)}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
