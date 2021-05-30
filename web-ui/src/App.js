import "./App.css";
import React from "react";
import BackendApi from "./BackendApi";
import HashLoader from "react-spinners/HashLoader";

// Component for rendering resulting short link
class CopyExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { copySuccessStatus: "" };
  }

  // Reset copySuccessStatus when render with new ShortUrl
  componentDidUpdate(prevProps) {
    if (this.props.textToCopy !== prevProps.textToCopy) {
      this.setState({ copySuccessStatus: "" });
    }
  }

  // Copy text with short link from textarea in clickboard
  copyToClipboard = (e) => {
    this.textArea.select();
    document.execCommand("copy");
    e.target.focus();
    this.setState({ copySuccessStatus: "Copied!" });
  };

  render() {
    return (
      <div>
        <form>
          <textarea
            readOnly
            rows="1"
            cols="40"
            ref={(textarea) => (this.textArea = textarea)}
            value={this.props.textToCopy}
          />
        </form>
        {
          /* Logical shortcut for only displaying the 
            button if the copy command exists */
          document.queryCommandSupported("copy") && (
            <div>
              <div style={{ display: "inline-block" }}>
                <button onClick={this.copyToClipboard}>Copy</button>
              </div>
              <div style={{ display: "inline-block", marginLeft: "10px" }}>
                {this.state.copySuccessStatus}
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

// Component for render api response - "short link", if it isn't empty
function DisplayShortUrl(props) {
  if (props.shortUrl === "") {
    // render nothing:
    return <p> </p>;
  }
  // render response:
  return (
    <div>
      <h3> Short URL:</h3>
      <CopyExample textToCopy={props.shortUrl}></CopyExample>
    </div>
  );
}

// Component for render api error - "error message", if it isn't empty
function DisplayApiError(props) {
  if (props.apiError === "") {
    // render nothing:
    return <p> </p>;
  }
  // render message with api error:
  return <h3> Ops.. something went wrong: {props.apiError}</h3>;
}

// Component with main ShortUrl functionality
class ShortUrl extends React.Component {
  constructor(props) {
    super(props);
    this.backendApi = new BackendApi();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      longUrl: "",
      longUrlValid: false,
      longUrlError: "",
      apiError: "",
      apiRequestInProcess: false,
      shortUrl: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateUrl(urlToValidate) {
    let url;

    // validate url
    try {
      url = new URL(urlToValidate);
    } catch (_) {
      return false;
    }

    // check validate url don't contains spaces
    const isNotContainsSpaces = !/\s/.test(urlToValidate);

    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      isNotContainsSpaces
    );
  }

  validateLongUrlField(value) {
    // validate url and set error message, if url validation failed
    const longUrlValid = this.validateUrl(value);
    const longUrlError = longUrlValid
      ? ""
      : value.length > 0
      ? "URL isn't valid (only absolute http(s) URL is accepted)"
      : "";

    this.setState({
      longUrlError: longUrlError,
      longUrlValid: longUrlValid,
    });
  }

  handleChange(event) {
    // delete redundant spaces
    const value = event.target.value.trim();

    this.setState({ longUrl: value }, () => {
      this.validateLongUrlField(value);
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    // if previous api request end up with error,
    // then reset short url and api error, and
    // set apiRequestInProcess flag in true
    if (this.state.apiError !== "") {
      this.setState({
        shortUrl: "",
        apiError: "",
        apiRequestInProcess: true,
      });
    } else {
      this.setState({
        apiRequestInProcess: true,
      });
    }

    // call backendApi to match long url its short url
    const result = await this.backendApi.post(this.state.longUrl);
    const hostname = this.backendApi.hostname;

    // dependent on api call success
    if (result.success === true) {
      // set short url:
      this.setState({
        shortUrl: hostname + "/" + result.message,
        apiError: "",
        apiRequestInProcess: false,
      });
    } else {
      // set api error:
      this.setState({
        shortUrl: "",
        apiError: result.message,
        apiRequestInProcess: false,
      });
    }
  }

  render() {
    return (
      <div>
        <h3>Input your URL, I'll short it ;)</h3>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input
              size="60"
              type="text"
              value={this.state.longUrl}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <div style={{ display: "inline-block", marginTop: "10px" }}>
              <input
                type="submit"
                disabled={!this.state.longUrlValid}
                value="Short it"
              />
            </div>
            <div
              style={{
                display: "inline-block",
                marginLeft: "20px",
                marginBottom: "4px",
              }}
            >
              <HashLoader
                color="#0C7763"
                loading={this.state.apiRequestInProcess}
                size={20}
              />
            </div>
          </div>
        </form>
        <div>{this.state.longUrlError}</div>
        <DisplayApiError apiError={this.state.apiError} />
        <DisplayShortUrl shortUrl={this.state.shortUrl} />
      </div>
    );
  }
}

// App component:
// 1. Set background
// 2. Render main ShortUrl functionality
function App() {
  return (
    <div
      className="App"
      style={{ background: `url("../images/background.jpg")` }}
    >
      <ShortUrl></ShortUrl>
    </div>
  );
}

export default App;
