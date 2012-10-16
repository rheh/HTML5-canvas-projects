<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>Canvas Motion</title>
		<script src='motion.js'></script>
	</head>
	<body onload='draw();'>
		<div>
			<canvas id="motion" width="1000" height="600"></canvas>
		</div>
		<div style="position: absolute; top: 10px; left: 100px;" >
			<form name='test'>
				<label for='time'>Time:</label>
				<input type="input" id='time' name='time' value="0" />
				<br>
				<input onclick="javascript:startLoop();" type='button' id='loop' value='Start' />
				<input onclick="javascript:stopLoop();" type='button' id='stop' value='Stop' />
			</form>
		</div>
	</body>
</html>