import "./App.css";
import React from "react";
import BackendApi from "./BackendApi";

class CopyExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { copySuccessStatus: "" };
  }

  // reset copySuccessStatus when render with new ShortLink
  componentDidUpdate(prevProps) {
    if (this.props.textToCopy !== prevProps.textToCopy) {
      this.setState({ copySuccessStatus: "" });
    }
  }

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
              <button onClick={this.copyToClipboard}>Copy</button>
              {this.state.copySuccessStatus}
            </div>
          )
        }
      </div>
    );
  }
}

// Display api response - short link, if it isn't empty
function DisplayShortLink(props) {
  if (props.shortLink === "") {
    // render nothing:
    return <p> </p>;
  }
  // render response:
  return (
    <div>
      <h3> Short link:</h3>
      <CopyExample textToCopy={props.shortLink}></CopyExample>
    </div>
  );
}

class ShortLink extends React.Component {
  constructor(props) {
    super(props);
    this.backendApi = new BackendApi();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      longLink: "",
      longLinkValid: false,
      longLinkError: "",

      shortLink: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // check URL dont contains 'space symbols' and not empty
  // (it is possible expand validation rules, but we need figure out all requires,
  //   so just impliment there basic 'space' validatoin )
  validateUrl(urlToValidate) {
    const isValid = !/\s/.test(urlToValidate) && urlToValidate.length > 0;
    return isValid;
  }

  validateLongLinkField(value) {
    let longLinkError = this.state.longLinkLinkError;
    let longLinkValid = this.state.longLinkValid;

    longLinkValid = this.validateUrl(value);
    longLinkError = longLinkValid
      ? ""
      : value.length > 0
      ? "URL isn't valid (contain spaces)"
      : "";

    this.setState({
      longLinkError: longLinkError,
      longLinkValid: longLinkValid,
    });
  }

  handleChange(event) {
    // delete redundant spaces
    const value = event.target.value.trim();

    this.setState({ longLink: value }, () => {
      this.validateLongLinkField(value);
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const result = await this.backendApi.post(this.state.longLink);
    const hostname = window.location.href;
    console.log("in app: " + JSON.stringify(result));

    if (result.success == true) {
      this.setState({
        shortLink: hostname + result.message,
      });
    } else {
      alarm(result.message);
    }
  }

  render() {
    const longLink = this.state.longLink;
    return (
      <div>
        <h3>Input your long link, I'll short it ;)</h3>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input
              size="60"
              type="text"
              value={this.state.longLink}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <input
              type="submit"
              disabled={!this.state.longLinkValid}
              value="Short it"
            />
          </div>
        </form>

        <div>{this.state.longLinkError}</div>
        <DisplayShortLink shortLink={this.state.shortLink} />
      </div>
    );
  }
}

const Background = "../images/background.jpg";
function App() {
  return (
    <div
      className="App"
      style={{
        width: `100%`,
        height: `100%`,
        backgroundSize: `cover`,
        background: `url(${Background})`,
      }}
    >
      <ShortLink></ShortLink>
    </div>
  );
}

export default App;
