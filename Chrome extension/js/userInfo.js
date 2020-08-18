import * as blackhole from '/js/blackhole.js';
import * as setUser from '/js/setUser.js';

export function load() {
    /*     chrome.storage.local.get('contentStatus', function(result) {
            console.log(result.contentStatus)
            if (result.contentStatus == 'content') {
                $("#content-back").show()

            }
        }) */
        setUser.retrieveUser().then(user=>{
            console.log(user)
            fillFields(user)
                })
        .then(
            checkSupport()
        )

}
export function fillFields(connectedUser){
    $("#displayName").text(connectedUser.displayName);
    $("#avatarPic").attr("src", connectedUser.photoURL);
    $("#email").text(connectedUser.email);
    $("#description").text(connectedUser.description);
}

export function checkProfile() {
    $("#blackhole").html("")
    checkSupport()
    $("#wallet-header").hide();
    $("#transaction-header").hide()
    $("#profile-header").show()
    blackhole.blackhole('#blackhole', 1, 220, 220, 125);

}
export function checkSupport() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var user = firebase.auth().currentUser.uid
        var url = tabs[0].url.replace(/[^\w\s]/gi, '_')
        console.log(url)
        firebase.database().ref('/wishes/' + url).once('value').then(function(snapshot) {
            if (snapshot.val() && snapshot.val()[user]) {
                $("#wishes").html("<i style='color:#d95555' class='fas fa-seedling'></i><p>You have already indicated your interest in this content and we have probably already contacted its Creator</p>")

            }
        })
    })
}
export function writeUserData() {
    var currentUser = firebase.auth().currentUser
    var db = firebase.database()
    var email = $("#email").text();
    var displayName = $("#displayName").text();
    var description = $("#description").text()
    if (email != currentUser.email) {
        currentUser.updateEmail(email).then(function() {
            console.log('email changed')
        }).catch(function(error) {
            // An error happened.
        });
    }
 
    setUser.createBlob()
    .then(blob => setUser.storeImage(currentUser, blob))
    .then(function (url) {
        db.ref('users/' + currentUser.uid).update({
            displayName: displayName,
            photoURL: url,
            email: email,
            description: description
    
        }).then(
            document.getElementById('saveButton').style.display = "none",
            document.getElementById('notifications-h').html("<p>Profile updated!</p>")


        ).catch(function(error) {
            console.log(" An error happened" + error)
            document.getElementById('saveButton').style.display = "none",
            document.getElementById('notifications-h').html("<p>Something went wrong!</p>")

        });
    })
    .then(setUser.setUser(currentUser.uid))

   



}

