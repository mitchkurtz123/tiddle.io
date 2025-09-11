import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface TikTokIconProps {
  size?: number;
  color?: string;
}

export default function TikTokIcon({ size = 14, color = '#000000' }: TikTokIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.89 2.89 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.36 0 .71.07 1.02.2V9.53a6.33 6.33 0 00-1.02-.08A6.34 6.34 0 002.14 15.89 6.34 6.34 0 008.48 22.23a6.34 6.34 0 006.34-6.34V9.59a8.28 8.28 0 004.77 1.49v-3.4a4.84 4.84 0 01-.01-1z"
        fill={color}
      />
    </Svg>
  );
}