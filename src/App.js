import React, { Component } from "react";
import "./App.css";
import moment from "moment";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      break: 5,
      session: 25,
      clockTime: moment.duration(25, "minutes"),
      canChange: true,
      sessionWaiting: false,
      breakWaiting: true,
      isPause: false,
      timer: null
    };

    this.breakIncrement = this.breakIncrement.bind(this);
    this.breakDecrement = this.breakDecrement.bind(this);
    this.sessionIncrement = this.sessionIncrement.bind(this);
    this.sessionDecrement = this.sessionDecrement.bind(this);
    this.resetTime = this.resetTime.bind(this);
    this.reduceTime = this.reduceTime.bind(this);
    this.startTimer = this.startTimer.bind(this);

    this.url1 =
      "https://s3.ap-south-1.amazonaws.com/freecodecampfiles/pomodoro_app_sounds/doorbell.mp3";
  }

  breakIncrement() {
    if (this.state.break != 60 && this.state.canChange === true) {
      this.setState({
        break: this.state.break + 1
      });
    }
  }

  breakDecrement() {
    if (this.state.break != 1 && this.state.canChange === true) {
      this.setState({
        break: this.state.break - 1
      });
    }
  }

  sessionIncrement() {
    if (this.state.session != 60 && this.state.canChange === true) {
      this.setState({
        session: this.state.session + 1,
        clockTime: this.state.clockTime.add(1, "minutes")
      });
    }
  }

  sessionDecrement() {
    if (this.state.session != 1 && this.state.canChange === true) {
      this.setState({
        session: this.state.session - 1,
        clockTime: this.state.clockTime.subtract(1, "minutes")
      });
    }
  }

  resetTime() {
    clearInterval(this.state.timer);
    this.setState(
      {
        break: 5,
        session: 25,
        clockTime: moment.duration(25, "minutes"),
        canChange: true,
        sessionWaiting: false,
        breakWaiting: true,
        isPause: false,
        timer: null
      },
      function() {
        document.getElementById("timer-label").innerHTML = "Session";
        document.getElementById("beep").pause();
        document.getElementById("beep").currentTime = 0;
      }
    );
  }

  //Start and pause logic
  startTimer() {
    if (this.state.isPause === false) {
      this.setState(
        {
          canChange: !this.state.canChange,
          isPause: !this.state.isPause
        },
        function() {
          this.state.timer = setInterval(this.reduceTime, 1000);
        }
      );
    } else if (this.state.isPause === true) {
      this.setState(
        {
          isPause: !this.state.isPause
        },
        function() {
          clearInterval(this.state.timer);
          document.getElementById("beep").pause();
          document.getElementById("beep").currentTime = 0;
        }
      );
    }
  }

  //Clock Timer works based on this function's logic
  reduceTime() {
    if (
      this.state.clockTime.get("minutes") > 0 ||
      this.state.clockTime.get("seconds") > 0
    ) {
      this.setState(
        {
          playAudio: true,
          clockTime: this.state.clockTime.subtract(1, "seconds")
        },
        function() {
          if (
            this.state.clockTime.get("minutes") === 0 &&
            this.state.clockTime.get("seconds") === 0 &&
            this.state.playAudio === true
          ) {
            document.getElementById("beep").play();
          }
        }
      );
    } else if (
      this.state.clockTime.get("minutes") === 0 &&
      this.state.clockTime.get("seconds") === 0 &&
      this.state.breakWaiting === true
    ) {
      this.setState(
        {
          clockTime: moment.duration(this.state.break + 1, "minutes"),
          breakWaiting: !this.state.breakWaiting,
          sessionWaiting: !this.state.sessionWaiting
        },
        function() {
          document.getElementById("timer-label").innerHTML = "Break";
          this.setState({
            clockTime: this.state.clockTime.subtract(60, "seconds")
          });
        }
      );
    } else if (
      this.state.clockTime.get("minutes") === 0 &&
      this.state.clockTime.get("seconds") === 0 &&
      this.state.sessionWaiting === true
    ) {
      this.setState(
        {
          clockTime: moment.duration(this.state.session + 1, "minutes"),
          sessionWaiting: !this.state.sessionWaiting,
          breakWaiting: !this.state.breakWaiting
        },
        function() {
          document.getElementById("timer-label").innerHTML = "Session";
          this.setState({
            clockTime: this.state.clockTime.subtract(60, "seconds")
          });
        }
      );
    }
  }

  render() {
    
    /* This code snippet is taken from The Reactionary youtube channel.
    Link -> https://www.youtube.com/watch?v=3gPbn5LaU_8&t=4693s */
    const leftZero = value => {
      if (value < 10) {
        return `0${value}`;
      }
      return `${value}`;
    };

    return (
      <div className="App container">
        <header className="header">
          <h1>Pomodoro Clock</h1>
        </header>
        <div className="break-session">
          <div id="break-label">
            <p>Break Length</p>
            <span
              id="break-increment"
              className="fa fa-plus-square-o break-inc"
              onClick={this.breakIncrement}
            />
            <span
              id="break-decrement"
              className="fa fa-minus-square-o break-dec"
              onClick={this.breakDecrement}
            />
            <br />
            <div id="break-length">{this.state.break}</div>
          </div>

          <div id="session-label">
            <p>Session Length</p>
            <span
              id="session-increment"
              className="fa fa-plus-square-o session-inc"
              onClick={this.sessionIncrement}
            />
            <span
              id="session-decrement"
              className="fa fa-minus-square-o session-dec"
              onClick={this.sessionDecrement}
            />
            <br />
            <div id="session-length">{this.state.session}</div>
          </div>
        </div>

        <div className="clock-box container">
          <div id="timer-label">Session</div>
          <div id="time-left">
            {leftZero(this.state.clockTime.get("minutes"))}:
            {leftZero(this.state.clockTime.get("seconds"))}
          </div>
          <div>
            <button id="start_stop" onClick={this.startTimer}>
              <span className="fa fa-pause-circle-o" />
              <span className="fa fa-play-circle-o" />
            </button>
          </div>
          <div className="reset-button container">
            <span
              id="reset"
              className="fa fa-refresh container"
              onClick={this.resetTime}
            />
          </div>
          <div>
            <audio id="beep" src={this.url1} />
          </div>
        </div>
        <div className="copyright credit">
          <div className="copyright">
            Designed and Coded by{" "}
            <span className="my-name">Sovit Ranjan Rath</span>
          </div>
          <div className="sound-credit">
            Ringing sound taken from&nbsp;
            <a href="http://soundbible.com/tags-buzzer.html">soundible.com</a>
            <br />
            <div>
              Sound by&nbsp;
              <a href="http://soundbible.com/2160-Old-Fashion-Door-Bell.html">
                Daniel Simion
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
