var config = {
    apiKey: "AIzaSyAdxBw7BVvGgtp0PliC5y_xXPfv35nDEuw",
    authDomain: "pressformore-c0045.firebaseapp.com",
    databaseURL: "https://pressformore-c0045.firebaseio.com",
    projectId: "pressformore-c0045",
    storageBucket: "pressformore-c0045.appspot.com",
    messagingSenderId: "1059781682708"
};
firebase.initializeApp(config);



chrome.webNavigation.onCompleted.addListener(function (details, event) {
    console.log("webNavigation fired")

    chrome.storage.local.set({ 'contentStatus': "nocontent" });
    chrome.browserAction.setIcon({ path: "./logo/logo-base.png" });
    chrome.browserAction.setBadgeText({ text: "" });

    chrome.tabs.executeScript(null, {
        "file": "content.js"
    });
    event.preventDefault()
})
chrome.windows.onFocusChanged.addListener(function (window) {
    if (window !== -1) {

        console.log(window)
        chrome.storage.local.set({ 'contentStatus': "nocontent" });
        chrome.browserAction.setIcon({ path: "./logo/logo-base.png" });
        chrome.browserAction.setBadgeText({ text: "" });

        chrome.tabs.executeScript(null, {
            "file": "content.js"
        });
    } else {
        chrome.storage.local.set({ 'key': pfmkey });
        chrome.storage.local.set({ 'url': url });
    }

});

chrome.tabs.onHighlighted.addListener(function (tabId, changeInfo, tab) {

    chrome.storage.local.set({ 'contentStatus': "nocontent" });
    chrome.browserAction.setIcon({ path: "./logo/logo-base.png" });
    chrome.browserAction.setBadgeText({ text: "" });

    chrome.tabs.executeScript(null, {
        "file": "content.js"
    });
});


function initApp() {
    // Listen for auth state changes.



    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            const pfmkey = request.payload[0]
            const url = request.payload[1]
            const title = request.payload[2]
            const img = request.payload[3]
            const userUid = firebase.auth().currentUser.uid
            console.log("Tab changed : Ceci est la clé: " + pfmkey + "; ceci est l'URL: " + url + "; ceci est le titre: " + title + "et l'image " + img)




            if (pfmkey) {
                //$("#container").load("onContent.html");

                chrome.storage.local.set({ 'contentStatus': "content" });

                //On regarde si l'user a un wallet...
                firebase.database().ref('/users/' + userUid).once('value').then(function (snapshot) {
                    var wallet = (snapshot.val() && snapshot.val().wallet);
                    //..et s'il est déjà producteur
                    var authorDetails = (snapshot.val() && snapshot.val().authorDetails);
                    if (authorDetails == undefined) {
                        var key = 0
                    } else {
                        var key = authorDetails.key
                    }

                    //S'il a un wallet et qu'il n'est pas le propriétaire du contenu
                    if (wallet && key !== pfmkey) {
                        //On regarde si le contenu est déjà en cours
                        const dataRef = firebase.database().ref('/users/' + userUid + '/transactions').child(url)
                        dataRef.once("value").then(function (snapshot) {
                            if (snapshot.val() == undefined || snapshot.val() == null) {
                                const onGoingArticle = {
                                    count: wallet.Attcounter,
                                    authorKey: pfmkey
                                }

                                firebase.database().ref('/users/' + userUid + '/transactions/' + url).set(onGoingArticle)
                            }
                        })
                        dataRef.once("value").then(function (snapshot) {
                            chrome.storage.local.set({ 'url': url });
                            let countRef = firebase.database().ref('/users/' + userUid + '/transactions/' + url)
                            countRef.once("value").then(function (snapshot) {
                                let count = (snapshot.val() && snapshot.val().count)
                                if (count !== "payé" && count > 0) {
                                    let progress = count;
                                    console.log(progress)
                                    var j = 60
                                    const interval = setInterval(() => {

                                        chrome.tabs.onHighlighted.addListener(function (details, event) {
                                            clearInterval(interval);
                                            chrome.storage.local.set({ 'contentStatus': "nocontent" });
                                            chrome.browserAction.setIcon({ path: "./logo/logo-base.png" });
                                            chrome.browserAction.setBadgeText({ text: "" });
                                            countRef.update({
                                                count: progress,
                                            })
                                            event.preventDefault()
                                            return

                                        })

                                        chrome.webNavigation.onCompleted.addListener(function (window, details, event) {
                                            if (window !== -1) {
                                                console.log("webNavigation fired")
                                                clearInterval(interval);

                                                chrome.storage.local.set({ 'contentStatus': "nocontent" });
                                                chrome.browserAction.setIcon({ path: "./logo/logo-base.png" });
                                                chrome.browserAction.setBadgeText({ text: "" });
                                                countRef.update({
                                                    count: progress,
                                                })

                                                event.preventDefault()
                                                return
                                            } else {
                                                chrome.storage.local.set({ 'key': pfmkey });
                                                chrome.storage.local.set({ 'url': url });
                                            }

                                        })
                                        chrome.windows.onFocusChanged.addListener(function (window, event) {

                                            if (window !== -1) {
                                                clearInterval(interval);
                                                console.log(chrome.windows.WINDOW_ID_NONE)

                                                console.log(window)
                                                chrome.storage.local.set({ 'key': null });
                                                chrome.storage.local.set({ 'url': null });
                                                chrome.storage.local.set({ 'contentStatus': "nocontent" });
                                                countRef.update({
                                                    count: progress,
                                                })
                                                event.preventDefault()

                                                return
                                            } else {
                                                chrome.storage.local.set({ 'key': pfmkey });
                                                chrome.storage.local.set({ 'url': url });
                                            }



                                        });
                                        progress -= 1;
                                        console.log(progress)
                                        if (j == 0) {
                                            j = 60
                                        }
                                        var path = './logo/image (' + j + ').png';
                                        j--
                                        chrome.browserAction.setIcon({ path: path });
                                        var badgeText = progress.toString()
                                        chrome.storage.local.set({ 'progress': progress });

                                        chrome.browserAction.setBadgeBackgroundColor({ color: [190, 190, 190, 230] });
                                        chrome.browserAction.setBadgeText({ text: badgeText });
                                        if (progress == 0) {
                                            var path = './logo/logo-0.png';
                                            chrome.browserAction.setIcon({ path: path });
                                            chrome.browserAction.setBadgeText({ text: "<3" });
                                            updateRef()
                                            clearInterval(interval);
                                        }

                                    }, 1000);
                                } else {
                                    var path = './logo/logo-0.png';
                                    chrome.browserAction.setIcon({ path: path });
                                    chrome.browserAction.setBadgeText({ text: "<3" });

                                }



                                function updateRef() {
                                    countRef.update({
                                        count: "a payer",
                                    })

                                    firebase.database().ref('transactions/' + pfmkey + "/" + url).once('value').then(function (snapshot) {
                                        var contentUrl = (snapshot.val());
                                        var date = new Date();
                                        var parsedDate = JSON.stringify(date);
                                        var key = userUid;
                                        var tranRef = firebase.database().ref('transactions/' + pfmkey + "/" + url + "/cTransactions/" + key)
                                        if (contentUrl == undefined) {
                                            firebase.database().ref('transactions/' + pfmkey + "/" + url).set({
                                                title: title,
                                                img: img,
                                            });
                                        }
                                        tranRef.update({
                                            date: parsedDate,

                                        })

                                    })

                                }



                            })



                        });
                    } else {
                        //console.log("auteur=user")
                    }
                })
            } else {
                $("#container").load("profile.html");

                chrome.storage.local.set({ 'key': null });
                chrome.storage.local.set({ 'url': null });
                chrome.storage.local.set({ 'contentStatus': "nocontent" });

            }
        });
}

window.onload = function () {
    initApp();

};