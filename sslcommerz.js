"use strict";
const crypto = require('crypto');
const request = require('request-promise');

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
        this.submit_url = "https://" + this.store_mode + ".sslcommerz.com/gwprocess/v4/api.php";
        this.validation_url = "https://" + this.store_mode + ".sslcommerz.com/validator/api/validationserverAPI.php";
        this.transaction_url = "https://" + this.store_mode + ".sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php"
    }
    /**
     * @function init_transaction get/create transaction request, POST Request 
     * @param {object} post_body check sslcommerz docs for all post_body params 
     * @param {function} callback 
     */
    async init_transaction(post_body){
        post_body['store_id'] = this.store_id;
        post_body['store_passwd'] = this.store_passwd;
        return this.post(this.submit_url, post_body);
    }
     /**
     * @function hash_validate_ipn validate verify_sign with verify key hash resolved as promise
     * @param {object} post_body check sslcommerz docs for all post_body params 
     */
    async hash_validate_ipn(post_body){
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
            return true;
        }
        else{
            return false
        }
    }
    /**
     * @function validate_transaction_order validate order/transaction 
     * @param {string} validation_id val_id, sslcommerz docs 
     * @param {function} callback 
     */
    async validate_transaction_order(validation_id){
        var query = {
            val_id: validation_id,
            store_id: this.store_id,
            store_passwd: this.store_passwd,
            format: 'json'
        }
        return this.get(this.validation_url, query);
    }
    /**
     *@function init_refund create a refund process 
     * @param {string} bank_transaction_id bank_tran_id check sslcommerz docs
     * @param {number} refund_amount  refund_amount check sslcommerz docs
     * @param {string} refund_remarks refund_remarks check sslcommerz docs
     * @param {function} callback 
     */
    async init_refund(bank_transaction_id, refund_amount, refund_remarks){
        var query = {
            bank_tran_id: bank_transaction_id,
            store_id: this.store_id,
            store_passwd: this.store_passwd,
            refund_amount: refund_amount,
            refund_remarks: refund_remarks
        }
        return this.get(this.transaction_url, query);
    }
    /**
     * @function refund_status get refund status by refund_reference_id, GET
     * @param {string} refund_reference_id reund_ref_id check sslcommerz docs
     * @param {function} callback 
     */
    async refund_status(refund_reference_id){
        var query = {
            refund_ref_id: refund_reference_id,
            store_id: this.store_id,
            store_passwd: this.store_passwd
        }
        return this.get(this.transaction_url, query);
    }
    /**
     * @function transaction_status_session get transaction status by sessionkey
     * @param {string} sessionkey sessionkey check sslcommerz docs
     * @param {function} callback 
     */
    async transaction_status_session(sessionkey){
        var query = {
            sessionkey: sessionkey,
            store_id: this.store_id,
            store_passwd: this.store_passwd
        }
        return this.get(this.transaction_url, query);
    }
    /**
     * @function transaction_status_id get transaction status by transaction_id 
     * @param {string} transaction_id tran_id check sslcommerz docs
     * @param {function} callback 
     */
    async transaction_status_id(transaction_id){
        var query = {
            tran_id: transaction_id,
            store_id: this.store_id,
            store_passwd: this.store_passwd
        }
        return this.get(this.transaction_url, query);
    }
    setSSLCommerzMode(isSandboxMode){
        if(isSandboxMode){
            return "sandbox";
        }
        else{
            return "securepay";
        }
    }
    async request(method, url, query, post_body){
        try{
            let params = {
                url: url,
                method: method || 'GET',
                qs: query,
                form: post_body,
                json: true
            };
            let response = await request(params);
            return response;
        } catch(error){
            return error.error;
        }
    }
    async get(url, query) {
        return this.request('GET', url, query, null);
    }
    async post(url, post_body){
        return this.request('POST', url, null, post_body);
    }
}

module.exports = SSLCommerz;