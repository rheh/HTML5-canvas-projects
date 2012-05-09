<?php

$str = '16.1 157.1';

$latLong = new stdClass();

$handle = @fopen("world.dat", "r");

$aCurrentPoints = array();
$latLong->shapes = array();

if ($handle) 
{
    while (($buffer = fgets($handle, 4096)) !== false) 
    {
    	$bComment = preg_match('/^#/', $buffer, $matches);
		
		if($bComment == FALSE)
		{
			$bMatch = preg_match('/(?P<lon>-?[0-9]{1,3}(\.[0-9]{1,2})?)[[:space:]]+(?P<lat>-?[0-9]{1,2}(\.[0-9]{1,2})?)[[:space:]]?$/', $buffer, $matches);

			if($bMatch)
			{
				$aCurrentPoint = new stdClass();
				
				
				//echo $buffer; 
				$aCurrentPoint->lat = $matches['lat'];
				$aCurrentPoint->lon = $matches['lon'];
				
				array_push($aCurrentPoints, $aCurrentPoint);
			}
			else 
			{
				if(count($aCurrentPoints) > 0)
				{
					array_push($latLong->shapes, $aCurrentPoints);
				}
				
				$aCurrentPoints = array();
			}
			
		}
    }
	
    if (!feof($handle)) 
    {
        echo "Error: unexpected fgets() fail\n";
    }
	
    fclose($handle);
	
	echo indent(json_encode($latLong));
}


/**
* Indents a flat JSON string to make it more human-readable.
*
* @param string $json The original JSON string to process.
* @return string Indented version of the original JSON string.
*/
function indent($json)
{
$result = '';
$pos = 0;
$strLen = strlen($json);
$indentStr = "\t";
$newLine = "\n";

for ($i = 0; $i < $strLen; $i++) {
// Grab the next character in the string.
$char = $json[$i];

// Are we inside a quoted string?
if ($char == '"') {
// search for the end of the string (keeping in mind of the escape sequences)
if (!preg_match('`"(\\\\\\\\|\\\\"|.)*?"`s', $json, $m, null, $i))
return $json;

// add extracted string to the result and move ahead
$result .= $m[0];
$i += strLen($m[0]) - 1;
continue;
}
else if ($char == '}' || $char == ']') {
$result .= $newLine;
$pos --;
$result .= str_repeat($indentStr, $pos);
}

// Add the character to the result string.
$result .= $char;

// If the last character was the beginning of an element,
// output a new line and indent the next line.
if ($char == ',' || $char == '{' || $char == '[') {
$result .= $newLine;
if ($char == '{' || $char == '[') {
$pos ++;
}

$result .= str_repeat($indentStr, $pos);
}
}

return $result;
}

?>