import { useEffect } from "react";

export function useSectionObserver(
  refs: React.RefObject<HTMLElement | null>[],
  onVisibleIndexChange: (index: number) => void,
  suppress: boolean,
) {
  useEffect(() => {
    if (suppress) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const index = refs.findIndex(
            (ref) => ref.current === visible[0].target,
          );
          if (index !== -1) onVisibleIndexChange(index);
        }
      },
      {
        rootMargin: "0px",
        threshold: [0.25, 0.5, 0.75],
      },
    );

    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [refs, onVisibleIndexChange, suppress]);
}
