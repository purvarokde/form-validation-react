import "./App.css";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { apiKey } from "./apiKey";
import { ReactNotifications, Store } from "react-notifications-component";

function App() {
  const [emailAddress, setEmailAddress] = useState("");
  const [userName, setUserName] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const [isEmailError, setIsEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [countriesList, setCountriesList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [gender, setGender] = useState("male");

  const notification = {
    title: "Registered!",
    message: "User registered successfully",
    type: "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated animate__fadeIn"], // `animate.css v4` classes
    animationOut: ["animate__animated animate__fadeOut"], // `animate.css v4` classes
    dismiss: {
      duration: 2000,
      onScreen: true,
    },
  };
  /* {
    emailAddress: true,
      firstName: false,
        lastName: false
  } */

  var regEx = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  const onChangeListener = (e) => {
    let value = e.target.value;
    let result = regEx.test(value);
    console.log(result);

    if (result) {
      setEmailAddress(value);
      //setIsChecked(false);
      setError(false);
    } else {
      setEmailAddress(value);
      setError(true);
      //setIsChecked(true);
      /* let errorObj = {
        ...error,
      };
      errorObj[e.target.id]; */
      // setError({});
    }
  };

  const onUsernameChangeListener = (event) => {
    let value = event.target.value;
    setUserName(value);
  };

  const onNameChangeListener = (event) => {
    switch (event.target.name) {
      case "firstname": {
        setFirstName(event.target.value);
        break;
      }
      case "lastname": {
        setLastName(event.target.value);
        break;
      }
      default:
        break;
    }
  };

  const onCheckBoxChangeListener = () => {
    /*  if (isChecked) {
      setIsChecked(false);
    } else {
      setIsChecked(true);
    } */
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    if (isChecked) {
      setUserName(emailAddress);
    }
  }, [isChecked]);

  useEffect(() => {
    console.log("email", emailAddress);
    console.log("username", userName);
  }, [emailAddress]);

  const onSubmitClick = (e) => {
    e.preventDefault();
    let newData = {
      addr: emailAddress,
      id: uuidv4(),
      firstName,
      lastName,
      password,
      gender,
      selectedCountry,
      selectedState,
      selectedCity,
    };
    // console.log({ newData });
    Store.addNotification(notification);
  };

  const checkForErrors = () => {
    return !(
      emailAddress.length &&
      userName.length &&
      firstName.length &&
      lastName.length &&
      password.length &&
      confirmPassword.length &&
      !error &&
      !confirmPasswordError &&
      countriesList.length &&
      selectedCountry &&
      statesList.length &&
      selectedState &&
      citiesList.length &&
      selectedCity
    );
  };
  const passwordChangeListener = (e) => {
    /*   let passInput = eve.target.value;
    setPassword(passInput); */
    if (e.target.name === "password") {
      setPassword(e.target.value);
    } else {
      setConfirmPassword(e.target.value);
    }
  };

  /**
   * onCountryChange- to set the selected Country on dropdown change
   * @param {*} e- event sent by the dropdown
   */
  const onCountryChange = (e) => {
    const id = +e.target.value;
    let selected = countriesList.find((country) => country.id === id);
    setSelectedCountry(selected);
    setSelectedState(null);
    setSelectedCity(null);
  };

  const onStateChange = (e) => {
    const id = +e.target.value;
    let selected = statesList.find((state) => state.id === id);
    setSelectedState(selected);
    setSelectedCity(null);
  };

  const onCityChange = (e) => {
    const id = +e.target.value;
    let selected = citiesList.find((city) => city.id === id);
    setSelectedCity(selected);
  };

  const onGenderChange = (e) => {
    const value = e.target.value;
    setGender(value);
  };

  useEffect(() => {
    console.log(list);
  }, [list]);

  useEffect(() => {
    if (confirmPassword === password) {
      console.log("passwords are matched");
      setConfirmPasswordError(false);
    } else {
      console.log("passwords are not matched");
      setConfirmPasswordError(true);
    }
  }, [password, confirmPassword]);

  //component did mount
  useEffect(() => {
    const url = `https://api.countrystatecity.in/v1/countries`;
    const requestOptions = {
      headers: {
        accept: "application/json",
        "X-CSCAPI-KEY": apiKey,
      },
    };

    fetch(url, requestOptions)
      .then((res) => res.json())
      .then((data) => setCountriesList(data));
  }, []);

  useEffect(() => {
    const url = `https://api.countrystatecity.in/v1/countries/${selectedCountry?.iso2}/states`;
    const requestOptions = {
      headers: {
        accept: "application/json",
        "X-CSCAPI-KEY": apiKey,
      },
    };
    fetch(url, requestOptions)
      .then((res) => res.json())
      .then((stateData) => setStatesList(stateData));
  }, [selectedCountry]);

  useEffect(() => {
    console.log(selectedState);
    const url = `https://api.countrystatecity.in/v1/countries/${selectedCountry?.iso2}/states/${selectedState?.iso2}/cities`;
    const requestOptions = {
      headers: {
        "X-CSCAPI-KEY": apiKey,
      },
    };

    fetch(url, requestOptions)
      .then((res) => res.json())
      .then((cityData) => setCitiesList(cityData));
  }, [selectedState]);

  return (
    <div className="App">
      <ReactNotifications />
      <form>
        <div className="element-container">
          <div className="container">
            <label for="email" style={{ alignSelf: "flex-start" }}>
              Email:
            </label>
            <input
              type="email"
              className="text-input"
              id="email"
              value={emailAddress}
              placeholder="some@example.com"
              onChange={onChangeListener}
              name="Email"
              required
            />
          </div>

          {error ? (
            <span className="error-message">Invalid email address</span>
          ) : null}
        </div>

        <div className="element-container">
          <div className="container">
            <label for="email">Username: </label>
            <input
              type="username"
              className="text-input"
              value={userName}
              onChange={onUsernameChangeListener}
              name="username"
              disabled={isChecked}
              required
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              type="checkbox"
              name="checkbox"
              id="myCheck"
              checked={isChecked}
              onClick={onCheckBoxChangeListener}
            ></input>
            <span style={{ fontSize: "13px" }}>Same as email</span>
          </div>
        </div>

        <div className="element-container">
          <div className="container">
            <label for="fname">First name:</label>
            <input
              type="text"
              className="text-input"
              onChange={onNameChangeListener}
              value={firstName}
              name="firstname"
            />
          </div>
        </div>

        <div className="element-container">
          <div className="container">
            <label for="lname">Last name:</label>
            <input
              type="text"
              className="text-input"
              onChange={onNameChangeListener}
              value={lastName}
              name="lastname"
            />
          </div>
        </div>
        <div className="element-container">
          <div className="container">
            <label for="password">Password:</label>
            <input
              type="password"
              className="text-input"
              value={password}
              onChange={passwordChangeListener}
              name="password"
              placeholder="Password"
            />
          </div>
        </div>
        <div className="element-container">
          <div className="container">
            <label for="password">Confirm Password:</label>
            <input
              type="password"
              className="text-input"
              value={confirmPassword}
              onChange={passwordChangeListener}
              //onKeyUp={handleValidation}
              name="confirmPassword"
              placeholder="Confirm password"
            />
          </div>
          {confirmPasswordError ? (
            <span className="error-message">Password does not match</span>
          ) : null}
        </div>
        <div className="element-container">
          <div className="container">
            <label for="lname">Gender:</label>
            <div style={{ display: "flex" }}>
              <label class="radio-inline" style={{ minWidth: "110px" }}>
                <input
                  type="radio"
                  name="optradio"
                  value="male"
                  checked={gender === "male"}
                  onChange={onGenderChange}
                />
                Male
              </label>
              <label class="radio-inline" style={{ minWidth: "110px" }}>
                <input
                  type="radio"
                  name="optradio"
                  value="female"
                  checked={gender === "female"}
                  onChange={onGenderChange}
                />
                Female
              </label>
              <label class="radio-inline" style={{ minWidth: "110px" }}>
                <input
                  type="radio"
                  name="optradio"
                  value="other"
                  checked={gender === "other"}
                  onChange={onGenderChange}
                />
                Other
              </label>
            </div>
          </div>
        </div>

        {/*  <div class="dropdown">
            <button class="dropbtn">Dropdown</button>
            <div class="dropdown-content">
              <a href="#">Link 1</a>
              <a href="#">Link 2</a>
              <a href="#">Link 3</a>
            </div>
          </div> */}
        <div className="element-container">
          {countriesList.length ? (
            <div className="container">
              <label for="email">Country: </label>

              <select onChange={onCountryChange}>
                {countriesList.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
        <div className="element-container">
          {statesList.length ? (
            <div className="container">
              <label for="email">State/UT: </label>
              <select onChange={onStateChange}>
                {statesList.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
        <div className="element-container">
          {citiesList.length ? (
            <div className="container">
              <label for="email">City: </label>
              <select onChange={onCityChange}>
                {citiesList.map((city) => (
                  <option value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
        <button onClick={onSubmitClick} disabled={checkForErrors()}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
