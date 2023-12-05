import React from 'react';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

class Leaderboard extends React.Component {
    cookie_names = ['x_won', 'o_won', 'draws'];

    constructor(props) {
        super(props);
        this.state = {
            x_won: 0,
            o_won: 0,
            draws: 0
        };

        this.cookie_names.forEach(name => {
            if (!this.getCookie(name)) {
                this.setCookie(name, 0);
            } else {
                this.setCookieState(name, this.getCookie(name));
            }
        });

    }

    componentDidMount() {

        this.cookie_names.forEach(name => {
            if (this.getCookie(name) !== this.getVal(name)) {
                this.setCookieState(name, this.getCookie(name));
            }
        });
    }

    componentDidUpdate() {
        this.cookie_names.forEach(name => {
            if (this.getCookie(name) !== this.getVal(name)) {
                this.setCookieState(name, this.getCookie(name));
            }
        });
    }

    getVal(name) {
        return this.state[name]
    }
    getCookie(name) {
        console.log(cookie.get(name));
        return cookie.get(name);
    }

    setCookie(name, value) {
        cookie.set(name, value);
        this.setCookieState(name, value);
    }

    setCookieState(name, value) {
        this.setState({ [name]: value });
    }

    render() {
        return (
            <div className="leaderboard">
              <h2>Leaderboard</h2>
              <p>X wins: {this.state.x_won}</p>
              <p>O wins: {this.state.o_won}</p>
              <p>Draws: {this.state.draws}</p>
            </div>
          );
    }

}

export default Leaderboard;