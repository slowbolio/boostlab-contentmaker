import fs from 'fs';

// Läs in den befintliga HTML-filen
const htmlPath = '/home/kodning/live-project/public/landing.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// Ersätt SVG checkmarks med unicode checkmarks
const svgCheckPattern = /<svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http:\/\/www.w3.org\/2000\/svg">[\s\S]*?<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"><\/path>[\s\S]*?<\/svg>/g;
const unicodeCheckmark = '<span class="text-green-500 mr-2 text-xl">✓</span>';

// Gör ersättningen
const updatedHTML = html.replace(svgCheckPattern, unicodeCheckmark);

// Spara den uppdaterade filen
fs.writeFileSync(htmlPath, updatedHTML);

console.log('Checkmarks ersatta med Unicode-tecken');