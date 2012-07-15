var job = null;
var bSwingRight = true;
var sCurrentLeft = "imgLeft5";
var sCurrentRight = "imgRight5";

function swing() {

	if (bSwingRight == 0) {
		$('#swing').removeClass(sCurrentLeft);
		$('#swing').addClass(sCurrentRight);
	} else {
		$('#swing').removeClass(sCurrentRight);
		$('#swing').addClass(sCurrentLeft);
	}

	bSwingRight = !bSwingRight;

	job = setTimeout(swing, 1000);
}


$(document).ready(function() {

	swing();

	$('#defaultSlider input').click(function() {

		clearTimeout(job);

		bSwingRight = !bSwingRight;

		var currentValue = this.value * 5;

		$('#swing').removeClass(sCurrentRight);
		$('#swing').removeClass(sCurrentLeft);

		sCurrentRight = "imgRight" + currentValue;
		sCurrentLeft = "imgLeft" + currentValue;

		console.log(this.value + " - " + currentValue);

		swing();
	});

});
