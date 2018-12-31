function Response(data, isError, errorMsg) {
    this.data = data;
    this.isError = isError;
    this.errorMsg = errorMsg;
}

module.exports = Response;