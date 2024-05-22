

//------------------------------------------------------------------------
//------------------------CARD ------------------------------------------------
//------------------------------------------------------------------------
function Card (id , numberOfProperties, numberOfValuesForEachProperty, isPropertiesDefinedById, properties){
	isPropertiesDefinedById = typeof isPropertiesDefinedById !== 'undefined' ? isPropertiesDefinedById : false;
	id = typeof id !== 'undefined' ? id : "noName";
	properties = typeof properties !== 'undefined' ? properties : [];
	this.id = id;
	this.numberOfValuesForEachProperty = numberOfValuesForEachProperty;
	
	this.properties = [];
	for (var i = 0;i<numberOfProperties;i++){
		this.properties.push("X");
	}
		
	if (properties.length >0 ){
		//if properties provided: check length, and if all values are "valid"
		// console.log("aha");
		// console.log(properties);
		if (properties.length == numberOfProperties){
			for (var i = 0;i<numberOfProperties;i++){
				if (!(properties[i] >=0 || properties[i]< numberOfValuesForEachProperty)){
					console.log("ASSERT ERROR value outside range ");
					console.log(numberOfValuesForEachProperty);
					console.log(properties.slice());
					
				}else{
                    this.properties[i] = properties[i];
                }
			}
		}else{
			console.log("ASSERT ERROR length of properties not valid. ");
			console.log(properties.length);
			console.log(numberOfProperties);
		}
		
	}else if (isPropertiesDefinedById ){
		this.setPropertiesFromId();
	}
}
	
Card.prototype.getNumberOfProperties = function(){
	return this.properties.length;
}

Card.prototype.getPropertyValue = function(property){
	return this.properties[property];
}

Card.prototype.getNumberOfValuesPerProperty = function(numberOfValuesForEachProperty){
	return this.numberOfValuesForEachProperty = numberOfValuesForEachProperty;
}

Card.prototype.setPropertyValue = function(property, value){
	//properties have just a numeric value.
	this.properties[property] = value;
}
Card.prototype.setPropertiesFromId = function (){
	// console.log(this.id);
	// console.log(this.properties);
	if (this.id.length !== this.properties.length){
		console.log("ASSERT ERROR: ID should be a string of chars of the same length as there are properties. (and chars to choose from should be no more than possible propertievalues. A=0, B=2,....)");
	}
	for (i=0;i<this.properties.length;i++){
		var value = this.id.charCodeAt(i) - 65 ; //ascii A=65
		if (value<0 || value > this.numberOfValuesForEachProperty -1){
			console.log("ASSERT ERROR: provided value derived from id is not a valid value, value: " + value );
			throw "aborted program on assert error.";
		}
		// console.log(this.numberOfValuesForEachProperty -1);
		this.properties[i] = this.id.charCodeAt(i) - 65 ; //ascii A=65
	}
}

Card.prototype.getPropertiesAsChars = function(property, value){
	//get property as letter 0 = A, 1 = B,...
	var asChars = [];
	for (var i=0;i<this.properties.length;i++){
		asChars.push(String.fromCharCode(65 + this.properties[i]));
	}
	return asChars;
}

Card.prototype.setIdFromProperties = function(id){
	this.id = this.getPropertiesAsChars().join("");
	this.isPropertiesDefinedById = true;
}

Card.prototype.show = function(){
	// console.log(this.id);
	if (this.isPropertiesDefinedById){
		console.log(this.id);
	}else{
		console.log(this.properties.join("-"));
	}
}

Card.prototype.getId = function(){
	return this.id;
}