# SSLCommerz Node.js Wrapper
Node.js wrapper for SSLCommerz API

# Installation
Download the project .zip, unzip and copy lib folder to your Node Project Directory 

# Intialize
```sh
const SSLCommerz = require('./lib/sslecommerz');

let settings = {
    isSandboxMode: true, //false if live
    store_id: "storeid",
    store_passwd: "storepasswd"
}

let sslcommerz = new SSLCommerz(settings);

```

# Usage
```sh
let post_body = {};
body['total_amount'] = 100.26;
body['currency'] = "BDT";
body['tran_id'] = "12345";
body['success_url'] = "your success url";
body['fail_url'] = "your fail url";
body['cancel_url'] = "your cancel url";
body['emi_option'] = 0;
body['cus_name'] = "test";
body['cus_email'] = "test@test.com";
body['cus_phone'] = "01700000000";
sslcommerz.init_session(post_body, (err, response, body) => {
    console.log(response);
    console.log(body);
});
```