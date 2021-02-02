<?php

## CONFIG ##

# LIST EMAIL ADDRESS
$recipient = "ransarajey@gmail.com";
$senderName = $_POST["senderName"];
$senderEmail= $_POST["senderEmail"];
$senderMessage= $_POST["senderMessage"];

# SUBJECT (Subscribe/Remove)
$senderSubject = $_POST["senderSubject"];

# RESULT PAGE
$location = "../index.html";

## FORM VALUES ##

# SENDER - WE ALSO USE THE RECIPIENT AS SENDER IN THIS SAMPLE
# DON'T INCLUDE UNFILTERED USER INPUT IN THE MAIL HEADER!

# MAIL BODY
$body = "".$senderMessage." \n -sent from ransarajey.com";
# add more fields here if required

## SEND MESSGAE ##

mail( $recipient, $senderSubject, $body, "From: $senderEmail" ) or die ("Mail could not be sent.");

## SHOW RESULT PAGE ##
header( "Location: $location" );

?>
