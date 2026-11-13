import { useEffect, useState } from 'react';

export default function PryzmBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  return (
    <div className="pryzm-background" aria-hidden="true">
      {!reducedMotion ? (
        <video
          className="hero-background-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          tabIndex={-1}
        >
          <source src={`${./media/hero/web4-background.webm`} type="video/webm" />
        </video>
      ) : null}
      <div className="hero-video-overlay" />
    </div>
  );
}
