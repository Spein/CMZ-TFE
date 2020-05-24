var config = {
    apiKey: "AIzaSyAdxBw7BVvGgtp0PliC5y_xXPfv35nDEuw",
    authDomain: "pressformore-c0045.firebaseapp.com",
    databaseURL: "https://pressformore-c0045.firebaseio.com",
    projectId: "pressformore-c0045",
    storageBucket: "pressformore-c0045.appspot.com",
    messagingSenderId: "1059781682708"
};

firebase.initializeApp(config);



export function displayView(user) {
    if (user) {
        chrome.storage.local.get('contentStatus', function(result) {
            if (result.contentStatus == 'content') {
                console.log("content")
                $("#container").load("onContent.html");

            } else {
                console.log("notcontent")


                $("#container").load("profile.html");

            }
        });
    } else {
        $("#container").load("sign-in.html");
    }
}



function initApp() {
    firebase.auth().onAuthStateChanged(function(user) {

        setTimeout(displayView(user), 200);
    });
}

window.onload = function() {
        initApp();
    }
    /* document.getElementById("test").addEventListener("click", youtube, false)
    document.getElementById("test2").addEventListener("click", authenticatedXhr, false) */