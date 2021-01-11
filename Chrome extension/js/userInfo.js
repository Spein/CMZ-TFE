import * as blackhole from '/js/blackhole.js';
import * as setUser from '/js/setUser.js';

export function load() {

    setUser.retrieveUser().then(user => {

        fillFields(user)
    })
        .then(
            checkSupport()
        )

}
export function fillFields(user) {
    console.log(user)
    $("#displayName").text(user.displayName);
    $("#avatarPic").attr("src", user.photoURL);
    $("#email").text(user.email);
    $("#description").text(user.description);
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
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var user = firebase.auth().currentUser.uid
        var url = tabs[0].url.replace(/[^\w\s]/gi, '_')
        console.log(url)
        firebase.database().ref('/wishes/' + url).once('value').then(function (snapshot) {
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
        currentUser.updateEmail(email).then(function () {
        }).catch(function (error) {
            // An error happened.
        });
    }

    setUser.createBlob()
        .then(blob => setUser.storeImage(currentUser, blob))
        .then(function (url) {
            console.log(url)
            db.ref('users/' + currentUser.uid).update({
                displayName: displayName,
                photoURL: url,
                email: email,
                description: description

            }).then(
                $('#saveButton').hide(),
                $('#notifications-h').html("<p>Profile updated!</p>")


            ).then(setUser.setUser(currentUser.uid))


        })
        .catch(function (error) {
            console.log(" An error happened" + error)
            $('#saveButton').hide()
            $('#notifications-h').html("<p>Something went wrong!</p>")

        });





}

