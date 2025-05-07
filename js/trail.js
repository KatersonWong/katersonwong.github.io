	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;
	
	var RADIUS = 250;

	var RADIUS_SCALE = 1;
	var RADIUS_SCALE_MIN = 1;
	var RADIUS_SCALE_MAX = 2.5;
	
	// The number of particles that are used to generate the trail
	var QUANTITY = 30;
	// Number of background stars
	var STAR_QUANTITY = 50;

	var canvas;
	var context;
	var particles;
	
	var backgroundStars;
	
	var mouseX = (window.innerWidth - SCREEN_WIDTH);
	var mouseY = (window.innerHeight - SCREEN_HEIGHT);
	var mouseIsDown = false;
	
	init();

	function init() {

		canvas = document.getElementById( 'world' );
		
		if (canvas && canvas.getContext) {
			context = canvas.getContext('2d');
			
			// Register event listeners
			document.addEventListener('mousemove', documentMouseMoveHandler, false);
			document.addEventListener('mousedown', documentMouseDownHandler, false);
			document.addEventListener('mouseup', documentMouseUpHandler, false);
			canvas.addEventListener('touchstart', canvasTouchStartHandler, false);
			canvas.addEventListener('touchmove', canvasTouchMoveHandler, false);
			window.addEventListener('resize', windowResizeHandler, false);
			
			createParticles();
			createBackgroundStars();
			
			windowResizeHandler();
			
			setInterval( loop, 1000 / 60 );
		}
	}

	function createParticles() {
		particles = [];
		
		for (var i = 0; i < QUANTITY; i++) {
			var particle = {
				position: { x: mouseX, y: mouseY },
				shift: { x: mouseX, y: mouseY },
				size: 1,
				angle: 0,
				speed: 0.01+Math.random()*0.04,
				targetSize: 1,
				fillColor: '#' + (Math.random() * 0x808080 + 0x808080 | 0).toString(16).padStart(6, '0'),
				//fillColor: '#' + Array.from({length:3}, () => (Math.random() * 0x55 + 0xaa | 0).toString(16).padStart(2, '0')).join('')
				orbit: RADIUS*.5 + (RADIUS * .5 * Math.random())
			};
			
			particles.push( particle );
		}
	}

	function createBackgroundStars() {
		backgroundStars = [];
		
		for (var i = 0; i < STAR_QUANTITY; i++) {
			var star = {
				x: Math.random() * SCREEN_WIDTH,
				y: Math.random() * SCREEN_HEIGHT,
				size: Math.random() * 1.2 + 0.2,
				twinkleSpeed: 0.02 + Math.random() * 0.03,
				twinklePhase: Math.random() * Math.PI * 2,
				color: getStarColor(),
				life: Math.random() * 100, // Random life duration
				maxLife: 100 + Math.random() * 150, // Random maximum life
				fadeSpeed: 0.5 + Math.random() * 1.5 // Random fade speed
			};
			backgroundStars.push(star);
		}

		
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

	// Function to calculate distance between two points
	function calculateDistance(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	}

	// Function to draw constellation lines between nearby stars
	function drawConstellations() {
		const MAX_DISTANCE = 150; // Maximum distance to connect stars
		const MIN_DISTANCE = 30;  // Minimum distance to avoid connecting very close stars
		
		for (let i = 0; i < backgroundStars.length; i++) {
			for (let j = i + 1; j < backgroundStars.length; j++) {
				const star1 = backgroundStars[i];
				const star2 = backgroundStars[j];
				
				const distance = calculateDistance(star1.x, star1.y, star2.x, star2.y);
				
				if (distance < MAX_DISTANCE && distance > MIN_DISTANCE) {
					// Calculate opacity based on distance (closer = more visible)
					const opacity = 0.3 * (1 - distance / MAX_DISTANCE);
					
					context.beginPath();
					context.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
					context.lineWidth = 0.5;
					context.moveTo(star1.x, star1.y);
					context.lineTo(star2.x, star2.y);
					context.stroke();
				}
			}
		}
	}

	function documentMouseMoveHandler(event) {
		mouseX = event.clientX - (window.innerWidth - SCREEN_WIDTH) * .5;
		mouseY = event.clientY - (window.innerHeight - SCREEN_HEIGHT) * .5;
	}
	
	function documentMouseDownHandler(event) {
		mouseIsDown = true;
	}
	
	function documentMouseUpHandler(event) {
		mouseIsDown = false;
	}

	function canvasTouchStartHandler(event) {
		if(event.touches.length == 1) {
			event.preventDefault();

			mouseX = event.touches[0].pageX - (window.innerWidth - SCREEN_WIDTH) * .5;
			mouseY = event.touches[0].pageY - (window.innerHeight - SCREEN_HEIGHT) * .5;
		}
	}
	
	function canvasTouchMoveHandler(event) {
		if(event.touches.length == 1) {
			event.preventDefault();

			mouseX = event.touches[0].pageX - (window.innerWidth - SCREEN_WIDTH) * .5;
			mouseY = event.touches[0].pageY - (window.innerHeight - SCREEN_HEIGHT) * .5;
		}
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
		if (mouseIsDown) {
			RADIUS_SCALE += (RADIUS_SCALE_MAX - RADIUS_SCALE) * (0.02);
		} else {
			RADIUS_SCALE -= (RADIUS_SCALE - RADIUS_SCALE_MIN) * (0.02);
		}
		
		RADIUS_SCALE = Math.min(RADIUS_SCALE, RADIUS_SCALE_MAX);
		
		// Fade out the lines slowly by drawing a rectangle over the entire canvas
		context.fillStyle = 'rgba(7, 18, 36, 0.1)';
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);
		
		// Update and draw background stars
		for (var i = backgroundStars.length - 1; i >= 0; i--) {
			var star = backgroundStars[i];
			
			// Update star life
			star.life += star.fadeSpeed;
			
			// If star has reached its maximum life, remove it
			if (star.life >= star.maxLife) {
				backgroundStars.splice(i, 1);
				continue;
			}
			
			// Calculate opacity based on life cycle
			var opacity = 1;
			if (star.life < 20) {
				// Fade in
				opacity = star.life / 20;
			} else if (star.life > star.maxLife - 20) {
				// Fade out
				opacity = (star.maxLife - star.life) / 20;
			}
			
			// Update twinkle effect
			star.twinklePhase += star.twinkleSpeed;
			var twinkle = (Math.sin(star.twinklePhase) + 1) * 0.5;
			var currentSize = star.size * (0.5 + twinkle * 0.5);
			
			// Draw star with opacity
			context.beginPath();
			context.fillStyle = star.color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
			context.arc(star.x, star.y, currentSize, 0, Math.PI * 2, true);
			context.fill();
			
			// Add subtle glow with opacity
			context.beginPath();
			context.fillStyle = star.color.replace(')', `, ${opacity * 0.2})`).replace('rgb', 'rgba');
			context.arc(star.x, star.y, currentSize * 2, 0, Math.PI * 2, true);
			context.fill();
		}

		// Draw constellation lines between nearby stars
		drawConstellations();
		
		// Randomly add new stars
		if (Math.random() < 0.1 && backgroundStars.length < STAR_QUANTITY) { // 10% chance each frame
			var newStar = {
				x: Math.random() * SCREEN_WIDTH,
				y: Math.random() * SCREEN_HEIGHT,
				size: Math.random() * 1.5 + 0.5,
				twinkleSpeed: 0.02 + Math.random() * 0.03,
				twinklePhase: Math.random() * Math.PI * 2,
				color: getStarColor(),
				life: 0,
				maxLife: 100 + Math.random() * 150,
				fadeSpeed: 0.5 + Math.random() * 1.5
			};
			backgroundStars.push(newStar);
		}
		
		for (i = 0, len = particles.length; i < len; i++) {
			var particle = particles[i];
			
			var lp = { x: particle.position.x, y: particle.position.y };
			
			// Offset the angle to keep the spin going
			particle.angle += particle.speed;
			
			// Follow mouse with some lag
			particle.shift.x += ( mouseX - particle.shift.x) * (particle.speed);
			particle.shift.y += ( mouseY - particle.shift.y) * (particle.speed);
			
			// Apply position
			particle.position.x = particle.shift.x + Math.cos(i + particle.angle) * (particle.orbit*RADIUS_SCALE);
			particle.position.y = particle.shift.y + Math.sin(i + particle.angle) * (particle.orbit*RADIUS_SCALE);
			
			// Limit to screen bounds
			particle.position.x = Math.max( Math.min( particle.position.x, SCREEN_WIDTH ), 0 );
			particle.position.y = Math.max( Math.min( particle.position.y, SCREEN_HEIGHT ), 0 );
			
			particle.size += ( particle.targetSize - particle.size ) * 0.05;
			
			// If we're at the target size, set a new one. Think of it like a regular day at work.
			if( Math.round( particle.size ) == Math.round( particle.targetSize ) ) {
				particle.targetSize = 1 + Math.random() * 7;
			}
			
			context.beginPath();
			context.fillStyle = particle.fillColor;
			context.strokeStyle = particle.fillColor;
			context.lineWidth = particle.size;
			context.moveTo(lp.x, lp.y);
			context.lineTo(particle.position.x, particle.position.y);
			context.stroke();
			context.arc(particle.position.x, particle.position.y, particle.size/2, 0, Math.PI*2, true);
			context.fill();
		}
	}
	
	
	/**
	 * reference:
	 * With love.
	 * http://hakim.se/experiments/
	 * http://twitter.com/hakimel
	 */