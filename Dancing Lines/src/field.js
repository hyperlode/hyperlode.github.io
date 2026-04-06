
class Field {
	constructor(fieldProperties, svg_element) {

		this.iteration = 0;
        this.svg = svg_element;
		this.fieldProperties = fieldProperties;
		this.movingPaths = [];
		this.running = false;
	}

	animate() {
		if (!this.running) return;

		let updateDelayMs = this.fieldProperties.LOOP_PERIOD_MS;
		for (let i = 0; i < this.movingPaths.length; i++){
			updateDelayMs = this.movingPaths[i].segmentsPositionUpdate(this.fieldProperties.LOOP_PERIOD_MS);
			this.movingPaths[i].updateOverlaps();
		}
		this.iteration++;
		window.setTimeout(() => this.animate(), updateDelayMs);
	}

	start() {
		if (!this.running) {
			this.running = true;
			this.animate();
		}
	}

	stop() {
		this.running = false;
	}

	addMovingPath(animationProperties, pathGeometry) {
		this.movingPaths.push(new MovingPath(pathGeometry, animationProperties, this.svg));
	}

	// Live-update methods — take effect immediately without restarting

	setStrokeColor(color) {
		for (const path of this.movingPaths) path.setStrokeColor(color);
	}

	setFillColor(color) {
		for (const path of this.movingPaths) path.setFillColor(color);
	}

	setFillRule(rule) {
		for (const path of this.movingPaths) path.setFillRule(rule);
	}

	setStrokeWidth(width) {
		for (const path of this.movingPaths) path.setStrokeWidth(width);
	}

	setBaseSpeed(speed) {
		for (const path of this.movingPaths) {
			path.animationProperties.BASE_SPEED = speed;
			// Reinitialize segment speeds with new base speed
			const variability = path.animationProperties.SPEED_VARIABILITY || 0;
			for (let i = 0; i < path.segments.length; i++) {
				let direction = Math.random() * 2 - 1;
				let speedVariance = 1 + (Math.random() * 2 - 1) * variability;
				path.segmentSpeeds[i] = direction * speed * speedVariance;
			}
		}
	}

	setSpeedVariability(variability) {
		for (const path of this.movingPaths) {
			path.animationProperties.SPEED_VARIABILITY = variability;
			// Reinitialize segment speeds with new variability
			const baseSpeed = path.animationProperties.BASE_SPEED || 0.2;
			for (let i = 0; i < path.segments.length; i++) {
				let direction = Math.random() * 2 - 1;
				let speedVariance = 1 + (Math.random() * 2 - 1) * variability;
				path.segmentSpeeds[i] = direction * baseSpeed * speedVariance;
			}
		}
	}

	setSpeedChangeOnBounce(change) {
		for (const path of this.movingPaths) {
			path.animationProperties.SPEED_CHANGE_ON_BOUNCE = change;
		}
	}
}
