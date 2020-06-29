import * as blackhole from '/js/blackhole.js';
import * as userInfo from '/js/userInfo.js';
import * as credentials from '/js/credentials.js';

blackhole.blackhole('#blackhole', 1, 175, 200, 140)


function signUp(email, displayName, password, photoURL) {
    var email = $("#email").val();
    var password = $("#password").val();
    var displayName = $("#displayName").val();
    var description = $("#description").val();
    var user = null;


    firebase.auth().createUserWithEmailAndPassword(email, password)

        .then(function (user) {
            user = firebase.auth().currentUser;
            var src = document.querySelector('#file').files[0];

            var blob = new Blob([src], { type: "image/jpeg" });

            console.log(blob)
            var metadata = {
                contentType: 'image/jpeg',
            };

            var ref = firebase.storage().ref().child('images/' + user.uid + "/profilePic.jpg")
            // use the Blob or File API
            ref.put(blob).then(snapshot => snapshot.ref.getDownloadURL())
                .then(function (url) {
                    const RegisteredUser = {
                        email: email,
                        description: description,
                        displayName: displayName,
                        photoURL: url,

                    }
                    firebase.database().ref('users/' + user.uid).set(RegisteredUser).then(function (user) {
                        userInfo.load()
                        $("#container").load("profile.html");
                        userInfo.showFSteps()

                    });
                });

        })
        .catch((error) => {
            $("#warning").text(error.message);
        });
    console.log('Validation link was sent to ' + email + '.');

}

document.getElementById("signUp").addEventListener('click', signUp, false);

function signIn(email, displayName, password, photoURL) {
    var email = $("#emails").val();
    var password = $("#passwords").val();
    console.log(email + password)
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (user) {
            user = firebase.auth().currentUser;
            var userId = firebase.auth().currentUser.uid;
            return firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
                var displayName = (snapshot.val() && snapshot.val().displayName) || 'Anonymous';
                var email = (snapshot.val() && snapshot.val().email) || 'No email';
                var photoURL = (snapshot.val() && snapshot.val().photoURL) || 'No photo URL';
                var description = (snapshot.val() && snapshot.val().description) || 'No description';
                // ...
            });
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            $("#warning").text(error.message);
            // ...
        });
}

document.getElementById("signIn").addEventListener('click', signIn, false);


document.querySelector('input[type="file"]').addEventListener('change', function () {
    console.log("la")

    if (this.files && this.files[0]) {
        var storage = firebase.storage()
        var img = document.querySelector('img'); // $('img')[0]
        img.src = URL.createObjectURL(this.files[0]); // set src to blob url
        var file = img.src
    }
});


function newMember() {

    $("#emailsignIn").hide();
    $('#emailsignUp').show()

}

function existingMember() {
    $('#emailsignUp').hide()
    $("#emailsignIn").show();

}
document.getElementById("new-member").addEventListener('click', newMember, false);
document.getElementById("existing-member").addEventListener('click', existingMember, false);