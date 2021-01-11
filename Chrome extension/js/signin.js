import * as blackhole from '/js/blackhole.js';
import * as setUser from '/js/setUser.js';
blackhole.blackhole('#blackhole', 1, 175, 200, 140)


function signUp(email, displayName, password, photoURL) {
    var email = $("#email").val();
    var password = $("#password").val();
    var displayName = $("#displayName").val();
    var description = $("#description").val();
    var user = null;
    firebase.auth().createUserWithEmailAndPassword(email, password)

        .then(function (user) {

            setUser.createBlob()
                .then(blob => setUser.storeImage(user, blob))
                .then(function (url) {
                    const RegisteredUser = {
                        email: email,
                        description: description,
                        displayName: displayName,
                        photoURL: url,

                    }
                    firebase.database().ref('users/' + user.uid).set(RegisteredUser)  
                    .then(function (user) {
                        user = firebase.auth().currentUser.uid;
                        setUser.setUser(user)

                    })

                });

        })
        .catch((error) => {
            $("#warning").text(error.message);
        });

}


function signIn() {
    var email = $("#emails").val();
    var password = $("#passwords").val();
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (user) {
            user = firebase.auth().currentUser.uid;
            setUser.setUser(user)

        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            $("#warning").text(error.message);
            // ...
        });
}



document.querySelector('input[type="file"]').addEventListener('change', function () {
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

document.getElementById("signUp").addEventListener('click', signUp, false);
document.getElementById("signIn").addEventListener('click', signIn, false);
document.getElementById("new-member").addEventListener('click', newMember, false);
document.getElementById("existing-member").addEventListener('click', existingMember, false);