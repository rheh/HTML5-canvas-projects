/*jslint plusplus: true, sloppy: true, indent: 4 */
( function() {"use strict";
        // this function is strict...
    }());
    
// Constants
var iCANVAS_START_X_POS = 0,
	iCANVAS_START_Y_POS = 0,
	iCANVAS_HEIGHT = 790,
	iCANVAS_WIDTH = 1580,
	iSPACE_FOR_LABEL = 30,
	iMAP_START_X_POS = iCANVAS_START_X_POS + iSPACE_FOR_LABEL,
	iMAP_START_Y_POS = iCANVAS_START_Y_POS + iSPACE_FOR_LABEL,
	iMAP_HEIGHT = iCANVAS_HEIGHT - (iSPACE_FOR_LABEL * 2),
	iMAP_WIDTH = iCANVAS_WIDTH - (iSPACE_FOR_LABEL * 2);

function drawBackground(ctx) {

	// Black background
	ctx.fillStyle = "rgb(0,0,0)";

	// Draw rectangle for the background
	ctx.fillRect(iCANVAS_START_X_POS, iCANVAS_START_Y_POS, (iCANVAS_START_X_POS + iCANVAS_WIDTH), iCANVAS_START_Y_POS + iCANVAS_HEIGHT);

	ctx.stroke();
}

function drawMapBackground(ctx) {
	// Ocean blue colour!
	ctx.fillStyle = "rgb(10, 133, 255)";

	// Draw rectangle for the map
	ctx.fillRect(iMAP_START_X_POS, iMAP_START_Y_POS, iMAP_WIDTH, iMAP_HEIGHT);

}

function degreesOfLatitudeToScreenY(iDegreesOfLatitude) {
	// Make the value positive, so we can calculate the percentage
	var iAdjustedDegreesOfLatitude = (iDegreesOfLatitude * 1) + 90,
		iDegreesOfLatitudeToScreenY = 0;

	// Are we at the South pole?
	if (iAdjustedDegreesOfLatitude === 0) {
		// Screen Y is the botton of the map (avoid divide by zero)
		iDegreesOfLatitudeToScreenY = iMAP_HEIGHT + iMAP_START_Y_POS;
	} else if (iAdjustedDegreesOfLatitude > 180) {
		// Are we at the North pole (or beyond)?
		// Screen Y is the top of the map
		iDegreesOfLatitudeToScreenY = iMAP_START_Y_POS;
	} else {
		// Convert the latitude value to screen X
		iDegreesOfLatitudeToScreenY = (iMAP_HEIGHT - (iAdjustedDegreesOfLatitude * (iMAP_HEIGHT / 180)) + iMAP_START_Y_POS);
	}

	return iDegreesOfLatitudeToScreenY;
}

function drawLongitudeLines(ctx, iDEGREES_BETWEEN_GRID_LINES) {

	var iNORTH_LATITUDE = 90,
		iSOUTH_LATITUDE = -90,
		iDegreesScreenY = 0,
		iLineOfLatitude;

	// Iterate around the latitude axis at the given interval
	for (iLineOfLatitude = iNORTH_LATITUDE; iLineOfLatitude >= iSOUTH_LATITUDE; iLineOfLatitude -= iDEGREES_BETWEEN_GRID_LINES) {

		// Convert the latitude value and move the pen to the start of the line
		iDegreesScreenY = degreesOfLatitudeToScreenY(iLineOfLatitude);
		ctx.moveTo(iMAP_START_X_POS, iDegreesScreenY);

		// Plot the line
		ctx.lineTo(iMAP_START_X_POS + iMAP_WIDTH, iDegreesScreenY);

		// Put the label on the line
		ctx.fillText(iLineOfLatitude, iCANVAS_START_X_POS + 5, iDegreesScreenY - 5);

		ctx.stroke();
	}
}

function degreesOfLongitudeToScreenX(iDegreesOfLongitude) {
    
	// Make the value positive, so we can calculate the percentage
	var iAdjustedDegreesOfLongitude = (iDegreesOfLongitude * 1) + 180,
		iDegreesOfLongitudeToScreenX = 0;

	// Are we at the West -180 point?
	if (iAdjustedDegreesOfLongitude === 0) {
		// Screen X is the left of the map (avoid divide by zero)
		iDegreesOfLongitudeToScreenX = iMAP_START_X_POS;
	} else if (iAdjustedDegreesOfLongitude > 360) {
		// If the longitude crosses the 180 line fix it (doesn't translat to screen well)
		iDegreesOfLongitudeToScreenX = iMAP_START_X_POS + iMAP_WIDTH;
	} else {
		// Convert the longitude value to screen X
		iDegreesOfLongitudeToScreenX = (iMAP_START_X_POS + (iAdjustedDegreesOfLongitude * (iMAP_WIDTH / 360)));
	}

	return iDegreesOfLongitudeToScreenX;
}

function degToRad(angle) {
    // Degrees to radians
    return ((angle * Math.PI) / 180);
}

function radToDeg(angle) {
    // Radians to degree
    return ((angle * 180) / Math.PI);
}

function drawLatitudeLines(ctx, iDEGREES_BETWEEN_GRID_LINES) {
    
	var iMIN_LONGITUDE = -180,
		iMAX_LONGITUDE = 180,
		iDegreesScreenY = 0,
		iLineOfLongitude,
		iDegreesScreenX,
		iCentralMeridian = degToRad(0),
		iRadius = iMAP_HEIGHT / 2;

	// Iterate around the longitude axis at the given interval
	for (iLineOfLongitude = iMIN_LONGITUDE; iLineOfLongitude <= iMAX_LONGITUDE; iLineOfLongitude += iDEGREES_BETWEEN_GRID_LINES) {

		// Convert the longitude value and move the pen to the start of the line
		iDegreesScreenX = degreesOfLongitudeToScreenX(iLineOfLongitude);
		
		//iDegreesScreenX = iRadius * (degToRad(iLineOfLongitude) - (degToRad(iLineOfLongitude) * iCentralMeridian));
		
		ctx.moveTo(iDegreesScreenX, iMAP_START_Y_POS);

		// Plot the line
		ctx.lineTo(iDegreesScreenX, iMAP_START_Y_POS + iMAP_HEIGHT);

		// Put the label on the line
		ctx.fillText(iLineOfLongitude, iDegreesScreenX - 10, iCANVAS_START_Y_POS + 10);

		ctx.stroke();
	}
}

function drawGraticule(ctx) {
	// Set distance between lines
	var iDEGREES_BETWEEN_LAT_GRID_LINES = 10,
		iDEGREES_BETWEEN_LON_GRID_LINES = 10;

	// Style
	ctx.lineWidth = 0.2;
	ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
	ctx.fillStyle = 'rgb(255,255,255)';

	// Font styling
	ctx.font = 'italic 10px sans-serif';
	ctx.textBaseline = 'top';

	drawLatitudeLines(ctx, iDEGREES_BETWEEN_LAT_GRID_LINES);
	drawLongitudeLines(ctx, iDEGREES_BETWEEN_LON_GRID_LINES);
}

function getMapData() {
	// The map data!
	var json =	{
		"shapes" : [[
			{
				"lat" : "48.24",
				"lon" : "-92.32"
			},
			{
				"lat" : "48.92",
				"lon" : "-88.13"
			},
			{
				"lat" : "46.27",
				"lon" : "-83.11"
			},
			{
				"lat" : "44.76",
				"lon" : "-81.66"
			},
			{
				"lat" : "42.29",
				"lon" : "-82.09"
			},
			{
				"lat" : "44.00",
				"lon" : "-77.10"
			},
			{
				"lat" : "46.92",
				"lon" : "-69.95"
			},
			{
				"lat" : "45.32",
				"lon" : "-65.92"
			},
			{
				"lat" : "44.25",
				"lon" : "-66.37"
			},
			{
				"lat" : "45.43",
				"lon" : "-61.22"
			},
			{
				"lat" : "47.34",
				"lon" : "-64.94"
			},
			{
				"lat" : "48.52",
				"lon" : "-64.12"
			},
			{
				"lat" : "47.02",
				"lon" : "-70.68"
			},
			{
				"lat" : "49.33",
				"lon" : "-67.24"
			},
			{
				"lat" : "50.48",
				"lon" : "-59.82"
			},
			{
				"lat" : "52.46",
				"lon" : "-56.14"
			},
			{
				"lat" : "53.58",
				"lon" : "-59.07"
			},
			{
				"lat" : "54.21",
				"lon" : "-58.26"
			},
			{
				"lat" : "55.33",
				"lon" : "-60.69"
			},
			{
				"lat" : "57.41",
				"lon" : "-61.97"
			},
			{
				"lat" : "59.49",
				"lon" : "-64.35"
			},
			{
				"lat" : "58.15",
				"lon" : "-67.29"
			},
			{
				"lat" : "59.91",
				"lon" : "-69.89"
			},
			{
				"lat" : "61.45",
				"lon" : "-71.31"
			},
			{
				"lat" : "61.97",
				"lon" : "-78.22"
			},
			{
				"lat" : "59.53",
				"lon" : "-77.28"
			},
			{
				"lat" : "55.88",
				"lon" : "-77.09"
			},
			{
				"lat" : "51.68",
				"lon" : "-79.06"
			},
			{
				"lat" : "52.70",
				"lon" : "-82.23"
			},
			{
				"lat" : "55.72",
				"lon" : "-86.75"
			},
			{
				"lat" : "56.86",
				"lon" : "-92.17"
			},
			{
				"lat" : "58.82",
				"lon" : "-95.61"
			},
			{
				"lat" : "62.02",
				"lon" : "-92.66"
			},
			{
				"lat" : "63.24",
				"lon" : "-90.65"
			},
			{
				"lat" : "64.12",
				"lon" : "-95.96"
			},
			{
				"lat" : "63.98",
				"lon" : "-89.88"
			},
			{
				"lat" : "65.22",
				"lon" : "-89.30"
			},
			{
				"lat" : "66.12",
				"lon" : "-86.86"
			},
			{
				"lat" : "66.88",
				"lon" : "-84.54"
			},
			{
				"lat" : "67.76",
				"lon" : "-82.30"
			},
			{
				"lat" : "69.68",
				"lon" : "-83.10"
			},
			{
				"lat" : "67.98",
				"lon" : "-86.05"
			},
			{
				"lat" : "68.20",
				"lon" : "-88.18"
			},
			{
				"lat" : "68.82",
				"lon" : "-91.00"
			},
			{
				"lat" : "69.69",
				"lon" : "-91.72"
			},
			{
				"lat" : "71.09",
				"lon" : "-93.15"
			},
			{
				"lat" : "71.05",
				"lon" : "-96.58"
			},
			{
				"lat" : "69.52",
				"lon" : "-93.35"
			},
			{
				"lat" : "68.25",
				"lon" : "-94.23"
			},
			{
				"lat" : "66.73",
				"lon" : "-95.96"
			},
			{
				"lat" : "68.27",
				"lon" : "-98.83"
			},
			{
				"lat" : "67.69",
				"lon" : "-102.45"
			},
			{
				"lat" : "68.43",
				"lon" : "-108.34"
			},
			{
				"lat" : "68.05",
				"lon" : "-105.83"
			},
			{
				"lat" : "66.60",
				"lon" : "-108.15"
			},
			{
				"lat" : "67.63",
				"lon" : "-111.15"
			},
			{
				"lat" : "68.23",
				"lon" : "-114.10"
			},
			{
				"lat" : "69.44",
				"lon" : "-120.92"
			},
			{
				"lat" : "69.26",
				"lon" : "-124.32"
			},
			{
				"lat" : "70.50",
				"lon" : "-128.76"
			},
			{
				"lat" : "69.19",
				"lon" : "-131.86"
			},
			{
				"lat" : "69.79",
				"lon" : "-131.15"
			},
			{
				"lat" : "69.13",
				"lon" : "-135.81"
			},
			{
				"lat" : "69.37",
				"lon" : "-140.19"
			},
			{
				"lat" : "69.58",
				"lon" : "-141.20"
			},
			{
				"lat" : "69.56",
				"lon" : "-141.21"
			},
			{
				"lat" : "69.83",
				"lon" : "-142.49"
			},
			{
				"lat" : "70.26",
				"lon" : "-148.09"
			},
			{
				"lat" : "70.96",
				"lon" : "-154.37"
			},
			{
				"lat" : "70.38",
				"lon" : "-159.53"
			},
			{
				"lat" : "68.25",
				"lon" : "-166.64"
			},
			{
				"lat" : "66.55",
				"lon" : "-161.56"
			},
			{
				"lat" : "65.97",
				"lon" : "-162.99"
			},
			{
				"lat" : "65.49",
				"lon" : "-168.23"
			},
			{
				"lat" : "64.49",
				"lon" : "-161.12"
			},
			{
				"lat" : "62.57",
				"lon" : "-165.29"
			},
			{
				"lat" : "60.06",
				"lon" : "-164.58"
			},
			{
				"lat" : "58.36",
				"lon" : "-162.06"
			},
			{
				"lat" : "58.12",
				"lon" : "-157.85"
			},
			{
				"lat" : "55.06",
				"lon" : "-162.34"
			},
			{
				"lat" : "57.11",
				"lon" : "-156.52"
			},
			{
				"lat" : "59.32",
				"lon" : "-153.53"
			},
			{
				"lat" : "60.81",
				"lon" : "-149.18"
			},
			{
				"lat" : "59.50",
				"lon" : "-149.90"
			},
			{
				"lat" : "60.36",
				"lon" : "-146.54"
			},
			{
				"lat" : "59.73",
				"lon" : "-139.98"
			},
			{
				"lat" : "58.28",
				"lon" : "-137.12"
			},
			{
				"lat" : "59.12",
				"lon" : "-136.01"
			},
			{
				"lat" : "57.12",
				"lon" : "-133.84"
			},
			{
				"lat" : "55.98",
				"lon" : "-131.46"
			},
			{
				"lat" : "57.20",
				"lon" : "-132.08"
			},
			{
				"lat" : "60.25",
				"lon" : "-140.37"
			},
			{
				"lat" : "60.16",
				"lon" : "-141.21"
			},
			{
				"lat" : "58.93",
				"lon" : "-133.38"
			},
			{
				"lat" : "54.83",
				"lon" : "-130.88"
			},
			{
				"lat" : "53.90",
				"lon" : "-128.86"
			},
			{
				"lat" : "52.12",
				"lon" : "-126.58"
			},
			{
				"lat" : "50.80",
				"lon" : "-127.08"
			},
			{
				"lat" : "49.66",
				"lon" : "-124.42"
			},
			{
				"lat" : "48.91",
				"lon" : "-122.56"
			},
			{
				"lat" : "48.92",
				"lon" : "-122.44"
			},
			{
				"lat" : "47.18",
				"lon" : "-124.42"
			},
			{
				"lat" : "42.48",
				"lon" : "-124.52"
			},
			{
				"lat" : "38.45",
				"lon" : "-123.09"
			},
			{
				"lat" : "36.62",
				"lon" : "-121.73"
			},
			{
				"lat" : "33.34",
				"lon" : "-117.60"
			},
			{
				"lat" : "32.64",
				"lon" : "-117.28"
			},
			{
				"lat" : "32.48",
				"lon" : "-117.29"
			},
			{
				"lat" : "27.80",
				"lon" : "-114.75"
			},
			{
				"lat" : "24.80",
				"lon" : "-112.53"
			},
			{
				"lat" : "24.07",
				"lon" : "-110.55"
			},
			{
				"lat" : "29.59",
				"lon" : "-114.23"
			},
			{
				"lat" : "29.99",
				"lon" : "-112.58"
			},
			{
				"lat" : "25.94",
				"lon" : "-109.57"
			},
			{
				"lat" : "21.94",
				"lon" : "-105.61"
			},
			{
				"lat" : "17.87",
				"lon" : "-102.09"
			},
			{
				"lat" : "15.94",
				"lon" : "-95.75"
			},
			{
				"lat" : "14.97",
				"lon" : "-92.21"
			},
			{
				"lat" : "14.71",
				"lon" : "-92.22"
			},
			{
				"lat" : "12.06",
				"lon" : "-86.74"
			},
			{
				"lat" : "8.65",
				"lon" : "-83.03"
			},
			{
				"lat" : "8.74",
				"lon" : "-79.93"
			},
			{
				"lat" : "7.82",
				"lon" : "-77.00"
			},
			{
				"lat" : "8.97",
				"lon" : "-81.99"
			},
			{
				"lat" : "12.70",
				"lon" : "-83.92"
			},
			{
				"lat" : "15.80",
				"lon" : "-86.33"
			},
			{
				"lat" : "15.92",
				"lon" : "-88.40"
			},
			{
				"lat" : "17.42",
				"lon" : "-88.45"
			},
			{
				"lat" : "21.33",
				"lon" : "-87.01"
			},
			{
				"lat" : "18.72",
				"lon" : "-91.65"
			},
			{
				"lat" : "20.37",
				"lon" : "-96.96"
			},
			{
				"lat" : "25.67",
				"lon" : "-97.65"
			},
			{
				"lat" : "25.82",
				"lon" : "-97.62"
			},
			{
				"lat" : "28.84",
				"lon" : "-95.62"
			},
			{
				"lat" : "29.03",
				"lon" : "-90.77"
			},
			{
				"lat" : "30.22",
				"lon" : "-87.33"
			},
			{
				"lat" : "28.15",
				"lon" : "-82.69"
			},
			{
				"lat" : "26.66",
				"lon" : "-80.16"
			},
			{
				"lat" : "32.31",
				"lon" : "-80.74"
			},
			{
				"lat" : "35.43",
				"lon" : "-76.89"
			},
			{
				"lat" : "38.21",
				"lon" : "-76.47"
			},
			{
				"lat" : "37.67",
				"lon" : "-75.66"
			},
			{
				"lat" : "41.76",
				"lon" : "-71.31"
			},
			{
				"lat" : "44.17",
				"lon" : "-69.44"
			},
			{
				"lat" : "47.03",
				"lon" : "-67.69"
			},
			{
				"lat" : "45.14",
				"lon" : "-73.18"
			},
			{
				"lat" : "43.28",
				"lon" : "-79.26"
			},
			{
				"lat" : "42.59",
				"lon" : "-82.84"
			},
			{
				"lat" : "45.32",
				"lon" : "-83.49"
			},
			{
				"lat" : "43.65",
				"lon" : "-86.36"
			},
			{
				"lat" : "43.42",
				"lon" : "-87.75"
			},
			{
				"lat" : "45.96",
				"lon" : "-86.01"
			},
			{
				"lat" : "46.59",
				"lon" : "-87.00"
			},
			{
				"lat" : "46.79",
				"lon" : "-91.39"
			},
			{
				"lat" : "47.96",
				"lon" : "-90.05"
			}], [
			{
				"lat" : "58.41",
				"lon" : "-152.62"
			},
			{
				"lat" : "58.40",
				"lon" : "-152.60"
			}], [
			{
				"lat" : "57.80",
				"lon" : "-153.30"
			},
			{
				"lat" : "57.48",
				"lon" : "-152.40"
			},
			{
				"lat" : "57.79",
				"lon" : "-153.32"
			}], [
			{
				"lat" : "53.96",
				"lon" : "-166.96"
			},
			{
				"lat" : "53.95",
				"lon" : "-167.01"
			}], [
			{
				"lat" : "53.50",
				"lon" : "-168.36"
			},
			{
				"lat" : "53.36",
				"lon" : "-168.19"
			}], [
			{
				"lat" : "52.68",
				"lon" : "-170.73"
			},
			{
				"lat" : "52.55",
				"lon" : "-170.60"
			}], [
			{
				"lat" : "51.94",
				"lon" : "-174.47"
			},
			{
				"lat" : "51.92",
				"lon" : "-174.47"
			}], [
			{
				"lat" : "51.71",
				"lon" : "-176.58"
			},
			{
				"lat" : "51.73",
				"lon" : "-176.64"
			}], [
			{
				"lat" : "51.76",
				"lon" : "-177.55"
			},
			{
				"lat" : "51.63",
				"lon" : "-177.41"
			}], [
			{
				"lat" : "51.75",
				"lon" : "-178.27"
			}], [
			{
				"lat" : "51.80",
				"lon" : "177.35"
			},
			{
				"lat" : "51.76",
				"lon" : "177.33"
			}], [
			{
				"lat" : "53.00",
				"lon" : "172.44"
			},
			{
				"lat" : "53.03",
				"lon" : "172.55"
			}], [
			{
				"lat" : "48.33",
				"lon" : "-123.40"
			},
			{
				"lat" : "50.84",
				"lon" : "-128.00"
			},
			{
				"lat" : "48.34",
				"lon" : "-123.50"
			}], [
			{
				"lat" : "52.88",
				"lon" : "-132.49"
			},
			{
				"lat" : "52.91",
				"lon" : "-132.44"
			}], [
			{
				"lat" : "53.02",
				"lon" : "-132.64"
			},
			{
				"lat" : "53.71",
				"lon" : "-131.97"
			},
			{
				"lat" : "53.02",
				"lon" : "-132.63"
			}], [
			{
				"lat" : "51.56",
				"lon" : "-55.36"
			},
			{
				"lat" : "49.52",
				"lon" : "-54.66"
			},
			{
				"lat" : "47.48",
				"lon" : "-53.65"
			},
			{
				"lat" : "46.31",
				"lon" : "-52.98"
			},
			{
				"lat" : "46.84",
				"lon" : "-56.12"
			},
			{
				"lat" : "47.57",
				"lon" : "-58.47"
			},
			{
				"lat" : "50.38",
				"lon" : "-57.61"
			},
			{
				"lat" : "51.53",
				"lon" : "-55.39"
			}], [
			{
				"lat" : "49.01",
				"lon" : "-61.37"
			},
			{
				"lat" : "49.29",
				"lon" : "-61.80"
			},
			{
				"lat" : "49.03",
				"lon" : "-61.38"
			}], [
			{
				"lat" : "46.71",
				"lon" : "-63.01"
			},
			{
				"lat" : "46.61",
				"lon" : "-64.42"
			},
			{
				"lat" : "46.68",
				"lon" : "-63.04"
			}], [
			{
				"lat" : "46.48",
				"lon" : "-60.14"
			},
			{
				"lat" : "46.50",
				"lon" : "-60.14"
			}], [
			{
				"lat" : "41.11",
				"lon" : "-71.97"
			},
			{
				"lat" : "41.15",
				"lon" : "-71.97"
			}], [
			{
				"lat" : "27.03",
				"lon" : "-80.79"
			},
			{
				"lat" : "26.99",
				"lon" : "-81.01"
			}], [
			{
				"lat" : "42.09",
				"lon" : "-113.01"
			},
			{
				"lat" : "42.01",
				"lon" : "-113.10"
			}], [
			{
				"lat" : "20.02",
				"lon" : "-155.74"
			},
			{
				"lat" : "19.98",
				"lon" : "-155.73"
			}], [
			{
				"lat" : "20.78",
				"lon" : "-156.51"
			},
			{
				"lat" : "20.78",
				"lon" : "-156.51"
			}], [
			{
				"lat" : "21.21",
				"lon" : "-157.12"
			},
			{
				"lat" : "20.95",
				"lon" : "-157.08"
			}], [
			{
				"lat" : "21.42",
				"lon" : "-157.87"
			}], [
			{
				"lat" : "22.07",
				"lon" : "-159.53"
			}], [
			{
				"lat" : "66.46",
				"lon" : "-117.44"
			},
			{
				"lat" : "65.24",
				"lon" : "-119.59"
			},
			{
				"lat" : "65.03",
				"lon" : "-123.95"
			},
			{
				"lat" : "66.44",
				"lon" : "-123.69"
			},
			{
				"lat" : "66.22",
				"lon" : "-119.21"
			},
			{
				"lat" : "66.44",
				"lon" : "-117.44"
			}], [
			{
				"lat" : "64.03",
				"lon" : "-120.71"
			},
			{
				"lat" : "62.30",
				"lon" : "-114.91"
			},
			{
				"lat" : "62.72",
				"lon" : "-109.07"
			},
			{
				"lat" : "61.19",
				"lon" : "-112.62"
			},
			{
				"lat" : "61.19",
				"lon" : "-118.68"
			},
			{
				"lat" : "61.17",
				"lon" : "-117.01"
			},
			{
				"lat" : "62.56",
				"lon" : "-115.97"
			},
			{
				"lat" : "64.00",
				"lon" : "-119.46"
			},
			{
				"lat" : "63.94",
				"lon" : "-120.59"
			}], [
			{
				"lat" : "58.46",
				"lon" : "-112.31"
			},
			{
				"lat" : "59.44",
				"lon" : "-108.90"
			},
			{
				"lat" : "58.90",
				"lon" : "-104.14"
			},
			{
				"lat" : "56.72",
				"lon" : "-102.56"
			},
			{
				"lat" : "58.73",
				"lon" : "-101.82"
			},
			{
				"lat" : "58.91",
				"lon" : "-104.65"
			},
			{
				"lat" : "58.51",
				"lon" : "-111.00"
			},
			{
				"lat" : "58.62",
				"lon" : "-112.35"
			}], [
			{
				"lat" : "50.09",
				"lon" : "-98.74"
			},
			{
				"lat" : "52.24",
				"lon" : "-99.75"
			},
			{
				"lat" : "51.47",
				"lon" : "-99.62"
			},
			{
				"lat" : "50.39",
				"lon" : "-98.82"
			}], [
			{
				"lat" : "50.21",
				"lon" : "-97.02"
			},
			{
				"lat" : "54.02",
				"lon" : "-97.50"
			},
			{
				"lat" : "52.93",
				"lon" : "-98.69"
			},
			{
				"lat" : "51.09",
				"lon" : "-97.19"
			},
			{
				"lat" : "50.20",
				"lon" : "-96.98"
			}], [
			{
				"lat" : "49.04",
				"lon" : "-95.34"
			},
			{
				"lat" : "50.34",
				"lon" : "-92.32"
			},
			{
				"lat" : "49.47",
				"lon" : "-94.14"
			},
			{
				"lat" : "48.82",
				"lon" : "-95.36"
			}], [
			{
				"lat" : "56.16",
				"lon" : "-80.39"
			},
			{
				"lat" : "55.94",
				"lon" : "-79.22"
			},
			{
				"lat" : "56.08",
				"lon" : "-80.34"
			}], [
			{
				"lat" : "58.60",
				"lon" : "-103.56"
			},
			{
				"lat" : "58.58",
				"lon" : "-103.60"
			}], [
			{
				"lat" : "58.03",
				"lon" : "-101.82"
			},
			{
				"lat" : "58.10",
				"lon" : "-102.33"
			},
			{
				"lat" : "58.06",
				"lon" : "-101.77"
			}], [
			{
				"lat" : "55.79",
				"lon" : "-101.88"
			},
			{
				"lat" : "57.15",
				"lon" : "-97.92"
			},
			{
				"lat" : "55.85",
				"lon" : "-101.22"
			},
			{
				"lat" : "55.74",
				"lon" : "-101.88"
			}], [
			{
				"lat" : "6.80",
				"lon" : "-77.61"
			},
			{
				"lat" : "0.97",
				"lon" : "-78.70"
			},
			{
				"lat" : "-4.47",
				"lon" : "-80.75"
			},
			{
				"lat" : "-14.57",
				"lon" : "-76.19"
			},
			{
				"lat" : "-18.75",
				"lon" : "-70.44"
			},
			{
				"lat" : "-26.15",
				"lon" : "-70.68"
			},
			{
				"lat" : "-32.03",
				"lon" : "-71.44"
			},
			{
				"lat" : "-37.27",
				"lon" : "-73.38"
			},
			{
				"lat" : "-42.11",
				"lon" : "-73.06"
			},
			{
				"lat" : "-46.09",
				"lon" : "-73.17"
			},
			{
				"lat" : "-48.05",
				"lon" : "-73.52"
			},
			{
				"lat" : "-51.56",
				"lon" : "-73.67"
			},
			{
				"lat" : "-53.88",
				"lon" : "-71.06"
			},
			{
				"lat" : "-50.77",
				"lon" : "-69.14"
			},
			{
				"lat" : "-46.59",
				"lon" : "-67.51"
			},
			{
				"lat" : "-42.80",
				"lon" : "-63.49"
			},
			{
				"lat" : "-40.16",
				"lon" : "-62.14"
			},
			{
				"lat" : "-36.71",
				"lon" : "-57.12"
			},
			{
				"lat" : "-34.15",
				"lon" : "-53.17"
			},
			{
				"lat" : "-32.02",
				"lon" : "-51.26"
			},
			{
				"lat" : "-25.48",
				"lon" : "-48.16"
			},
			{
				"lat" : "-22.32",
				"lon" : "-40.73"
			},
			{
				"lat" : "-15.24",
				"lon" : "-38.88"
			},
			{
				"lat" : "-7.81",
				"lon" : "-34.60"
			},
			{
				"lat" : "-3.42",
				"lon" : "-41.95"
			},
			{
				"lat" : "-1.84",
				"lon" : "-48.02"
			},
			{
				"lat" : "-1.57",
				"lon" : "-48.44"
			},
			{
				"lat" : "0.00",
				"lon" : "-50.81"
			},
			{
				"lat" : "5.39",
				"lon" : "-54.47"
			},
			{
				"lat" : "8.32",
				"lon" : "-60.59"
			},
			{
				"lat" : "9.88",
				"lon" : "-64.19"
			},
			{
				"lat" : "10.64",
				"lon" : "-70.78"
			},
			{
				"lat" : "11.89",
				"lon" : "-70.97"
			},
			{
				"lat" : "8.76",
				"lon" : "-76.26"
			},
			{
				"lat" : "6.80",
				"lon" : "-77.61"
			}], [
			{
				"lat" : "-52.79",
				"lon" : "-69.14"
			},
			{
				"lat" : "-55.08",
				"lon" : "-66.16"
			},
			{
				"lat" : "-54.88",
				"lon" : "-70.01"
			},
			{
				"lat" : "-53.85",
				"lon" : "-70.55"
			},
			{
				"lat" : "-52.81",
				"lon" : "-69.31"
			}], [
			{
				"lat" : "-51.58",
				"lon" : "-59.29"
			},
			{
				"lat" : "-51.54",
				"lon" : "-59.35"
			}], [
			{
				"lat" : "-51.55",
				"lon" : "-58.65"
			},
			{
				"lat" : "-51.56",
				"lon" : "-58.55"
			}], [
			{
				"lat" : "21.44",
				"lon" : "-84.39"
			},
			{
				"lat" : "19.73",
				"lon" : "-73.90"
			},
			{
				"lat" : "21.18",
				"lon" : "-79.27"
			},
			{
				"lat" : "21.80",
				"lon" : "-83.74"
			},
			{
				"lat" : "21.42",
				"lon" : "-84.32"
			}], [
			{
				"lat" : "17.95",
				"lon" : "-66.96"
			},
			{
				"lat" : "17.89",
				"lon" : "-67.05"
			}], [
			{
				"lat" : "17.22",
				"lon" : "-77.88"
			},
			{
				"lat" : "16.98",
				"lon" : "-78.06"
			}], [
			{
				"lat" : "18.08",
				"lon" : "-74.47"
			},
			{
				"lat" : "18.99",
				"lon" : "-69.88"
			},
			{
				"lat" : "17.76",
				"lon" : "-71.10"
			},
			{
				"lat" : "17.86",
				"lon" : "-74.45"
			}], [
			{
				"lat" : "73.74",
				"lon" : "-85.28"
			},
			{
				"lat" : "70.96",
				"lon" : "-85.79"
			},
			{
				"lat" : "71.94",
				"lon" : "-85.13"
			},
			{
				"lat" : "72.96",
				"lon" : "-84.74"
			},
			{
				"lat" : "73.10",
				"lon" : "-80.61"
			},
			{
				"lat" : "72.20",
				"lon" : "-78.45"
			},
			{
				"lat" : "72.55",
				"lon" : "-75.44"
			},
			{
				"lat" : "71.98",
				"lon" : "-73.89"
			},
			{
				"lat" : "71.04",
				"lon" : "-72.56"
			},
			{
				"lat" : "70.57",
				"lon" : "-71.49"
			},
			{
				"lat" : "70.29",
				"lon" : "-69.78"
			},
			{
				"lat" : "69.71",
				"lon" : "-68.12"
			},
			{
				"lat" : "69.19",
				"lon" : "-65.91"
			},
			{
				"lat" : "68.39",
				"lon" : "-66.92"
			},
			{
				"lat" : "67.68",
				"lon" : "-64.08"
			},
			{
				"lat" : "66.68",
				"lon" : "-62.50"
			},
			{
				"lat" : "65.33",
				"lon" : "-63.07"
			},
			{
				"lat" : "66.08",
				"lon" : "-66.11"
			},
			{
				"lat" : "65.41",
				"lon" : "-67.48"
			},
			{
				"lat" : "63.15",
				"lon" : "-64.05"
			},
			{
				"lat" : "63.26",
				"lon" : "-66.58"
			},
			{
				"lat" : "62.33",
				"lon" : "-69.04"
			},
			{
				"lat" : "63.77",
				"lon" : "-72.22"
			},
			{
				"lat" : "64.17",
				"lon" : "-76.88"
			},
			{
				"lat" : "65.54",
				"lon" : "-73.25"
			},
			{
				"lat" : "66.64",
				"lon" : "-70.09"
			},
			{
				"lat" : "67.44",
				"lon" : "-72.05"
			},
			{
				"lat" : "68.36",
				"lon" : "-76.32"
			},
			{
				"lat" : "70.17",
				"lon" : "-78.34"
			},
			{
				"lat" : "69.71",
				"lon" : "-82.12"
			},
			{
				"lat" : "70.12",
				"lon" : "-87.64"
			},
			{
				"lat" : "71.43",
				"lon" : "-89.68"
			},
			{
				"lat" : "73.74",
				"lon" : "-85.28"
			}], [
			{
				"lat" : "76.10",
				"lon" : "-80.90"
			},
			{
				"lat" : "76.28",
				"lon" : "-84.21"
			},
			{
				"lat" : "76.38",
				"lon" : "-88.94"
			},
			{
				"lat" : "77.40",
				"lon" : "-85.47"
			},
			{
				"lat" : "77.93",
				"lon" : "-85.43"
			},
			{
				"lat" : "78.54",
				"lon" : "-87.01"
			},
			{
				"lat" : "78.94",
				"lon" : "-83.17"
			},
			{
				"lat" : "79.93",
				"lon" : "-84.87"
			},
			{
				"lat" : "79.82",
				"lon" : "-81.33"
			},
			{
				"lat" : "80.92",
				"lon" : "-76.27"
			},
			{
				"lat" : "80.62",
				"lon" : "-82.88"
			},
			{
				"lat" : "81.16",
				"lon" : "-82.58"
			},
			{
				"lat" : "81.05",
				"lon" : "-86.51"
			},
			{
				"lat" : "81.21",
				"lon" : "-89.36"
			},
			{
				"lat" : "81.38",
				"lon" : "-90.45"
			},
			{
				"lat" : "81.86",
				"lon" : "-89.28"
			},
			{
				"lat" : "82.30",
				"lon" : "-87.21"
			},
			{
				"lat" : "82.05",
				"lon" : "-80.51"
			},
			{
				"lat" : "82.55",
				"lon" : "-80.16"
			},
			{
				"lat" : "82.86",
				"lon" : "-77.83"
			},
			{
				"lat" : "83.05",
				"lon" : "-75.51"
			},
			{
				"lat" : "82.90",
				"lon" : "-71.18"
			},
			{
				"lat" : "82.78",
				"lon" : "-65.10"
			},
			{
				"lat" : "81.80",
				"lon" : "-63.34"
			},
			{
				"lat" : "81.26",
				"lon" : "-68.26"
			},
			{
				"lat" : "80.34",
				"lon" : "-69.46"
			},
			{
				"lat" : "79.82",
				"lon" : "-71.05"
			},
			{
				"lat" : "79.46",
				"lon" : "-74.40"
			},
			{
				"lat" : "79.03",
				"lon" : "-75.42"
			},
			{
				"lat" : "78.92",
				"lon" : "-75.48"
			},
			{
				"lat" : "78.20",
				"lon" : "-76.01"
			},
			{
				"lat" : "77.28",
				"lon" : "-80.66"
			},
			{
				"lat" : "76.98",
				"lon" : "-78.07"
			},
			{
				"lat" : "76.13",
				"lon" : "-80.90"
			}], [
			{
				"lat" : "74.13",
				"lon" : "-92.86"
			},
			{
				"lat" : "72.70",
				"lon" : "-92.50"
			},
			{
				"lat" : "73.16",
				"lon" : "-94.89"
			},
			{
				"lat" : "74.14",
				"lon" : "-92.96"
			}], [
			{
				"lat" : "76.95",
				"lon" : "-94.80"
			},
			{
				"lat" : "76.04",
				"lon" : "-89.68"
			},
			{
				"lat" : "75.40",
				"lon" : "-88.52"
			},
			{
				"lat" : "75.67",
				"lon" : "-82.36"
			},
			{
				"lat" : "74.65",
				"lon" : "-79.39"
			},
			{
				"lat" : "74.22",
				"lon" : "-86.15"
			},
			{
				"lat" : "74.94",
				"lon" : "-91.70"
			},
			{
				"lat" : "76.91",
				"lon" : "-95.60"
			},
			{
				"lat" : "76.96",
				"lon" : "-94.87"
			}], [
			{
				"lat" : "73.74",
				"lon" : "-99.96"
			},
			{
				"lat" : "72.90",
				"lon" : "-97.89"
			},
			{
				"lat" : "71.13",
				"lon" : "-98.28"
			},
			{
				"lat" : "72.92",
				"lon" : "-102.04"
			},
			{
				"lat" : "73.14",
				"lon" : "-101.34"
			},
			{
				"lat" : "73.59",
				"lon" : "-99.69"
			}], [
			{
				"lat" : "73.25",
				"lon" : "-107.58"
			},
			{
				"lat" : "71.02",
				"lon" : "-104.59"
			},
			{
				"lat" : "69.56",
				"lon" : "-101.71"
			},
			{
				"lat" : "68.62",
				"lon" : "-104.07"
			},
			{
				"lat" : "69.12",
				"lon" : "-106.61"
			},
			{
				"lat" : "69.05",
				"lon" : "-114.09"
			},
			{
				"lat" : "70.12",
				"lon" : "-113.89"
			},
			{
				"lat" : "70.32",
				"lon" : "-115.88"
			},
			{
				"lat" : "71.32",
				"lon" : "-116.10"
			},
			{
				"lat" : "72.48",
				"lon" : "-117.45"
			},
			{
				"lat" : "72.44",
				"lon" : "-113.53"
			},
			{
				"lat" : "72.24",
				"lon" : "-109.84"
			},
			{
				"lat" : "71.71",
				"lon" : "-106.62"
			},
			{
				"lat" : "73.04",
				"lon" : "-107.43"
			}], [
			{
				"lat" : "74.29",
				"lon" : "-120.96"
			},
			{
				"lat" : "72.53",
				"lon" : "-118.37"
			},
			{
				"lat" : "71.18",
				"lon" : "-123.06"
			},
			{
				"lat" : "73.77",
				"lon" : "-123.40"
			},
			{
				"lat" : "74.27",
				"lon" : "-120.93"
			}], [
			{
				"lat" : "76.74",
				"lon" : "-108.83"
			},
			{
				"lat" : "75.54",
				"lon" : "-106.25"
			},
			{
				"lat" : "74.78",
				"lon" : "-107.08"
			},
			{
				"lat" : "74.16",
				"lon" : "-112.99"
			},
			{
				"lat" : "74.99",
				"lon" : "-112.28"
			},
			{
				"lat" : "75.33",
				"lon" : "-116.04"
			},
			{
				"lat" : "76.20",
				"lon" : "-115.27"
			},
			{
				"lat" : "75.56",
				"lon" : "-110.95"
			},
			{
				"lat" : "76.31",
				"lon" : "-109.77"
			},
			{
				"lat" : "76.70",
				"lon" : "-108.82"
			}], [
			{
				"lat" : "77.46",
				"lon" : "-115.70"
			},
			{
				"lat" : "76.30",
				"lon" : "-118.10"
			},
			{
				"lat" : "76.37",
				"lon" : "-121.13"
			},
			{
				"lat" : "77.28",
				"lon" : "-116.04"
			}], [
			{
				"lat" : "77.86",
				"lon" : "-110.01"
			},
			{
				"lat" : "77.68",
				"lon" : "-112.36"
			},
			{
				"lat" : "77.86",
				"lon" : "-109.96"
			}], [
			{
				"lat" : "78.48",
				"lon" : "-109.60"
			},
			{
				"lat" : "78.01",
				"lon" : "-112.20"
			},
			{
				"lat" : "78.48",
				"lon" : "-109.60"
			}], [
			{
				"lat" : "76.61",
				"lon" : "-97.87"
			},
			{
				"lat" : "75.31",
				"lon" : "-99.21"
			},
			{
				"lat" : "75.60",
				"lon" : "-100.86"
			},
			{
				"lat" : "76.26",
				"lon" : "-99.40"
			},
			{
				"lat" : "76.60",
				"lon" : "-97.79"
			}], [
			{
				"lat" : "75.53",
				"lon" : "-94.72"
			},
			{
				"lat" : "75.52",
				"lon" : "-94.66"
			}], [
			{
				"lat" : "79.01",
				"lon" : "-104.10"
			},
			{
				"lat" : "77.54",
				"lon" : "-99.19"
			},
			{
				"lat" : "78.08",
				"lon" : "-103.22"
			},
			{
				"lat" : "78.95",
				"lon" : "-104.30"
			}], [
			{
				"lat" : "77.52",
				"lon" : "-93.74"
			},
			{
				"lat" : "77.52",
				"lon" : "-93.74"
			}], [
			{
				"lat" : "78.50",
				"lon" : "-96.88"
			},
			{
				"lat" : "77.77",
				"lon" : "-96.91"
			},
			{
				"lat" : "78.48",
				"lon" : "-96.94"
			}], [
			{
				"lat" : "65.84",
				"lon" : "-84.69"
			},
			{
				"lat" : "63.87",
				"lon" : "-81.58"
			},
			{
				"lat" : "62.96",
				"lon" : "-85.00"
			},
			{
				"lat" : "65.71",
				"lon" : "-84.63"
			}], [
			{
				"lat" : "62.75",
				"lon" : "-81.84"
			},
			{
				"lat" : "62.63",
				"lon" : "-82.01"
			}], [
			{
				"lat" : "62.12",
				"lon" : "-79.88"
			},
			{
				"lat" : "62.12",
				"lon" : "-79.88"
			}], [
			{
				"lat" : "59.89",
				"lon" : "-43.53"
			},
			{
				"lat" : "60.67",
				"lon" : "-45.29"
			},
			{
				"lat" : "60.83",
				"lon" : "-47.91"
			},
			{
				"lat" : "62.41",
				"lon" : "-49.90"
			},
			{
				"lat" : "64.42",
				"lon" : "-50.71"
			},
			{
				"lat" : "64.94",
				"lon" : "-51.39"
			},
			{
				"lat" : "66.09",
				"lon" : "-52.96"
			},
			{
				"lat" : "67.19",
				"lon" : "-53.62"
			},
			{
				"lat" : "67.51",
				"lon" : "-53.51"
			},
			{
				"lat" : "68.65",
				"lon" : "-51.84"
			},
			{
				"lat" : "70.00",
				"lon" : "-52.19"
			},
			{
				"lat" : "71.03",
				"lon" : "-51.85"
			},
			{
				"lat" : "71.41",
				"lon" : "-55.41"
			},
			{
				"lat" : "72.97",
				"lon" : "-54.63"
			},
			{
				"lat" : "74.70",
				"lon" : "-56.98"
			},
			{
				"lat" : "76.09",
				"lon" : "-61.95"
			},
			{
				"lat" : "75.83",
				"lon" : "-66.38"
			},
			{
				"lat" : "77.00",
				"lon" : "-71.13"
			},
			{
				"lat" : "77.60",
				"lon" : "-66.81"
			},
			{
				"lat" : "77.78",
				"lon" : "-70.78"
			},
			{
				"lat" : "79.70",
				"lon" : "-64.96"
			},
			{
				"lat" : "81.16",
				"lon" : "-63.38"
			},
			{
				"lat" : "82.17",
				"lon" : "-56.89"
			},
			{
				"lat" : "82.15",
				"lon" : "-48.18"
			},
			{
				"lat" : "82.74",
				"lon" : "-42.08"
			},
			{
				"lat" : "83.54",
				"lon" : "-38.02"
			},
			{
				"lat" : "82.94",
				"lon" : "-23.96"
			},
			{
				"lat" : "81.97",
				"lon" : "-25.97"
			},
			{
				"lat" : "80.64",
				"lon" : "-25.99"
			},
			{
				"lat" : "80.97",
				"lon" : "-13.57"
			},
			{
				"lat" : "80.16",
				"lon" : "-16.60"
			},
			{
				"lat" : "78.82",
				"lon" : "-19.82"
			},
			{
				"lat" : "77.54",
				"lon" : "-18.80"
			},
			{
				"lat" : "76.46",
				"lon" : "-21.98"
			},
			{
				"lat" : "75.12",
				"lon" : "-20.69"
			},
			{
				"lat" : "74.40",
				"lon" : "-21.78"
			},
			{
				"lat" : "73.69",
				"lon" : "-24.10"
			},
			{
				"lat" : "73.08",
				"lon" : "-26.54"
			},
			{
				"lat" : "72.69",
				"lon" : "-24.63"
			},
			{
				"lat" : "71.69",
				"lon" : "-21.84"
			},
			{
				"lat" : "71.24",
				"lon" : "-24.62"
			},
			{
				"lat" : "70.89",
				"lon" : "-27.16"
			},
			{
				"lat" : "70.00",
				"lon" : "-27.21"
			},
			{
				"lat" : "69.35",
				"lon" : "-24.10"
			},
			{
				"lat" : "68.43",
				"lon" : "-28.35"
			},
			{
				"lat" : "68.56",
				"lon" : "-32.48"
			},
			{
				"lat" : "66.26",
				"lon" : "-35.26"
			},
			{
				"lat" : "65.90",
				"lon" : "-37.90"
			},
			{
				"lat" : "65.00",
				"lon" : "-40.04"
			},
			{
				"lat" : "64.04",
				"lon" : "-40.49"
			},
			{
				"lat" : "63.14",
				"lon" : "-42.01"
			},
			{
				"lat" : "61.15",
				"lon" : "-42.88"
			},
			{
				"lat" : "60.07",
				"lon" : "-43.09"
			},
			{
				"lat" : "59.90",
				"lon" : "-43.56"
			}], [
			{
				"lat" : "66.41",
				"lon" : "-16.26"
			},
			{
				"lat" : "64.29",
				"lon" : "-15.32"
			},
			{
				"lat" : "63.47",
				"lon" : "-20.14"
			},
			{
				"lat" : "64.21",
				"lon" : "-21.76"
			},
			{
				"lat" : "64.97",
				"lon" : "-21.33"
			},
			{
				"lat" : "65.62",
				"lon" : "-23.04"
			},
			{
				"lat" : "66.26",
				"lon" : "-21.76"
			},
			{
				"lat" : "66.12",
				"lon" : "-18.77"
			},
			{
				"lat" : "66.35",
				"lon" : "-16.23"
			}], [
			{
				"lat" : "51.47",
				"lon" : "0.56"
			},
			{
				"lat" : "54.94",
				"lon" : "-1.71"
			},
			{
				"lat" : "57.52",
				"lon" : "-3.41"
			},
			{
				"lat" : "58.14",
				"lon" : "-5.42"
			},
			{
				"lat" : "55.59",
				"lon" : "-5.77"
			},
			{
				"lat" : "54.82",
				"lon" : "-3.48"
			},
			{
				"lat" : "52.88",
				"lon" : "-4.68"
			},
			{
				"lat" : "51.58",
				"lon" : "-2.68"
			},
			{
				"lat" : "50.08",
				"lon" : "-3.80"
			},
			{
				"lat" : "51.14",
				"lon" : "1.26"
			},
			{
				"lat" : "51.41",
				"lon" : "0.65"
			}], [
			{
				"lat" : "54.91",
				"lon" : "-7.17"
			},
			{
				"lat" : "53.47",
				"lon" : "-9.97"
			},
			{
				"lat" : "51.76",
				"lon" : "-8.52"
			},
			{
				"lat" : "54.79",
				"lon" : "-5.69"
			},
			{
				"lat" : "55.25",
				"lon" : "-7.34"
			}], [
			{
				"lat" : "60.66",
				"lon" : "-1.33"
			},
			{
				"lat" : "60.38",
				"lon" : "-1.17"
			}], [
			{
				"lat" : "58.44",
				"lon" : "-6.18"
			},
			{
				"lat" : "58.36",
				"lon" : "-6.09"
			}], [
			{
				"lat" : "57.58",
				"lon" : "-6.47"
			},
			{
				"lat" : "57.54",
				"lon" : "-6.33"
			}], [
			{
				"lat" : "57.54",
				"lon" : "-7.30"
			}], [
			{
				"lat" : "57.05",
				"lon" : "-7.46"
			}], [
			{
				"lat" : "56.94",
				"lon" : "-6.54"
			}], [
			{
				"lat" : "55.94",
				"lon" : "-6.00"
			}], [
			{
				"lat" : "55.55",
				"lon" : "-5.09"
			}], [
			{
				"lat" : "54.38",
				"lon" : "-4.44"
			},
			{
				"lat" : "54.19",
				"lon" : "-4.30"
			}], [
			{
				"lat" : "71.02",
				"lon" : "-8.08"
			},
			{
				"lat" : "70.86",
				"lon" : "-8.21"
			}], [
			{
				"lat" : "79.52",
				"lon" : "16.92"
			},
			{
				"lat" : "78.46",
				"lon" : "22.26"
			},
			{
				"lat" : "76.41",
				"lon" : "16.86"
			},
			{
				"lat" : "77.39",
				"lon" : "16.00"
			},
			{
				"lat" : "77.92",
				"lon" : "16.03"
			},
			{
				"lat" : "79.50",
				"lon" : "16.81"
			}], [
			{
				"lat" : "79.40",
				"lon" : "14.71"
			},
			{
				"lat" : "79.12",
				"lon" : "16.05"
			},
			{
				"lat" : "77.80",
				"lon" : "14.02"
			},
			{
				"lat" : "78.46",
				"lon" : "13.56"
			},
			{
				"lat" : "79.26",
				"lon" : "12.63"
			},
			{
				"lat" : "79.40",
				"lon" : "14.68"
			}], [
			{
				"lat" : "78.24",
				"lon" : "22.01"
			},
			{
				"lat" : "78.23",
				"lon" : "21.86"
			}], [
			{
				"lat" : "77.75",
				"lon" : "21.54"
			},
			{
				"lat" : "77.26",
				"lon" : "23.88"
			},
			{
				"lat" : "77.67",
				"lon" : "21.53"
			},
			{
				"lat" : "77.79",
				"lon" : "22.79"
			}], [
			{
				"lat" : "79.97",
				"lon" : "23.50"
			},
			{
				"lat" : "79.54",
				"lon" : "28.24"
			},
			{
				"lat" : "78.94",
				"lon" : "20.85"
			},
			{
				"lat" : "79.34",
				"lon" : "19.00"
			},
			{
				"lat" : "79.88",
				"lon" : "21.05"
			},
			{
				"lat" : "79.96",
				"lon" : "23.41"
			}], [
			{
				"lat" : "80.23",
				"lon" : "46.98"
			},
			{
				"lat" : "79.97",
				"lon" : "43.13"
			},
			{
				"lat" : "80.22",
				"lon" : "47.18"
			}], [
			{
				"lat" : "80.19",
				"lon" : "50.43"
			},
			{
				"lat" : "79.88",
				"lon" : "50.55"
			},
			{
				"lat" : "79.86",
				"lon" : "47.77"
			},
			{
				"lat" : "80.14",
				"lon" : "50.45"
			}], [
			{
				"lat" : "80.18",
				"lon" : "61.79"
			},
			{
				"lat" : "80.18",
				"lon" : "61.79"
			}], [
			{
				"lat" : "80.69",
				"lon" : "65.08"
			},
			{
				"lat" : "80.59",
				"lon" : "64.27"
			},
			{
				"lat" : "80.68",
				"lon" : "65.13"
			}], [
			{
				"lat" : "35.66",
				"lon" : "-5.13"
			},
			{
				"lat" : "36.63",
				"lon" : "4.06"
			},
			{
				"lat" : "37.12",
				"lon" : "10.40"
			},
			{
				"lat" : "33.61",
				"lon" : "11.36"
			},
			{
				"lat" : "30.10",
				"lon" : "20.10"
			},
			{
				"lat" : "32.17",
				"lon" : "23.49"
			},
			{
				"lat" : "30.80",
				"lon" : "31.65"
			},
			{
				"lat" : "23.74",
				"lon" : "35.76"
			},
			{
				"lat" : "14.82",
				"lon" : "39.75"
			},
			{
				"lat" : "11.34",
				"lon" : "42.93"
			},
			{
				"lat" : "11.45",
				"lon" : "51.52"
			},
			{
				"lat" : "6.99",
				"lon" : "49.82"
			},
			{
				"lat" : "-0.62",
				"lon" : "43.13"
			},
			{
				"lat" : "-7.58",
				"lon" : "39.15"
			},
			{
				"lat" : "-13.20",
				"lon" : "40.37"
			},
			{
				"lat" : "-18.17",
				"lon" : "37.74"
			},
			{
				"lat" : "-22.71",
				"lon" : "35.33"
			},
			{
				"lat" : "-28.15",
				"lon" : "32.84"
			},
			{
				"lat" : "-34.39",
				"lon" : "26.50"
			},
			{
				"lat" : "-35.51",
				"lon" : "19.55"
			},
			{
				"lat" : "-30.88",
				"lon" : "17.50"
			},
			{
				"lat" : "-18.75",
				"lon" : "12.24"
			},
			{
				"lat" : "-12.81",
				"lon" : "13.89"
			},
			{
				"lat" : "-5.55",
				"lon" : "12.05"
			},
			{
				"lat" : "0.14",
				"lon" : "9.67"
			},
			{
				"lat" : "3.79",
				"lon" : "7.19"
			},
			{
				"lat" : "5.39",
				"lon" : "1.74"
			},
			{
				"lat" : "4.59",
				"lon" : "-4.77"
			},
			{
				"lat" : "6.75",
				"lon" : "-12.00"
			},
			{
				"lat" : "10.98",
				"lon" : "-15.54"
			},
			{
				"lat" : "15.50",
				"lon" : "-16.33"
			},
			{
				"lat" : "22.29",
				"lon" : "-16.10"
			},
			{
				"lat" : "27.12",
				"lon" : "-12.90"
			},
			{
				"lat" : "31.09",
				"lon" : "-9.52"
			},
			{
				"lat" : "35.58",
				"lon" : "-5.41"
			}], [
			{
				"lat" : "0.00",
				"lon" : "33.71"
			},
			{
				"lat" : "-3.42",
				"lon" : "33.48"
			},
			{
				"lat" : "-0.20",
				"lon" : "33.34"
			},
			{
				"lat" : "0.00",
				"lon" : "33.71"
			}], [
			{
				"lat" : "-12.50",
				"lon" : "49.30"
			},
			{
				"lat" : "-18.79",
				"lon" : "49.28"
			},
			{
				"lat" : "-25.50",
				"lon" : "43.95"
			},
			{
				"lat" : "-20.08",
				"lon" : "44.37"
			},
			{
				"lat" : "-16.31",
				"lon" : "46.34"
			},
			{
				"lat" : "-14.08",
				"lon" : "47.91"
			},
			{
				"lat" : "-12.50",
				"lon" : "49.30"
			}], [
			{
				"lat" : "69.10",
				"lon" : "178.88"
			},
			{
				"lat" : "68.42",
				"lon" : "181.20"
			},
			{
				"lat" : "67.78",
				"lon" : "183.52"
			},
			{
				"lat" : "66.38",
				"lon" : "188.87"
			},
			{
				"lat" : "64.74",
				"lon" : "186.54"
			},
			{
				"lat" : "65.63",
				"lon" : "182.87"
			},
			{
				"lat" : "65.14",
				"lon" : "180.13"
			},
			{
				"lat" : "64.88",
				"lon" : "179.48"
			},
			{
				"lat" : "64.29",
				"lon" : "178.20"
			},
			{
				"lat" : "62.62",
				"lon" : "177.46"
			},
			{
				"lat" : "60.17",
				"lon" : "170.42"
			},
			{
				"lat" : "59.89",
				"lon" : "164.48"
			},
			{
				"lat" : "57.34",
				"lon" : "162.92"
			},
			{
				"lat" : "54.88",
				"lon" : "161.82"
			},
			{
				"lat" : "51.09",
				"lon" : "156.42"
			},
			{
				"lat" : "57.76",
				"lon" : "156.40"
			},
			{
				"lat" : "61.73",
				"lon" : "163.79"
			},
			{
				"lat" : "60.73",
				"lon" : "159.90"
			},
			{
				"lat" : "61.68",
				"lon" : "156.81"
			},
			{
				"lat" : "59.10",
				"lon" : "153.83"
			},
			{
				"lat" : "59.46",
				"lon" : "148.57"
			},
			{
				"lat" : "58.39",
				"lon" : "140.77"
			},
			{
				"lat" : "54.07",
				"lon" : "137.10"
			},
			{
				"lat" : "52.43",
				"lon" : "140.72"
			},
			{
				"lat" : "47.30",
				"lon" : "138.77"
			},
			{
				"lat" : "42.04",
				"lon" : "129.92"
			},
			{
				"lat" : "38.46",
				"lon" : "128.33"
			},
			{
				"lat" : "35.18",
				"lon" : "126.15"
			},
			{
				"lat" : "39.08",
				"lon" : "125.12"
			},
			{
				"lat" : "40.15",
				"lon" : "121.62"
			},
			{
				"lat" : "38.21",
				"lon" : "117.58"
			},
			{
				"lat" : "36.90",
				"lon" : "121.77"
			},
			{
				"lat" : "32.65",
				"lon" : "120.73"
			},
			{
				"lat" : "30.25",
				"lon" : "121.28"
			},
			{
				"lat" : "24.93",
				"lon" : "118.83"
			},
			{
				"lat" : "21.81",
				"lon" : "112.69"
			},
			{
				"lat" : "21.73",
				"lon" : "108.53"
			},
			{
				"lat" : "16.34",
				"lon" : "107.55"
			},
			{
				"lat" : "10.45",
				"lon" : "107.32"
			},
			{
				"lat" : "10.37",
				"lon" : "104.39"
			},
			{
				"lat" : "13.52",
				"lon" : "100.01"
			},
			{
				"lat" : "8.30",
				"lon" : "100.26"
			},
			{
				"lat" : "1.56",
				"lon" : "103.22"
			},
			{
				"lat" : "9.17",
				"lon" : "98.21"
			},
			{
				"lat" : "15.36",
				"lon" : "97.66"
			},
			{
				"lat" : "17.79",
				"lon" : "94.21"
			},
			{
				"lat" : "21.74",
				"lon" : "90.05"
			},
			{
				"lat" : "21.03",
				"lon" : "90.06"
			},
			{
				"lat" : "15.95",
				"lon" : "82.06"
			},
			{
				"lat" : "11.72",
				"lon" : "80.05"
			},
			{
				"lat" : "8.60",
				"lon" : "76.41"
			},
			{
				"lat" : "17.43",
				"lon" : "72.79"
			},
			{
				"lat" : "20.00",
				"lon" : "72.02"
			},
			{
				"lat" : "21.99",
				"lon" : "68.98"
			},
			{
				"lat" : "24.41",
				"lon" : "64.62"
			},
			{
				"lat" : "24.77",
				"lon" : "57.83"
			},
			{
				"lat" : "26.20",
				"lon" : "53.11"
			},
			{
				"lat" : "29.41",
				"lon" : "49.67"
			},
			{
				"lat" : "25.15",
				"lon" : "50.96"
			},
			{
				"lat" : "23.44",
				"lon" : "54.33"
			},
			{
				"lat" : "22.57",
				"lon" : "59.03"
			},
			{
				"lat" : "18.86",
				"lon" : "57.87"
			},
			{
				"lat" : "15.74",
				"lon" : "52.95"
			},
			{
				"lat" : "12.96",
				"lon" : "47.26"
			},
			{
				"lat" : "14.68",
				"lon" : "42.75"
			},
			{
				"lat" : "19.61",
				"lon" : "39.93"
			},
			{
				"lat" : "25.78",
				"lon" : "36.92"
			},
			{
				"lat" : "28.46",
				"lon" : "33.30"
			},
			{
				"lat" : "30.63",
				"lon" : "32.60"
			},
			{
				"lat" : "30.58",
				"lon" : "32.18"
			},
			{
				"lat" : "35.03",
				"lon" : "36.08"
			},
			{
				"lat" : "36.17",
				"lon" : "32.53"
			},
			{
				"lat" : "36.94",
				"lon" : "27.77"
			},
			{
				"lat" : "39.18",
				"lon" : "26.51"
			},
			{
				"lat" : "40.82",
				"lon" : "31.54"
			},
			{
				"lat" : "40.48",
				"lon" : "38.53"
			},
			{
				"lat" : "43.17",
				"lon" : "40.35"
			},
			{
				"lat" : "46.45",
				"lon" : "39.88"
			},
			{
				"lat" : "44.99",
				"lon" : "35.18"
			},
			{
				"lat" : "44.96",
				"lon" : "33.50"
			},
			{
				"lat" : "45.14",
				"lon" : "30.24"
			},
			{
				"lat" : "41.48",
				"lon" : "28.70"
			},
			{
				"lat" : "39.84",
				"lon" : "26.55"
			},
			{
				"lat" : "39.67",
				"lon" : "23.62"
			},
			{
				"lat" : "37.34",
				"lon" : "23.80"
			},
			{
				"lat" : "36.92",
				"lon" : "21.90"
			},
			{
				"lat" : "42.02",
				"lon" : "18.79"
			},
			{
				"lat" : "44.31",
				"lon" : "14.52"
			},
			{
				"lat" : "42.25",
				"lon" : "14.58"
			},
			{
				"lat" : "39.57",
				"lon" : "18.32"
			},
			{
				"lat" : "39.35",
				"lon" : "16.05"
			},
			{
				"lat" : "42.36",
				"lon" : "11.52"
			},
			{
				"lat" : "43.08",
				"lon" : "6.87"
			},
			{
				"lat" : "41.09",
				"lon" : "2.80"
			},
			{
				"lat" : "37.14",
				"lon" : "-1.11"
			},
			{
				"lat" : "36.70",
				"lon" : "-6.24"
			},
			{
				"lat" : "39.57",
				"lon" : "-8.67"
			},
			{
				"lat" : "43.13",
				"lon" : "-6.51"
			},
			{
				"lat" : "45.55",
				"lon" : "-0.84"
			},
			{
				"lat" : "48.40",
				"lon" : "-3.93"
			},
			{
				"lat" : "49.09",
				"lon" : "0.48"
			},
			{
				"lat" : "51.29",
				"lon" : "4.20"
			},
			{
				"lat" : "52.92",
				"lon" : "6.44"
			},
			{
				"lat" : "55.94",
				"lon" : "8.42"
			},
			{
				"lat" : "55.49",
				"lon" : "11.72"
			},
			{
				"lat" : "53.66",
				"lon" : "11.73"
			},
			{
				"lat" : "54.14",
				"lon" : "16.78"
			},
			{
				"lat" : "56.32",
				"lon" : "21.40"
			},
			{
				"lat" : "57.20",
				"lon" : "24.67"
			},
			{
				"lat" : "59.18",
				"lon" : "28.94"
			},
			{
				"lat" : "59.52",
				"lon" : "24.16"
			},
			{
				"lat" : "62.66",
				"lon" : "22.07"
			},
			{
				"lat" : "65.35",
				"lon" : "23.76"
			},
			{
				"lat" : "62.54",
				"lon" : "18.70"
			},
			{
				"lat" : "59.67",
				"lon" : "19.11"
			},
			{
				"lat" : "58.54",
				"lon" : "18.40"
			},
			{
				"lat" : "55.73",
				"lon" : "15.34"
			},
			{
				"lat" : "58.08",
				"lon" : "11.74"
			},
			{
				"lat" : "57.68",
				"lon" : "8.37"
			},
			{
				"lat" : "59.20",
				"lon" : "5.80"
			},
			{
				"lat" : "60.86",
				"lon" : "7.38"
			},
			{
				"lat" : "61.86",
				"lon" : "7.51"
			},
			{
				"lat" : "62.99",
				"lon" : "9.62"
			},
			{
				"lat" : "65.46",
				"lon" : "13.37"
			},
			{
				"lat" : "67.12",
				"lon" : "15.46"
			},
			{
				"lat" : "68.62",
				"lon" : "18.54"
			},
			{
				"lat" : "69.64",
				"lon" : "22.32"
			},
			{
				"lat" : "70.17",
				"lon" : "24.77"
			},
			{
				"lat" : "69.79",
				"lon" : "25.93"
			},
			{
				"lat" : "70.46",
				"lon" : "28.56"
			},
			{
				"lat" : "69.76",
				"lon" : "29.75"
			},
			{
				"lat" : "69.11",
				"lon" : "33.83"
			},
			{
				"lat" : "66.85",
				"lon" : "41.90"
			},
			{
				"lat" : "66.25",
				"lon" : "35.14"
			},
			{
				"lat" : "66.07",
				"lon" : "33.30"
			},
			{
				"lat" : "64.15",
				"lon" : "35.46"
			},
			{
				"lat" : "64.03",
				"lon" : "37.68"
			},
			{
				"lat" : "64.09",
				"lon" : "41.71"
			},
			{
				"lat" : "65.58",
				"lon" : "44.80"
			},
			{
				"lat" : "68.16",
				"lon" : "44.87"
			},
			{
				"lat" : "66.83",
				"lon" : "45.92"
			},
			{
				"lat" : "67.85",
				"lon" : "51.79"
			},
			{
				"lat" : "67.89",
				"lon" : "53.70"
			},
			{
				"lat" : "68.09",
				"lon" : "59.68"
			},
			{
				"lat" : "69.08",
				"lon" : "65.07"
			},
			{
				"lat" : "69.19",
				"lon" : "68.56"
			},
			{
				"lat" : "70.97",
				"lon" : "68.38"
			},
			{
				"lat" : "71.62",
				"lon" : "73.03"
			},
			{
				"lat" : "68.29",
				"lon" : "73.80"
			},
			{
				"lat" : "66.45",
				"lon" : "69.42"
			},
			{
				"lat" : "66.36",
				"lon" : "73.43"
			},
			{
				"lat" : "68.36",
				"lon" : "77.51"
			},
			{
				"lat" : "66.74",
				"lon" : "80.74"
			},
			{
				"lat" : "68.67",
				"lon" : "75.27"
			},
			{
				"lat" : "71.80",
				"lon" : "75.11"
			},
			{
				"lat" : "70.56",
				"lon" : "78.62"
			},
			{
				"lat" : "71.90",
				"lon" : "78.43"
			},
			{
				"lat" : "71.23",
				"lon" : "82.72"
			},
			{
				"lat" : "70.03",
				"lon" : "84.25"
			},
			{
				"lat" : "72.76",
				"lon" : "81.40"
			},
			{
				"lat" : "74.01",
				"lon" : "86.50"
			},
			{
				"lat" : "74.78",
				"lon" : "87.68"
			},
			{
				"lat" : "75.23",
				"lon" : "90.25"
			},
			{
				"lat" : "75.57",
				"lon" : "89.68"
			},
			{
				"lat" : "75.95",
				"lon" : "95.12"
			},
			{
				"lat" : "76.09",
				"lon" : "99.69"
			},
			{
				"lat" : "77.52",
				"lon" : "104.10"
			},
			{
				"lat" : "76.40",
				"lon" : "106.34"
			},
			{
				"lat" : "75.60",
				"lon" : "112.99"
			},
			{
				"lat" : "73.72",
				"lon" : "107.88"
			},
			{
				"lat" : "73.71",
				"lon" : "110.43"
			},
			{
				"lat" : "73.37",
				"lon" : "113.34"
			},
			{
				"lat" : "73.28",
				"lon" : "123.10"
			},
			{
				"lat" : "73.02",
				"lon" : "128.94"
			},
			{
				"lat" : "72.24",
				"lon" : "126.10"
			},
			{
				"lat" : "70.86",
				"lon" : "130.53"
			},
			{
				"lat" : "71.51",
				"lon" : "135.49"
			},
			{
				"lat" : "72.23",
				"lon" : "139.60"
			},
			{
				"lat" : "72.39",
				"lon" : "146.04"
			},
			{
				"lat" : "72.21",
				"lon" : "146.92"
			},
			{
				"lat" : "71.28",
				"lon" : "150.77"
			},
			{
				"lat" : "70.14",
				"lon" : "159.92"
			},
			{
				"lat" : "69.63",
				"lon" : "167.68"
			},
			{
				"lat" : "69.99",
				"lon" : "170.20"
			},
			{
				"lat" : "69.10",
				"lon" : "178.88"
			}], [
			{
				"lat" : "76.71",
				"lon" : "68.33"
			},
			{
				"lat" : "75.62",
				"lon" : "66.03"
			},
			{
				"lat" : "74.11",
				"lon" : "59.10"
			},
			{
				"lat" : "73.03",
				"lon" : "54.92"
			},
			{
				"lat" : "74.10",
				"lon" : "56.67"
			},
			{
				"lat" : "75.09",
				"lon" : "58.56"
			},
			{
				"lat" : "75.87",
				"lon" : "63.86"
			},
			{
				"lat" : "76.70",
				"lon" : "68.19"
			}], [
			{
				"lat" : "72.57",
				"lon" : "53.04"
			},
			{
				"lat" : "70.39",
				"lon" : "58.29"
			},
			{
				"lat" : "70.78",
				"lon" : "55.03"
			},
			{
				"lat" : "72.26",
				"lon" : "53.44"
			},
			{
				"lat" : "72.61",
				"lon" : "53.63"
			}], [
			{
				"lat" : "46.50",
				"lon" : "52.22"
			},
			{
				"lat" : "44.73",
				"lon" : "51.73"
			},
			{
				"lat" : "41.80",
				"lon" : "52.56"
			},
			{
				"lat" : "40.40",
				"lon" : "53.43"
			},
			{
				"lat" : "37.86",
				"lon" : "54.22"
			},
			{
				"lat" : "38.45",
				"lon" : "49.04"
			},
			{
				"lat" : "42.76",
				"lon" : "48.17"
			},
			{
				"lat" : "45.64",
				"lon" : "49.33"
			},
			{
				"lat" : "46.50",
				"lon" : "52.22"
			}], [
			{
				"lat" : "46.32",
				"lon" : "62.32"
			},
			{
				"lat" : "43.06",
				"lon" : "60.32"
			},
			{
				"lat" : "45.58",
				"lon" : "59.57"
			},
			{
				"lat" : "46.33",
				"lon" : "61.94"
			}], [
			{
				"lat" : "46.12",
				"lon" : "79.55"
			},
			{
				"lat" : "44.44",
				"lon" : "74.30"
			},
			{
				"lat" : "45.79",
				"lon" : "78.62"
			},
			{
				"lat" : "46.07",
				"lon" : "79.66"
			}], [
			{
				"lat" : "41.96",
				"lon" : "76.81"
			},
			{
				"lat" : "41.86",
				"lon" : "76.73"
			}], [
			{
				"lat" : "35.15",
				"lon" : "35.15"
			},
			{
				"lat" : "34.84",
				"lon" : "34.61"
			},
			{
				"lat" : "35.17",
				"lon" : "35.18"
			}], [
			{
				"lat" : "35.33",
				"lon" : "23.84"
			},
			{
				"lat" : "34.91",
				"lon" : "24.30"
			},
			{
				"lat" : "35.39",
				"lon" : "24.09"
			}], [
			{
				"lat" : "37.89",
				"lon" : "15.54"
			},
			{
				"lat" : "37.89",
				"lon" : "13.47"
			},
			{
				"lat" : "37.89",
				"lon" : "15.54"
			}], [
			{
				"lat" : "40.95",
				"lon" : "9.56"
			},
			{
				"lat" : "39.99",
				"lon" : "8.46"
			},
			{
				"lat" : "40.69",
				"lon" : "9.12"
			}], [
			{
				"lat" : "42.60",
				"lon" : "9.72"
			},
			{
				"lat" : "42.35",
				"lon" : "9.54"
			}], [
			{
				"lat" : "8.95",
				"lon" : "80.60"
			},
			{
				"lat" : "5.96",
				"lon" : "79.73"
			},
			{
				"lat" : "8.30",
				"lon" : "80.10"
			}], [
			{
				"lat" : "57.44",
				"lon" : "11.04"
			},
			{
				"lat" : "57.25",
				"lon" : "10.67"
			}], [
			{
				"lat" : "24.67",
				"lon" : "-77.92"
			},
			{
				"lat" : "24.22",
				"lon" : "-77.98"
			}], [
			{
				"lat" : "23.62",
				"lon" : "-77.61"
			},
			{
				"lat" : "23.64",
				"lon" : "-77.18"
			}], [
			{
				"lat" : "24.13",
				"lon" : "-75.55"
			},
			{
				"lat" : "24.31",
				"lon" : "-75.41"
			}], [
			{
				"lat" : "-0.17",
				"lon" : "-91.40"
			},
			{
				"lat" : "-0.26",
				"lon" : "-91.52"
			}], [
			{
				"lat" : "46.68",
				"lon" : "-60.25"
			},
			{
				"lat" : "46.33",
				"lon" : "-60.71"
			}], [
			{
				"lat" : "49.47",
				"lon" : "-63.89"
			},
			{
				"lat" : "49.43",
				"lon" : "-63.45"
			}], [
			{
				"lat" : "-10.60",
				"lon" : "142.53"
			},
			{
				"lat" : "-16.34",
				"lon" : "145.62"
			},
			{
				"lat" : "-22.09",
				"lon" : "149.79"
			},
			{
				"lat" : "-26.82",
				"lon" : "153.21"
			},
			{
				"lat" : "-35.19",
				"lon" : "150.52"
			},
			{
				"lat" : "-38.53",
				"lon" : "145.60"
			},
			{
				"lat" : "-37.69",
				"lon" : "140.13"
			},
			{
				"lat" : "-34.77",
				"lon" : "137.34"
			},
			{
				"lat" : "-34.56",
				"lon" : "135.76"
			},
			{
				"lat" : "-31.34",
				"lon" : "131.50"
			},
			{
				"lat" : "-33.65",
				"lon" : "121.72"
			},
			{
				"lat" : "-33.25",
				"lon" : "115.62"
			},
			{
				"lat" : "-26.01",
				"lon" : "114.09"
			},
			{
				"lat" : "-21.27",
				"lon" : "114.88"
			},
			{
				"lat" : "-18.13",
				"lon" : "122.34"
			},
			{
				"lat" : "-14.53",
				"lon" : "125.32"
			},
			{
				"lat" : "-14.90",
				"lon" : "128.39"
			},
			{
				"lat" : "-11.42",
				"lon" : "132.35"
			},
			{
				"lat" : "-12.43",
				"lon" : "136.16"
			},
			{
				"lat" : "-16.45",
				"lon" : "138.07"
			},
			{
				"lat" : "-10.78",
				"lon" : "142.25"
			}], [
			{
				"lat" : "-40.68",
				"lon" : "144.72"
			},
			{
				"lat" : "-42.14",
				"lon" : "148.32"
			},
			{
				"lat" : "-42.77",
				"lon" : "145.57"
			},
			{
				"lat" : "-41.19",
				"lon" : "146.47"
			}], [
			{
				"lat" : "-34.23",
				"lon" : "172.86"
			},
			{
				"lat" : "-37.52",
				"lon" : "176.10"
			},
			{
				"lat" : "-39.49",
				"lon" : "177.06"
			},
			{
				"lat" : "-38.03",
				"lon" : "174.77"
			},
			{
				"lat" : "-34.27",
				"lon" : "172.83"
			}], [
			{
				"lat" : "-40.53",
				"lon" : "172.36"
			},
			{
				"lat" : "-43.81",
				"lon" : "172.92"
			},
			{
				"lat" : "-46.13",
				"lon" : "168.41"
			},
			{
				"lat" : "-43.21",
				"lon" : "170.26"
			},
			{
				"lat" : "-40.94",
				"lon" : "173.69"
			}], [
			{
				"lat" : "-10.18",
				"lon" : "150.74"
			},
			{
				"lat" : "-8.26",
				"lon" : "143.04"
			},
			{
				"lat" : "-6.97",
				"lon" : "138.48"
			},
			{
				"lat" : "-2.94",
				"lon" : "131.95"
			},
			{
				"lat" : "-1.35",
				"lon" : "130.91"
			},
			{
				"lat" : "-2.64",
				"lon" : "134.38"
			},
			{
				"lat" : "-2.62",
				"lon" : "141.24"
			},
			{
				"lat" : "-8.15",
				"lon" : "148.19"
			},
			{
				"lat" : "-10.27",
				"lon" : "150.75"
			}], [
			{
				"lat" : "7.01",
				"lon" : "117.24"
			},
			{
				"lat" : "0.76",
				"lon" : "117.90"
			},
			{
				"lat" : "-3.50",
				"lon" : "113.89"
			},
			{
				"lat" : "-0.82",
				"lon" : "109.44"
			},
			{
				"lat" : "3.38",
				"lon" : "113.13"
			},
			{
				"lat" : "7.01",
				"lon" : "117.24"
			}], [
			{
				"lat" : "5.75",
				"lon" : "95.31"
			},
			{
				"lat" : "1.40",
				"lon" : "102.32"
			},
			{
				"lat" : "-2.98",
				"lon" : "106.03"
			},
			{
				"lat" : "-2.81",
				"lon" : "101.46"
			},
			{
				"lat" : "5.73",
				"lon" : "95.20"
			}], [
			{
				"lat" : "41.53",
				"lon" : "140.91"
			},
			{
				"lat" : "35.75",
				"lon" : "140.79"
			},
			{
				"lat" : "34.56",
				"lon" : "136.82"
			},
			{
				"lat" : "34.72",
				"lon" : "133.56"
			},
			{
				"lat" : "35.41",
				"lon" : "132.49"
			},
			{
				"lat" : "37.20",
				"lon" : "136.73"
			},
			{
				"lat" : "40.00",
				"lon" : "139.82"
			},
			{
				"lat" : "41.43",
				"lon" : "140.68"
			}], [
			{
				"lat" : "34.30",
				"lon" : "133.71"
			},
			{
				"lat" : "31.58",
				"lon" : "131.41"
			},
			{
				"lat" : "33.10",
				"lon" : "129.38"
			},
			{
				"lat" : "34.37",
				"lon" : "133.90"
			}], [
			{
				"lat" : "45.50",
				"lon" : "141.89"
			},
			{
				"lat" : "42.92",
				"lon" : "144.12"
			},
			{
				"lat" : "41.64",
				"lon" : "140.30"
			},
			{
				"lat" : "45.30",
				"lon" : "141.53"
			},
			{
				"lat" : "45.53",
				"lon" : "141.89"
			}], [
			{
				"lat" : "54.36",
				"lon" : "142.57"
			},
			{
				"lat" : "49.19",
				"lon" : "143.64"
			},
			{
				"lat" : "45.88",
				"lon" : "141.99"
			},
			{
				"lat" : "50.85",
				"lon" : "141.92"
			},
			{
				"lat" : "54.34",
				"lon" : "142.60"
			}], [
			{
				"lat" : "25.48",
				"lon" : "121.92"
			},
			{
				"lat" : "24.70",
				"lon" : "120.53"
			},
			{
				"lat" : "25.51",
				"lon" : "121.70"
			}], [
			{
				"lat" : "20.07",
				"lon" : "110.81"
			},
			{
				"lat" : "19.66",
				"lon" : "109.20"
			},
			{
				"lat" : "20.07",
				"lon" : "110.81"
			}], [
			{
				"lat" : "-6.16",
				"lon" : "106.51"
			},
			{
				"lat" : "-7.72",
				"lon" : "114.15"
			},
			{
				"lat" : "-7.89",
				"lon" : "108.71"
			},
			{
				"lat" : "-6.16",
				"lon" : "106.51"
			}], [
			{
				"lat" : "-20.01",
				"lon" : "164.27"
			},
			{
				"lat" : "-20.27",
				"lon" : "164.16"
			}], [
			{
				"lat" : "-17.04",
				"lon" : "178.61"
			},
			{
				"lat" : "-17.04",
				"lon" : "178.61"
			}], [
			{
				"lat" : "-16.43",
				"lon" : "179.45"
			},
			{
				"lat" : "-16.43",
				"lon" : "179.35"
			}], [
			{
				"lat" : "-13.39",
				"lon" : "-172.55"
			},
			{
				"lat" : "-13.78",
				"lon" : "-172.61"
			}], [
			{
				"lat" : "18.67",
				"lon" : "122.26"
			},
			{
				"lat" : "13.86",
				"lon" : "123.05"
			},
			{
				"lat" : "13.80",
				"lon" : "120.73"
			},
			{
				"lat" : "16.43",
				"lon" : "120.43"
			},
			{
				"lat" : "18.40",
				"lon" : "121.72"
			}], [
			{
				"lat" : "9.79",
				"lon" : "125.34"
			},
			{
				"lat" : "6.28",
				"lon" : "125.56"
			},
			{
				"lat" : "7.00",
				"lon" : "122.38"
			},
			{
				"lat" : "9.38",
				"lon" : "125.10"
			}], [
			{
				"lat" : "11.35",
				"lon" : "119.64"
			},
			{
				"lat" : "10.16",
				"lon" : "118.81"
			},
			{
				"lat" : "10.86",
				"lon" : "119.59"
			},
			{
				"lat" : "11.35",
				"lon" : "119.64"
			}], [
			{
				"lat" : "65.14",
				"lon" : "-179.87"
			},
			{
				"lat" : "65.63",
				"lon" : "-177.13"
			},
			{
				"lat" : "64.74",
				"lon" : "-173.46"
			},
			{
				"lat" : "66.38",
				"lon" : "-171.13"
			},
			{
				"lat" : "67.78",
				"lon" : "-176.48"
			},
			{
				"lat" : "68.42",
				"lon" : "-178.80"
			}], [
			{
				"lat" : "79.08",
				"lon" : "101.96"
			},
			{
				"lat" : "77.86",
				"lon" : "101.31"
			},
			{
				"lat" : "79.04",
				"lon" : "101.22"
			}], [
			{
				"lat" : "79.29",
				"lon" : "94.29"
			},
			{
				"lat" : "78.68",
				"lon" : "95.31"
			},
			{
				"lat" : "79.43",
				"lon" : "100.02"
			},
			{
				"lat" : "79.62",
				"lon" : "97.26"
			},
			{
				"lat" : "79.65",
				"lon" : "95.44"
			}], [
			{
				"lat" : "80.62",
				"lon" : "95.46"
			},
			{
				"lat" : "79.66",
				"lon" : "92.39"
			},
			{
				"lat" : "80.54",
				"lon" : "95.07"
			}], [
			{
				"lat" : "76.05",
				"lon" : "138.54"
			},
			{
				"lat" : "75.45",
				"lon" : "144.93"
			},
			{
				"lat" : "74.99",
				"lon" : "140.30"
			},
			{
				"lat" : "75.44",
				"lon" : "137.27"
			},
			{
				"lat" : "75.98",
				"lon" : "138.29"
			}], [
			{
				"lat" : "75.29",
				"lon" : "146.08"
			},
			{
				"lat" : "74.73",
				"lon" : "147.75"
			},
			{
				"lat" : "75.06",
				"lon" : "145.85"
			}], [
			{
				"lat" : "73.88",
				"lon" : "141.44"
			},
			{
				"lat" : "73.84",
				"lon" : "141.48"
			}], [
			{
				"lat" : "-71.68",
				"lon" : "0.01"
			},
			{
				"lat" : "-70.57",
				"lon" : "6.57"
			},
			{
				"lat" : "-70.44",
				"lon" : "15.04"
			},
			{
				"lat" : "-70.75",
				"lon" : "25.10"
			},
			{
				"lat" : "-69.10",
				"lon" : "33.37"
			},
			{
				"lat" : "-69.77",
				"lon" : "38.46"
			},
			{
				"lat" : "-68.16",
				"lon" : "42.85"
			},
			{
				"lat" : "-67.23",
				"lon" : "46.59"
			},
			{
				"lat" : "-66.96",
				"lon" : "49.35"
			},
			{
				"lat" : "-65.97",
				"lon" : "52.90"
			},
			{
				"lat" : "-67.20",
				"lon" : "58.46"
			},
			{
				"lat" : "-67.58",
				"lon" : "63.60"
			},
			{
				"lat" : "-68.41",
				"lon" : "70.63"
			},
			{
				"lat" : "-70.36",
				"lon" : "69.24"
			},
			{
				"lat" : "-69.44",
				"lon" : "76.20"
			},
			{
				"lat" : "-66.64",
				"lon" : "88.08"
			},
			{
				"lat" : "-66.52",
				"lon" : "94.98"
			},
			{
				"lat" : "-66.09",
				"lon" : "101.53"
			},
			{
				"lat" : "-65.91",
				"lon" : "111.31"
			},
			{
				"lat" : "-66.87",
				"lon" : "118.64"
			},
			{
				"lat" : "-66.24",
				"lon" : "126.24"
			},
			{
				"lat" : "-66.18",
				"lon" : "133.09"
			},
			{
				"lat" : "-66.72",
				"lon" : "139.85"
			},
			{
				"lat" : "-67.96",
				"lon" : "146.86"
			},
			{
				"lat" : "-68.82",
				"lon" : "153.65"
			},
			{
				"lat" : "-69.57",
				"lon" : "159.94"
			},
			{
				"lat" : "-70.67",
				"lon" : "164.10"
			},
			{
				"lat" : "-71.94",
				"lon" : "170.19"
			},
			{
				"lat" : "-74.64",
				"lon" : "165.68"
			},
			{
				"lat" : "-77.60",
				"lon" : "163.82"
			},
			{
				"lat" : "-78.95",
				"lon" : "162.10"
			},
			{
				"lat" : "-82.84",
				"lon" : "166.72"
			},
			{
				"lat" : "-83.86",
				"lon" : "175.58"
			}], [
			{
				"lat" : "-84.37",
				"lon" : "-178.56"
			},
			{
				"lat" : "-85.40",
				"lon" : "-147.96"
			},
			{
				"lat" : "-81.12",
				"lon" : "-152.96"
			},
			{
				"lat" : "-79.50",
				"lon" : "-153.95"
			},
			{
				"lat" : "-77.48",
				"lon" : "-151.24"
			},
			{
				"lat" : "-76.44",
				"lon" : "-146.74"
			},
			{
				"lat" : "-75.16",
				"lon" : "-137.68"
			},
			{
				"lat" : "-74.63",
				"lon" : "-131.63"
			},
			{
				"lat" : "-74.41",
				"lon" : "-123.05"
			},
			{
				"lat" : "-73.97",
				"lon" : "-114.76"
			},
			{
				"lat" : "-75.41",
				"lon" : "-111.91"
			},
			{
				"lat" : "-74.77",
				"lon" : "-105.05"
			},
			{
				"lat" : "-74.21",
				"lon" : "-100.90"
			},
			{
				"lat" : "-73.18",
				"lon" : "-101.04"
			},
			{
				"lat" : "-73.06",
				"lon" : "-100.28"
			},
			{
				"lat" : "-73.33",
				"lon" : "-93.06"
			},
			{
				"lat" : "-73.18",
				"lon" : "-85.40"
			},
			{
				"lat" : "-73.04",
				"lon" : "-79.82"
			},
			{
				"lat" : "-72.52",
				"lon" : "-78.21"
			},
			{
				"lat" : "-73.41",
				"lon" : "-71.90"
			},
			{
				"lat" : "-71.10",
				"lon" : "-67.51"
			},
			{
				"lat" : "-68.92",
				"lon" : "-67.57"
			},
			{
				"lat" : "-66.83",
				"lon" : "-66.65"
			},
			{
				"lat" : "-65.28",
				"lon" : "-64.30"
			},
			{
				"lat" : "-63.74",
				"lon" : "-59.14"
			},
			{
				"lat" : "-64.37",
				"lon" : "-59.58"
			},
			{
				"lat" : "-65.94",
				"lon" : "-62.50"
			},
			{
				"lat" : "-66.66",
				"lon" : "-62.48"
			},
			{
				"lat" : "-68.02",
				"lon" : "-65.64"
			},
			{
				"lat" : "-69.07",
				"lon" : "-63.85"
			},
			{
				"lat" : "-70.87",
				"lon" : "-61.69"
			},
			{
				"lat" : "-72.71",
				"lon" : "-60.89"
			},
			{
				"lat" : "-74.30",
				"lon" : "-61.07"
			},
			{
				"lat" : "-75.88",
				"lon" : "-63.33"
			},
			{
				"lat" : "-77.06",
				"lon" : "-76.05"
			},
			{
				"lat" : "-77.12",
				"lon" : "-83.04"
			},
			{
				"lat" : "-80.83",
				"lon" : "-74.30"
			},
			{
				"lat" : "-82.14",
				"lon" : "-56.40"
			},
			{
				"lat" : "-81.65",
				"lon" : "-42.46"
			},
			{
				"lat" : "-80.17",
				"lon" : "-31.60"
			},
			{
				"lat" : "-79.20",
				"lon" : "-34.01"
			},
			{
				"lat" : "-77.28",
				"lon" : "-32.48"
			},
			{
				"lat" : "-76.18",
				"lon" : "-26.28"
			},
			{
				"lat" : "-73.45",
				"lon" : "-17.18"
			},
			{
				"lat" : "-72.01",
				"lon" : "-11.20"
			},
			{
				"lat" : "-71.98",
				"lon" : "-8.67"
			},
			{
				"lat" : "-71.45",
				"lon" : "-5.45"
			},
			{
				"lat" : "-71.74",
				"lon" : "-0.82"
			},
			{
				"lat" : "-71.68",
				"lon" : "0.07"
			}], [
			{
				"lat" : "-77.89",
				"lon" : "164.65"
			},
			{
				"lat" : "-77.37",
				"lon" : "170.95"
			},
			{
				"lat" : "-78.25",
				"lon" : "179.67"
			}], [
			{
				"lat" : "-78.24",
				"lon" : "-178.74"
			},
			{
				"lat" : "-78.47",
				"lon" : "-165.76"
			},
			{
				"lat" : "-77.73",
				"lon" : "-158.42"
			}], [
			{
				"lat" : "-64.63",
				"lon" : "-58.98"
			},
			{
				"lat" : "-68.62",
				"lon" : "-60.99"
			},
			{
				"lat" : "-71.70",
				"lon" : "-61.02"
			}], [
			{
				"lat" : "-74.94",
				"lon" : "-62.01"
			},
			{
				"lat" : "-77.07",
				"lon" : "-52.00"
			},
			{
				"lat" : "-77.80",
				"lon" : "-42.23"
			},
			{
				"lat" : "-78.03",
				"lon" : "-36.22"
			}], [
			{
				"lat" : "-77.81",
				"lon" : "-35.03"
			},
			{
				"lat" : "-75.54",
				"lon" : "-26.13"
			},
			{
				"lat" : "-73.04",
				"lon" : "-19.35"
			},
			{
				"lat" : "-71.86",
				"lon" : "-12.16"
			},
			{
				"lat" : "-70.65",
				"lon" : "-6.15"
			},
			{
				"lat" : "-69.14",
				"lon" : "-0.57"
			},
			{
				"lat" : "-70.25",
				"lon" : "4.93"
			},
			{
				"lat" : "-69.99",
				"lon" : "10.91"
			},
			{
				"lat" : "-69.87",
				"lon" : "16.52"
			},
			{
				"lat" : "-70.22",
				"lon" : "25.41"
			},
			{
				"lat" : "-69.29",
				"lon" : "32.13"
			},
			{
				"lat" : "-69.58",
				"lon" : "33.62"
			}], [
			{
				"lat" : "-68.53",
				"lon" : "70.56"
			},
			{
				"lat" : "-69.51",
				"lon" : "73.91"
			}], [
			{
				"lat" : "-67.87",
				"lon" : "81.42"
			},
			{
				"lat" : "-66.41",
				"lon" : "84.67"
			},
			{
				"lat" : "-66.73",
				"lon" : "89.07"
			}], [
			{
				"lat" : "-74.67",
				"lon" : "-135.79"
			},
			{
				"lat" : "-73.22",
				"lon" : "-124.34"
			},
			{
				"lat" : "-74.08",
				"lon" : "-116.65"
			},
			{
				"lat" : "-74.64",
				"lon" : "-109.93"
			},
			{
				"lat" : "-74.56",
				"lon" : "-105.36"
			},
			{
				"lat" : "-74.77",
				"lon" : "-105.83"
			}], [
			{
				"lat" : "-70.06",
				"lon" : "-69.30"
			},
			{
				"lat" : "-72.68",
				"lon" : "-71.33"
			},
			{
				"lat" : "-71.85",
				"lon" : "-71.42"
			},
			{
				"lat" : "-71.46",
				"lon" : "-75.10"
			},
			{
				"lat" : "-70.55",
				"lon" : "-71.79"
			},
			{
				"lat" : "-69.26",
				"lon" : "-70.34"
			},
			{
				"lat" : "-70.13",
				"lon" : "-69.34"
			}], [
			{
				"lat" : "-77.83",
				"lon" : "-49.20"
			},
			{
				"lat" : "-78.79",
				"lon" : "-44.59"
			},
			{
				"lat" : "-80.13",
				"lon" : "-44.14"
			},
			{
				"lat" : "-79.95",
				"lon" : "-59.04"
			},
			{
				"lat" : "-77.84",
				"lon" : "-49.28"
			},
			{
				"lat" : "-77.81",
				"lon" : "-48.24"
			}], [
			{
				"lat" : "-80.12",
				"lon" : "-58.13"
			},
			{
				"lat" : "-80.20",
				"lon" : "-63.25"
			},
			{
				"lat" : "-80.12",
				"lon" : "-58.32"
			}], [
			{
				"lat" : "-78.74",
				"lon" : "-163.64"
			},
			{
				"lat" : "-79.93",
				"lon" : "-161.20"
			},
			{
				"lat" : "-78.74",
				"lon" : "-163.62"
			}]]
	};

	return json;
}

function drawLandMass(ctx) {
	var landMass = getMapData(),
		iFirstScreenX = 0,
		iFirstScreenY = 0,
		shape,
		iLat,
		iLon,
		bFirst = false,
		iShapeCounter,
		iPointCouner;

	// A lighter shade of green
	ctx.fillStyle = 'rgb(0,204,0)';

	// Iterate around the shapes and draw
	for (iShapeCounter = 0; iShapeCounter < landMass.shapes.length; iShapeCounter++) {

		shape = landMass.shapes[iShapeCounter];

		ctx.beginPath();

		// Draw each point with the shape
		for (iPointCouner = 0; iPointCouner < shape.length; iPointCouner++) {

			iLon = shape[iPointCouner].lat;
			iLat = shape[iPointCouner].lon;

			// Before plotting convert the lat/Lon to screen coordinates
			ctx.lineTo(degreesOfLongitudeToScreenX(iLat),
				degreesOfLatitudeToScreenY(iLon));
		}

		// Fill the path green
		ctx.fill();
		ctx.stroke();

	}

}

function plotPosition(position) {
	// Grab a handle to the canvas
	var canvas = document.getElementById('map'),
		ctx;

	// Canvas supported?
	if (canvas.getContext) {
		// Grab the context
		ctx = canvas.getContext('2d');

		ctx.beginPath();

		// Draw a arc that represent the geo-location of the request
		ctx.arc(
			degreesOfLongitudeToScreenX(position.coords.longitude),
			degreesOfLatitudeToScreenY(position.coords.latitude),
			5,
			0,
			2 * Math.PI,
			false
		);

		// Point style
		ctx.fillStyle = 'rgb(255,255,0)';
		ctx.fill();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "black";

		ctx.stroke();
	}
}

function draw() {
	// Main entry point got the map canvas example

	var canvas = document.getElementById('map'),
		ctx;

	// Canvas supported?
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');

		// Draw the background
		drawBackground(ctx);

		// Draw the map background
		drawMapBackground(ctx);

		// Draw the map background
		drawGraticule(ctx);

		// Draw the land
		drawLandMass(ctx);

		// One-shot position request. (f supported)
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(plotPosition);
		}

	} else {
		alert("Canvas not supported!");
	}
}