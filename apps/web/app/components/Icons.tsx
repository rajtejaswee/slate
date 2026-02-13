export const StrokeWidthIcon = ({ width }: { width: "thin" | "medium" | "thick" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path 
      d="M2 10L18 10" 
      stroke="currentColor" 
      strokeWidth={width === "thin" ? 1 : width === "medium" ? 2 : 4} 
      strokeLinecap="round" 
    />
  </svg>
);

export const StrokeStyleIcon = ({ style }: { style: "solid" | "dashed" | "dotted" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path 
      d="M2 10L18 10" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeDasharray={style === "dashed" ? "4 4" : style === "dotted" ? "1 3" : "none"}
    />
  </svg>
);