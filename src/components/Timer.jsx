import React from 'react';
import formatSecondsToMinutesAndSeconds from '../lib/formatSecondsToMinutesAndSeconds';
import PausePlayButton from './PausePlayButton';
import ResetButton from './ResetButton';
import '../styles/timer.css';

const WORK_TIME = 2;
const BREAK_TIME = 1;

const MODES_TIMES = {
  WORK: WORK_TIME,
  BREAK: BREAK_TIME,
};

const TIME_STEP = 1000;

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.setTimer = this.setTimer.bind(this);
    this.stop = this.stop.bind(this);
    this.tick = this.tick.bind(this);
    this.completeSession = this.completeSession.bind(this);
    this.toggleIsPlaying = this.toggleIsPlaying.bind(this);
    this.reset = this.reset.bind(this);

    this.state = {
      mode: props.mode,
      time: MODES_TIMES[props.mode],
      isPlaying: props.autoPlays
    };
  }

  componentDidMount() {
    const { mode, time } = this.state;
    this.setTimer(mode, time);
  }

  componentWillUnmount() {
    this.stop();
  }

  setTimer(mode, time) {
    this.setState({
      mode: mode,
      time: time
    })
    this.timerID = setInterval(this.tick, TIME_STEP)
  }

  stop() {
    this.setState({
      isPlaying: false
    });
    clearInterval(this.timerID);
  }

  tick() {
    const { mode, isPlaying } = this.state;

    if (isPlaying) {
      this.setState(prevState => {
        return {
          time: prevState.time - 1
        };
      },
      () => {
        let time = this.state.time;
        if (time === 0) {
          this.stop();

          if (mode === 'WORK') {
            this.setTimer('BREAK', MODES_TIMES['BREAK'])
          }

          if (mode === 'BREAK') {
            this.completeSession()
            this.setTimer('WORK', MODES_TIMES['WORK'])
          }
        }
      });
    }
  }

  toggleIsPlaying() {
    this.setState(prevState => ({
      isPlaying: !prevState.isPlaying
    }));
  }

  reset() {
    this.stop();
    this.setTimer('WORK', MODES_TIMES['WORK']);
  }

  completeSession() {
    this.props.onSessionComplete();
  }


  render() {
    const { mode, time, isPlaying } = this.state;
    // TODO 6: make sure we are showing the right class depending on the mode
    const timerModeClass = (mode === 'WORK') ? 'work' : 'break';
    const timerClassName = `timer-container timer-${timerModeClass}`;
    return (
      <div className={timerClassName}>
        <div>
          <ResetButton onClick={this.reset} />
        </div>
        <div>{formatSecondsToMinutesAndSeconds(time)}</div>
        <div>
          <PausePlayButton isPlaying={isPlaying} onClick={this.toggleIsPlaying} />
        </div>
      </div>
    );
  }
}

export default Timer;
