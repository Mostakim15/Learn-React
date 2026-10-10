import React from "react";

export default function Button({
    children,
    type = "button",
    bgColor = "bg-[#172b3a]",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button
            type={type}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 ${bgColor} ${textColor} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}