import React, { Component } from "react";
import PropTypes from "prop-types";
import adapter from "webrtc-adapter";
import { BrowserMultiFormatReader } from "@zxing/library";

// styled
import StyledModal from "./ModalCss";

const modalRoot = document.getElementById("modal-root");

class Modal extends Component {
  static defaultProps = {
    id: "",
    modalClass: "",
    modalSize: "md",
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    modalClass: PropTypes.string,
    modalSize: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      fadeType: null,
    };

    // function
    this.transitionEnd = this.transitionEnd.bind(this);
    this.onEscKeyDown = this.onEscKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  // Refs
  background = React.createRef();
  interactiveRef = React.createRef();

  componentDidMount() {
    window.addEventListener("keydown", this.onEscKeyDown, false);
    setTimeout(() => this.setState({ fadeType: "in" }), 0);

    // checks if doc has loaded and waits for scanner to run and add node
    document.readyState != "loading"
      ? scanner()
      : document.addEventListener("DOMContentLoaded", scanner());
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.isOpen && prevProps.isOpen) {
      this.setState({ fadeType: "out" });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onEscKeyDown, false);
  }

  transitionEnd = (e) => {
    if (e.propertyName !== "opacity" || this.state.fadeType === "in") return;

    if (this.state.fadeType === "out") {
      this.props.onClose();
    }
  };

  onEscKeyDown = (e) => {
    if (e.key !== "Escape") return;
    this.setState({ fadeType: "out" });
  };

  handleClick = (e) => {
    e.preventDefault();
    this.setState({ fadeType: "out" });
  };

  render() {
    console.log(this.props);
    const modalLayout = {
      width: "70vw",
      height: "80vh",
      margin: "0 auto",
      padding: "0 4rem",
    };

    return (
      <React.Fragment>
        <StyledModal
          id={this.props.id}
          className={`wrapper ${"size-" + this.props.modalSize} fade-${
            this.state.fadeType
          } ${this.props.modalClass}`}
          role="dialog"
          modalSize={this.props.modalSize}
          onTransitionEnd={this.transitionEnd}
        >
          <div className="box-dialog">
            <div className="box-header">
              <h4 className="box-title">Place barcode in scaner view finder</h4>
              <button onClick={this.handleClick} className="close">
                ×
              </button>
            </div>
            <div className="box-body">
              <div style={modalLayout}>
                <section id="container" class="container">
                  <div className="box-content">
                    <div id="result_strip">
                      <ul class="thumbnails"></ul>
                      <ul class="collector"></ul>
                    </div>
                    <video
                      id="interactive"
                      class="viewport"
                      ref={this.interactiveRef}
                    ></video>
                  </div>
                  <div className="box-footer" />
                </section>
              </div>
            </div>
          </div>
          <div
            className={`background`}
            onMouseDown={this.handleClick}
            ref={this.background}
          />
        </StyledModal>
      </React.Fragment>
    );
  }
}

const scanner = (onScanFunc) => {
  const codeReader = new BrowserMultiFormatReader();

  codeReader
    .getVideoInputDevices()
    .then((videoInputDevices) => {
      const selectedDeviceId = videoInputDevices[0].deviceId;
      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        "interactive",
        (result, err) => {
          if (result) {
            console.log(result.text, "decode");
            console.log(JSON.string(result), "decode-blob");
            this.setState({ fadeType: "out" });
            onScanFunc(result.text);
          }
          if (err) {
            console.error(err);
          }
        }
      );
    })
    .catch((err) => {
      console.error(err);
    });
};

export default Modal;
