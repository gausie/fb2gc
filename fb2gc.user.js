// ==UserScript==
// @name         Facebook to Google Calendar
// @namespace    fb2gc
// @include      https://*.facebook.com/event.php*
// @include      http://*.facebook.com/event.php*
// @include      https://facebook.com/event.php*
// @include      http://facebook.com/event.php*
// @author       Samuel Gaus
// @description  This userscript adds a button to a Facebook event that extracts the relevant data and produces a Google Calendar event.
// ==/UserScript==

// This method of including jQuery was lovingly stolen from Erik Vold (http://erikvold.com/blog/index.cfm/2010/6/14/using-jquery-with-a-user-script)

function addJQuery(callback) {
	var script = document.createElement("script");
	script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "(" + callback.toString() + ")();";
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
}

function main() {

// First we need to scrape the data.

	// Title is in the header
	var title = $("h1").text();
	// Time is stored using hCal (yyyy-mm-ddThh:mm:ss)
	var start = $("span.dtstart span.value-title").attr("title");
	var end = $("span.dtend span.value-title").attr("title");
	// Location is stored using hCard
	var place = $("span.org").text();
	var address = $.map(
		$("div.adr").children(),
		function(element){
			return $(element).text()
		}
	).join(", ");

// We can't use a description because it ends up being too long, resulting in a 414 error. If you can POST one way, we can sort this out.

	//var description = $("div.description").text();

	// Times needs to be yyyymmddThhmmssZ
	var dash = new RegExp("-", "g");
	var colon = new RegExp(":", "g");
	start = start.replace(dash, "").replace(colon, "")+'Z';
	end = end.replace(dash, "").replace(colon, "")+'Z';

// Generate the Google Calendar template link

	var href  = "http://www.google.com/calendar/event?action=TEMPLATE&text=";
	href += encodeURI(title);
	href += "&dates=";
	// todo: needs some way of handling all-day events
	href += start;
	href += "/";
	href += end;
	// Missing out description because of 414 errors
	//href += "&details=";
	//href += encodeURI(description);
	href += "&location=";
	href += encodeURI(place+", "+address);
	href += "&trp=true";

// Now we need to make a Send to Google Calendar link

	$('div.profileHeaderMain div.fsm').append(" · <span class='fsl'><a target='_blank' href='"+href+"'>Google Calendar</a></span>");

}

addJQuery(main);
