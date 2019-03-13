/* eslint-disable no-console,no-restricted-syntax */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {addScript} from '../utils';

const withGoogleOAuth = (WrappedComponent) => {

  class GoogleOAuth extends Component {

    constructor(props) {
      super(props);
      this.state = {
        gapiLoaded: false,
      };
      this.gapiUrl = "https://apis.google.com/js/client.js";
    }
  
    componentDidMount() {
      addScript(
        'gapi',
        this.gapiUrl,
        () => {this.setState({gapiLoaded: true})}
      );
    }

    _getAuthParams = () => {
      if (this.props.authParams)
        return this.props.authParams
      else {
        const authParams = {
          client_id: this.props.clientId,
          cookie_policy: this.props.cookiePolicy,
          login_hint: this.props.loginHint,
          hosted_domain: this.props.hostedDomain,
          fetch_basic_profile: this.props.fetchBasicProfile,
          ux_mode: this.props.uxMode,
          redirect_uri: this.props.redirectUrl,
          include_granted_scopes: true,
          discoveryDocs: this.props.discoveryDocs,
          prompt: this.props.prompt,
          scope: this.props.scope,
        };
        if (this.props.responseType === 'code') {
          authParams['response_type'] = this.props.responseType;
          authParams['access_type'] = 'offline';
        }
        return authParams;
      }
    }

    authorize = () => {
      if (!this.state.gapiLoaded) { return; }
      if (this.props.preAuthorize) {
        this.props.preAuthorize()
      }
      window.gapi.auth2.authorize(
        this._getAuthParams(),
        (response) => {
          if (response.error) {
            this.props.onError(response);
          } else {
            this.props.onSuccess(response);
          }
        }
      );
    }

    render() {
      const updatedProps = {
        ...this.props, 
        ...this.state,
        authorize: this.authorize
      };
      return <WrappedComponent {...updatedProps} />;
    }
  }

  GoogleOAuth.propTypes = {
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    preAuthorize: PropTypes.func,
    authParams: PropTypes.object,
    clientId: PropTypes.string,
    scope: PropTypes.string,
    redirectUri: PropTypes.string,
    cookiePolicy: PropTypes.string,
    loginHint: PropTypes.string,
    hostedDomain: PropTypes.string,  
    fetchBasicProfile: PropTypes.bool,
    prompt: PropTypes.string,
    discoveryDocs: PropTypes.array,
    uxMode: PropTypes.string,
    responseType: PropTypes.string,
  };
  return GoogleOAuth;
}

export default withGoogleOAuth;