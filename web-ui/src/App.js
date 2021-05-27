import "./App.css";
import React from "react";

class CopyExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { copySuccess: "" };
  }

  copyToClipboard = (e) => {
    this.textArea.select();
    document.execCommand("copy");
    // This is just personal preference.
    // I prefer to not show the whole text area selected.
    e.target.focus();
    this.setState({ copySuccess: "Copied!" });
  };

  render() {
    return (
      <div>
        <form>
          <textarea
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
              {this.state.copySuccess}
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
      <h3> short link:</h3>
      <CopyExample textToCopy={props.shortLink} copySuccess=""></CopyExample>
    </div>
  );
}

class ShortLink extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      longLink: "",
      shortLink: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ longLink: event.target.value });
  }

  handleSubmit(event) {
    // alert("get long link: " + this.state.longLink);
    event.preventDefault();
    this.setState({
      shortLink: "short link:" + this.state.longLink,
    });
  }

  render() {
    const longLink = this.state.longLink;
    return (
      <div>
        <h3>Input your long link, i'll short it ;)</h3>
        <form onSubmit={this.handleSubmit}>
          <label>
            Link:
            <input
              type="text"
              value={this.state.longLink}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Short it" />
        </form>
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
