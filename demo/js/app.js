var MidiPlayer = MidiPlayer;
var loadFile, loadFile2, Player, Player2;
var AudioContext = window.AudioContext || window.webkitAudioContext || false; 
var ac = new AudioContext || new webkitAudioContext;
var eventsDiv = document.getElementById('events');
var bitsyarray = [];
var bitsyarray2 = [];

var changeTempo = function(tempo) {
	Player.tempo = tempo;
}
//tryna be a better programmer this will be the last time i leave no comments and use silly variable names
//modified this function to convert player events into bitsy
var play = function(a) {
	Player.info = Player.getEvents(); 
	//Player.play();
	//document.getElementById('play-button').innerHTML = 'Pause';
	//save note on values
	let notes = [];
	//save note off values
	let noted = [];
	//save value with duration into 1 array
	let array = [];
	//split duophonic midi into different array
	let array2 = [];
	//loop through parsed midi data
	for (let i = 0; i < Player.info.length; i++) {
		for (let i2 = 0; i2 < Player.info[i].length; i2++) {
			if(Player.info[i][i2].name == "Note on" || Player.info[i][i2].name == "Note off"){
				if(Player.info[i][i2].name == "Note on"){
					//push note on values
					let fart = {note:"", tick:""};
					fart.note = Player.info[i][i2].noteName
					fart.tick = Player.info[i][i2].tick
					notes.push(fart);
				}
				if(Player.info[i][i2].name == "Note off"){
					//push note off values
					let fart = {note:"", tick:""};
					fart.note = Player.info[i][i2].noteName
					fart.tick = Player.info[i][i2].tick
					noted.push(fart);				
				}
				console.log(Player.info[i][i2]);
			}
						

		}
	}
	console.log("on",notes);				
	for (let i = 0; i < notes.length; i++) {
		let h = true;
        //push notes to array with duration by checking how long the note was on and when it comes off
		for (let j = 0; j < noted.length; j++) {
			if (notes[i].note == noted[j].note && h == true){
				h = false;
				let fart = {note:"", duration:"", tick:""};
				fart.note = notes[i].note;
				fart.duration = toDuration(noted[j].tick - notes[i].tick);
				fart.tick = notes[i].tick;
				array.push(fart);
				noted.splice(j,1);
				//console.log(noted);
			}

		}
	}
	for (let i = 0; i < array.length; i++) {
        //if there is a chord delete one of the notes and put in a seperate array.
		array.forEach((element) => {
			if(array[i].tick == element.tick && array[i].note != element.note){

			console.log(array[i].tick,"delete",element.tick);
			array2.push(array[i]);	
			array.splice(i,1);

				return;
			}
	});

	}
	
	//convert delta time to bitsy time
	function toDuration(data){
		for (let i = 1; i < 17; i++) {
			//adding slight quantization doesnt really work
			if(data == (Player.division/4) * i || data < (Player.division/2) * i){
			
			return 1 * i;
		}                    
		}
		return 16;
		

	}
	//sort the array from tick position so notes go in order
	array.sort(compareNumbers);	
	function compareNumbers(a, b) {
		return a.tick - b.tick;
	  }
	  //add zeroes to places where there are no notes
	  function addZeros(twe){
		if(twe[0].tick !== 0){
			twe.splice(0,0,{note: "0", duration: toDuration(twe[0].tick), tick: 0});
		}
		let yes = [];
		yes = twe.slice();

		for (let i = 0; i < twe.length; i++) {
			if(i != twe.length - 1){		
				//player.division/4 is the length of one note so multiplying it by the duration should be the next tick note but if its not then put a zero that goes to the next tick note
				if(twe[i].tick == 0){
			      if (((Player.division/4) * twe[i].duration) != twe[i+1].tick){
				yes.splice(i,0,{note: "0", duration: toDuration(twe[i+1].tick - (Player.division/4)* twe[i].duration), tick:(Player.division/4)* twe[i].duration});
				yes.sort(compareNumbers);
				}

				}
				else{
					if ((twe[i].tick+((Player.division/4)*(twe[i].duration))) != twe[i+1].tick){			
					yes.splice(i,0,{note: "0", duration: toDuration(twe[i+1].tick - twe[i].tick - (Player.division/4)*twe[i].duration), tick: (twe[i].tick+((Player.division/4)*(twe[i].duration)))});
					yes.sort(compareNumbers);
					}
			}
		}
		}
		return yes;
	  }
	  //convert into bitsy format using arrays so its easier to display
	function bitsy(yes){
		let output = [];

		for (let i = 0; i < yes.length; i++) {		

		if( i > -1){
			if (yes[i].duration == 1){
				output.push(yes[i].note);
			}
			//putting zeros based on duration
			if(yes[i].duration > 1){
				if(yes[i].note == '0'){
					output.push(yes[i].note);
					for (let j = 1; j < yes[i].duration; j++) {
						output.push("0");                        

					}
				}
				else{
			output.push(yes[i].duration + yes[i].note)
			for (let d = 1; d < yes[i].duration; d++) {
				output.push("0");                        
			}
		}
	}
		}               
		
	}
	if(output.length > 15){
		return sliceIntoChunks(output, 16);    
	}
	if (output.length < 15){
		let junko = 16 - output.length;
		for (let l = 0; l < junko; l++) {
			output.push("0");
	}
	return output.flat();
	}
	}
	//slice into chunks of 16 length of a bar
	function sliceIntoChunks(arr, chunkSize) {
	const res = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
	const chunk = arr.slice(i, i + chunkSize);
	if(chunk.length < chunkSize){
		let difference = chunkSize - chunk.length
		//fill rest of bar with zeros
		for (let k = 0; k < difference; k++) {
			chunk.push("0");
		}
		res.push(chunk);
	}else {
		 res.push(chunk);}
		}
 return res;
	}
	console.log("arraybeforezeros",array);
	console.log("array",addZeros(array));
	console.log("bitsy",bitsy(addZeros(array)));
	//console.log("bitsy2",bitsy(addZeros(array2)));
	document.getElementById("output").innerHTML ="";
	//save value to a different global array based on where the file was uploaded from
	if(a){
		//the main melody allows you to start displaying data
		document.getElementById("b").removeAttribute("disabled");
		document.getElementById("b").removeAttribute("style");

		bitsyarray=bitsy(addZeros(array));
	}else{
		bitsyarray2=bitsy(addZeros(array));

	}	
}

var pause = function() {
	Player.pause();
	document.getElementById('play-button').innerHTML = 'Play';
}
//function that displays the data on the html page
var stop = function() {	
	document.getElementById("output").innerHTML ="";
	//when there is only 1 chunk so i have to all of this to see if its an array or not
	if (bitsyarray[0].constructor == Array){
		for (let e = 0; e < bitsyarray.length; e++) {			
			if(bitsyarray2.toString().length == 0){				
				if(e==0){
					document.getElementById("output").innerHTML += (bitsyarray[e].toString() + "\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0" );
				}
				else{
		  			document.getElementById("output").innerHTML += ("\n>"+ "\n"+bitsyarray[e].toString() + "\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0" );
				}
			}
			else{
				if(e==0){
					document.getElementById("output").innerHTML += (bitsyarray[e].toString() + "\n"+bitsyarray2[e].toString());
				}
				else if(e<bitsyarray2.length){
		  			document.getElementById("output").innerHTML += ("\n>"+ "\n"+bitsyarray[e].toString() + "\n"+bitsyarray2[e].toString());
				}
				else{
					document.getElementById("output").innerHTML += ("\n>"+ "\n"+bitsyarray[e].toString() + "\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0" );
				}

			}
			if(e == bitsyarray.length -1){
				document.getElementById("output").innerHTML +="\nNAME ChangeName\nTMP MED\nSQR P2 P2"; 		
			}
		}          
	  }
	  else{
		
		if(bitsyarray2.length==0&&bitsyarray2.toString().length > 0){
			document.getElementById("output").innerHTML += bitsyarray.toString() +"\n"+ bitsyarray2.toString()+ "\nNAME ChangeName\nTMP MED\nSQR P2 P2";
		}
		if(bitsyarray2.length>0){
			for (let e = 0; e < bitsyarray2.length; e++) {	
			if(e==0){
			document.getElementById("output").innerHTML += ("\n"+bitsyarray.toString() + "\n"+bitsyarray2[e].toString());

			}else if(e<bitsyarray2.length){
				document.getElementById("output").innerHTML += ("\n>"+ "\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0" + "\n"+bitsyarray2[e].toString());

			}
			if(e == bitsyarray2.length -1){
				document.getElementById("output").innerHTML +="\nNAME ChangeName\nTMP MED\nSQR P2 P2"; 		
			}			
		}
		}
		if(bitsyarray2.toString().length == 0){
		  document.getElementById("output").innerHTML += bitsyarray.toString() + "\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0" +"\nNAME ChangeName\nTMP MED\nSQR P2 P2";
		}
	  }
}

var buildTracksHtml = function() {
	Player.tracks.forEach(function(item, index) {
		var trackDiv = document.createElement('div');
		trackDiv.id = 'track-' + (index+1);
		var h5 = document.createElement('h5');
		h5.innerHTML = 'Track ' + (index+1);
		var code = document.createElement('code');
		trackDiv.appendChild(h5);
		trackDiv.appendChild(code);
		eventsDiv.appendChild(trackDiv);
	});
}


	loadFile = function() {
		var file = document.querySelector('#midi1').files[0];
		var reader = new FileReader();
		if (file) reader.readAsArrayBuffer(file);
		reader.addEventListener("load", function () {
			Player = new MidiPlayer.Player(function(event) {
				if (event.name == 'Note on') {
					//instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
					//document.querySelector('#track-' + event.track + ' code').innerHTML = JSON.stringify(event);
				}				
			});
			Player.loadArrayBuffer(reader.result);
			//change the array the array in this function gets saved too
			play(true);
		}, false);
	}

	loadFile2 = function() {
		var file = document.querySelector('#midi2').files[0];
		var reader = new FileReader();
		if (file) reader.readAsArrayBuffer(file);
		reader.addEventListener("load", function () {
			Player = new MidiPlayer.Player(function(event) {
				if (event.name == 'Note on') {
					//instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
					//document.querySelector('#track-' + event.track + ' code').innerHTML = JSON.stringify(event);
				}				
			});
			Player.loadArrayBuffer(reader.result);
			//change the array the array in this function gets saved too
			play(false);
		}, false);
	}






