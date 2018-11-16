var config = {
    apiKey: "AIzaSyAnbxo0tZjRo8wdFCWaKpohxYv0eP81EG8",
    authDomain: "train-schedule-d0570.firebaseapp.com",
    databaseURL: "https://train-schedule-d0570.firebaseio.com",
    projectId: "train-schedule-d0570",
    storageBucket: "",
    messagingSenderId: "806892094385"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var trainname = "";
  var destination = "";
  var firsttime = "";
  var frequency = "";

  $("#submit").on("click", function(event){
    event.preventDefault();

    trainname = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    firsttime = $("#firsttime-input").val().trim();
    frequency = $("#frequency-input").val().trim();


database.ref().push({
trainname: trainname,
destination: destination,
firsttime: firsttime,
frequency: frequency,
dateadded: firebase.database.ServerValue.TIMESTAMP
});

    database.ref().orderByChild(database.dateadded).limitToLast(1);
  });

  database.ref().on("child_added", function(snapshot){
    var trainInfo = snapshot.val();
    console.log("Variable trainInfo: "+ trainInfo);

    var currentTime = moment();
    console.log("Variable currentTime: " + currentTime);

    var frequencyInt = parseInt(trainInfo.frequency);
    console.log("Variable frequencyInt: " + frequencyInt);

    var firstTimeConverted = moment(trainInfo.firsttime, "HH:mm").subtract(1, "years"); 
    console.log("Variable firstTimeConverted: " + firstTimeConverted);
    console.log("Variable firsttime: " + firsttime);
    console.log("trainInfo.firsttime: "+ trainInfo.firsttime);

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference In Time: "+ diffTime);

    var timeRemainder = diffTime % frequencyInt;
    console.log("timeApart: "+ timeRemainder);
    
    //Minutes Remaining:
    var minutesTill = frequencyInt - timeRemainder;
    console.log("minutesTill: " + minutesTill);
    var minutesdisplay = null;
    if (minutesTill ===0){
        minutesdisplay = "Arriving Now";
    } else {
        minutesdisplay = minutesTill;
    }
    var nextArrival = ((moment().add(minutesTill, "minutes")).format("hh:mm"));
    console.log("nextArrival : "+ nextArrival);

    var row = $("<tr>");
    var newrow = $("#tablebody").append(row);
    row.append(("<td>" + trainInfo.trainname+ "</td>"));
    row.append(("<td>" + trainInfo.destination+ "</td>"));
    row.append(("<td>" + trainInfo.frequency+ "</td>"));
    row.append(("<td>" + nextArrival+ "</td>"));
    row.append(("<td>" + minutesTill+ "</td>"));
   
  }, function(errorObject){
    console.log("The read failed: " + errorObject.code);});
  
