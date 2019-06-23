# SSLCommerz Node.js Wrapper
Node.js wrapper for SSLCommerz API Using Promises
<br/>SSLCommerz Developer Page: https://developer.sslcommerz.com/

# Installation
Download the project .zip, unzip and copy folder to your Node Project Directory.
```sh
cd sslcommerz
npm install --save
``` 

# Intialize
Initialization of SSLCommerz class with store_id, store_passwd.
```sh
const SSLCommerz = require('./sslcommerz/lib/sslecommerz');

let settings = {
    isSandboxMode: true, //false if live version
    store_id: "storeid",
    store_passwd: "storepasswd"
}

let sslcommerz = new SSLCommerz(settings);

```

# Usage
Basic Usage to intialize a transaction session.
```sh
let post_body = {};
post_body['total_amount'] = 100.26;
post_body['currency'] = "BDT";
post_body['tran_id'] = "12345";
post_body['success_url'] = "your success url";
post_body['fail_url'] = "your fail url";
post_body['cancel_url'] = "your cancel url";
post_body['emi_option'] = 0;
post_body['cus_name'] = "test";
post_body['cus_email'] = "test@test.com";
post_body['cus_phone'] = "01700000000";
sslcommerz.init_transaction(post_body).then(response => {
    console.log(response);
}).catch(error => {
    console.log(error);
})
```