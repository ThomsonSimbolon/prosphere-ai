import React from 'react';

interface IconProps {
  name: string;
  size?: number | string;
  fill?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size,
  fill = false,
  className = '',
  style = {},
}) => {
  const customStyle: React.CSSProperties = {
    ...style,
    ...(size ? { fontSize: typeof size === 'number' ? `${size}px` : size } : {}),
    ...(fill ? { fontVariationSettings: "'FILL' 1" } : {}),
  };

  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={customStyle}
    >
      {name}
    </span>
  );
};
