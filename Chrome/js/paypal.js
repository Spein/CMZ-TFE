PAYPAL_CLIENT = 'AeJW2wnaN3sEDAIMbBtFez8SrWDaLQymNRZpkUZhFuporxzQ-q0miw7u_6vg4JQIZHRTZG1lK4WebsZg';
PAYPAL_SECRET = 'EMHscHOk1EKm0hrq2CXMnD8DNTpEiPNno7VM39cHGHKL2F-ECNZWpTCbqrseHxK6WnHL2USrNdRepMX-';

PAYPAL_OAUTH_API = 'https://api.sandbox.paypal.com/v1/oauth2/token/';
PAYPAL_ORDER_API = 'https://api.sandbox.paypal.com/v2/checkout/orders/';

basicAuth = base64encode(`${ PAYPAL_CLIENT }:${ PAYPAL_SECRET }`);
auth = http.post(PAYPAL_OAUTH_API {
    headers: {
        Accept: `application/json`,
        Authorization: `Basic ${ basicAuth }`
    },
    data: `grant_type=client_credentials`
});

function handleRequest(request, response) {

    orderID = request.body.orderID;

    details = http.get(PAYPAL_ORDER_API + orderID, {
        headers: {
            Accept: `application/json`,
            Authorization: `Bearer ${ auth.access_token }`
        }
    });

    // 4. Handle any errors from the call
    if (details.error) {
        return response.send(500);
    }

    // 5. Validate the transaction details are as expected
    if (details.purchase_units[0].amount.value !== '5.77') {
        return response.send(400);
    }

    // 6. Save the transaction in your database
    database.saveTransaction(orderID);

    // 7. Return a successful response to the client
    return response.send(200);
}