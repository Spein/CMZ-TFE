export function setUser(user) {
    return new Promise(function (resolve, reject) {

            return firebase.database().ref('/users/' + user).once('value').then(function(snapshot) {
                console.log(user)
                var userData = [{
                    uid:user,
                    displayName: (snapshot.val() && snapshot.val().displayName) || null,
                    email: (snapshot.val() && snapshot.val().email) || null,
                    photoURL: (snapshot.val() && snapshot.val().photoURL) || null,
                    description: (snapshot.val() && snapshot.val().description) || null,
                    transactions:(snapshot.val() && snapshot.val().transactions) || null,
                    walletStatus: (snapshot.val().wallet && snapshot.val().wallet.status) || null,
                    walletAmount: (snapshot.val().wallet && snapshot.val().wallet.amount) || null,
                    walletStartDate: (snapshot.val().wallet && snapshot.val().wallet.startDate) || null,
                    walletendDate: (snapshot.val().wallet && snapshot.val().wallet.endDate) || null,
                    attCounter: (snapshot.val().wallet && snapshot.val().wallet.Attcounter) || null,
                    authorKey: (snapshot.val().authorDetails && snapshot.val().authorDetails.key) || null,
                    authorbankAccount : (snapshot.val().authorDetails && snapshot.val().authorDetails.bankAccount) || null
                }]
                resolve(localStorage.setItem('user', JSON.stringify(userData)));


                // ...
            });
   
        })
}

export function retrieveUser() {
    return new Promise(function (resolve, reject) {
    console.log(localStorage)
    var user = JSON.parse(localStorage.getItem('user'))[0];
    resolve(user)})

}


export function createBlob() {
    return new Promise(function (resolve, reject) {
        var preSrc = document.querySelector('#file').files[0];
        if (preSrc) {
            var src = preSrc
            var blob = new Blob([src], { type: "image/png" });
            resolve(blob)
        } else {
            var random = Math.floor(Math.random() * 3) + 1
            fetch('../logo/planet-' + random + '.png')

                .then(response => response.blob())
                .then(function (blob) {
                    resolve(blob)
                });
        }
    })


}

export function storeImage(user, blob) {
    return new Promise(function (resolve, reject) {

        var ref = firebase.storage().ref().child('images/' + user.uid + "/profilePic.png")
        // use the Blob or File API
        ref.put(blob).then(snapshot => snapshot.ref.getDownloadURL()).then(url => resolve(url))
    })
}