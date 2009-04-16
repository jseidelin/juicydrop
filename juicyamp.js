
var SMLoaded = false;

$(function()
{
	$('.scroll-pane').jScrollPane({scrollbarWidth :8, wheelSpeed : 7});

	/*
	setTimeout(
		function() {
			if (!SMLoaded) {
				alert("Looks like SoundManager2 didn't load correctly. Try reloading (F5) the page.");
			}
		}, 6000
	);
	*/

});


var initJuicyAmp = (function() {

var $ = function(id) {return document.getElementById(id);};


var visualizations = [
	//"fiShbRaiN - narcolepsy",
	"Unchained - Cranked On Failure",
	"Rovastar & Zylot - Narell's Fever",
	"fiShbRaiN - betelguese",
	"Rovastar - Starquake",
	"fiShbRaiN - inside the flux capacitor",
	"Unchained - God of the Game",
	"Krash - Hyperspace",
	"John Scoville - Inside Outside",
	"John Scoville - Retina (Beat Mix)",
	"John Scoville - Matrix Nautilus",
	"Illusion - Growing Diamond",
	//"CTho - Vibes",
	"Geiss - Oldskool",
	"Geiss - Eggs",
	"Zylot - Psyonist (New Eyes Mix)",
	"Unchained - God Of The Game (Remix)",
	//"Unchained - Picture Of Poison",
	"Unchained - Painful Plasma",
	"Unchained - Jaundice",
	"Unchained - Morat's Final Voyage",
	"Unchained - Unified Drag 2",
	"Unchained - Unclaimed Wreckage 2 (Shamanic)",
	"Unchained & Rovastar - Xen Traffic",
	//"Zylot - light of the path",
	"Unchained - Making a Science of It 4",
	"Unchained - Goofy Beat Detection",
	"Telek EMPR - Scanner - Trust me, I've got a Melways",
	"Zylot - Spiral (Hypnotic)",
	"Rovastar - Explosive Minds",
	"Geiss - De La Moutard 1",
	"Unchained - Ribald Ballad",
	"Unchained - Goo Kung Fu",
	"Aderrasi - Pyrokinesis",
	"Geiss - Corpus Callosum"
];
var songs = [
	// ["firstofmay.mp3", "Jonathan Coulton - First of May"],
	// ["mrfancypants.mp3", "Jonathan Coulton - Mr. Fancy Pants"],
	["tomcruisecrazy.mp3", "Jonathan Coulton - Tom Cruise Crazy"],
	// ["mandelbrotset.mp3", "Jonathan Coulton - Mandelbrot Set"],
	["wanderingstar.mp3", "Portishead - Wandering Star"],
	["mariamaria.mp3", "Santana - Maria Maria"],
	// ["mozart_piano_concerto_no_20_rondo.mp3", "Mozart - Piano Concert No. 20 (Rondo)"],
	["lyricalgangbang.mp3", "Dr. Dre - Lyrical Gangbang"],
	["suttersfort.mp3", "Filibuster - Sutter's Fort"],
	["ridin.mp3", "Chamillionaire - Ridin'"]
];


/*
JuicyDrop.prepareSM2(soundManager);

soundManager.flashLoadTimeout = 6000;
soundManager.waitForWindowLoad = false;
soundManager.debugMode = false;
*/

// check for canvas support
if (!document.createElement("canvas").getContext) {
	alert("Please use a canvas-enabled browser such as Chrome (fastest), Firefox, Opera or Safari.");
	return;
}



var screenWidth = 400;
var screenHeight = 400;

var activeMusic;

function initJuicyAmp() {
	JuicyDrop.prepareSM2(soundManager);

	soundManager.flashLoadTimeout = 6000;
	soundManager.waitForWindowLoad = false;
	soundManager.debugMode = false;

	SMLoaded = true;

	var JD = new JuicyDrop($("screen"), screenWidth, screenHeight);

	var infoTimer;
	function setInfoText(str) {
		$("infotext").innerHTML = str;
		if (infoTimer)
			clearTimeout(infoTimer);
		infoTimer = setTimeout(clearInfoText, 2000);
	}
	function clearInfoText() {
		$("infotext").innerHTML = "";
		infoTimer = 0;
	}

	document.onkeydown = function(e) {
		//console.log(e.keyCode);
		var enabled;
		switch(e.keyCode) {
			case 76: // L
				JD.reload();
				break;
			case 68:
				JD.toggleDebug(); // D
				break;
			case 88:
				JD.setDimensions(screenWidth,screenHeight);
				$("screen").style.paddingLeft = "0px";
				$("screen").style.width = "400px";
				$("screen").style.paddingTop = "0px";
				$("screen").style.height = "400px";
				break;
			case 90:
				JD.setDimensions(256,256);
				$("screen").style.paddingLeft = "72px";
				$("screen").style.width = "328px";
				$("screen").style.paddingTop = "72px";
				$("screen").style.height = "328px";
				break;
			case 49:
				enabled = JD.getRenderSettings().drawWaveform = !JD.getRenderSettings().drawWaveform;
				setInfoText("Waveform: " + (enabled ? "on" : "off"));
				break;
			case 50:
				enabled = JD.getRenderSettings().drawCustomWaves = !JD.getRenderSettings().drawCustomWaves;
				setInfoText("Custom waves: " + (enabled ? "on" : "off"));
				break;
			case 51:
				enabled = JD.getRenderSettings().drawCustomShapes = !JD.getRenderSettings().drawCustomShapes;
				setInfoText("Custom shapes: " + (enabled ? "on" : "off"));
				break;
			case 52:
				enabled = JD.getRenderSettings().drawBorders = !JD.getRenderSettings().drawBorders;
				setInfoText("Borders: " + (enabled ? "on" : "off"));
				break;
			case 53:
				enabled = JD.getRenderSettings().drawPerPixelEffects = !JD.getRenderSettings().drawPerPixelEffects;
				setInfoText("Per-pixel effects: " + (enabled ? "on" : "off"));
				break;
			case 54:
				enabled = JD.getRenderSettings().drawMotionVectors = !JD.getRenderSettings().drawMotionVectors;
				setInfoText("Motion vectors: " + (enabled ? "on" : "off"));
				break;
			case 55:
				enabled = JD.getRenderSettings().drawVideoEcho = !JD.getRenderSettings().drawVideoEcho;
				setInfoText("Video echo: " + (enabled ? "on" : "off"));
				break;
		}
	};

	function addListItem(list, label, value, callback) {
		var item = document.createElement("li");
		item._value = value;
		item._label = label;
		item.innerHTML = label;
		list.appendChild(item);
		item.onclick = function() {
			callback(item);
		};
		return item;
	}

	var selectSong = function(item) {
		if (activeSongItem)
			activeSongItem.className = "";
		activeSongItem = item;

		// stop any playing songs
		soundManager.stopAll();

		// song is already loaded
		if (smsongs[item._value]) {
			smsongs[item._value].play();
		} else {
			// load song
			var music = soundManager.createSound(
				{
					id:item._value,
					url:"music/" + item._value,
					autoLoad : true,
					stream : true,
					autoPlay : true
				}
			);
			smsongs[item._value] = music;
		}
		activeMusic = smsongs[item._value];
		JD.setAudioInput(activeMusic);

		if (!JD.isRunning())
			JD.start();

		item.className = "active";

		document.getElementById("current-song").innerHTML = activeSongItem._label;
	};

	var smsongs = [];
	var songItems = [];
	var activeSongItem;
	var i;
	for (i=0;i<songs.length;i++) {
		(function() {
			var file = songs[i][0];
			var label = i+1 + ". " + songs[i][1];
			var songItem = addListItem(
				document.getElementById("playlist"),
				label, file, selectSong
			);
			songItem._idx = i;
			songItems.push(songItem);
		})();
	}

	var activeVisItem;
	var visItems = [];
	var selectVis = function(item) {
		if (activeVisItem)
			activeVisItem.className = "";
		activeVisItem = item;
		JD.loadMilkDrop("presets/" + item._value);
		item.className = "active";
	};


	for (i=0;i<visualizations.length;i++) {
		(function() {
			var file = visualizations[i] + ".milk";
			var label = visualizations[i];
			visItems.push(addListItem(
				document.getElementById("vislist"),
				label, file, selectVis
			));
		})();
	}
	selectVis(visItems[0]);

	var buttonPrev = document.getElementById("button-prev");
	var buttonPlay = document.getElementById("button-play");
	var buttonPause = document.getElementById("button-pause");
	var buttonStop = document.getElementById("button-stop");
	var buttonNext = document.getElementById("button-next");

	var buttons = [buttonPrev, buttonPlay, buttonPause, buttonStop, buttonNext];
	for (i = 0; i < buttons.length;i++) {
		buttons[i].onmousedown = function() { this.className = "mousedown"; };
		buttons[i].onmouseup = function() { this.className = ""; };
	}

	buttonPrev.onclick = function() {
		if (activeSongItem) {
			var prevIdx = activeSongItem._idx - 1;
			if (prevIdx < 0) prevIdx = songItems.length-1;
			selectSong(songItems[prevIdx]);
		}
	};

	buttonNext.onclick = function() {
		if (activeSongItem) {
			var nextIdx = activeSongItem._idx + 1;
			if (nextIdx >= songItems.length) nextIdx = 0;
			selectSong(songItems[nextIdx]);
		}
	};

	buttonPlay.onclick = function() {
		if (activeSongItem && activeMusic) {
			activeMusic.play();
		} else {
			selectSong(songItems[0]);
		}
	};

	buttonStop.onclick = function() {
		// this doesn't seem to work, if togglePause is called it starts where it was stopped...
		soundManager.stopAll();
		if (activeMusic) {
			activeMusic.setPosition(0);
		}
	};

	buttonPause.onclick = function() {
		if (activeSongItem && activeMusic) {
			activeMusic.togglePause();
		}
	};

	var specCanvas = document.getElementById("spectrum");
	var specCtx = specCanvas.getContext("2d");
	var specBar = document.getElementById("spec-bar");
	setInterval( function() {
		specCanvas.width = 78;
		specCanvas.height = 18;

		if (!activeMusic) return;
		var juice = activeMusic.juice;
		if (!juice) return;

		for (var i=0;i<16;i++) {
			var h = juice.freqBands16[i];
			h = Math.pow(h,0.75)*8;
			if (h > 16) h = 16;
			h = h>>0;
			if (h > 0) {
				specCtx.drawImage(
					specBar,
					0, 16 - h, 3, h,
					3 + i*4 + i, 1 + 16 - h, 3, h
				);
			}
		}

	}, 1000 / 10);
}

//soundManager.onload = initJuicyAmp;

return initJuicyAmp;

})();

