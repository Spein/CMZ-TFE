import * as userInfo from '/js/userInfo.js';
import * as wallet from '/js/wallet.js';
import * as transaction from '/js/transactions.js';
import * as setUser from '/js/setUser.js';

import * as lists from '/js/lists.js';





    document.getElementById("profile").addEventListener('click', userInfo.checkProfile, false);
    document.getElementById("saveButton").addEventListener('click', userInfo.writeUserData, false);
    
    
    
    
    //Wallet settings
    
    document.getElementById("wallet").addEventListener('click', wallet.checkWallet, false);
    document.getElementById("create-wallet").addEventListener('click', wallet.createWallet, false);
    
    
    
    //tab transaction
    
    document.getElementById("transaction").addEventListener('click', transaction.firstCheck, false);
    document.getElementById("check-iban").addEventListener('click', transaction.alertValidIBAN, false);
    document.getElementById("create-author").addEventListener('click', transaction.createAuthor, false);
    
    //Paiements fait par l'utilisateur
    
    document.getElementById("filterByHist").addEventListener('click', lists.getUserpaidContents, false);
    document.getElementById("filterByAut").addEventListener('click', lists.getSendPaymentsbyAuthors, false);
    
    
    //Tous les paiements historisés
    
    document.getElementById("rfilterByHist").addEventListener('click', transaction.checkAuthor, false);
    
    // Paiements totaux par contenus
    
    document.getElementById("rfilterByCont").addEventListener('click', lists.getReceivedPaymentsbyContents, false);
    
    // Paiements totaux par utilisateurs
    
    document.getElementById("rfilterByAut").addEventListener('click', lists.getReceivedPaymentsbyUsers, false);
    document.getElementById('logout-button').addEventListener('click', logout, false);
    document.getElementById("bug-i").addEventListener('click', openBug, false);
    document.getElementById("close-bug").addEventListener('click', function () { $("#bug-form-container").hide() }, false);
    document.getElementById("bug-sended-close").addEventListener('click', function () { $("#bug-form-container").hide() }, false);
    document.getElementById("bug-button").addEventListener('click', sendBug, false);
    document.getElementById("content-back").addEventListener('click', backContent, false);
    document.getElementById("getUrl").addEventListener('click', getURL, false);
    
    document.querySelector('input[type="file"]').addEventListener('change', function () {
        if (this.files && this.files[0]) {
            var storage = firebase.storage()
            var img = document.querySelector('img'); // $('img')[0]
            img.src = URL.createObjectURL(this.files[0]); // set src to blob url
            var file = img.src
            document.getElementById('saveButton').style.display = "block";
    
        }
    });

function logout() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
        localStorage.clear();
    }
}

//Add style to tabs
function styledTabs() {
    setUser.retrieveUser()
    .then((user)=>{
        console.log(user)
        if (!user.walletStatus) {
            $("#wallet").addClass("blinking")
            if (!user.authorKey) {
                $("#transaction").css("color", "#b6b6b6")

            } else {
                $("#transaction").css("color", "#b6b6b6")
                $("#wallet").removeClass("blinking")

            }
        } else if (!user.authorKey) {
            $("#transaction").addClass("blinking")
        }
    })

}
//bug-listener
function openBug() {
    $("#bug-form-container").show("inherit")
}

function sendBug() {
    var user = firebase.auth().currentUser.uid
    var date = new Date();
    var parsedDate = JSON.stringify(date);

    firebase.database().ref('bugs/' + user).push({
        date: parsedDate,
        message: $("#bug-form").val(),
        //content: $("#container").html()
    })
    $("#bug-notsended").hide()
    $("#bug-sended").show()

}


//Editable fields
var editables = document.getElementsByClassName("editable")


for (var i = 0; i < editables.length; i++) {
    (function (index) {
        editables[index].addEventListener("input", function () {
            document.getElementById('saveButton').style.display = "block";
        })
    })(i);
}

var bugText = document.getElementsByClassName("bug-text")


for (var i = 0; i < bugText.length; i++) {
    (function (index) {
        bugText[index].addEventListener("input", function () {
            document.getElementById('bug-button').style.display = "block";
        })
    })(i);
}
//Profile panels
const tabs = document.querySelectorAll(".panel-nav");
const tab = document.querySelectorAll(".tab-item-link");
const panel = document.querySelectorAll(".panel-body");

function onTabClick(event) {

    // deactivate existing active tabs and panel

    for (let i = 0; i < tab.length; i++) {
        tab[i].classList.remove("active");

    }

    for (let i = 0; i < panel.length; i++) {
        panel[i].classList.remove("active");
    }


    // activate new tabs and panel
    event.target.classList.add('active');
    let classString = event.target.getAttribute('data-target');
    document.getElementById('panels').getElementsByClassName(classString)[0].classList.add("active");

}

for (let i = 0; i < tab.length; i++) {
    tab[i].addEventListener('click', onTabClick, false);
}

//TutoPanels
function backContent() {
    $("#content-area").html('')

    $("#content-area").hide()


}



function getURL() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var user = firebase.auth().currentUser.uid
        var url = tabs[0].url.replace(/[^\w\s]/gi, '_')
        var date = new Date();
        var parsedDate = JSON.stringify(date);
        firebase.database().ref('wishes/' + url).update({
            [user]: parsedDate
        }).then((updates) => {
            $("#wishes").html("<i style='color:#d95555' class='fas fa-seedling'></i><p>Thank you! What a pleasure to expand the family, we will contact our next Creator</p>")
        })
    });
}


    userInfo.load()
    wallet.checkWStatus()
    styledTabs()

