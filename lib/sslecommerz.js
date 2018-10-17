"use strict";
const crypto = require('crypto');
const request = require('request');

class SSLCommerz{
    constructor(config){
        this.store_mode = this.setSSLCommerzMode((typeof config.isSandboxMode === "undefined") ? true : config.isSandboxMode);
        this.store_id = config.store_id;
        this.store_passwd = config.store_passwd;
        this.submit_url = "https://" + this.store_mode + ".sslcommerz.com/gwprocess/v3/api.php";
        this.validation_url = "https://" + this.store_mode + ".sslcommerz.com/validator/api/validationserverAPI.php";
    }

    setSSLCommerzMode(isSandboxMode){
        if(isSandboxMode){
            return "sandbox";
        }
        else{
            return "securepay";
        }
    }

    request(method, url, query, post_body, callback){
        let params = {
            url: url,
            method: method || 'GET',
            query: query,
            form: post_body
        };
        request(params, (err, response, body) => {
            if(err || (response && response.error)){
                if( response && response.error ) {
                    callback( response.error.message );
                } 
                else{
                    callback(err);
                }
            }
            else{
                response = response || {};
                if(typeof response === 'string') {
                    response = JSON.parse(response);
                }
                if(typeof body === 'string'){
                    body = JSON.parse(body);
                }
                callback(null, response, body);
            }
        });
    }

    get(url, query, callback) {
        this.request('GET', url, query, null, callback);
    }

    post(url, post_body, callback){
        this.request('POST', url, null, post_body, callback)
    }

    
    init_transaction(body, callback){
        body['store_id'] = this.store_id;
        body['store_passwd'] = this.store_passwd;
        this.post(this.submit_url, body, callback);
    }

    hash_validate_ipn(post_body){
        return new Promise(resolve => {
            var verify_key = post_body.verify_key;
            var verify_sign = post_body.verify_sign;
            verify_key = verify_key.split(",");
            //console.log(verify_key);
            //console.log('store_passwd');
            verify_key = verify_key.sort();
            Object.keys(post_body).forEach(key => {
                if(verify_key.includes(key)){
                    var index = verify_key.indexOf(key);
                    verify_key[index] = verify_key[index] + "=" + post_body[key] + "&";
                }
            });
            //console.log(verify_key);
            var hashed_passwd = 'store_passwd='+crypto.createHash('md5').update(this.store_passwd).digest("hex");
            verify_key.push(hashed_passwd);
            //console.log(verify_key);
            var before_verify_hash="";
            Object.keys(verify_key).forEach(key => {
                before_verify_hash += verify_key[key];
            });
            //console.log(before_verify_hash);
            var verify_hash = crypto.createHash('md5').update(before_verify_hash).digest("hex");
            //console.log("md6");
            //console.log(verify_hash);
            if(verify_hash === verify_sign){
                resolve(true);
            }
            else{
                resolve(false);
            }
        });
    }
    

}

module.exports = SSLCommerz;