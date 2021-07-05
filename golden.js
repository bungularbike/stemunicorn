var START = 0;
var END = 500;
var PAGE = 2;
toPaste = "";
function makeDesc(nodes) {
    var output = "";
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].object == undefined || nodes[i].object == "text") {
            output += nodes[i].leaves[0].text;
        } else {
            output += nodes[i].nodes[0].leaves[0].text;
        }
    }
    return output;
}
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function makeDate(dateobj) {
    if (dateobj.day!=undefined) {
        return (months[dateobj.month-1] + " " + dateobj.day + ", " + dateobj.year);
    } else if (dateobj.month != undefined) {
         return (months[dateobj.month-1] + " " + dateobj.year);
    } else {
        return dateobj.year;
    }
}
function toPlaces(n, x, q = false) {
	return (((q && n > 0) ? "+" : 0) + Math.round((n + Number.EPSILON) * (10 ** x)) / (10 ** x));
}
function toShort(z, x, q = false) {
	if (Math.abs(z) < 1000) {
		return toPlaces(z, 0);
	} else {
		var n = toPlaces(z, x);
		if (z < 0) { n = -1 * z }
		x = Math.pow(10, x);
	    var a = ["K", "M", "B", "T"];
	    for (var i = a.length - 1; i >= 0; i--) {
	        var s = Math.pow(10, (i + 1) * 3);
	        if (s <= n) {
	             n = Math.round(n * x / s) / x;
	             if ((n == 1000) && (i < a.length - 1)) {
	                 n = 1;
	                 i++;
	             }
	             n += a[i];
	             break;
	        }
	    }
	    if (z < 0) {
	    	return ("-" + n);
	    } else if (q) {
	    	return ("+" + n);
	    } else {
	    	return n;
	    }
	}
}
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
if (typeof errors == "undefined") {
	var errors = [];
}
var results;
var xhr = new XMLHttpRequest();
xhr.open("GET", "https://golden.com/api/v1/queries/list-of-cryptocurrency-companies/results/?order=&page=" + PAGE + "&per_page=500", false);
xhr.onreadystatechange = function() {
    if (this.readyState==4) {
    	results = JSON.parse(xhr.responseText);
    }
}
xhr.send();
for (var k = START; k < END; k++) {
    console.log((k + 1 + ((PAGE - 1) * 500)) + " " + results.results[k].name);
    try {
	    var company = new Array(16);
	    company[0] = results.results[k].name;
	    company[1] = makeDesc(results.results[k].description.nodes[0].nodes);
	    company[8] = ('=IMAGE("' + results.results[k].thumbnail.original + '")');
	    var founders = [];
	    var investors = [];
	    var rounds_id = [];
	    for (var j = 0; j < results.results[k].infobox.length; j++) {
	        if (results.results[k].infobox[j].label=="LinkedIn") {company[3]=results.results[k].infobox[j].display_value}
	        if (results.results[k].infobox[j].label=="Full address") {company[5]=results.results[k].infobox[j].display_value}
	        if (results.results[k].infobox[j].label=="Founded date") {company[7]=results.results[k].infobox[j].display_value;company[7]=makeDate(company[7])}
	        if (results.results[k].infobox[j].label=="Website") {company[9]=results.results[k].infobox[j].display_value}
	        if (results.results[k].infobox[j].label=="Email address") {company[4]=results.results[k].infobox[j].display_value}
	        if (results.results[k].infobox[j].label=="Phone number") {company[2]=results.results[k].infobox[j].display_value}
	        if (results.results[k].infobox[j].label=="Total funding amount (USD)") {company[11]=results.results[k].infobox[j].display_value;company[11]=("$"+toShort(company[11],1))}
	        if (results.results[k].infobox[j].label=="Number of employees") {company[14]=results.results[k].infobox[j].display_value}
	        if (results.results[k].infobox[j].label=="Founder") { founders[founders.length] = results.results[k].infobox[j].display_value}
	       	if (results.results[k].infobox[j].label=="Investors") { investors[investors.length] = results.results[k].infobox[j].display_value}
	       	if (results.results[k].infobox[j].label=="Crunchbase") {company[15]=results.results[k].infobox[j].display_value}
	       	if (results.results[k].infobox[j].label=="Funding rounds") {rounds_id[rounds_id.length]=results.results[k].infobox[j].display_value}
	    }
		var xhr = new XMLHttpRequest();
		var website = company[9];
		/*if (website.indexOf("http://") != -1) {
			website = website.replace("http://", "https://");
		}*/
		xhr.open("GET", website, false);
		xhr.onreadystatechange = function() {
	        if (this.readyState==4) {
	        	if (this.status==200) {
	        		if (founders.length > 0) {
						var _founders = [];
						for (var f = 0; f < founders.length; f++) {
				    		var xhr = new XMLHttpRequest();
				    		xhr.open("GET", "https://golden.com/api/v1/entities/?ids=" + founders[f], false);
				    		xhr.onreadystatechange = function() {
				                if (this.readyState==4) {
				                	_founders[_founders.length] = JSON.parse(xhr.responseText).results[0].name;
				                }
				    		}
				    		xhr.send();
				    	}
				    	company[6] = _founders.join(", ");
					}
					if (investors.length > 0) {
						var _investors = [];
						for (var g = 0; g < investors.length; g++) {
				    		var xhr = new XMLHttpRequest();
				    		xhr.open("GET", "https://golden.com/api/v1/entities/?ids=" + investors[g], false);
				    		xhr.onreadystatechange = function() {
				                if (this.readyState==4) {
				                	_investors[_investors.length] = JSON.parse(xhr.responseText).results[0].name;
				                }
				    		}
				    		xhr.send();
				    	}
				    	company[12] = _investors.join(", ");
					}
					if (rounds_id.length > 0) {
						var rounds = [];
						for (var h = 0; h < rounds_id.length; h++) {
				    		var xhr = new XMLHttpRequest();
				    		xhr.open("GET", "https://golden.com/api/v1/entities/?ids=" + rounds_id[h], false);
				    		xhr.onreadystatechange = function() {
				                if (this.readyState==4) {
				                	var slug = JSON.parse(xhr.responseText).results[0].slug;
				                	var _xhr = new XMLHttpRequest();
						    		_xhr.open("GET", "https://golden.com/api/v1/entities/" + slug, false);
						    		_xhr.onreadystatechange = function() {
						                if (this.readyState==4) {
						                	var info = JSON.parse(_xhr.responseText).infobox;
						                	var roundobj = {};
						                	var rounddateobj;
						                	for (var c = 0; c < info.length; c++) {
						                		if (info[c].label=="Funding round amount (USD)") {roundobj.amount=("$"+toShort(info[c].display_value, 1))}
						                		if (info[c].label=="Funding round date") {roundobj.date=makeDate(info[c].display_value);rounddateobj=info[c].display_value}
						                		if (info[c].label=="Funding type") {roundobj.type=info[c].display_value}
						                	}
						                	if (roundobj.date == undefined) {roundobj.date = ""}
						                	if (roundobj.amount == undefined) {roundobj.amount = "$undisclosed"}
						               		if (roundobj.type == undefined) {
						               			roundobj.type = "Standard";
						               		} else {
						               			roundobj.type = JSON.parse(_xhr.responseText).localData.entities[roundobj.type].name;
						               		}
						               		rounds[rounds.length] = [(roundobj.type + " " + roundobj.amount + " " + roundobj.date)];
						                	var rounddate = new Date();
						                	if (rounddateobj.year!=undefined) {
						                		rounddate.setYear(rounddateobj.year);
						                	} else {
						                		rounddate.setYear(2099);
						                	}
						                	if (rounddateobj.month!=undefined) {
						                		rounddate.setMonth(rounddateobj.month);
						                	}
						                	if (rounddateobj.day!=undefined) {
						                		rounddate.setDate(rounddateobj.day);
						                	}
						                	rounds[rounds.length-1][1] = rounddate;
						                }
						    		}
						    		_xhr.send();
				                }
				    		}
				    		xhr.send();
				    	}
				    	rounds.sort(function(a,b){
						  return new Date(a[1]) - new Date(b[1]);
						});
						var _toPaste = [];
						for (var d = 0; d < rounds.length; d++) {
							_toPaste[_toPaste.length] = ((d + 1) + ". " + rounds[d][0]);
						}
				    	company[10] = _toPaste.join(" | ");
					}
				    for (var l = 0; l < company.length; l++) {
				        if (company[l] == undefined) {company[l]="/"}
				    }
				    toPaste += (company.join("\t") + "\n")
	        	}
	        }
		}
	    xhr.send();
	} catch {
		errors[errors.length] = results.results[k].name;
		continue;
	}
}
console.log(toPaste);