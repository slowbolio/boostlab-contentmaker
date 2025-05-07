import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

// Create canvas
const width = 800;
const height = 600;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#1A1A1D';
ctx.fillRect(0, 0, width, height);

// Header
ctx.fillStyle = '#121214';
ctx.fillRect(0, 0, width, 60);
ctx.strokeStyle = '#343A40';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(0, 60);
ctx.lineTo(width, 60);
ctx.stroke();

// Logo
ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 20px Arial';
ctx.fillText('BoostLab', 20, 35);
ctx.fillStyle = '#FF6B00';
ctx.fillText('ContentMaker', 110, 35);

// Sidebar
ctx.fillStyle = '#121214';
ctx.fillRect(0, 60, 220, height - 60);
ctx.strokeStyle = '#343A40';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(220, 60);
ctx.lineTo(220, height);
ctx.stroke();

// Active sidebar item
ctx.fillStyle = 'rgba(255, 107, 0, 0.1)';
ctx.fillRect(0, 100, 220, 40);
ctx.fillStyle = '#FF6B00';
ctx.fillRect(0, 100, 3, 40);
ctx.fillStyle = '#FF6B00';
ctx.font = '14px Arial';
ctx.fillText('Dashboard', 20, 125);

// Sidebar items
ctx.fillStyle = '#A0AEC0';
ctx.font = '14px Arial';
ctx.fillText('Projekt', 20, 165);
ctx.fillText('Mallar', 20, 205);
ctx.fillText('Skapa innehåll', 20, 245);
ctx.fillText('Inställningar', 20, 285);
ctx.fillText('Hjälp', 20, 325);

// Main content
ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 24px Arial';
ctx.fillText('Välkommen tillbaka, Anna!', 240, 100);

ctx.fillStyle = '#A0AEC0';
ctx.font = '14px Arial';
ctx.fillText('Här är en överblick över dina innehållsprojekt', 240, 120);

// Cards
function drawCard(x, y, title, stat, desc) {
  // Card background
  ctx.fillStyle = '#202024';
  ctx.fillRect(x, y, 240, 120);
  ctx.strokeStyle = '#343A40';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, 240, 120);
  
  // Card title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px Arial';
  ctx.fillText(title, x + 15, y + 25);
  
  // Card stat
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px Arial';
  ctx.fillText(stat, x + 15, y + 65);
  
  // Card description
  ctx.fillStyle = '#A0AEC0';
  ctx.font = '13px Arial';
  ctx.fillText(desc, x + 15, y + 90);
}

drawCard(240, 140, 'Aktiva projekt', '8', 'Pågående innehållsprojekt');
drawCard(500, 140, 'Sparade mallar', '12', 'Anpassade innehållsmallar');
drawCard(240, 280, 'Genererade prompter', '47', 'Denna månad');

// Projects list
ctx.fillStyle = '#202024';
ctx.fillRect(500, 280, 280, 300);
ctx.strokeStyle = '#343A40';
ctx.lineWidth = 1;
ctx.strokeRect(500, 280, 280, 300);

// Projects header
ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
ctx.fillRect(500, 280, 280, 50);
ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 16px Arial';
ctx.fillText('Senaste innehållsprojekt', 515, 310);

// Create button
const btnX = 650;
const btnY = 295;
const btnWidth = 120;
const btnHeight = 30;
const btnRadius = 4;

// Create gradient
const gradient = ctx.createLinearGradient(btnX, btnY, btnX + btnWidth, btnY);
gradient.addColorStop(0, '#FF6B00');
gradient.addColorStop(1, '#FF9900');

// Draw button with rounded corners
ctx.fillStyle = gradient;
ctx.beginPath();
ctx.moveTo(btnX + btnRadius, btnY);
ctx.lineTo(btnX + btnWidth - btnRadius, btnY);
ctx.quadraticCurveTo(btnX + btnWidth, btnY, btnX + btnWidth, btnY + btnRadius);
ctx.lineTo(btnX + btnWidth, btnY + btnHeight - btnRadius);
ctx.quadraticCurveTo(btnX + btnWidth, btnY + btnHeight, btnX + btnWidth - btnRadius, btnY + btnHeight);
ctx.lineTo(btnX + btnRadius, btnY + btnHeight);
ctx.quadraticCurveTo(btnX, btnY + btnHeight, btnX, btnY + btnHeight - btnRadius);
ctx.lineTo(btnX, btnY + btnRadius);
ctx.quadraticCurveTo(btnX, btnY, btnX + btnRadius, btnY);
ctx.closePath();
ctx.fill();

ctx.fillStyle = '#FFFFFF';
ctx.font = '14px Arial';
ctx.fillText('Skapa nytt', 670, 315);

// Project items
function drawProjectItem(y, name, date) {
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '14px Arial';
  ctx.fillText(name, 515, y);
  
  ctx.fillStyle = '#A0AEC0';
  ctx.font = '13px Arial';
  ctx.fillText(date, 690, y);
  
  // Divider
  ctx.strokeStyle = '#343A40';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(500, y + 15);
  ctx.lineTo(780, y + 15);
  ctx.stroke();
}

drawProjectItem(350, 'Instagram kampanj', 'Igår, 15:32');
drawProjectItem(390, 'Facebook - Produkt', '2 dagar sedan');
drawProjectItem(430, 'LinkedIn - Företag', '5 dagar sedan');
drawProjectItem(470, 'Nyhetsbrev - Maj', '1 vecka sedan');

// Save image
const buffer = canvas.toBuffer('image/png');
const outputPath = path.resolve('/home/kodning/live-project/public/images/app-dashboard-screenshot.png');
fs.writeFileSync(outputPath, buffer);

console.log(`Screenshot saved to ${outputPath}`);