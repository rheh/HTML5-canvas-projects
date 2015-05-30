var tiles = new Array(),
	iTileBeingFlippedId = null,
	tileImages = new Array(1,2,3,4,5,6,7,8,9,10),
	rightanswer = -1,
	timeInterval,
	answers = new Array();
	

options={
	"fingers1":["fingers1","1"],
	"fingers2":["fingers2","2"],
	"fingers3":["fingers3","3"],
	"fingers4":["fingers4","4"],
	"fingers5":["fingers5","5"],
	"fingers6":["fingers6","6"],
	"fingers7":["fingers7","7"],
	"fingers8":["fingers8","8"],
	"fingers9":["fingers9","9"],
	"fingers10":["fingers10","10"]
}
	/* we can have dictionary of hands matched with answers
	for now lets use text */

// Kamilla - get rid of flipping
// Merisa - init main image 
// Wendy - display the images, check for match
// Usama - displayGame 

function createTile(iCounter, answerPostion) {
	var curTile =  new tile("tile" + iCounter);
	
	//generate non-repeating random numbers
	do {
		var iRandomImage = Math.floor((Math.random() * 10));
	}
	while (iRandomImage==answers[0]||iRandomImage==answers[1]||iRandomImage==answers[2]);
	answers.push(iRandomImage);
		
	if (answerPostion == iCounter) {
		curTile.setBackContentImage("images/" +  rightanswer + ".jpg");
	}
	else {
		curTile.setBackContentImage("images/" +  iRandomImage + ".jpg");
	}
	return curTile;
}

/* we need to randomly generate hand number from initMain and then grab 
corrsponding answer. Then go to initTiles*/

// two subfunctions, one to find main image and also find correct answer
// pass to initTiles
function initState() {
	
	while(tiles.length > 0) {
		tiles.pop();
	}
	
	$('#board').empty();
}

// this function finds 2 random answers. 
// pass to displayGame to display images
function initTiles() {
	var iCounter = 0, 
		curTile = null;

	initState();
	
	// main tile
	var mainImageValue = initMain();
    var answerPostion = Math.floor(Math.random() * 3);  //determines which box should contain the answer
	// put main image here and 3 cards, including right answer
	for(iCounter = 0; iCounter < 3; iCounter++) {
		curTile = createTile(iCounter, answerPostion);
		// append to the board
		$('#board').append(curTile.getHTML());
		tiles.push(curTile);
	}
}

function initMain() {
	var i = Math.floor((Math.random() * 10) + 1);
	rightanswer=i;
	answers = new Array()
	answers.push(i);
	$('#main').html('<center><img src="images/fingers'+i+'.jpg"></center>');
    return i;
}

function getTileContent(callback) {	
	var iCounter = 0;
	for(iCounter = 0; iCounter < tiles.length; iCounter++) {
		$("#" + tiles[iCounter].id).html(tiles[iCounter].getBackContent());
	}
	callback();
}

function playAudio(sAudio) {
	
	var audioElement = document.getElementById('audioEngine');
			
	if(audioElement !== null) {

		audioElement.src = sAudio;
		audioElement.play();
	}	
}

function checkMatch(clickedImage) {
	var tileValue = getTileValue(clickedImage.innerHTML);
	if (tileValue == rightanswer) {
		$(clickedImage).css("border-color","green");
		$(clickedImage).css("box-shadow","0px 0px 0px 4px green inset");
		$(clickedImage).effect( "bounce", {times:1, distance: 15}, 600, function() {
			startGame();
		});		
		playAudio("mp3/applause.mp3");
	} else {
		$(clickedImage).css("border-color","red");
		$(clickedImage).css("box-shadow","0px 0px 0px 4px red inset");
		$(clickedImage).effect( "shake", {distance:5});		
		playAudio("mp3/no.mp3");
		$(clickedImage).fadeTo("400", 0.33);
	}
}

function progress(timeleft, timetotal, $element) {
    var progressBarWidth = timeleft * $element.width() / timetotal;
    $element
        .find('div')
        .animate({ width: progressBarWidth }, timeleft == timetotal ? 0 : 1000, "linear")
    
	timeInterval = setInterval(function() {
		clearInterval(timeInterval);
		if(timeleft>0) {
			progress(timeleft - 1, timetotal, $element);
		} else {
			//do game over stuff
		}
	}, 1000);
    
};

function getTileValue(s) {
	var fileName = s.split('/');
	var sArray = fileName[1].split('.');
	return sArray[0];
}


function startGame() {
	initTiles();
	//
	getTileContent(
		function() {
			$("div.tile").click(function() {
				if(!this.attempted) {
					checkMatch(this);
				}
				this.attempted = true;
			});
		}
	);
	clearInterval(timeInterval);
	progress(10, 10, $('#progressBar'));
}



$(document).ready(function() {
	$('#startGameButton').click(function() {
	// change to initState
		startGame();
	});
});