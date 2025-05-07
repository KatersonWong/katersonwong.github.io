var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var canvas;
var context;
var stars = [];
var connections = [];

// Configuration
var STAR_COUNT = 100;
var MAX_CONNECTION_DISTANCE = 150;
var MIN_CONNECTION_DISTANCE = 50;
var MAX_CONNECTIONS_PER_STAR = 3;

init();

function init() {
    canvas = document.getElementById('world');
    
    if (canvas && canvas.getContext) {
        context = canvas.getContext('2d');
        
        // Register event listeners
        window.addEventListener('resize', windowResizeHandler, false);
        
        createStars();
        createConnections();
        
        windowResizeHandler();
        
        setInterval(loop, 1000 / 60);
    }
}

function createStars() {
    stars = [];
    
    for (var i = 0; i < STAR_COUNT; i++) {
        var star = {
            x: Math.random() * SCREEN_WIDTH,
            y: Math.random() * SCREEN_HEIGHT,
            size: Math.random() * 2 + 1,
            brightness: Math.random() * 0.5 + 0.5,
            twinkleSpeed: 0.02 + Math.random() * 0.03,
            twinklePhase: Math.random() * Math.PI * 2,
            color: getStarColor()
        };
        stars.push(star);
    }
}

function createConnections() {
    connections = [];
    
    // Create connections between stars
    for (let i = 0; i < stars.length; i++) {
        const star1 = stars[i];
        let connectionCount = 0;
        
        // Find nearest stars within range
        const nearbyStars = stars
            .map((star2, index) => ({
                star: star2,
                index: index,
                distance: getDistance(star1, star2)
            }))
            .filter(item => 
                item.distance >= MIN_CONNECTION_DISTANCE && 
                item.distance <= MAX_CONNECTION_DISTANCE &&
                item.index !== i
            )
            .sort((a, b) => a.distance - b.distance);
        
        // Connect to nearest stars up to MAX_CONNECTIONS_PER_STAR
        for (let j = 0; j < Math.min(nearbyStars.length, MAX_CONNECTIONS_PER_STAR); j++) {
            connections.push({
                from: i,
                to: nearbyStars[j].index,
                opacity: 0.3 + Math.random() * 0.2
            });
        }
    }
}

function getDistance(star1, star2) {
    const dx = star1.x - star2.x;
    const dy = star1.y - star2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function getStarColor() {
    const colors = [
        '#FFFFFF', // Pure white
        '#E6F3FF', // Light blue-white
        '#CCE6FF', // Blue-white
        '#FFE6CC', // Warm white
        '#FFCCE6'  // Pink-white
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function windowResizeHandler() {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.zIndex = '-1';
}

function loop() {
    // Clear canvas with a dark background
    context.fillStyle = 'rgba(5, 10, 20, 0.1)';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    
    // Draw connections first (so they appear behind stars)
    connections.forEach(connection => {
        const star1 = stars[connection.from];
        const star2 = stars[connection.to];
        
        // Update connection opacity based on star brightness
        const avgBrightness = (star1.brightness + star2.brightness) / 2;
        
        context.beginPath();
        context.strokeStyle = `rgba(255, 255, 255, ${connection.opacity * avgBrightness})`;
        context.lineWidth = 0.5;
        context.moveTo(star1.x, star1.y);
        context.lineTo(star2.x, star2.y);
        context.stroke();
    });
    
    // Draw stars
    stars.forEach(star => {
        // Update twinkle effect
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = (Math.sin(star.twinklePhase) + 1) * 0.5;
        const currentBrightness = star.brightness * (0.5 + twinkle * 0.5);
        
        // Draw star glow
        const gradient = context.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 2
        );
        gradient.addColorStop(0, star.color.replace(')', `, ${currentBrightness})`).replace('rgb', 'rgba'));
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        context.beginPath();
        context.fillStyle = gradient;
        context.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        context.fill();
        
        // Draw star core
        context.beginPath();
        context.fillStyle = star.color.replace(')', `, ${currentBrightness})`).replace('rgb', 'rgba');
        context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        context.fill();
    });
    
    // Occasionally update connections to create a dynamic effect
    if (Math.random() < 0.01) { // 1% chance each frame
        createConnections();
    }
} 