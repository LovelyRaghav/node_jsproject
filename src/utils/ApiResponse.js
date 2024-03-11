class ApiResponse {
    constructor(statusCode,data, message ="Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode <400  // set statandard to send under 400 
    }
}


export { ApiResponse }