var tz = moment.tz.guess(true)

//Paiements fait par l'utilisateur
export function getUserpaidContents() {
    var div = document.getElementById("transactions-sent")
    div.innerHTML = "";
    div.innerHTML += '<div class="transaction"><div class="first-trcontainer"><p class="column-title" style="align-self:center;"><i class="fab fa-autoprefixer"></i>Titre</p></div><div class="second-trcontainer"><p class="column-title"><i class="fas fa-feather-alt"></i> Auteur</p></div></div>'
    var userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + userId + "/transactions/").once('value').then(function (snapshot) {
        var urls = (Object.keys(snapshot.val()));
        var author = (snapshot.val());
        console.log(Object.entries(author), urls);
        if (urls) {
            urls.forEach(function (element) {
                firebase.database().ref('/users/' + userId + "/transactions/" + element).once('value').then(function (snapi) {
                    var authorKey = snapi.val().authorKey
                    var status = snapi.val().status
                    console.log(snapi.val())
                    if (snapi.val() && snapi.val().count == 0) {

                        firebase.database().ref('/transactions/' + authorKey).once('value').then(function (snip) {
                            var authorId = snip.val().authorId

                            firebase.database().ref('/users/' + authorId).once('value').then(function (snoip) {
                                var authorDisplayname = (snoip.val() && snoip.val().displayName);
                                var authorphotoURL = (snoip.val() && snoip.val().photoURL);
                                firebase.database().ref('/transactions/' + authorKey + "/" + element).once('value').then(function (snop) {
                                    var img = snop.val().img
                                    var title = snop.val().title

                                    firebase.database().ref('/transactions/' + authorKey + "/" + element + "/cTransactions").child(userId).once('value').then(function (snup) {
                                        if (snup.val()) {
                                            var date = snup.val().date
                                            console.log(date)

                                            var subDate = date.substring(1, 25)
                                            var moDate = moment.tz((subDate), tz).fromNow();
                                            var shortTitle = title.substring(0, 35) + "..."

                                            div.innerHTML += '<div class="transaction"><div class="first-trcontainer"><p class="tr-title">' + shortTitle + '</p><p class="tr-date">' + moDate + '</p></div><div class="second-trcontainer"> <figure class="avatar avatar-sm"><img id="avatarPic" src="' + authorphotoURL + '" alt="Avatar"></figure><p>' + authorDisplayname + '</p></div></div>'

                                        }
                                    })

                                })
                            })
                        })
                    }

                })
            });
            $("#footer-sent").show()
        } else if (!urls) {
            console.log("pas de contenu")

        }
    })

}

//Tous les paiements historisés
export function getReceivedPaymentsHist() {
    var div = document.getElementById("transactions-received")
    div.innerHTML = "";

    $("#no-rpayments").hide()
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + userId + "/authorDetails/key").once('value').then(function (snapshot) {
        var authorKey = snapshot.val()
        console.log(authorKey)
        firebase.database().ref('/transactions/' + authorKey).once('value').then(function (snap) {
            var arrContent = Object.entries(snap.val())

            div.innerHTML += '<div class="transaction"><div class="first-trcontainer"><p class="column-title" style="align-self:center;"><i class="fab fa-autoprefixer"></i>Titre</p></div><div class="second-trcontainer"><p class="column-title"><i class="fab fa-slack-hash"></i> Number</p></div></div>'

            arrContent.forEach((value, index) => {
                console.log(value)

                if (index < 1) return;
                var title = value[1].title
                console.log(title)

                var shortTitle = title.substring(0, 35) + "..."
                var transactions = Object.entries(value[1])
                transactions.forEach((valeur, i) => {
                    if (i != 0) return;
                    var clientDate = valeur[1]

                    var parsedClientDate = Object.entries(clientDate)
                    console.log(parsedClientDate)
                    if (parsedClientDate) {
                        parsedClientDate.forEach((el, o) => {
                            var client = el[0]
                            var date = moment.tz((el[1].date.substring(1, 25)), tz).fromNow();
                            console.log(date)
                            firebase.database().ref('/users/' + client).once('value').then(function (snopshot) {
                                var photoClient = snopshot.val().photoURL
                                var nameClient = snopshot.val().displayName
                                var shortTitle = title.substring(0, 35) + "..."
                                var div = document.getElementById("transactions-received")
                                div.innerHTML += '<div class="transaction"><div class="first-trcontainer"><p class="tr-title">' + shortTitle + '</p><p class="tr-date">' + date + '</p></div><div class="second-trcontainer"> <figure class="avatar avatar-sm"><img id="avatarPic" src="' + photoClient + '" alt="Avatar"></figure><p>' + nameClient + '</p></div></div>'

                            })


                        })
                    } else {
                        var parsedClient = Object.keys(clientDate)
                        var parsedDate = Object.values(clientDate)
                        var client = parsedClient[0]
                        var date = moment.tz((parsedDate[0].substring(1, 25)), tz).fromNow();
                        firebase.database().ref('/users/' + client).once('value').then(function (snopshot) {
                            var photoClient = snopshot.val().photoURL
                            var nameClient = snopshot.val().displayName
                            var shortTitle = title.substring(0, 35) + "..."
                            div.innerHTML += '<div class="transaction"><div class="first-trcontainer"><p class="tr-title">' + shortTitle + '</p><p class="tr-date">' + date + '</p></div><div class="second-trcontainer"> <figure class="avatar avatar-sm"><img id="avatarPic" src="' + photoClient + '" alt="Avatar"></figure><p>' + nameClient + '</p></div></div>'

                        })
                    }
                })
            });
        })
        $("#footer-received").show()
    })
}

// Paiements totaux par contenus
export function getReceivedPaymentsbyContents() {

    var div = document.getElementById("transactions-received")
    div.innerHTML = "";
    div.innerHTML += '<div class="transaction"><div class="first-trcontainer"><p class="column-title" style="align-self:center;"><i class="far fa-user-circle"></i>User</p></div><div class="second-trcontainer"><p class="column-title"><i class="fab fa-slack-hash"></i>CoMonz</p></div></div>'

    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + userId + "/authorDetails/key").once('value').then(function (snapshot) {
        var authorKey = snapshot.val()
        firebase.database().ref('/transactions/' + authorKey).once('value').then(function (snap) {
            var authorSocket = Object.entries(snap.val())
            authorSocket.forEach((element, index) => {
                if (element[0] == "authorId") {
                    $("#no-rpayments").show()
                    $("#transaction-amount").html(0)

                    return;
                }
                $("#no-rpayments").hide()
                var urls = element[0]
                var title = element[1].title
                firebase.database().ref('/transactions/' + authorKey + "/" + urls + '/cTransactions').once('value').then(function (snap) {

                    var shortTitle = title.substring(0, 35) + "..."


                    var commoners = Object.keys(snap.val()).length;
                    $("#transaction-amount").html(authorSocket.length + 1)

                    console.log()
                    div.innerHTML += '<div class="transaction"><div class="first-trcontainer"><p class="tr-title">' + shortTitle + '</p></div><div class="second-trcontainer"><p>' + commoners + '</p></div></div>'

                })
            })
        })

    })
}
// Paiements donnés par auteurs

export function getSendPaymentsbyAuthors() {
    var div = document.getElementById("transactions-sent")
    div.innerHTML = "";
    div.innerHTML += '<div class="transaction"><div class="first-trcontainer"><p class="column-title" style="align-self:center;"><i class="fas fa-feather-alt"></i> Auteur</p></div><div class="second-trcontainer"><p class="column-title"><i class="fab fa-slack-hash"></i>Contents</p></div></div>'

    var clientIds = []
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + userId + "/transactions/").once('value').then(function (snapshot) {
        var arrContent = Object.entries(snapshot.val())

        arrContent.forEach((valeur, i) => {
            clientIds.push(valeur[1].authorKey)

        })

        var filteredclientIds = clientIds.filter((x, i, a) => a.indexOf(x) == i)
        console.log(filteredclientIds)
        filteredclientIds.forEach((valeur, i) => {
            firebase.database().ref('/transactions/' + valeur).once('value').then(function (snopshot) {
                var idClient = snopshot.val().authorId
                firebase.database().ref('/users/' + idClient).once('value').then(function (snopshot) {
                    var photoClient = snopshot.val().photoURL
                    var nameClient = snopshot.val().displayName
                    var counts = getOccurence(clientIds, valeur)

                    div.innerHTML += '<div class="transaction"><div class="first-trcontainer"><figure class="avatar avatar-sm"><img id="avatarPic" src="' + photoClient + '" alt="Avatar"></figure><p>' + nameClient + '</p></div><div class="second-trcontainer"><p class="tr-title">' + counts + '</p> </div></div>'
                })
            })

        })







    })
}
// Paiements totaux par utilisateurs

export function getReceivedPaymentsbyUsers() {
    var div = document.getElementById("transactions-received")
    div.innerHTML = "";
    div.innerHTML += '<div class="transaction"><div class="first-trcontainer"><p class="column-title" style="align-self:center;"><i class="fab fa-autoprefixer"></i>User</p></div><div class="second-trcontainer"><p class="column-title"><i class="fab fa-slack-hash"></i>CoMonz</p></div></div>'

    var clientIds = []
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + userId + "/authorDetails/key").once('value').then(function (snapshot) {
        var authorKey = snapshot.val()
        firebase.database().ref('/transactions/' + authorKey).once('value').then(function (snap) {
            var arrContent = Object.entries(snap.val())
            arrContent.forEach((value, index) => {
                if (value[0] == "authorId") return;
                var title = value[1].title
                var shortTitle = title.substring(0, 35) + "..."
                var transactions = Object.entries(value[1])

                transactions.forEach((valeur, i) => {

                    if (i != 0) return;
                    var clientDate = valeur[1]

                    var parsedClientDate = Object.entries(clientDate)
                    if (parsedClientDate) {
                        parsedClientDate.forEach((el, o) => {
                            var client = el[0]
                            clientIds.push(client)

                        })
                    }
                })
            })
            var filteredclientIds = clientIds.filter((x, i, a) => a.indexOf(x) == i)
            filteredclientIds.forEach((valeur, i) => {
                firebase.database().ref('/users/' + valeur).once('value').then(function (snopshot) {
                    var photoClient = snopshot.val().photoURL
                    var nameClient = snopshot.val().displayName
                    var div = document.getElementById("transactions-received")
                    var counts = getOccurence(clientIds, valeur)

                    div.innerHTML += '<div class="transaction"><div class="first-trcontainer"><figure class="avatar avatar-sm"><img id="avatarPic" src="' + photoClient + '" alt="Avatar"></figure><p>' + nameClient + '</p></div><div class="second-trcontainer"><p class="tr-title">' + counts + '</p> </div></div>'

                })

            })






        })
    })
}

export function getOccurence(array, value) {
    var count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
}