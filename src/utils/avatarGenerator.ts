/**
 * Local Avatar Generator Utility
 * 
 * Generates SVG avatars locally to avoid external dependencies and CSP issues.
 * This provides a fallback for ui-avatars.com and ensures avatars work in all environments.
 */

/**
 * Generate a consistent color from a string (name)
 */
function stringToColor(str: string): string {
  const colors = [
    '#a855f7', // Bright purple
    '#8b5cf6', // Purple
    '#c084fc', // Light lavender
    '#d8b4fe', // Pale purple
    '#9333ea', // Rich purple
    '#7c3aed', // Deep purple
    '#e9d5ff', // Very light purple
    '#f3e8ff', // Lightest purple
    '#6b21a8', // Dark purple
    '#581c87', // Darkest purple
    '#4c1d95', // Very dark purple
    '#3b0764', // Deepest purple
    '#2e1065', // Ultra dark purple
    '#5b4b8a', // Medium purple
    '#4c3d7a', // Dark medium purple
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex] || '#a855f7';
}

/**
 * Get initials from a name
 */
function getInitials(name: string): string {
  if (!name) return '?';
  
  const words = name.trim().split(/\s+/).filter(word => word.length > 0);
  if (words.length === 0) return '?';
  if (words.length === 1) {
    return words[0]!.charAt(0).toUpperCase();
  }
  
  const firstWord = words[0]!;
  const lastWord = words[words.length - 1]!;
  return (firstWord.charAt(0) + lastWord.charAt(0)).toUpperCase();
}

/**
 * Generate SVG avatar as data URL
 */
export function generateLocalAvatar(name: string, size: number = 32): string {
  const initials = getInitials(name);
  const backgroundColor = stringToColor(name);
  const textColor = '#ffffff';
  
  // Calculate font size based on avatar size
  const fontSize = Math.round(size * 0.4);
  
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${backgroundColor}" rx="${size * 0.1}"/>
      <text 
        x="50%" 
        y="50%" 
        text-anchor="middle" 
        dominant-baseline="central"
        fill="${textColor}" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="${fontSize}px" 
        font-weight="600"
      >
        ${initials}
      </text>
    </svg>
  `.trim();
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Generate avatar URL with fallback support
 * Uses ui-avatars.com as primary, local generation as fallback
 */
export function getAvatarUrl(name: string, size: number = 32, options: {
  useLocal?: boolean;
  backgroundColor?: string;
} = {}): string {
  // If explicitly requesting local avatar or no name provided
  if (options.useLocal || !name) {
    return generateLocalAvatar(name, size);
  }
  
  // Use ui-avatars.com as primary option
  const backgroundColor = options.backgroundColor || stringToColor(name).replace('#', '');
  const encodedName = encodeURIComponent(name);
  
  return `https://ui-avatars.com/api/?name=${encodedName}&size=${size}&background=${backgroundColor}&color=ffffff&bold=true&format=png`;
}

/**
 * Avatar component props for React usage
 */
export interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
  useLocal?: boolean;
  onError?: () => void;
}

/**
 * Create an img element with automatic fallback
 */
export function createAvatarElement(props: AvatarProps): HTMLImageElement {
  const { name, size = 32, className = '', useLocal = false, onError } = props;
  
  const img = document.createElement('img');
  img.className = className;
  img.alt = `${name} profile picture`;
  img.loading = 'lazy';
  
  // Set initial source
  img.src = getAvatarUrl(name, size, { useLocal });
  
  // Add error handling for external avatars
  if (!useLocal) {
    img.onerror = () => {
      // Fallback to local avatar on error
      img.src = generateLocalAvatar(name, size);
      if (onError) onError();
    };
  }
  
  return img;
}

/**
 * Simple avatar state management for vanilla JS/TS
 * For React usage, implement as a custom hook in your component
 */
export function createAvatarState(name: string, size: number = 32, preferLocal: boolean = false) {
  let currentUrl = getAvatarUrl(name, size, { useLocal: preferLocal });
  let hasError = false;
  
  const handleError = () => {
    if (!hasError) {
      hasError = true;
      currentUrl = generateLocalAvatar(name, size);
    }
  };
  
  return {
    getCurrentUrl: () => currentUrl,
    handleError,
    hasError: () => hasError
  };
}
