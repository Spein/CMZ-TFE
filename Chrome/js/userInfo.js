import * as blackhole from '/js/blackhole.js';

export function load() {
    /*     chrome.storage.local.get('contentStatus', function(result) {
            console.log(result.contentStatus)
            if (result.contentStatus == 'content') {
                $("#content-back").show()

            }
        }) */
    const currentUser = firebase.auth().currentUser.uid
    firebase.database().ref('/users/' + currentUser).once('value').then(function (snapshot) {

        const connectedUser = {
            photoURL: snapshot.val().photoURL,
            displayName: snapshot.val().displayName,
            email: snapshot.val().email,
            description: snapshot.val().description
        }
        console.log(connectedUser)

        checkSupport()
        $("#displayName").text(connectedUser.displayName);
        $("#avatarPic").attr("src", connectedUser.photoURL);
        $("#email").text(connectedUser.email);
        $("#description").text(connectedUser.description);
    }).catch((err) => { console.log(err) })




}
export function showFSteps() {
    $("#tutorials").show()
    $("#first-steps").show()
}

export function closeTuto() {
    $("#tutorials").hide()
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
                $("#wishes").html("<i style='color:#d95555' class='fas fa-seedling'></i><p>Vous avez déjà marqué votre intérêt pour ce contenu et nous avons sûrement déjà pris contact avec l'auteur</p>")

            }
        })
    })
}
export function writeUserData() {
    var currentUser = firebase.auth().currentUser
    var db = firebase.database()
    var email = $("#email").text();
    if (email != currentUser.email) {
        currentUser.updateEmail(email).then(function () {
            console.log('email changed')
        }).catch(function (error) {
            // An error happened.
        });
    }
    var photoURL = $("#avatarPic").attr("src");
    var displayName = $("#displayName").text();
    var description = $("#description").text()

    db.ref('users/' + currentUser.uid).update({
        displayName: displayName,
        photoURL: photoURL,
        email: email,
        description: description

    }).then(function () {
        chrome.storage.local.set({ 'displayName': displayName });
        chrome.storage.local.set({ 'email': email });
        chrome.storage.local.set({ 'photoURL': photoURL });
        chrome.storage.local.set({ 'description': description });

        console.log("Update successful")
    }).catch(function (error) {
        console.log(" An error happened")
    });



}