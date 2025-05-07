const fs = require('fs');
const { createCanvas } = require('canvas');

// Create canvas
const canvas = createCanvas(800, 600);
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#1A1A1D';
ctx.fillRect(0, 0, 800, 600);

// Sidebar
ctx.fillStyle = '#2D2D30';
ctx.fillRect(0, 0, 200, 600);

// Header
ctx.fillStyle = '#252529';
ctx.fillRect(200, 0, 600, 60);

// Logo area
ctx.fillStyle = '#333336';
ctx.fillRect(20, 20, 160, 40);

// Navigation items
const navItems = ['Dashboard', 'Content', 'Analytics', 'Settings', 'Users'];
navItems.forEach((item, index) => {
    // Nav item background
    ctx.fillStyle = index === 0 ? '#FF6B00' : '#333336';
    ctx.fillRect(20, 100 + (index * 50), 160, 40);
    
    // Nav item text
    ctx.fillStyle = index === 0 ? '#FFFFFF' : '#AAAAAA';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(item, 50, 125 + (index * 50));
});

// Main title
ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 18px Arial';
ctx.textAlign = 'left';
ctx.fillText('BoostLab ContentMaker Dashboard', 220, 35);

// User avatar placeholder
ctx.fillStyle = '#333336';
ctx.beginPath();
ctx.arc(760, 30, 20, 0, 2 * Math.PI);
ctx.fill();

// Content area - Cards
const cards = [
    { title: 'Total Content', value: '256', color: '#4A90E2' },
    { title: 'Published', value: '189', color: '#2ECC71' },
    { title: 'Drafts', value: '67', color: '#FF6B00' },
    { title: 'Engagement', value: '87%', color: '#9B59B6' }
];

cards.forEach((card, index) => {
    const x = 220 + (index % 2) * 280;
    const y = 80 + Math.floor(index / 2) * 120;
    
    // Card background
    ctx.fillStyle = '#252529';
    ctx.fillRect(x, y, 260, 100);
    
    // Card title
    ctx.fillStyle = '#AAAAAA';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(card.title, x + 20, y + 30);
    
    // Card value
    ctx.fillStyle = card.color;
    ctx.font = 'bold 28px Arial';
    ctx.fillText(card.value, x + 20, y + 70);
    
    // Card icon placeholder
    ctx.fillStyle = '#333336';
    ctx.beginPath();
    ctx.arc(x + 220, y + 50, 25, 0, 2 * Math.PI);
    ctx.fill();
});

// Chart area
ctx.fillStyle = '#252529';
ctx.fillRect(220, 320, 560, 260);

// Chart title
ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 16px Arial';
ctx.textAlign = 'left';
ctx.fillText('Content Performance', 240, 350);

// Chart bars
const barData = [65, 85, 40, 90, 35, 60, 75];
const barWidth = 50;
const barSpacing = 30;
const barMaxHeight = 180;
const barStartX = 280;
const barStartY = 530;

barData.forEach((value, index) => {
    const barHeight = (value / 100) * barMaxHeight;
    const x = barStartX + index * (barWidth + barSpacing);
    const y = barStartY - barHeight;
    
    // Gradient for bars
    const gradient = ctx.createLinearGradient(0, y, 0, barStartY);
    gradient.addColorStop(0, '#4A90E2');
    gradient.addColorStop(1, '#FF6B00');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // X-axis labels
    ctx.fillStyle = '#AAAAAA';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Day ${index + 1}`, x + barWidth/2, barStartY + 20);
});

// Y-axis labels
const yLabels = [0, 25, 50, 75, 100];
yLabels.forEach((label, index) => {
    const y = barStartY - (index * barMaxHeight / 4);
    
    // Grid line
    ctx.strokeStyle = '#333336';
    ctx.beginPath();
    ctx.moveTo(240, y);
    ctx.lineTo(760, y);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#AAAAAA';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`${label}%`, 235, y + 5);
});

// Save to file
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('/home/kodning/live-project/public/images/app-dashboard-screenshot.png', buffer);

console.log('Dashboard image created and saved to /home/kodning/live-project/public/images/app-dashboard-screenshot.png');