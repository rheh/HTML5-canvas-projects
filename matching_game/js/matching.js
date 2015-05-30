var tiles = new Array(),
	flips = new Array('tb', 'bt', 'lr', 'rl' ),
	iFlippedTile = null,
	iTileBeingFlippedId = null,
	tileImages = new Array(1,2,3,4,5,6,7,8,9,10),
	tileAllocation = null,
	iTimer = 0,
	iInterval = 100,
	rightanswer = -1,
	iPeekTime = 3000;
	

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

function getRandomImageForTile() {

	var iRandomImage = Math.floor((Math.random() * tileAllocation.length)),
		iMaxImageUse = 2;
	
	while(tileAllocation[iRandomImage] >= iMaxImageUse ) {
			
		iRandomImage = iRandomImage + 1;
			
		if(iRandomImage >= tileAllocation.length) {
				
			iRandomImage = 0;
		}
	}
	
	return iRandomImage;
}

function createTile(iCounter, answerPostion, mainImageValue) {
	//alert(answerPostion + "this is the answer position and this is the value" + mainImageValue);
	var curTile =  new tile("tile" + iCounter),
		iRandomImage = getRandomImageForTile();
		
	tileAllocation[iRandomImage] = tileAllocation[iRandomImage] + 1;
		
	//curTile.setFrontColor("tileColor" + Math.floor((Math.random() * 5) + 1));
	//curTile.setStartAt(500 * Math.floor((Math.random() * 5) + 1));
	//curTile.setFlipMethod(flips[Math.floor((Math.random() * 3) + 1)]);
	if (answerPostion == iCounter) {
		curTile.setBackContentImage("images/" +  mainImageValue + ".jpg");
	}
	else {
		curTile.setBackContentImage("images/" +  (iRandomImage + 1) + ".jpg");
	}
	return curTile;
}

/* we need to randomly generate hand number from initMain and then grab 
corrsponding answer. Then go to initTiles*/

// two subfunctions, one to find main image and also find correct answer
// pass to initTiles
function initState() {

	/* Reset the tile allocation count array.  This
		is used to ensure each image is only 
		allocated twice.
	*/

	// since 10 different numbers, array size 10
	tileAllocation = new Array(0,0,0,0,0,0,0,0,0,0);
	
	while(tiles.length > 0) {
		tiles.pop();
	}
	
	$('#board').empty();
	iTimer = 0;
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
		curTile = createTile(iCounter, answerPostion, mainImageValue);
		// append to the board
		$('#board').append(curTile.getHTML());
		tiles.push(curTile);
	}	
}

function initMain() {
	var i = Math.floor((Math.random() * 10) + 1);
	rightanswer=i;
	$('#main').html('<center><img src="images/fingers'+i+'.jpg"></center>');
    return i;
	// generate 2 random numbers
	// var limit = 10,
 //    amount = 2,
 //    lower_bound = 1,
 //    upper_bound = 10,
 //    optionsKey = [];

	// if (amount > limit) limit = amount;
	// 	while (optionsKey.length < limit) {
	// 		while (optionsKey.)
	//     var random_number = Math.round(Math.random()*(upper_bound - lower_bound) + lower_bound);
	//     if (optionsKey.indexOf(random_number) == -1) { 
	//         optionsKey.push( random_number );
	//     }
	// }
	// for (var j=0;j<2;++j) {
	// 	var random_number=Math.round(Math.random()*(10-1)+1);
	// 	optionsKey.push(random_number);
	// 	var random_number=Math.round(Math.random()*(10-1)+1);
	// 	if (random_number==optionsKey[0]) {
	// 		var random_number=Math.round(Math.random()*(10-1)+1);
	// 		optionsKey
	// 	}
	// 	optionsKey.push(random_number);
	// }
	// console.log(optionsKey[1]);
	// console.log(optionsKey[2]);
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

function checkMatch(clickedImageName) {
	var tileValue = getTileValue(clickedImageName);
	// need to deactivate answer if clicked and wrong, use jquery to darken
	
	if (tileValue == rightanswer) {
		alert('correct');
		playAudio("mp3/applause.mp3");
		$('#startGameButton').click();
		//new game
	} else {
		alert('incorrect');
		playAudio("mp3/no.mp3");
		//darken image, deactivate?
	}
}

function getTileValue(s) {
	var fileName = s.split('/');
	var sArray = fileName[1].split('.');
	return sArray[0];
}

$(document).ready(function() {
	$('#startGameButton').click(function() {
	// change to initState
		initTiles();
		//
		getTileContent(
			function() {
				$("div.tile").click(function() {
					checkMatch(this.innerHTML);
					//alert("You clicked something");				  
					//Should not be alert, should call checkMatch()
				});
			}
		);
	});
});