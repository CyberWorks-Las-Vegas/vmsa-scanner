import React, { createRef } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import adapter from "webrtc-adapter";
import { BrowserMultiFormatReader } from "@zxing/library";

import Parser from "./parse";

// Styles
import Theme from "../../Themes/theme";
import { withStyles } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import TextField from "@material-ui/core/TextField";
// Components
import StyledModal from "./Modal/ModalCss";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link to="https://sound-secure.com">Sound Secure</Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const classStyle = (theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
});

const modalLayout = {
  width: "70vw",
  height: "80vh",
  margin: "0 auto",
  padding: "0 4rem",
};

class VSDashboard extends React.Component {
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
      isModalOpen: false,
      premises_id: "",
      first_name: 0,
      last_name: "",
      street: "",
      street_number: "",
      city: "",
      state: "",
      zip: "",
      license_id: "",
      dl: ``,
      scanned: false,
      fadeType: null,
    };
    // Refs
    this.background = React.createRef(null);
    this.interactiveRef = React.createRef(null);
    this.inputRef = React.createRef(null);

    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.postApi = this.postApi.bind(this);
    this.toggleState = this.toggleState.bind(this);
    this.logInsertCheckIn = this.logInsertCheckIn.bind(this);
    this.logInsertCheckOut = this.logInsertCheckOut.bind(this);
    this.VisitorStationFormChange = this.VisitorStationFormChange.bind(this);
    this.parseFun = this.parseFun.bind(this);

    this.transitionEnd = this.transitionEnd.bind(this);
    this.onEscKeyDown = this.onEscKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.scanner = this.scanner.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onEscKeyDown, false);
    setTimeout(() => this.setState({ fadeType: "in" }), 0);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.isOpen && prevProps.isOpen) {
      this.setState({ fadeType: "out" });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onEscKeyDown, false);
  }

  scanner = () => {
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
              console.log({ result }, "decode olonnye");
              this.setState((prevState) => ({
                ...prevState,
                isModalOpen: false,
                first_name: result.text,
              }));
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

  transitionEnd = (e) => {
    if (e.propertyName !== "opacity" || this.state.fadeType === "in") return;

    if (this.state.fadeType === "out") {
      this.setState({
        isModalOpen: !this.state.isModalOpen,
      });
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

  toggleState = (e) => {
    console.log(this.state.dl, "parse - toggle state");
    const inny = this.state.dl;
    const rawData = Parser(inny);
    console.log({ rawData }, "parsed license");

    this.setState((prevState) => ({
      ...prevState,
      first_name: rawData.firstName,
      last_name: rawData.lastName,
      street: rawData.addressStreet,
      city: rawData.addressCity,
      state: rawData.addressState,
      zip: rawData.addressPostalCode.slice(0, 5),
      license_id: rawData.documentNumber,
      scanned: true,
    }));
  };

  signIn = () => {
    this.logInsertCheckIn();
  };

  signOut = () => {
    this.logInsertCheckOut();
  };
  // function checks for form changes and updates state
  VisitorStationFormChange = (e) => {
    e.persist();
    console.log(this.state.dl, "input state");
    this.setState((prevState) => ({
      ...prevState,
      dl: `${e.target.value}`,
    }));
  };
  parseFun = (e) => {
    console.log("scan for textInput", e.data, { event: e });
    this.setState((prevState) => ({
      ...prevState,
      dl: prevState.dl.concat(e.data),
    }));
  };

  // Post form data to express
  postApi = async (form, endPoint) => {
    // get response json from express server
    return await fetch(endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((result) => result.json())
      .catch((error) => console.log("Authorization failed : " + error.message));
  };

  // function to handle retriving current logs from db
  logInsertCheckIn = async (e) => {
    const {
      premises_id,
      first_name,
      last_name,
      street,
      street_number,
      city,
      state,
      zip,
      license_id,
    } = this.state;

    const check_inDate = () => {
      let date = new Date();
      let minutes = date.getMinutes();
      let zero = "0";
      return `${date.getHours()}:${minutes > 9 ? minutes : zero + minutes}`;
    };
    const check_in = check_inDate();

    const logInForm = {
      premises_id,
      first_name,
      last_name,
      street,
      street_number,
      city,
      state,
      zip,
      license_id,
      check_in,
    };
    // waits for post api to resolve promise
    const endPoint =
      "https://vmsa-prod-backend.herokuapp.com/API/logInsertVal/logInsert";
    const body = await this.postApi(logInForm, endPoint).then((res) => res);
    // console.log(body)
    // updates state with info from express
    this.setState({
      current_logs: {
        correct: body.correct,
      },
    });
  };

  // function to handle posting current logs to db
  logInsertCheckOut = async (e) => {
    const { premises_id, license_id } = this.state;

    const check_outDate = () => {
      let date = new Date();
      let minutes = date.getMinutes();
      let zero = "0";
      return `${date.getHours()}:${minutes > 9 ? minutes : zero + minutes}`;
    };
    const check_out = check_outDate();
    const logOutForm = {
      premises_id,
      license_id,
      check_out,
    };
    // waits for post api to resolve promise
    const endPoint =
      "https://vmsa-prod-backend.herokuapp.com/API/logInsertOutVal/logInsertOut";
    const body = await this.postApi(logOutForm, endPoint).then((res) => res);
    // updates state with info from express
    // console.log(body)
    this.setState({
      current_logs: {
        correct: body.correct,
      },
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              Scan ID then press parse
            </Typography>
            <Grid container spacing={3}>
              {this.state.scanned === false ? (
                <Grid item xs={12} sm={6}>
                  <TextareaAutosize
                    id="scanner"
                    name="dl"
                    label="handheld scanner output"
                    fullWidth
                    // autoComplete="fname"
                    autoFocus
                    onChange={this.VisitorStationFormChange}
                    value={this.state.dl}
                  />
                </Grid>
              ) : (
                <React.Fragment>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      disabled
                      id="firstName"
                      name="first_name"
                      label="Firsst Name"
                      fullWidth
                      value={this.state.first_name}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      disabled
                      id="lastName"
                      name="last_name"
                      label="Last name"
                      fullWidth
                      autoComplete="lname"
                      value={this.state.last_name}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      disabled
                      id="address1"
                      name="street"
                      label="Street Address"
                      fullWidth
                      autoComplete="billing address-line1"
                      value={this.state.street}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      disabled
                      id="city"
                      name="city"
                      label="City"
                      fullWidth
                      autoComplete="billing address-level2"
                      value={this.state.city}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      disabled
                      id="state"
                      name="state"
                      label="State/Province/Region"
                      fullWidth
                      value={this.state.state}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      disabled
                      id="zip"
                      name="zip"
                      label="Zip / Postal code"
                      fullWidth
                      autoComplete="billing postal-code"
                      value={this.state.zip}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      disabled
                      id="license_id"
                      name="license_id"
                      label="Driver license #"
                      fullWidth
                      autoComplete="driver license"
                      value={this.state.license_id}
                    />
                  </Grid>
                </React.Fragment>
              )}
            </Grid>

            <div className={classes.buttons}>
              {this.state.scanned === false && (
                <Grid item xs={3}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={this.toggleState}
                    className={classes.button}
                  >
                    Parse
                  </Button>
                </Grid>
              )}
            </div>
            {this.state.isModalOpen && (
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
                    <h4 className="box-title">
                      Place barcode in scaner view finder
                    </h4>
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
                <div className={`background`} onMouseDown={this.handleClick} />
              </StyledModal>
            )}
          </Paper>
          <Copyright />
        </main>
      </React.Fragment>
    );
  }
}

VSDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(classStyle(Theme))(VSDashboard);
