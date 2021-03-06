import React from 'react';
import AuthenticationContext from './context/AuthenticationContext';
import Cookies from 'js-cookie';
import axios from 'axios';
import dataSrc from './dataSrc';
import config from './config';

let defaultUser = {
    role: "guest",
    area: config.surveillanceMap.defaultArea,
    authAreas: [config.surveillanceMap.defaultArea]
}

class Auth extends React.Component {

    state = {
        authenticated: Cookies.get('authenticated') ? true : false,
        user: Cookies.get('user') ? {...JSON.parse(Cookies.get('user'))} : defaultUser,
        accessToken: ""
    }

    signin = (userInfo) => {
        // let authAreas = []
        // console.log(userInfo)
        // Object.keys(config.areaOptions).map(areaIndex => {
        //     if (userInfo.auth_area & areaIndex) {
        //         authAreas.push(config.areaOptions[areaIndex])
        //     }
        // })
        // userInfo = {
        //     ...userInfo,
        //     authAreas
        // }
        Cookies.set('authenticated', true)
        Cookies.set('user', userInfo)

        this.setState({
            authenticated: true,
            user: userInfo
        })
    };
  
    signout = () => {
        Cookies.remove('authenticated')
        Cookies.remove('user')
        this.setState({
            authenticated: false,
            user: defaultUser,
            accessToken: ""
        });
    };

    async signup (values) {
        let { username, password, role, area } = values
        // let areaOptionsIndex = {}
        // Object.keys(config.areaOptions).map(item => {
        //     areaOptionsIndex[config.areaOptions[item]] = item
        // })
        // console.log(areaOptionsIndex)

        let result = await axios.post(dataSrc.signup, {
            username,
            password,
            role,
            area,
        })
        return result
    }
  
    handleAuthentication = () => {
    };
  
    setSession(authResult) {
    }

    setCookies(key, value) {
        Cookies.set(key, value)
    }

    setSearchHistory = (searchHistory) => {
        this.setState({
            ...this.state,
            user: {
                ...this.state.user,
                searchHistory,
            }
        })
    } 

    setMyDevice = (myDevice) => {
        this.setState({
            ...this.state,
            user: {
                ...this.state.user,
                myDevice
            }
        })
    }

    setUserInfo = (status, value) =>{
        this.setState({
            ...this.state,
            user: {
                ...this.state.user,
                [status]: value,
            }
        })
    }

    render() {
        const authProviderValue = {
            ...this.state,
            signin: this.signin,
            signup: this.signup,
            signout: this.signout,
            handleAuthentication: this.handleAuthentication,
            setSearchHistory: this.setSearchHistory,
            setMyDevice: this.setMyDevice,
            setUserInfo: this.setUserInfo,
            setCookies: this.setCookies,
        };

        return (
            <AuthenticationContext.Provider value={authProviderValue}>
                {this.props.children}
            </AuthenticationContext.Provider>
        );
      }
}

export default Auth;