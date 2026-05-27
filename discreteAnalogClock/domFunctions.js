Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

//replace all instances in a string http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript/1145525#1145525
 function replaceAllInstancesInString(str, search, replacement){
       return str.split(search).join(replacement);
    }