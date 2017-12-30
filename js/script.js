waypoints = []
waypoints_list = {}
map = null

function initMap() {
	var mapdiv = document.getElementById('map')
	
	var uluru = {lat: -25.363, lng: 131.044};
	map = new google.maps.Map(mapdiv, {
	  zoom: 4,
	  center: uluru
	});
	//var marker = new google.maps.Marker({
	//  position: uluru,
	//  map: map
	//});
}

function createWaypoint()
{
	return {location: null, gps: null}
}

function updateLocation(index, value)
{
	waypoints[index].location = value
}

function addTableRow(table, index) {
	row = table.insertRow(index)
	locinput = document.createElement("input")
	locinput.setAttribute('list','waypointlist')
	locinput.classList.add("locationcell")
	locinput.addEventListener('input', function (evt) {updateLocation(index, this.value)});
	row.insertCell(0).appendChild(locinput)
	
	gps = row.insertCell(1)
	gps.classList.add("gpscell")
	
	row.insertCell(2)
	
	insertinput = document.createElement("button")
	insertinput.innerHTML = "Insert:" + (index)
	insertinput.onclick = function () {addWaypoint(index)}
	row.insertCell(3).appendChild(insertinput) 

	deleteinput = document.createElement("button")
	deleteinput.innerHTML = "Delete:" + index
	deleteinput.onclick = function () {deleteWaypoint(index)}
	deleteinput.class = "delete"
	row.insertCell(4).appendChild(deleteinput) 
}

function updateTableRow(table, index) {
	waypoint = waypoints[index]
	
	locationcell = document.getElementsByClassName("locationcell")[index]
	locationcell.value = ""
	if (locationcell && waypoint && waypoint.location) {
		locationcell.value = waypoint.location
	}
	
	gpscell = document.getElementsByClassName("gpscell")[index]
	gpscell.innerHTML = ""
	if (waypoint && waypoint.gps) {
		gpscell.innerHTML = waypoint.gps
	}	
}

function updateTable() {
	tablebody = document.getElementById('tablebody')

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

function updateMap() {
	header = document.getElementById('header')
	map = document.getElementById('map')
	map.style.height = (window.innerHeight - header.clientHeight) + "px"
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

window.onresize = updateMap


