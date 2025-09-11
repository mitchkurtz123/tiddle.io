import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface TwitterIconProps {
  size?: number;
  color?: string;
}

export default function TwitterIcon({ size = 14, color = '#000000' }: TwitterIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* X (Twitter) Logo */}
      <Path
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z"
        fill={color}
      />
    </Svg>
  );
}