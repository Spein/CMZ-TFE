export function storeUser(user) {
    var email = $("#emails").val();
    var password = $("#passwords").val();
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(user) {
            user = firebase.auth().currentUser;
            var userId = firebase.auth().currentUser.uid;
            return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
                var userData = [{
                    displayName: (snapshot.val() && snapshot.val().displayName) || 'Anonymous';
                    email: (snapshot.val() && snapshot.val().email) || 'No email';
                    photoURL: (snapshot.val() && snapshot.val().photoURL) || 'No photo URL';
                    description: (snapshot.val() && snapshot.val().description) || 'No description';
                    walletStatus: (snapshot.val() && snapshot.val().wallet.status) || 'No wallet';
                    walletAmount: (snapshot.val() && snapshot.val().wallet.amount) || 'No wallet'
                    walletStartDate: (snapshot.val() && snapshot.val().wallet.startDate) || 'No wallet'
                    walletendDate: (snapshot.val() && snapshot.val().wallet.endDate) || 'No wallet'
                    attCounter: (snapshot.val() && snapshot.val().wallet.Attcounter) || 'No wallet'
                    authorKey: (snapshot.val() && snapshot.val().authorDetails.key) || 'Not an author'
                    authorbankAccount = (snapshot.val() && snapshot.val().authorDetails.bankAccount) || 'Not an author'
                }]

                // ...
            });
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            console.log("error")
                /* $("#warning").text(error.message); */
                // ...
        });

}