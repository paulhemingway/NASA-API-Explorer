var manifestData, image, roverData, newDate, date;
var currentIndex = 0;
var photoArray = [];
let key = "gOuj2MAldvGvUU4eT5LDHdzYl0jTbCGocMBrYIbZ";


let funnyStatusArray = [
    "i'm hungry","i'm lonely","i miss earth","it's really cold","i'm a rover vroom vroom","i'm a great photographer","i think i saw an alien!","they don't pay me enough for this","the wifi sucks here","can i come back yet","the cell service here is terrible","i'm starving!","is this enough pictures?","...","i'm REALLY bored.","i'm kinda like WALL-E lol","so lonely","i'm kinda scared lowkey","¿donde esta la leche?","ok this isn't funny guys pick me up","hello?","rocks, sand, ice. nice.","mars is boring.","hi mom","oppy oppy oppy","my batteries are almost dead","beep boop robot lol","i'm not alone...","okay real funny guys, pick me up"
];
var statusIndex;

// show or hide loading animation based on passed parameter
function loading(x){
    if (x == 1){
        $("#loader").show();
    }
    if (x == 0){
        $("#loader").hide();
    }
}

function displayModal(modalContent){
    $("#modalText").html(modalContent);
    $("#alertModal").show();
    loading(0); 
}

function closeModal(){
    $("#alertModal").hide();
}

// function to go through rover photos using the arrow buttons
function roverSlides(x){
    // add either 1 or -1 to index to determine the next displayed image
    currentIndex += x;
    statusIndex = Math.floor(Math.random() * funnyStatusArray.length);
    image = photoArray[currentIndex];
    if (image != undefined){
        loading(1);
        setInterval(function(){
            
            loading(0);
        },500);
        $("#imageHolder").html('<img id="roverImage" src="' + image + '" alt="image">');
            // numbers for photo counter on top left
            
            $("#photoCount").html(currentIndex+1 + '/' + photoArray.length);
        $("#statusLabel").html(funnyStatusArray[statusIndex]);
        
    }else{
        currentIndex -= x;
    }
    console.log("current index " + (currentIndex+1));
}

function manifestQuery(){ 
    let manifestURL = "https://api.nasa.gov/mars-photos/api/v1/manifests/opportunity?api_key=" + key;
    var loadSuccess = false;
    $.getJSON(manifestURL, function(data){
        manifestData = data;
        loadSuccess = true;
    });
    
    // wait 8 seconds before calling function to check if manifest load was successful
    setTimeout(function(){
        manifestSuccess(loadSuccess);
    }, 8000);
}

// check if manifest query was successful
function manifestSuccess(loadSuccess){
    if (loadSuccess != true){
        displayModal("Manifest data not loaded correctly. Refresh the page.");
    }
}

//fetch rover photos and display them
function fetch(){
    
    $("#apodBox").hide();
    loading(1);
    $("#prev").attr('onclick', 'roverSlides(-1)');
    $("#next").attr('onclick', 'roverSlides(1)');
    var sol = $("#solInput").val();
    var camera = $("#cameraSelect").val();
    var currentSol, currentCamera;
    var dataURL = "https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?sol=" + sol + "&camera=" + camera
+ "&api_key=" + key;
    
    if(camera != ""){
        $.getJSON(dataURL, function(data){
            if(sol >= 0 && sol <= manifestData.photo_manifest.max_sol){
                var i = 0;
                $("#contentTitle").html("Opportunity Rover Photos");
                roverData = data;
                image = data.photos[0].img_src;
                currentCamera = data.photos[0].camera.full_name;
                currentSol = data.photos[0].sol;

                // update all the content
                $("#imageHolder").html('<img id="roverImage" src="' + image + '" alt="image">');
                $("#title").html("Rover: Opportunity");
                $("#date").html('Launch Date: 6-7-2003');
                $("#description").html('Opportunity, also known as MER-B (Mars Exploration Rover –B) or MER-1, and nicknamed "Oppy", is a robotic rover that was active on Mars from 2004 until the middle of 2018. Launched on July 7, 2003, as part of NASA\'s Mars Exploration Rover program, itlanded in Meridiani Planum on January 25, 2004, three weeks after its twin Spirit (MER-A) touched down on the other side of the planet. With a planned 90-sol duration of activity (slightly less than 92.5 Earth days), Spirit functioned until it got stuck in 2009 and ceased communications in 2010, while Opportunity was able to stay operational for 5111 sols after landing, maintaining its power and key systems through continual recharging of its batteries using solar power, and hibernating during events such as dust storms to save power. This careful operation allowed Opportunity to exceed its operating plan by 14 years, 46 days (in Earth time), 55 times its designed lifespan. By June 10, 2018, when it last contacted NASA, the rover had traveled a distance of 45.16 kilometers (28.06 miles).');
                
                $("#roverInfo").html("Martian sol: " + currentSol + "<br>" + "Camera: " + currentCamera);                
                $("#roverInfo").show();
                // empty the photoarray every time fetch is called and store all the image URLs for that sol & camera
                photoArray = [];
                for (i=0; i<data.photos.length; i++){
                    photoArray[i] = data.photos[i].img_src;
                }
                
                $("#photoCount").html(1 + "/" + photoArray.length);
                $("#photoCount").show();
 
                $("#contentBox").show();
                $("#solLabel").html("sol #" + currentSol);
                statusIndex = Math.floor(Math.random() * funnyStatusArray.length);
                $("#statusLabel").html(funnyStatusArray[statusIndex]);
                $("#imageLabel").show();
            }
        });
        
        setInterval(function(){
            loading(0);
        }, 1000);
    }
}

function cameraOptions() {
    var sol = $("#solInput").val();
    let array = manifestData.photo_manifest;
    var solObject;
    var i;
    var optionsHTML = "";
    var exists = true;
    
    if (sol > manifestData.photo_manifest.max_sol){
                displayModal("Inputted sol exceeds the maximum sol: " + manifestData.photo_manifest.max_sol);
    }else if(sol < 0){
                displayModal("Inputted sol must be greater than 0.");

    }else{
        for (i = 0; i<array.photos.length; i++){
            if (sol == array.photos[i].sol){

                solObject = array.photos[i];
                break;
            }else if (array.photos[i].sol > sol){
                exists = false;
                break;
            }
        }

         if (exists == true){   
            for (i = 0; i<solObject.cameras.length; i++){
                switch(solObject.cameras[i]){
                    case 'FHAZ':
                        optionsHTML += '<option value="FHAZ">Front Hazard Avoidance Camera</option>';
                        break;
                    case 'RHAZ':
                        optionsHTML += '<option value="RHAZ">Rear Hazard Avoidance Camera</option>';
                        break;
                    case 'NAVCAM':
                        optionsHTML += '<option value="NAVCAM">Navigation Camera</option>';
                        break;
                    case 'PANCAM':
                        optionsHTML += '<option value="PANCAM">Panoramic Camera</option>';
                        break;
                    case 'MINITES':
                        optionsHTML += '<option value="MINITES">Mini-TES</option>';
                        break;
                }
            }
            $("#cameraSelect").html('<option value="">Please Select a Camera</option>' + optionsHTML);
         }else{
             $("#cameraSelect").html('<option value="">Please Input a Valid Sol</option>');
         }
    } 
}

function apodSlides(x){
    loading(1);
    newDate.setDate(newDate.getDate() + x);
    newDateFormat = newDate.toISOString().slice(0,10);
    getApod(newDateFormat);
}

function getDate(){
    var dateInput = $("#dateInput").val();
    return dateInput;
}

function getApod(dateInput) {
    $("#roverInfo").hide();
    $("#apodBox").show();
    $("#photoCount").hide();
    $("#contentBox").hide();
    $("#prev").attr('onclick', 'apodSlides(-1)');
    $("#next").attr('onclick', 'apodSlides(1)');
    var xmlHttp = new XMLHttpRequest();
    
    if (dateInput == ""){
        dateInput = getDate();
    }
    
    var apodURL = 'https://api.nasa.gov/planetary/apod?date=' + dateInput + '&api_key=' + key;
		
    
        $.getJSON(apodURL, function(data){
            loading(0);
            if (data == null){
                console.log("Error: Information for this date not found!");
                newDate = new Date(newDate.getDate() -1);
            }else {
                var media_type = data.media_type;
                var media = data.url;
                var title = data.title;
                var date = data.date;
                var explanation = data.explanation;

                newDate = new Date(date);

                if (media_type != "image"){
                    displayModal("Media type for this date is not an image! <br> <a href='" + media_type + "' target='blank'>Click to View Media</a>");
                }else{
                    $("#apodBox").html('<img id="hdImage" src="' + media + '" alt="image">');
                }

                $("#title").html(title);
                $("#dateInput").val(date);
                $("#date").html("Date: " + date);
                $("#description").html(explanation);
            }
        })

        .fail(function() {
            displayModal("Error: Information for " + $("#dateInput").val() + " not found!");
            $("#dateInput").val(new Date().toISOString().slice(0,10));
        });
    
    /* This section was to get the APOD data from an XML request. Host is no longer active. */
    
        // xmlHttp.onload = function() {
		// 	if (xmlHttp.status == 200) {
		// 		loading(0);
        //         // get the XML document
        //         var xmlDoc = xmlHttp.responseXML;
        //         if (xmlDoc == null){
        //             console.log("Error: Information for this date not found!");
        //             newDate = new Date(newDate.getDate() -1);
        //         }else{
        //             var mediaData = xmlDoc.getElementsByTagName("url");
        //             var media = mediaData[0].childNodes[0].nodeValue;
                    
        //             var mediaTypeData = xmlDoc.getElementsByTagName("media_type");
        //             var mediaType = mediaTypeData[0].childNodes[0].nodeValue;
                    
        //             if (mediaType != "image"){
        //                 displayModal("Media type for this date is not an image! <br> <a href='" + media + "' target='_blank'>Media Link</a>");
        //             }else{
        //                 $("#apodBox").html('<img id="hdImage" src="' + media + '" alt="image">');
        //             }
                    
        //             var titleData = xmlDoc.getElementsByTagName("title");
        //             var title = titleData[0].childNodes[0].nodeValue;
        //             $("#title").html(title);

        //             var dateData = xmlDoc.getElementsByTagName("date");
        //             var date = dateData[0].childNodes[0].nodeValue;
                    
        //             newDate = new Date(date);
                    
        //             $("#dateInput").val(date);
        //             $("#date").html("Date: " + date);
        //             var explanationData = xmlDoc.getElementsByTagName("explanation");
        //             var explanation = explanationData[0].childNodes[0].nodeValue;
        //             $("#description").html(explanation);
           
        //         }
                
		// 	} else {
        //         displayModal("Date must be between June 15, 1995 and the present.");
        //     }
		// }
		// xmlHttp.open("GET", apodURL, true);
		// xmlHttp.send();
}

$(document).ready(function(){
    $("#contentBox").hide();
    loading(1);
    var today = new Date().toISOString().slice(0,10);
    
    var modal = document.getElementById("alertModal");

    window.onclick = function(event){
        if(event.target == modal) {
            $("#alertModal").fadeOut();
        }
    }

    $("#dateInput").attr('max', today);
    getApod("");
});