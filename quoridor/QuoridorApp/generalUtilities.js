
https://javascriptweblog.wordpress.com/2010/12/07/namespacing-in-javascript/



var utilities = {
  //https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
  arraysEqual: function(a, b) {
		if (a === b) return true;
		if (a == null || b == null) return false;
		if (a.length != b.length) return false;
		
		// If you don't care about the order of the elements inside
		// the array, you should sort both arrays here.
		
		for (var i = 0; i < a.length; ++i) {
			if (a[i] !== b[i]) return false;
		}
		return true;
	}



}


