function makeHttpObject() {
    try { return new XMLHttpRequest(); } catch (error) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (error) {}
    try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (error) {}

    throw new Error("Could not create HTTP request object.");
}
var request = makeHttpObject();
request.open("GET", window.location, true);
request.send(null);

request.onreadystatechange = function() {
    var elementOfInterest = document.getElementsByTagName('comonz');
    var tag = elementOfInterest[0].outerHTML.replace(/(["])/g, "'")

    if (request.readyState == 4) {
        console.log(request.responseText.includes(elementOfInterest[0].id))

        if (request.responseText.includes(elementOfInterest[0].id)) {
            if (elementOfInterest.length > 0) {
                console.log("ok")

                var id = elementOfInterest[0].id
                console.log(elementOfInterest[0].id)
                var urlArr = []
                var newPathname = "";
                var rawURL = window.location.host.replace(/[^\w\s]/gi, '').substring(3) + window.location.pathname.replace(/[^\w\s]/gi, '')
                var splitedURL = rawURL.split()
                for (var i = 0; i <= splitedURL[0].length; i++) {
                    if (i % 2 == 0) {
                        urlArr.push(splitedURL[0][i])
                    }


                }
                var preuRL = urlArr.join()
                var uRL = preuRL.replace(/[,]/gi, '')

                if (document.getElementsByTagName('img')[0]) {
                    var img = document.getElementsByTagName('img')[0].src
                } else {
                    var img = './andrea.jpg'
                }
                if (document.title) {
                    var title = document.title
                } else {
                    document.getElementsByTagName('h1')[0];
                    var title = document.getElementsByTagName('h1')[0]

                };

                var key = elementOfInterest[0].id;
                chrome.runtime.sendMessage({ payload: [key, uRL, title, img] });
                chrome.storage.local.set({ 'url': uRL });
                chrome.storage.local.set({ 'key': key });




                if (elementOfInterest == undefined || elementOfInterest == null || elementOfInterest.length == 0) {
                    chrome.runtime.sendMessage({ payload: [null, uRL, title, img] });
                    chrome.storage.local.set({ 'key': null });
                    chrome.storage.local.set({ 'url': null });
                }
            }
        }

    }

};