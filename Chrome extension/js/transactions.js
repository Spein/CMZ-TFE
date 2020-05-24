import * as blackhole from '/js/blackhole.js';
import * as lists from '/js/lists.js';
export function firstCheck() {
    $("#blackhole").html("")
    $("#profile-header").hide()
    $("#wallet-header").hide()
    $("#transaction-header").show()
    var userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
        var wallet = (snapshot.val() && snapshot.val().wallet);
        console.log(wallet)
        if (wallet) {
            $("#need-wallet").hide()
            checkAuthor()

        } else if (wallet == undefined) {
            $("#need-wallet").show()
            $("#commoners").hide()
            $("#wallet-amount").html(0)


        }
    })

}

export function checkAuthor() {
    var div = document.getElementById("transactions-received")
    div.innerHTML = ""
    var userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
        var authorDetails = (snapshot.val() && snapshot.val().authorDetails);

        if (authorDetails) {
            var bankAcc = (snapshot.val() && snapshot.val().authorDetails.bankAccount)

            var commoners = 0;
            firebase.database().ref('/users/' + userId + "/authorDetails/").once('value').then(function (snapshot) {
                var authorKey = snapshot.val().key

                firebase.database().ref('/transactions/' + authorKey).once('value').then(function (snap) {

                    if (snap.val()) {

                        var authorSocket = Object.entries(snap.val())
                        div.innerHTML += '<div class="transaction"><div class="first-trcontainer"><p class="column-title" style="align-self:center;"><i class="fab fa-autoprefixer"></i>Titre</p></div><div class="second-trcontainer"><p class="column-title"><i class="far fa-user-circle"></i>Profile</p></div></div>'

                        authorSocket.forEach((element, index) => {
                            if (element[0] == "authorId") {
                                $("#no-rpayments").show()
                                $("#transaction-amount").html(0)
                                $("#footer-received").hide()
                                return;
                            }

                            $("#no-rpayments").hide()
                            var urls = element[0]
                            var title = element[1].title
                            firebase.database().ref('/transactions/' + authorKey + "/" + urls + '/cTransactions').once('value').then(function (snap) {
                                var userSocket = Object.keys(snap.val())
                                var userDate = Object.values(snap.val())

                                commoners = commoners + userSocket.length;
                                blackhole.blackhole('#blackhole', commoners + 1, 220, 220, 125)
                                $("#transaction-amount").html(commoners)
                                userSocket.forEach((element, index) => {
                                    var rawdate = snap.val()
                                    var date = moment(rawdate[element].date.substring(1, 11)).fromNow();

                                    firebase.database().ref('/users/' + element).once('value').then(function (snopshot) {
                                        var photoClient = snopshot.val().photoURL
                                        var nameClient = snopshot.val().displayName
                                        var shortTitle = title.substring(0, 35) + "..."
                                        div.innerHTML += '<div class="transaction"><div class="first-trcontainer"><p class="tr-title">' + shortTitle + '</p><p class="tr-date">' + date + '</p></div><div class="second-trcontainer"> <figure class="avatar avatar-sm"><img id="avatarPic" src="' + photoClient + '" alt="Avatar"></figure><p>' + nameClient + '</p></div></div>'

                                    })

                                })


                            })

                        })
                        $("#footer-received").show()

                    }


                })

            })


            $("#no-author").hide()
            $("#author-on").show()
            $("#commons-key").text("<comonz id='" + authorDetails.key + "'></comomz>")
            $("#bank-account").text(bankAcc)

        } else if (authorDetails == undefined) {
            $("#no-author").show()
            blackhole.blackhole('#blackhole', 1, 220, 220, 125)
            $("#transaction-amount").html(0)
        }
        // ...
    });



}
$("#cgu").change(function () {
    if (this.checked) {
        $("#no-cgu").hide()
        $("#cgu-accepted").show()
        $("#cgu").attr("disabled", true);


    }
});
export function createAuthor() {

    var authorKey = Math.random().toString(36).slice(-10);
    var userId = firebase.auth().currentUser.uid
    var iban = $("#iban-input").val();

    firebase.database().ref('users/' + userId + '/authorDetails').set({
        siteURL: false,
        key: authorKey,
        bankAccount: iban,

    });

    firebase.database().ref('transactions/' + authorKey).set({
        authorId: userId,
    });
    checkAuthor()

}

export function alertValidIBAN(iban) {
    var iban = document.getElementById("iban-input")

    if (isValidIBANNumber(iban.value)) {

        $("#check-author").hide()
        createAuthor()


    } else {
        $("#warning-iban").html("<p class='label label-error mr-1'>Mauvais numéro IBAN</p>")

    };

}
export function alertValidIBAN2(iban) {
    var iban = document.getElementById("iban-input2")
    var changediban = iban.value
    if (isValidIBANNumber(changediban)) {
        var userId = firebase.auth().currentUser.uid

        $("#verify-change").hide()
        firebase.database().ref('users/' + userId + '/authorDetails').update({
            bankAccount: changediban

        })

        checkAuthor()


    } else {
        $("#warning-iban2").html("<p class='label label-error mr-1'>Mauvais numéro IBAN</p>")

    };

}
document.getElementById("check-iban2").addEventListener('click', alertValidIBAN2, false);
document.getElementById("change-bacc").addEventListener('click', function () { $("#verify-change").show() }, false);

export function isValidIBANNumber(input) {
    var CODE_LENGTHS = {
        AD: 24,
        AE: 23,
        AT: 20,
        AZ: 28,
        BA: 20,
        BE: 16,
        BG: 22,
        BH: 22,
        BR: 29,
        CH: 21,
        CR: 21,
        CY: 28,
        CZ: 24,
        DE: 22,
        DK: 18,
        DO: 28,
        EE: 20,
        ES: 24,
        FI: 18,
        FO: 18,
        FR: 27,
        GB: 22,
        GI: 23,
        GL: 18,
        GR: 27,
        GT: 28,
        HR: 21,
        HU: 28,
        IE: 22,
        IL: 23,
        IS: 26,
        IT: 27,
        JO: 30,
        KW: 30,
        KZ: 20,
        LB: 28,
        LI: 21,
        LT: 20,
        LU: 20,
        LV: 21,
        MC: 27,
        MD: 24,
        ME: 22,
        MK: 19,
        MR: 27,
        MT: 31,
        MU: 30,
        NL: 18,
        NO: 15,
        PK: 24,
        PL: 28,
        PS: 29,
        PT: 25,
        QA: 29,
        RO: 24,
        RS: 22,
        SA: 24,
        SE: 24,
        SI: 19,
        SK: 24,
        SM: 27,
        TN: 24,
        TR: 26
    };
    var iban = String(input).toUpperCase().replace(/[^A-Z0-9]/g, ''), // keep only alphanumeric characters
        code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/), // match and capture (1) the country code, (2) the check digits, and (3) the rest
        digits;
    // check syntax and length
    if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
        return false;
    }
    // rearrange country code and check digits, and convert chars to ints
    digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, function (letter) {
        return letter.charCodeAt(0) - 55;
    });
    // final check
    return mod97(digits);
}

function mod97(string) {
    var checksum = string.slice(0, 2),
        fragment;
    for (var offset = 2; offset < string.length; offset += 7) {
        fragment = String(checksum) + string.substring(offset, offset + 7);
        checksum = parseInt(fragment, 10) % 97;
    }
    return checksum;
}