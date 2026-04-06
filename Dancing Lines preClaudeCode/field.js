
class Field {
	constructor(fieldProperties, svg_element) {

		this.iteration = 0;
        this.svg = svg_element;
		this.fieldProperties = fieldProperties;
		this.movingPaths = [];
	}

	assignAccelerations(){
		// give each path an acceleration at the start.
		for (let i=0;i<this.movingPaths.length;i++){
			this.movingPaths[i].randomAccelerationsUpdate(0); // 0 = always update, provide start speed
		}
	}

	animate() {
		for (let i=0;i<this.movingPaths.length;i++){

			this.movingPaths[i].randomAccelerationsUpdate(this.fieldProperties.ACCELERATION_UPDATE_HIGHER_IS_LESS_PROBABLE); // 0 = always update

			var updateDelayMs = this.movingPaths[i].segmentsPositionUpdate(this.fieldProperties.LOOP_PERIOD_MS);
			this.movingPaths[i].updateOverlaps();
			this.movingPaths[i].resetAccelerations(); // accelerations (speed change) only last one cycle.
		}
		this.iteration++;
		window.setTimeout(function () { this.animate(); }.bind(this), updateDelayMs);
	}

	addMovingPath(animationProperties, pathGeometry) {
		//specific path info
		//define paths always clockwise.
		this.movingPaths.push( new MovingPath(pathGeometry, animationProperties, this.svg));
	}
}