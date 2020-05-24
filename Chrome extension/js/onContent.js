import * as blackhole from '/js/blackhole.js';

setTimeout(getContent(), 500)
var key;
var tz = moment.tz.guess(true)

function getContent() {
    chrome.storage.local.get('key', function (retour) {
        var commonzkey = retour.key;
        chrome.storage.local.get('url', function (result) {

            var url = result.url;
            var currentUser = firebase.auth().currentUser.uid
            $("#comment").html("   ")

            const dataRef = firebase.database().ref('/users/' + currentUser + '/transactions').child(url)


            if (commonzkey !== null) {
                var comRef = firebase.database().ref('transactions/')

                firebase.database().ref('/users/' + currentUser).once('value').then(function (snip) {

                    var wallet = (snip.val() && snip.val().wallet);
                    var walletEndate = wallet.endDate
                    var fundDate
                    var diffTime

                    firebase.database().ref('/transactions/' + commonzkey + '/' + url + "/cTransactions/" + currentUser + "/date").once('value').then((data) => {
                        if (data && data.val()) {
                            diffTime = new Date(walletEndate).getTime() > new Date(data.val()).getTime()
                            fundDate = moment.tz((data.val().substring(1, 25)), tz).fromNow()
                        }





                        if (wallet) {
                            $("#wallet-on").show()
                            $("#wallet-off").hide()


                            dataRef.on("value", function (snop) {

                                if (snop.val() !== undefined && snop.val() !== null) {

                                    var date = snop.val().onDate;
                                    var count = snop.val().count;
                                    comRef.on("value", function (snep) {
                                        var userCom = snep.val() && snep.val()[currentUser]
                                        if (userCom) {
                                            var moDate = moment.tz((snep.val()[currentUser].date.substring(1, 25)), tz).fromNow();

                                            $("#comment").hide()
                                            $("#ownCom").html("<i class='far fa-comment-dots'></i><p>" + snep.val()[currentUser].content) + "</p>"
                                            $("#ownComdate").html(moDate)
                                            $("#lcomment").show()
                                            $("#pre-com").hide()


                                        } else {
                                            $("#lcomment").hide()
                                        }
                                    })
                                    if (count > 0) {
                                        setInterval(function () {

                                            chrome.storage.local.get('progress', function (result) {
                                                $("#statut-transaction").html("<p>Contenu rémunéré dans :<br>" + result.progress + " secondes</p>")

                                            })
                                        }, 1000)


                                        $("#vcomment").hide()
                                        if (count = 0) {
                                            if ($("#comment").html() > 3) {
                                                $("#vcomment").show()
                                            }
                                        }
                                        $("#statut-transaction").hide()
                                        $("#content-fund").show()
                                        $('#funding-date').html(fundDate)
                                        console.log(fundDate)
                                        $("#date").text(date)
                                        if ($("#comment").html() > 3) {
                                            $("#vcomment").show()
                                        } else {
                                            $("#vcomment").hide()

                                        }
                                        var editables = document.getElementsByClassName("editable")
                                        for (var i = 0; i < editables.length; i++) {
                                            (function (index) {
                                                editables[index].addEventListener("input", function () {
                                                    if ($("#comment").html().length > 1) {

                                                        $("#vcomment").show()
                                                    } else {
                                                        $("#vcomment").hide()
                                                    }
                                                })
                                            })(i);
                                        }
                                        console.log(diffTime)

                                        if (diffTime) {
                                            $("#cancel-fund").hide()
                                        } else {
                                            $("#cancel-fund").show()
                                        }
                                    }


                                }

                            })



                            firebase.database().ref('/transactions/' + commonzkey).once('value').then(function (snip) {
                                var author = (snip.val() && snip.val().authorId);

                                firebase.database().ref('/users/' + author).once('value').then(function (snapshot) {

                                    var authorDisplayname = (snapshot.val() && snapshot.val().displayName);
                                    var authorphotoURL = (snapshot.val() && snapshot.val().photoURL);
                                    var authorDescription = (snapshot.val() && snapshot.val().description);
                                    $("#avatarPic").attr("src", authorphotoURL);
                                    $("#user-container").text(authorDisplayname);
                                    $("#description-container").text(authorDescription);



                                })
                            })

                            firebase.database().ref('/transactions/' + commonzkey + '/' + url + '/cTransactions').once('value').then(function (snapshot) {
                                if (snapshot.val()) {
                                    var commoners = Object.keys(snapshot.val()).length;
                                    blackhole.blackhole('#blackhole', commoners, 220, 220, 125);
                                    $("#commoners").text("Ce contenu à déjà conquis " + commoners + " comMoners")

                                } else if (snapshot.val() == undefined) {
                                    $("#statut-transaction").text("pas encore de support")
                                    blackhole.blackhole('#blackhole', 1, 220, 220, 85);
                                    firebase.database().ref('/users/' + currentUser + '/transactions/' + url).once('value').then(function (snip) {

                                        if (snip.val() == null || snip.val() == undefined) {
                                            $("#vcomment-field").hide()
                                            $("#content-refund").show()

                                        }

                                    })
                                }

                            })

                            var comRef = firebase.database().ref('transactions/' + commonzkey + "/" + url + "/comments")
                            comRef.on("value", function (snep) {
                                const comments = snep.val()
                                if (comments) {
                                    Object.keys(comments).forEach((userIds, index) => {
                                        firebase.database().ref('users/' + userIds).once('value').then(function (snoip) {
                                            var authorDisplayname = (snoip.val() && snoip.val().displayName);
                                            var authorphotoURL = (snoip.val() && snoip.val().photoURL);

                                            var div = document.getElementById("comments-list")
                                            div.innerHTML += '<div class="transaction"><div class="first-trcontainer"><div class="comment-container"><p class="tr-title">' + comments[userIds].content + '</p></div><p class="tr-date">' + moment.tz((comments[userIds].date.substring(1, 25)), tz).fromNow() + '</p></div><div class="second-trcontainer"> <figure class="avatar avatar-sm"><img id="avatarPic" src="' + authorphotoURL + '" alt="Avatar"></figure><p>' + authorDisplayname + '</p></div></div>'

                                        })
                                    })
                                }
                            })
                        } else {

                            firebase.database().ref('/transactions/' + commonzkey).once('value').then(function (snip) {
                                var author = (snip.val() && snip.val().authorId);

                                firebase.database().ref('/users/' + author).once('value').then(function (snapshot) {

                                    var authorDisplayname = (snapshot.val() && snapshot.val().displayName);
                                    var authorphotoURL = (snapshot.val() && snapshot.val().photoURL);
                                    var authorDescription = (snapshot.val() && snapshot.val().description);
                                    $("#avatarPic").attr("src", authorphotoURL);
                                    $("#user-container").text(authorDisplayname);
                                    $("#description-container").text(authorDescription);



                                })
                            })

                            $("#wallet-on").hide()
                            $("#wallet-off").show()

                        }
                    })
                })
            }

            function linkComment() {
                var comRef = firebase.database().ref('transactions/' + commonzkey + "/" + url + "/comments/" + currentUser)
                var date = new Date();
                var parsedDate = JSON.stringify(date);
                var comment = $("#comment").html()
                $("#pre-com").hide()
                $("#lcomment").show()
                var moDate = moment.tz((parsedDate.substring(1, 22)), tz).fromNow();

                $("#ownComdate").html(moDate)

                $('#comments-list').html('')
                console.log(comment)
                if (comment.length > 0) {

                    comRef.update({
                        content: comment,
                        date: parsedDate

                    });

                }
            }
            document.getElementById("vcomment").addEventListener('click', linkComment, false);


        })

    })

    function cancelFund() {
        chrome.storage.local.get('url', function (result) {
            var user = firebase.auth().currentUser.uid
            chrome.storage.local.get('key', function (retour) {
                var commonzkey = retour.key;

                var url = result.url;
                var transRef = firebase.database().ref('transactions/' + commonzkey + "/" + url + "/cTransactions/" + user)
                var comRef = firebase.database().ref('transactions/' + commonzkey + "/" + url + "/comments/" + user)
                var userRef = firebase.database().ref('users/' + user + "/transactions/" + url)
                transRef.remove()
                comRef.remove()
                userRef.remove()
                console.log("remove completed")
                $('#content-fund').hide()
                $("#content-refund").show()
                chrome.storage.local.set({ 'progress': 60 });


            })
        })
    }
    document.getElementById("cancel-fund").addEventListener('click', cancelFund, false);




    function backProfile() {
        $("#content-area").load("profile.html");
        $("#content-area").show()


    }



    document.getElementById("profile-back").addEventListener('click', backProfile, false);

}