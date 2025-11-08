# Image Optimization Guidelines

## Overview
This document outlines best practices for image optimization in the expense tracker application to ensure optimal performance.

## Image Format Recommendations

### Use WebP Format
- **Primary format**: WebP provides superior compression compared to JPEG/PNG
- **Browser support**: All modern browsers support WebP
- **Fallback**: Provide JPEG/PNG fallback for older browsers

### Format Selection Guide
- **Photos/Complex images**: Use WebP (or JPEG as fallback)
- **Icons/Simple graphics**: Use SVG (vector format, scales perfectly)
- **Transparency needed**: Use WebP with alpha channel (or PNG as fallback)
- **Animations**: Use WebP animated (or GIF as fallback)

## Implementation Examples

### Using Picture Element with Fallback
```jsx
<picture>
  <source srcSet="/images/photo.webp" type="image/webp" />
  <source srcSet="/images/photo.jpg" type="image/jpeg" />
  <img src="/images/photo.jpg" alt="Description" loading="lazy" />
</picture>
```

### Lazy Loading Images
```jsx
<img 
  src="/images/photo.webp" 
  alt="Description" 
  loading="lazy"
  decoding="async"
/>
```

## Optimization Tools

### Online Tools
- **Squoosh**: https://squoosh.app/ (Google's image compression tool)
- **TinyPNG**: https://tinypng.com/ (PNG/JPEG compression)
- **SVGOMG**: https://jakearchibald.github.io/svgomg/ (SVG optimization)

### CLI Tools
```bash
# Install imagemin for automated optimization
npm install --save-dev imagemin imagemin-webp imagemin-mozjpeg imagemin-pngquant

# Convert images to WebP
npx imagemin src/assets/*.{jpg,png} --out-dir=src/assets --plugin=webp
```

## Size Guidelines
- **Thumbnails**: < 50KB
- **Regular images**: < 200KB
- **Hero images**: < 500KB
- **Icons**: Use SVG (typically < 5KB)

## Current Implementation
- All icons use SVG format (optimal)
- Receipt uploads are stored in Firebase Storage
- No large images in the application bundle

## Future Considerations
- If adding user avatars, implement image resizing on upload
- Consider using a CDN for image delivery
- Implement responsive images with srcset for different screen sizes
