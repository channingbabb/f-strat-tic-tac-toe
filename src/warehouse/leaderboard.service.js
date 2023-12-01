import Cookies from 'universal-cookie';

const cookie = new Cookies();

class LeaderboardService {
    cookie_names = ['x-won', 'o-won', 'draws'];

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
            }
        });

    }

    getVal(name) {
        return this.state[name]
    }
    getCookie(name) {
        return cookie.get(name);
    }

    setCookie(name, value) {
        cookie.set(name, value);
        this.setCookieState(name, value);
    }

    setCookieState(name, value) {
        this.setState({ [name]: value });
    }

}

export default LeaderboardService;