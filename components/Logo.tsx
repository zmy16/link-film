export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="gh-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE566" />
          <stop offset="55%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#C9A900" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#gh-gold)" />
      <rect x="9" y="21" width="30" height="17" rx="2" fill="#08080A" />
      <path d="M8 14.5 L39.5 10.5 L41 18 L9.5 22 Z" fill="#08080A" />
      <path d="M15.5 13.6 L19 20 L24.5 19.3 L21 12.9 Z" fill="#FFD700" />
      <path d="M27 12.1 L30.5 18.5 L36 17.8 L32.5 11.4 Z" fill="#FFD700" />
    </svg>
  );
}
