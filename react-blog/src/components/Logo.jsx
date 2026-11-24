import React from "react";

/**
 * LetterformLogo - An Amazon-inspired wordmark & mark logo
 * Featuring "The Letterform" with an elegant curved smile/arrow under "Letterform"
 * tying together literature/letters and progressive thought, rendered in the site's
 * signature Deep Navy (#172b3a) and Warm Copper (#b77945).
 */
export function LetterformIcon({ className = "h-8 w-8", ...props }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Background soft circle or tile */}
      <rect width="40" height="40" rx="10" fill="#172b3a" />
      {/* Monogram 'L' with Amazon-style curved dynamic smile/arrow */}
      <path
        d="M14 10V26H26"
        stroke="#ffffff"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Amazon-style smile arrow connecting the journey */}
      <path
        d="M12 28.5C16 31 22 31 27 28"
        stroke="#b77945"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M26 26.5L28.5 28.2L26.5 30.5"
        stroke="#b77945"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LetterformLogo({
  variant = "full", // "full" | "icon" | "wordmark"
  className = "",
  textColor = "#172b3a",
  accentColor = "#b77945",
  width,
}) {
  if (variant === "icon") {
    return <LetterformIcon className={className || "h-9 w-9"} />;
  }

  return (
    <div
      className={`inline-flex items-center gap-2 select-none ${className}`}
      style={width ? { width } : undefined}
    >
      <svg
        viewBox="0 0 230 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-9 w-auto max-w-full"
      >
        {/* "The" subtle editorial prefix */}
        <text
          x="4"
          y="15"
          fill={accentColor}
          fontFamily="ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"
          fontSize="11"
          fontWeight="700"
          letterSpacing="0.12em"
          textTransform="uppercase"
        >
          The
        </text>

        {/* "Letterform" main wordmark */}
        <text
          x="3"
          y="34"
          fill={textColor}
          fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontSize="23"
          fontWeight="800"
          letterSpacing="-0.03em"
        >
          Letterform
        </text>

        {/* Amazon-style swoosh / smile arrow from the first 'e' in Letter to the 'm' at the end */}
        {/* Curve goes from ~x=20 to ~x=136 */}
        <path
          d="M 22 39 C 55 45, 100 45, 134 38.5"
          stroke={accentColor}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Dynamic arrowhead like the Amazon smile */}
        <path
          d="M 132 35.5 L 138 38 L 133 42"
          fill={accentColor}
          stroke={accentColor}
          strokeWidth="1.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dot on the 'i' or editorial sparkle / dot accent */}
        <circle cx="140" cy="32" r="2.2" fill={accentColor} />
      </svg>
    </div>
  );
}
