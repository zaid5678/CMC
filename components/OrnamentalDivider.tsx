export default function OrnamentalDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center my-8 ${className}`} aria-hidden="true" role="presentation">
      <div className="flex-1 h-px" style={{ background: 'rgba(201,168,76,0.5)' }} />
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-4 flex-shrink-0"
      >
        <path
          d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"
          fill="#C9A84C"
          opacity="0.8"
        />
        <path
          d="M12 6 L13.2 10.8 L18 12 L13.2 13.2 L12 18 L10.8 13.2 L6 12 L10.8 10.8 Z"
          fill="#E8C97A"
          opacity="0.6"
        />
      </svg>
      <div className="flex-1 h-px" style={{ background: 'rgba(201,168,76,0.5)' }} />
    </div>
  );
}
