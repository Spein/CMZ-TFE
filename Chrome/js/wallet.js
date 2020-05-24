import * as blackhole from '/js/blackhole.js';
import * as lists from '/js/lists.js';
moment().local("fr")
export function checkWallet() {
    $("#blackhole").html("")
    $("#profile-header").hide()
    $("#transaction-header").hide()
    $("#wallet-header").show()
    const connectedUser = firebase.auth().currentUser.uid

    return firebase.database().ref('/users/' + connectedUser).once('value').then(function (snapshot) {
        var wallet = (snapshot.val() && snapshot.val().wallet);
        var transactions = (snapshot.val() && snapshot.val().transactions)
        console.log(wallet)
        if (wallet) {
            var attCounter = (snapshot.val() && snapshot.val().wallet.Attcounter)

            $("#create-wallet").hide()

            $("#wallet-amount").show()
            $("#commonZ").show()
            var moDate = moment(wallet.startDate.substring(1, 20)).fromNow();
            console.log(wallet.startDate.substring(1, 20))
            $("#wallet-amount").html(wallet.amount)
            blackhole.blackhole('#blackhole', $("#wallet-amount").html(), 220, 220, 125);
            document.querySelector("#wallet-startDate").innerHTML = moment(wallet.startDate.substring(1, 11)).format('DD/MM/YYYY')
            document.querySelector("#wallet-endDate").innerHTML = moment(wallet.endDate.substring(1, 11)).format('DD/MM/YYYY')

            if (transactions) {
                lists.getUserpaidContents()
                $("#no-transactions").hide()

            } else {
                $("#no-transactions").show()
            }
            if (wallet.status == "inactive") {
                $("#btns-wallet").show()
                $("#statut-commons").html("<p>Votre période est dépassée. <p> Ajoutez ici vos coMonZ et déterminez votre temps d'attention </p><p>Votre temps d'attention est de :<br><span id='attCounter'>1 minute et 0 secondes</span></p>")
                $("#date-container").hide()



            } else {
                $("#btns-wallet").hide()
                $("#save-wallet").hide()
                var minutes = Math.floor(attCounter / 60)
                if (attCounter < 61 && !attCounter == 60) {
                    var seconds = attCounter

                } else if (attCounter = 60) {
                    var seconds = 0
                    minutes = 1

                } else {
                    var seconds = attCounter - (60 * minutes)
                }
                console.log(attCounter)
                $("#statut-commons").html("<p>Votre portefeuille a été rempli " + moDate + "</p><p>Votre temps d'attention est de :<br><span id='attCounter'></span></p>")
                $("#attCounter").html(minutes + " minutes " + seconds + " secondes")

                $("#statut-commons").show()
                $("#date-container").show()


            }
            $("#no-wallet").hide()
            $("#wallet-on").show()



        } else if (wallet == undefined) {
            blackhole.blackhole('#blackhole', 1, 220, 220, 125)
            $("#no-wallet").show()
            $("#commonZ").hide()
            $("#btns-wallet").hide()
            $("#create-wallet").show()
            $("#paypal-button-container").html("")



        }
        // ...
    });




}

function checkSave() {
    setTimeout(function () {
        if (parseInt($("#wallet-amount").html()) > 0) {
            $("#save-wallet").show()
        } else {
            $("#save-wallet").hide()

        }

    }, 200)

}
document.getElementById("minus-commons").addEventListener('click', checkSave, false);
document.getElementById("add-commons").addEventListener('click', checkSave, false);

export function createWallet() {
    $("#no-wallet").hide()
    $("#create-wallet").hide()
    $("#wallet-amount").show()
    $("#btns-wallet").show()
    $("#statut-commons").html("<p> Ajoutez ici vos coMonZ et déterminez votre temps d'attention </p><p>Votre temps d'attention est de :<br><span id='attCounter'>1 minute et 0 secondes</span></p>")
    $("#wallet-on").show()
    $("#commonZ").show()

}
export function minComonz() {

    var parsedCount = parseInt($("#wallet-amount").html())
    if (parsedCount > 0) {

        parsedCount = parsedCount - 10
        $("#wallet-amount").html(parsedCount)
        blackhole.blackhole('#blackhole', parsedCount, 220, 220, 125);
    }




}
document.getElementById("minus-commons").addEventListener('click', minComonz, false);
export function addComonz() {

    console.log("min")
    var parsedCount = parseInt($("#wallet-amount").html())
    parsedCount = parsedCount + 10
    $("#wallet-amount").html(parsedCount)



}
document.getElementById("add-commons").addEventListener('click', addComonz, false);
export function saveWallet() {
    $("#btns-wallet").hide()
    $("#transactions-sent").hide()
    $("#footer-sent").html("")
    $("#paypal-button-container").html("")
    paypal.Buttons({

        // Set up the transaction
        createOrder: function (data, actions) {
            var amount = $("#wallet-amount").html()
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        currency: "EUR",
                        value: amount / 10
                    }
                }]
            });
        },

        // Finalize the transaction
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                // Show a success message to the buyer
                $("#paypal-button-container").html("")

                var user = firebase.auth().currentUser.uid
                var amount = $("#wallet-amount").html()
                var startDate = new Date();
                var endDate = moment(new Date()).add(1, 'month');

                var parsedStartDate = JSON.stringify(startDate);
                var parsedEndDate = JSON.stringify(endDate);

                $("#btns-wallet").hide()
                $("#save-commons").hide()
                //Paypal
                blackhole.blackhole('#blackhole', amount, 220, 220, 125);

                firebase.database().ref('users/' + user + '/wallet/').set({
                    amount: amount,
                    startDate: parsedStartDate,
                    endDate: parsedEndDate,
                    status: "active",
                    Attcounter: parseInt($('input[name="participants"]').val())


                });
                $('#paypal-button-container').hide();
                checkWallet()
                chrome.storage.local.set({ 'wallet-amount': amount });
                chrome.storage.local.set({ 'date-wallet': date });

                console.log(" wallet storage successful")
            });
        }


    }).render('#paypal-button-container');




}
document.getElementById("save-wallet").addEventListener('click', saveWallet, false);

export function checkWStatus() {
    const connectedUser = firebase.auth().currentUser.uid
    if (connectedUser) {
        firebase.database().ref('/users/' + connectedUser).once('value').then(function (snapshot) {
            var wallet = (snapshot.val() && snapshot.val().wallet);
            var transactions = (snapshot.val() && snapshot.val().transactions)
            if (wallet) {
                var endDate = wallet.endDate;
                var month = moment(wallet.startDate.substring(1, 11)).format('MMMM');
                var year = moment(wallet.startDate.substring(1, 11)).format('YYYY');

                var diff = moment().diff(endDate.substring(1, 20), 'days')
                console.log(diff)
                if (diff > 0 && transactions && wallet.amount > 0) {
                    var walletRef = firebase.database().ref('/users/' + connectedUser + "/wallet")
                    var authorPool = {};

                    var arrTrans = 0

                    var bar = new Promise((resolve, reject) => {
                        Object.keys(transactions).forEach((value, index, array) => {
                            console.log(value);

                            var toUpdate = firebase.database().ref('/users/' + connectedUser + "/transactions/").child(value)
                            toUpdate.once('value').then(function (snip) {

                                if (snip.val().count == 0) {
                                    arrTrans++
                                    console.log(arrTrans)
                                    toUpdate.update({
                                        count: "payé",

                                    })

                                }
                                if (index === array.length - 1) resolve();

                            })
                        });
                    });

                    bar.then(() => {
                        console.log(arrTrans)

                        var numTransactions = arrTrans
                        var share = wallet.amount / numTransactions
                        const keys = Object.keys(transactions)
                        for (const key of keys) {
                            var authorKey = transactions[key].authorKey
                            authorPool[authorKey] = (authorPool[authorKey] + share) || share


                        }
                        const authors = Object.keys(authorPool)

                        for (const author of authors) {
                            console.log(authorPool[author])
                            firebase.database().ref('/checkouts/' + author + "/" + year + "/" + month).once('value').then(function (snip) {
                                if (snip.val() && snip.val().total) {
                                    var total = snip.val().total + authorPool[author]
                                } else {
                                    var total = authorPool[author]

                                }

                                firebase.database().ref('/checkouts/' + author + "/" + year + "/" + month).update({
                                    [connectedUser]: authorPool[author],
                                    total: total

                                }).then(
                                    walletRef.update({
                                        status: "inactive",
                                        amount: 0
                                    }))

                            })
                        }
                        console.log(authorPool)
                    });


                    Object.keys(transactions).forEach(function (element) {
                        console.log(element)

                    })





                }
            }
        })
    }
}

const $element = $('input[type="range"]');
const $tooltip = $('#range-tooltip');
const sliderStates = [
    { name: "low", tooltip: "Super, vous dégainez plus vite que votre ombre! On adore les francs-tireurs.", range: _.range(5, 300) },
    { name: "med", tooltip: "Pas mal, vous avez raison pourquoi se presser à rétribuer un potentiel franc-maçonniste !", range: _.range(300, 500) },
    { name: "high", tooltip: "Mouais...j'en connais un qui passe les vacances chez maman à Tel-Aviv...Allez Mr. Scrupuleux ainsi soit-il :)", range: [600] },
];
var currentState;
var $handle;

$element
    .rangeslider({
        polyfill: false,
        onInit: function () {
            $handle = $('.rangeslider__handle', this.$range);
            updateHandle($handle[0], this.value);
            updateState($handle[0], this.value);
        }
    })
    .on('input', function () {
        var minutes = Math.floor(this.value / 60)
        if (this.value < 61) {
            var seconds = this.value

        } else {
            var seconds = this.value - (60 * minutes)
        }
        $("#attCounter").html(minutes + " minutes " + seconds + " secondes ")
        updateHandle($handle[0], this.value);
        checkState($handle[0], this.value);
    });

// Update the value inside the slider handle
function updateHandle(el, val) {
    el.textContent = val;
}

// Check if the slider state has changed
function checkState(el, val) {
    // if the value does not fall in the range of the current state, update that shit.
    if (!_.contains(currentState.range, parseInt(val))) {
        updateState(el, val);
    }
}

// Change the state of the slider
function updateState(el, val) {
    for (var j = 0; j < sliderStates.length; j++) {
        if (_.contains(sliderStates[j].range, parseInt(val))) {
            currentState = sliderStates[j];
            // updateSlider();
        }
    }
    // If the state is high, update the handle count to read 50+
    if (currentState.name == "high") {
        updateHandle($handle[0], "600");
    }
    // Update handle color
    $handle
        .removeClass(function (index, css) {
            return (css.match(/(^|\s)js-\S+/g) || []).join(' ');
        })
        .addClass("js-" + currentState.name);
    // Update tooltip
    $tooltip.html(currentState.tooltip);
}