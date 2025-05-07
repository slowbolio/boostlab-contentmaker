#!/bin/bash
# Escape special characters in the replacement string
replacement='<span class="text-green-500 mr-2 text-xl">✓</span>'

# Use sed to perform the replacement
sed -i "s|<svg class=\"h-5 w-5 text-green-500 mr-2\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">.*<path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M5 13l4 4L19 7\"></path>.*</svg>|$replacement|g" /home/kodning/live-project/public/landing.html