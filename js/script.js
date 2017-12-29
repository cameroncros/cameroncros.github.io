waypoints = []

function initMap() {
	var mapdiv = document.getElementById('map')
	
	var uluru = {lat: -25.363, lng: 131.044};
	var map = new google.maps.Map(mapdiv, {
	  zoom: 4,
	  center: uluru
	});
	var marker = new google.maps.Marker({
	  position: uluru,
	  map: map
	});
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
	locinput.class = "locationclass"
	locinput.addEventListener('input', function (evt) {updateLocation(index, this.value)});
	row.insertCell(0).appendChild(locinput)
	
	gps = row.insertCell(1)
	gps.class = "gpscell"
	
	row.insertCell(2)
	
	insertinput = document.createElement("button")
	insertinput.innerHTML = "Insert"
	insertinput.onclick = function () {addWaypoint(index)}
	row.insertCell(3).appendChild(insertinput) 

	deleteinput = document.createElement("button")
	deleteinput.innerHTML = "Delete"
	deleteinput.onclick = function () {deleteWaypoint(index)}
	deleteinput.class = "delete"
	row.insertCell(4).appendChild(deleteinput) 
}

function updateTableRow(table, index) {
	waypoint = waypoints[index]
	
	if (waypoint && waypoint.location) {
		document.getElementsByClassName("locationcell")[index].value = waypoint.location
	}
	
	if (waypoint && waypoint.gps) {
		document.getElementsByClassName("gpscell")[index].innerHTML = waypoint.gps
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
window.onresize = updateMap

function addWaypoint(index) {
	if (index) {
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

addWaypoint(0)
updateTable()


