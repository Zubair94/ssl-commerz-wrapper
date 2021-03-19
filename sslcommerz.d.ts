export default SSLCommerz;
declare class SSLCommerz {
    /**
     * @constructor init SSLCommerz class
     * @param {object} config
     * @example config = { isSandboxMode: true, store_id: 'myid', store_passwd: 'mypasswd'}
     */
    constructor(config: object);
    store_mode: string;
    store_id: any;
    store_passwd: any;
    submit_url: string;
    validation_url: string;
    transaction_url: string;
    /**
     * @function init_transaction get/create transaction request, POST Request
     * @param {object} post_body check sslcommerz docs for all post_body params
     * @returns {Promise} Response from SSLCommerz
     */
    init_transaction(post_body: object): Promise<any>;
    /**
    * @function hash_validate_ipn validate verify_sign with verify key hash resolved as promise
    * @param {object} post_body check sslcommerz docs for all post_body params
    * @returns {Promise} Boolean to match verify_sign and generated MD5 hash
    */
    hash_validate_ipn(post_body: object): Promise<any>;
    /**
     * @function validate_transaction_order validate order/transaction
     * @param {string} validation_id val_id, sslcommerz docs
     * @returns {Promise} Response from SSLCommerz
     */
    validate_transaction_order(validation_id: string): Promise<any>;
    /**
     *@function init_refund create a refund process
        * @param {string} bank_transaction_id bank_tran_id check sslcommerz docs
        * @param {number} refund_amount  refund_amount check sslcommerz docs
        * @param {string} refund_remarks refund_remarks check sslcommerz docs
        * @returns {Promise} Response from SSLCommerz
        */
    init_refund(bank_transaction_id: string, refund_amount: number, refund_remarks: string): Promise<any>;
    /**
     * @function refund_status get refund status by refund_reference_id, GET
     * @param {string} refund_reference_id reund_ref_id check sslcommerz docs
     * @returns {Promise} Response from SSLCommerz
     */
    refund_status(refund_reference_id: string): Promise<any>;
    /**
     * @function transaction_status_session get transaction status by sessionkey
     * @param {string} sessionkey sessionkey check sslcommerz docs
     * @returns {Promise} Response from SSLCommerz
     */
    transaction_status_session(sessionkey: string): Promise<any>;
    /**
     * @function transaction_status_id get transaction status by transaction_id
     * @param {string} transaction_id tran_id check sslcommerz docs
     * @returns {Promise} Response from SSLCommerz
     */
    transaction_status_id(transaction_id: string): Promise<any>;
    setSSLCommerzMode(isSandboxMode: any): "sandbox" | "securepay";
    request(method: any, url: any, urlParams: any, post_body: any): Promise<any>;
    get(url: any, query: any): Promise<any>;
    post(url: any, post_body: any): Promise<any>;
}
