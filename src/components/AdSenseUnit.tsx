import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export type AdSlotType = 'top' | 'middle' | 'in-article-2' | 'bottom';

interface AdSenseUnitProps {
  slotType: AdSlotType;
  postId?: string | number;
  className?: string;
}

const SLOT_CONFIG: Record<
  AdSlotType,
  {
    slotId: string;
    format?: string;
    fullWidthResponsive?: boolean;
    fixedWidth?: string;
    fixedHeight?: string;
    minHeightClass: string;
    containerMarginClass: string;
  }
> = {
  // 1. أول مقال (طويلي العنكبوت) - slot 6095642195
  top: {
    slotId: '6095642195',
    format: 'auto',
    fullWidthResponsive: true,
    minHeightClass: 'min-h-[90px] sm:min-h-[100px]',
    containerMarginClass: 'my-5',
  },
  // 2. إعلان وسط المقال - slot 3369992389 (autorelaxed)
  middle: {
    slotId: '3369992389',
    format: 'autorelaxed',
    minHeightClass: 'min-h-[120px]',
    containerMarginClass: 'my-7',
  },
  'in-article-2': {
    slotId: '3369992389',
    format: 'autorelaxed',
    minHeightClass: 'min-h-[120px]',
    containerMarginClass: 'my-7',
  },
  // 3. آخر مقال (حجم الإعلان على بركه الله 970x250) - slot 6998068287
  bottom: {
    slotId: '6998068287',
    fixedWidth: '970px',
    fixedHeight: '250px',
    minHeightClass: 'min-h-[100px] sm:min-h-[250px]',
    containerMarginClass: 'my-8',
  },
};

export const AdSenseUnit: React.FC<AdSenseUnitProps> = ({
  slotType,
  postId,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const adRef = useRef<HTMLModElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(slotType === 'top');
  const [adPushed, setAdPushed] = useState<boolean>(false);

  // 1. Measure containerWidth on mount and whenever postId or slotType changes, and track resize
  useEffect(() => {
    setAdPushed(false);
    setIsVisible(slotType === 'top');

    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        if (w > 0) {
          setContainerWidth(w);
        }
      }
    };

    updateWidth();
    const rafId = requestAnimationFrame(updateWidth);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateWidth();
      });
      resizeObserver.observe(containerRef.current);
    } else if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateWidth);
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateWidth);
      }
    };
  }, [postId, slotType]);

  // Determine whether bottom slot uses fixed 970x250 or responsive auto mode
  const isFixedBottom = slotType === 'bottom' && containerWidth >= 986;
  const insKey: 'fixed' | 'responsive' = isFixedBottom ? 'fixed' : 'responsive';

  // Reset adPushed if insKey changes between 'fixed' and 'responsive'
  useEffect(() => {
    setAdPushed(false);
  }, [insKey]);

  // Lazy-observe offscreen ad slots using IntersectionObserver
  useEffect(() => {
    if (isVisible) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          if (containerRef.current && containerRef.current.clientWidth > 0) {
            setContainerWidth(containerRef.current.clientWidth);
          }
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, postId, slotType]);

  // 2 & 5. Only push ad after containerWidth > 0, isVisible is true, and data-adsbygoogle-status is not set
  useEffect(() => {
    if (!isVisible || containerWidth <= 0 || adPushed) return;

    const timer = setTimeout(() => {
      try {
        if (
          typeof window !== 'undefined' &&
          adRef.current &&
          containerRef.current &&
          containerRef.current.clientWidth > 0
        ) {
          const status = adRef.current.getAttribute('data-adsbygoogle-status');
          if (!status) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setAdPushed(true);
          }
        }
      } catch (err) {
        console.debug('AdSense notice:', err);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [isVisible, containerWidth, adPushed, slotType, postId, insKey]);

  const cfg = SLOT_CONFIG[slotType];

  // 3. Bottom ad (6998068287): fixed 970x250 only if containerWidth >= 986, otherwise responsive auto 100%
  const insStyle: React.CSSProperties = isFixedBottom
    ? {
        display: 'inline-block',
        width: '970px',
        height: '250px',
      }
    : {
        display: 'block',
        width: '100%',
      };

  const adFormat =
    slotType === 'bottom'
      ? isFixedBottom
        ? undefined
        : 'auto'
      : cfg.format;

  const fullWidthResponsive =
    slotType === 'bottom'
      ? isFixedBottom
        ? undefined
        : 'true'
      : cfg.fullWidthResponsive
      ? 'true'
      : undefined;

  return (
    <aside
      ref={containerRef}
      aria-label="إعلان"
      className={`ads-container ads-container-${slotType} w-full ${cfg.containerMarginClass} text-center select-none ${className}`}
    >
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <span className="h-px w-8 bg-gray-200 dark:bg-[#2f366b]" />
        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 tracking-wide">
          إعلان
        </span>
        <span className="h-px w-8 bg-gray-200 dark:bg-[#2f366b]" />
      </div>

      <div
        className={`${cfg.minHeightClass} w-full flex items-center justify-center rounded-xl bg-gray-50/50 dark:bg-[#1a1e3b]/35 border border-dashed border-gray-200/80 dark:border-[#2f366b]/60 px-2 py-1.5 transition-colors`}
      >
        {isVisible && containerWidth > 0 && (
          <ins
            key={insKey}
            ref={adRef}
            className="adsbygoogle"
            style={insStyle}
            data-ad-client="ca-pub-4007921870267373"
            data-ad-slot={cfg.slotId}
            {...(adFormat ? { 'data-ad-format': adFormat } : {})}
            {...(fullWidthResponsive
              ? { 'data-full-width-responsive': fullWidthResponsive }
              : {})}
          />
        )}
      </div>
    </aside>
  );
};
