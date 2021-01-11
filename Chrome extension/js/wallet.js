import * as blackhole from '/js/blackhole.js';
import * as lists from '/js/lists.js';
import * as setUser from '/js/setUser.js';

moment()
export function checkWallet() {
    $("#paypal-button-container").html("")

    $("#blackhole").html("")
    $("#profile-header").hide()
    $("#transaction-header").hide()
    $("#wallet-header").show()
    $("#transactions-footer").show()

    setUser.retrieveUser().then(user => {
        var walletStatus = user.walletStatus;
        var userUid=user.uid
        var transactions = user.transactions
        console.log(walletStatus,transactions)
         if (walletStatus==="active") {
            var attCounter = user.attCounter

            $("#create-wallet").hide()
            $("#no-wallet").hide()

            $("#wallet-amount").show()
            $("#commonZ").show()
            var moDate = moment(user.walletStartDate.substring(1, 20)).fromNow();
            $("#wallet-amount").html(wallet.amount)
            blackhole.blackhole('#blackhole', $("#wallet-amount").html(), 220, 220, 125);
            document.querySelector("#wallet-startDate").innerHTML = moment(user.walletStartDate.substring(1, 11)).format('DD/MM/YYYY')
            document.querySelector("#wallet-endDate").innerHTML = moment(user.walletStartDate.substring(1, 11)).format('DD/MM/YYYY')
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
            $("#statut-commons").html("<p>Your wallet is full of coMonZ for " + moDate + "</p><p>You've set your commitment at :<br><span id='attCounter'></span></p>")
            $("#attCounter").html(minutes + " minutes " + seconds + " seconds")

            $("#statut-commons").show()
            $("#date-container").show()
           
        
            $("#no-wallet").hide()
            $("#wallet-on").show()



        }   
        else if (walletStatus === "inactive") {
            $("#no-wallet").hide()
            $("#create-wallet").hide()
            $("#wallet-active").show()
            $("#btns-wallet").show()
            $("#statut-commons").html("<p>Your active period is over.<br> Add your coMonZ here and determine your attention time </p> <p> Your attention time is: <br> <span id = 'attCounter'> 1 minute and 0 seconds</span></p>")

        }  
        
        else if (!walletStatus) {
            blackhole.blackhole('#blackhole', 1, 220, 220, 125)
            $("#no-wallet").show()
            $("#wallet-charged").hide()
            $("#create-wallet").show()


        }
        if (transactions) {
            lists.getUserpaidContents()
            $("#no-transactions").hide()
            $("#transactions-sent").show()

        } else {
            $("#no-transactions").show()
            $("#transactions-sent").hide()

        } 
    })
}

function checkSave() {
    setTimeout(function () {
        if (parseInt($("#wallet-amount").html()) > 0) {
            $("#save-wallet").show()
        } else {
            $("#save-wallet").hide()

        }

    }, 100)

}
document.getElementById("minus-commons").addEventListener('click', checkSave, false);
document.getElementById("add-commons").addEventListener('click', checkSave, false);

export function createWallet() {
    $("#no-wallet").hide()
    $("#create-wallet").hide()
    $("#wallet-amount").show()
    $("#btns-wallet").show()
    $("#statut-commons").html("<p>Add your coMonZ here and determine your attention time </p> <p> Your attention time is: <br> <span id = 'attCounter'> 1 minute and 0 seconds</span></p>")
    $("#wallet-on").show()
    $("#commonZ").show()

}
export function minComonz() {

    var parsedCount = parseInt($("#wallet-amount").html())
    if (parsedCount > 0) {
        console.log(parsedCount)
        parsedCount = parsedCount - 10
        $("#wallet-amount").html(parsedCount + '<br>')
        $("#euro-amount").html("Montant versé: " + parsedCount / 10 + " €")

        blackhole.blackhole('#blackhole', parsedCount, 220, 220, 125);
    }
}
document.getElementById("minus-commons").addEventListener('click', minComonz, false);
export function addComonz() {

    var parsedCount = parseInt($("#wallet-amount").html())
    console.log(parsedCount)

    parsedCount = parsedCount + 10
    $("#wallet-amount").html(parsedCount)
    $("#euro-amount").html("Montant versé: " + parsedCount / 10 + " €")
    blackhole.blackhole('#blackhole', parsedCount, 220, 220, 125);

}
document.getElementById("add-commons").addEventListener('click', addComonz, false);
export function saveWallet() {
    $("#btns-wallet").hide()
    $("#transactions-sent").hide()
    $("#footer-sent").hide()
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


                }).then(setUser.setUser(user)
                );
                $('#paypal-button-container').hide();
                checkWallet()       
                console.log(" wallet storage successful")
            });
        }

    }).render('#paypal-button-container');


}
document.getElementById("save-wallet").addEventListener('click', saveWallet, false);

export function checkWStatus() {
    setUser.retrieveUser().then(user => {
        console.log(user)
        
        var endDate = wallet.endDate;
        var month = moment(user.walletStartDate.substring(1, 11)).format('MMMM');
        var year = moment(user.walletStartDate.substring(1, 11)).format('YYYY');
        var walletAmount = user.walletAmount
        var diff = moment().diff(user.walletendDate.substring(1, 20), 'days')
        var transactions = user.transactions
        var clientIds = []
        var arrContent = Object.entries(transactions)
        var walletRef = firebase.database().ref('/users/' + user.uid + "/wallet")

        console.log(diff)


        if (diff > 0 && transactions) {
            arrContent.forEach((valeur, i) => {
                clientIds.push(valeur[1].authorKey)

            })

            var filteredclientIds = clientIds.filter((x, i, a) => a.indexOf(x) == i)
            filteredclientIds.forEach((authorKey, i) => {
                var counts = lists.getOccurence(clientIds, authorKey)
                var share = counts / Object.keys(transactions).length
                firebase.database().ref('/checkouts/' + authorKey + "/" + year + "/" + month).update({
                    [user.uid]: walletAmount / 10 * share,

                }).then(
                    walletRef.update({
                        status: "inactive",
                        amount: 0
                    }))

            })

        }
    })
}





const $element = $('input[type="range"]');
const $tooltip = $('#range-tooltip');
const sliderStates = [
    { name: "low", tooltip: "Great, a Super Faaan! We love snipers.", range: _.range(5, 300) },
    { name: "med", tooltip: "Well, you deserve time to know what's worthy and what's not", range: _.range(300, 500) },
    { name: "high", tooltip: "“Tolerance is the daughter of doubt.”", range: [600] },
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