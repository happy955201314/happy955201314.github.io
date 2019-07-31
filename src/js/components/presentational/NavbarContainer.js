/** React Plugin */
import React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import { supportedLocale } from '../../../js/locale';
import { Navbar, Nav, NavDropdown, Image, Dropdown  } from 'react-bootstrap'
import LocaleContext from '../../context/LocaleContext';
import SigninPage from '../container/SigninPage';
import SignupPage from '../container/SignupPage';
import Cookies from 'js-cookie'

import config from '../../config';
import AuthenticationContext from '../../context/AuthenticationContext';
import { authenticationService } from '../../authenticationService';

class NavbarContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            isShowSigninForm: false,
            isShowSignupForm: false,
            currentLocale: config.locale.defaultLocale
        }
        this.handleLangSelect = this.handleLangSelect.bind(this);
        this.handleSigninFormShowUp = this.handleSigninFormShowUp.bind(this);
        this.handleSigninFormSubmit = this.handleSigninFormSubmit.bind(this);
        this.handleSignout = this.handleSignout.bind(this);
        this.handleSignupFormShowUp = this.handleSignupFormShowUp.bind(this);
        this.handleSignupFormSubmit = this.handleSignupFormSubmit.bind(this);
        this.handleSignFormClose = this.handleSignFormClose.bind(this)

    }

    handleLangSelect() {
        const lang = supportedLocale[config.locale.supportedLocale
                        .filter(item => item !== this.state.currentLocale)
                        .join()].lang
        this.setState({
            currentLocale: lang
        })
        this.props.changeLocale(lang);
    }

    handleSigninFormShowUp() {
        this.setState({
            isShowSigninForm: true,
            isShowSignupForm: false,
        })
    }

    handleSignupFormShowUp() {
        this.setState({
            isShowSigninForm: false,
        })
        setTimeout(
            function() {
                this.setState({
                    isShowSignupForm: true,
                })
            }.bind(this),
            300
        )
    }

    handleSigninFormSubmit(authentication) {
        this.props.handleAuthentication(authentication)
        this.setState({
            isShowSigninForm: false,
        })
    }

    handleSignupFormSubmit() {
        this.setState({
            isShowSignupForm: false,
        })
    }

    handleSignout() {
        const authentication = authenticationService.signout()
        this.props.handleAuthentication(authentication)
    }

    handleSignFormClose() {
        this.setState({
            isShowSigninForm: false,
            isShowSignupForm: false,
        })
    }

    render() {
        const style = {
            navbar: {
                boxShadow: "0 1px 6px 0 rgba(32,33,36,0.28)",
                fontWeight: '450',
                marginBottom: 10
            },
            navbarBrand: {
                color: 'black'
            }
        }
        const locale = this.context;
        const { isShowSigninForm, isShowSignupForm } = this.state;

        return (
            <AuthenticationContext.Consumer>
                {auth => (
                    <Navbar id='navbar' bg="white" className="navbar sticky-top navbar-light" expand='md' style={style.navbar}>
                        <Navbar.Brand className='px-0 mx-0'>  
                            <Link to="/" className="nav-link nav-brand d-flex align-items-center px-0" style={style.navbarBrand}>
                                <Image
                                    alt=""
                                    src={config.image.logo}
                                    width={50}
                                    className="d-inline-block align-top px-1"
                                />
                                {config.companyName}
                            </Link>
                        </Navbar.Brand>
                        
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">  
                            <Nav className="mr-auto text-capitalize my-auto" >
                                <Nav.Item><Link to="/" className="nav-link nav-route" >{locale.HOME}</Link></Nav.Item>
                        {!auth.isSignin &&
                            <>
                                <Nav.Item><Link to="/page/healthReport" className="nav-link nav-route" >{locale.HEALTH_REPORT}</Link></Nav.Item>
                                <Nav.Item><Link to="/page/geofence" className="nav-link nav-route" >{locale.GEOFENCE}</Link></Nav.Item>
                                <Nav.Item><Link to="/page/objectManagement" className="nav-link nav-route" >{locale.OBJECT_MANAGEMENT}</Link></Nav.Item>
                            </>
                        }
                            </Nav>
                            <Nav className='text-capitalize'>
                                {/* <NavDropdown title={locale.language} id="collasible-nav-dropdown" alignRight onSelect={this.handleLangSelect}>
                                    {Object.values(supportedLocale).map( (locale,index) => {
                                        return <NavDropdown.Item key={index} className="lang-select" eventKey={locale.abbr}>{locale.name}</NavDropdown.Item>
                                    })}
                                </NavDropdown>           */}
                                <Nav.Item className="nav-link nav-route" onClick={this.handleLangSelect}>
                                    {supportedLocale[config.locale.supportedLocale.filter(item => item !== this.state.currentLocale).join()].name}
                                </Nav.Item>
                                {auth.isSignin
                                    ? 
                                        <NavDropdown title={<i className="fas fa-user-alt"></i> }id="collasible-nav-dropdown" alignRight>
                                            <NavDropdown.Item className="lang-select" disabled>{auth.userInfo.name}</NavDropdown.Item>
                                            <Dropdown.Divider />
                                            <NavDropdown.Item className="lang-select" onClick={this.handleSignout}>{locale.SIGN_OUT}</NavDropdown.Item>
                                        </NavDropdown> 
                                        
                                    : 
                                        <Nav.Item className="nav-link nav-route" onClick={this.handleSigninFormShowUp}>{locale.SIGN_IN}</Nav.Item>
                                }
                            </Nav>
                        </Navbar.Collapse>

                        <SigninPage 
                            show={isShowSigninForm}
                            handleSigninFormSubmit={this.handleSigninFormSubmit}
                            handleSignupFormShowUp={this.handleSignupFormShowUp}
                            handleSignFormClose={this.handleSignFormClose}
                            handleAuthentication={this.props.handleAuthentication}
                        />
                        <SignupPage 
                            show={isShowSignupForm}
                            handleSignupFormSubmit={this.handleSignupFormSubmit}
                            handleSignFormClose={this.handleSignFormClose}
                        />
                    </Navbar>
                )}
            </AuthenticationContext.Consumer>
        );
    }
}

NavbarContainer.contextType = LocaleContext;

export default NavbarContainer;
