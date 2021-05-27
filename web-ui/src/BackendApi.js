const https = require("https");
const queryString = require("query-string");

class BackendApi {
  hostname = "https://localhost:44336";
  checkStatus(res) {
    if (res.ok) {
      // res.status >= 200 && res.status < 300
      return res;
    } else {
      console.log("what there happens?");
      throw Error(res.statusText);
    }
  }

  async postData(url = "") {
    const options = {
      method: "POST",
      //agent: new https.Agent({
      //  rejectUnauthorized: false,
      //}),
    };
    // Default options are marked with *
    let response;
    try {
      response = await fetch(url, options);
    } catch (e) {
      console.log("hello from the core of request");
      throw e;
    }
    console.log(response);
    console.log("-------------------");
    return response;
  }

  async post(longUrl) {
    const method = "/api/urltransformation";
    const paramsObject = { longUrl: longUrl };
    const params = queryString.stringify(paramsObject);
    const endpoint = this.hostname + method + "?" + params;

    console.log(endpoint);

    let result;
    try {
      result = await this.postData(endpoint);
      console.log("after post data");
      console.log(result);

      result = this.checkStatus(result);
      console.log("after check status");

      result = await result.json();
      console.log("after json()");
      console.log(result);
      console.log(result.shortUrl);

      return {
        success: true,
        message: result.shortUrl,
      };
    } catch (e) {
      console.log("hellllo mazafucker" + JSON.stringify(e));
      console.log(e.message);
      return {
        success: false,
        message: e.message,
      };
    }
  }
}

export default BackendApi;
