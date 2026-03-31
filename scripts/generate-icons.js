// Simple script to generate PWA icons
// Run with: node scripts/generate-icons.js

const fs = require('fs')
const path = require('path')

const sizes = [72, 96, 128, 144, 150, 152, 192, 310, 384, 512]
const iconsDir = path.join(__dirname, '../public/icons')

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

// SVG icon template
const generateSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#E65100" rx="${size * 0.2}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.5}" font-weight="bold" fill="white" text-anchor="middle" dy="${size * 0.15}">T</text>
</svg>
`

// Generate SVG icons
sizes.forEach((size) => {
  const svg = generateSVG(size)
  const filename = path.join(iconsDir, `icon-${size}x${size}.png`)

  // Note: This creates SVG files. For production, you'd want to convert to PNG.
  // For now, we'll save as SVG with .png extension (browsers will handle it)
  // or you can use a proper icon generation tool.

  fs.writeFileSync(
    path.join(iconsDir, `icon-${size}x${size}.svg`),
    svg.trim()
  )

  console.log(`Generated icon-${size}x${size}.svg`)
})

// Generate favicon
const faviconSVG = `
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#E65100" rx="6"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle" dy="7">T</text>
</svg>
`

fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), faviconSVG.trim())

// Generate apple touch icon
const appleTouchIcon = `
<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" fill="#E65100" rx="40"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="100" font-weight="bold" fill="white" text-anchor="middle" dy="35">T</text>
</svg>
`

fs.writeFileSync(
  path.join(__dirname, '../public/apple-touch-icon.svg'),
  appleTouchIcon.trim()
)

console.log('Icons generated successfully!')
console.log('Note: SVG files were created. For production, convert them to PNG using a tool like sharp or an online converter.')
