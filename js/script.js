waypoints = []
waypoints_list = {}
map = null
flightpath = null
markers = []

function initMap() {
	var mapdiv = document.getElementById('map')
	
	var uluru = {lat: -25.363, lng: 131.044};
	map = new google.maps.Map(mapdiv, {
	  zoom: 4,
	  center: uluru
	});
}

function createWaypoint()
{
	return {code: null, location: null, state: null, gps: null}
}

function parseCoordinate()
{
    return null
    
}

function updateCode(index, value)
{
    var waypoint = waypoints[index]
    if (value != waypoint.code)
    {
	    waypoint.code = value
	    if (waypoints_list[value] != undefined)
	    {
	        known = waypoints_list[value]
            waypoint.gps = known.coordinate
            waypoint.location = known.location
            waypoint.state = known.state
            
            updateTable()
	        updateMap()
        }
        else if ((coordinate = parseCoordinate(value)) != null)
        {
            waypoints.gps = coordinate
            
            updateTable()
            updateMap()
        }
	}
}

function addTableRow(table, index) {
	var row = table.insertRow(index)
	var codeinput = document.createElement("input")
	codeinput.setAttribute('list','waypointlist')
	codeinput.classList.add("codecell")
	codeinput.addEventListener('input', function (evt) {updateCode(index, this.value)});
	row.insertCell(0).appendChild(codeinput)
	
	var gps = row.insertCell(1)
	gps.classList.add("gpscell")
	
	var location = row.insertCell(2)
	location.classList.add("locationcell")
	
	var state = row.insertCell(3)
	state.classList.add("statecell")
	
	// Spacer cell
	row.insertCell(4)
	
	var insertinput = document.createElement("button")
	insertinput.innerHTML = "Insert:" + (index)
	insertinput.onclick = function () {addWaypoint(index)}
	row.insertCell(5).appendChild(insertinput) 

	var deleteinput = document.createElement("button")
	deleteinput.innerHTML = "Delete:" + index
	deleteinput.onclick = function () {deleteWaypoint(index)}
	deleteinput.class = "delete"
	row.insertCell(6).appendChild(deleteinput) 
}

function updateTableRow(table, index) {
	var waypoint = waypoints[index]
	if (waypoint == undefined) {
	    return
	}
	
	var codecell = document.getElementsByClassName("codecell")[index]
	if (codecell) {
	    if (waypoint.code) {
		    codecell.value = waypoint.code
		} else {
		    codecell.value = ""
		}
	}
	
	var locationcell = document.getElementsByClassName("locationcell")[index]
	if (locationcell) {
	    if (waypoint.location) {
		    locationcell.innerHTML = waypoint.location
		} else {
		    locationcell.innerHTML = ""
		}
	}
	
	var statecell = document.getElementsByClassName("statecell")[index]
	if (statecell) {
	    if (waypoint.state) {
		    statecell.innerHTML = waypoint.state
		} else {
		    statecell.innerHTML = ""
		}
	}
	
	var gpscell = document.getElementsByClassName("gpscell")[index]
	if (gpscell) {
	    if (waypoint.gps) {
		    gpscell.innerHTML = "Lat: " + waypoint.gps.lat + ", Long: " + waypoint.gps.lng
		} else {
		    gpscell.innerHTML = ""
		}
	}	
}

function updateTable() {
	var tablebody = document.getElementById('tablebody')

	while(tablebody.rows.length != waypoints.length) {
		if (tablebody.rows.length > waypoints.length) {
			tablebody.deleteRow(tablebody.rows.length-1)
		} else {
			addTableRow(tablebody, tablebody.rows.length)
		}
	}	

	for (i in waypoints) {
		updateTableRow(tablebody, i) 
	}
	updateMap()
}

function resizeMap() {
	var header = document.getElementById('header')
	var map = document.getElementById('map')
	map.style.height = (window.innerHeight - header.clientHeight) + "px"
}

function updateMap() {
    resizeMap()
    if (map == null) {
        return
    }
    	
	var coordinates = []
	for (i in markers)
	{
	    markers[i].setMap(null)
	}
	
	for (i in waypoints)
	{
	    var waypoint = waypoints[i]
	    if (waypoint.gps != null) {
	        coordinates.push(waypoint.gps)
	    }
	    var marker = new google.maps.Marker({
	        position: waypoint.gps,
	        map: map,
	        title: waypoint.code + " - " + waypoint.location,
	        label: parseInt(i)+1+""
	    });
	    markers.push(marker)
	}
	
	if (flightpath != null) {
	    flightpath.setMap(null)
	}
	
	flightpath = new google.maps.Polyline({
        path: coordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    flightpath.setMap(map)
}

function addWaypoint(index) {
	if (index != null) {
			waypoints.splice(index, 0, createWaypoint())   
	} else {
			waypoints.push(createWaypoint())
	}
	updateTable()
}

function deleteWaypoint(index) {
	waypoints.splice(index, 1)
	updateTable()
}

function loadWaypoints() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            waypoints_list = JSON.parse(this.responseText)
            
            datalist = document.getElementById('waypointlist')
            datalist.innerHTML = ""

            for (i in waypoints_list) {
                var option = document.createElement('option')
                option.value = i
                datalist.appendChild(option)
            }
        }
    };
    xhttp.open("GET", "waypoints.json", true);
    xhttp.send(); 
}

addWaypoint(0)
loadWaypoints()
updateTable()

window.onresize = resizeMap


