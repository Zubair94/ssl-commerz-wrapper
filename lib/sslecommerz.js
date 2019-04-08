"use strict";
const crypto = require('crypto');
const request = require('request');

class SSLCommerz{
    /**
     * @constructor init SSLCommerz class
     * @param {object} config
     * @example config = { isSandboxMode: true, store_id: 'myid', store_passwd: 'mypasswd'} 
     */
    constructor(config){
        this.store_mode = this.setSSLCommerzMode((typeof config.isSandboxMode === "undefined") ? true : config.isSandboxMode);
        this.store_id = config.store_id;
        this.store_passwd = config.store_passwd;
        this.submit_url = "https://" + this.store_mode + ".sslcommerz.com/gwprocess/v3/api.php";
        this.validation_url = "https://" + this.store_mode + ".sslcommerz.com/validator/api/validationserverAPI.php";
        this.transaction_url = "https://" + this.store_id.mode + ".sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php"
    }
    /**
     * @function init_transaction get/create transaction request, POST Request 
     * @param {object} post_body check sslcommerz docs for all post_body params 
     * @param {function} callback 
     */
    init_transaction(post_body, callback){
        post_body['store_id'] = this.store_id;
        post_body['store_passwd'] = this.store_passwd;
        this.post(this.submit_url, post_body, callback);
    }
     /**
     * @function hash_validate_ipn validate verify_sign with verify key hash resolved as promise
     * @param {object} post_body check sslcommerz docs for all post_body params 
     */
    hash_validate_ipn(post_body){
        return new Promise(resolve => {
            var verify_key = post_body.verify_key;
            var verify_sign = post_body.verify_sign;
            verify_key = verify_key.split(",");
            verify_key = verify_key.sort();
            Object.keys(post_body).forEach(key => {
                if(verify_key.includes(key)){
                    var index = verify_key.indexOf(key);
                    verify_key[index] = verify_key[index] + "=" + post_body[key] + "&";
                }
            });
            var hashed_passwd = 'store_passwd='+crypto.createHash('md5').update(this.store_passwd).digest('hex')+'&';
            verify_key.push(hashed_passwd);
            verify_key = verify_key.sort();
            var before_verify_hash="";
            Object.keys(verify_key).forEach(key => {
                before_verify_hash += verify_key[key];
            });
            before_verify_hash = before_verify_hash.slice(0, -1);
            var verify_hash = crypto.createHash('md5').update(before_verify_hash).digest('hex');
            if(verify_hash === verify_sign){
                resolve(true);
            }
            else{
                resolve(false);
            }
        });
    }
    /**
     * @function validate_transaction_order validate order/transaction 
     * @param {string} validation_id val_id, sslcommerz docs 
     * @param {function} callback 
     */
    validate_transaction_order(validation_id, callback){
        var query = {
            val_id: validation_id,
            store_id: this.store_id,
            store_passwd: this.store_passwd,
            format: 'json'
        }
        this.get(this.validation_url, query, callback);
    }
    /**
     *@function init_refund create a refund process 
     * @param {string} bank_transaction_id bank_tran_id check sslcommerz docs
     * @param {number} refund_amount  refund_amount check sslcommerz docs
     * @param {string} refund_remarks refund_remarks check sslcommerz docs
     * @param {function} callback 
     */
    init_refund(bank_transaction_id, refund_amount, refund_remarks, callback){
        var query = {
            bank_tran_id: bank_transaction_id,
            store_id: this.store_id,
            store_passwd: this.store_passwd,
            refund_amount: refund_amount,
            refund_remarks: refund_remarks
        }
        this.get(this.transaction_url, query, callback);
    }
    /**
     * @function refund_status get refund status by refund_reference_id, GET
     * @param {string} refund_reference_id reund_ref_id check sslcommerz docs
     * @param {function} callback 
     */
    refund_status(refund_reference_id, callback){
        var query = {
            refund_ref_id: refund_reference_id,
            store_id: this.store_id,
            store_passwd: this.store_passwd
        }
        this.get(this.transaction_url, query, callback);
    }
    /**
     * @function transaction_status_session get transaction status by sessionkey
     * @param {string} sessionkey sessionkey check sslcommerz docs
     * @param {function} callback 
     */
    transaction_status_session(sessionkey, callback){
        var query = {
            sessionkey: sessionkey,
            store_id: this.store_id,
            store_passwd: this.store_passwd
        }
        this.get(this.transaction_url, query, callback);
    }
    /**
     * @function transaction_status_id get transaction status by transaction_id 
     * @param {string} transaction_id tran_id check sslcommerz docs
     * @param {function} callback 
     */
    transaction_status_id(transaction_id, callback){
        var query = {
            tran_id: transaction_id,
            store_id: this.store_id,
            store_passwd: this.store_passwd
        }
        this.get(this.transaction_url, query, callback);
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
            qs: query,
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
}

module.exports = SSLCommerz;