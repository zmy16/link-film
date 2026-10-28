import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

const base = (props: IconProps) => ({
  width: props.size ?? 16,
  height: props.size ?? 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const IconSearch = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.2-4.2" />
  </svg>
);

export const IconPlay = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 4.5l12 7.5-12 7.5z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconArrowRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 12h15" />
    <path d="M13.5 6.5L20 12l-6.5 5.5" />
  </svg>
);

export const IconClose = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconGlobe = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17" />
    <path d="M12 3.5c2.4 2.4 3.6 5.3 3.6 8.5S14.4 18.1 12 20.5C9.6 18.1 8.4 15.2 8.4 12S9.6 5.9 12 3.5z" />
  </svg>
);

export const IconGrid = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={1.7}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
  </svg>
);

export const IconPin = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19 10.4c0 4.4-4.7 8.3-6.4 9.5a1 1 0 0 1-1.2 0C9.7 18.7 5 14.8 5 10.4a7 7 0 0 1 14 0z" />
    <circle cx="12" cy="10.2" r="2.6" />
  </svg>
);

export const IconStar = (p: IconProps) => (
  <svg {...base(p)}>
    <path
      d="M12 3.4l2.68 5.43 5.99.87-4.34 4.23 1.03 5.97L12 17.08l-5.36 2.82 1.03-5.97-4.34-4.23 5.99-.87z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

export const IconShuffle = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h3.2l3.1 4.4" />
    <path d="M4 17h3.2l9.3-10H20" />
    <path d="M16.5 4.5L20 7l-3.5 2.5" />
    <path d="M16.5 14.5L20 17l-3.5 2.5" />
    <path d="M13.6 13.2l1.6 1.8h4.8" />
  </svg>
);
