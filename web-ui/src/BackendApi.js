const queryString = require("query-string");

class BackendApi {
  hostname = "https://localhost:5001"; // default hostname

  constructor() {
    // set hostname from env variable, if it's setted
    const hostnameFromEnv = process.env["REACT_APP_WEBAPI_URLSHORTER_HOSTNAME"];
    if (hostnameFromEnv !== undefined) {
      this.hostname = hostnameFromEnv;
    }
  }

  async checkStatus(res) {
    if (res.ok) {
      // res.status >= 200 && res.status < 300
      return res;
    } else {
      if (res.status === 400) {
        throw Error(await res.text());
      }

      throw Error(res.statusText);
    }
  }

  async post(longUrl) {
    // set post options:
    const method = "/api/urltransformation";
    const paramsObject = { longUrl: longUrl };
    const params = queryString.stringify(paramsObject);
    const endpoint = this.hostname + method + "?" + params;
    const options = {
      method: "POST",
    };

    // request
    let result;
    try {
      result = await fetch(endpoint, options);
      result = await this.checkStatus(result);
      result = await result.json();

      // return result of success api call
      return {
        success: true,
        message: result.shortUrl,
      };
    } catch (e) {
      // return error of failed api call
      return {
        success: false,
        message: e.message,
      };
    }
  }
}

export default BackendApi;
