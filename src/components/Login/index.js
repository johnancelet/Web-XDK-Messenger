// @flow
import React from 'react'
import layer from '../../get-layer';
// @flow-disable
import config from '../../LayerConfiguration.json'
// @flow-enable
import './login_style.css'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';

const layerClient = layer.layerClient
const Layer = layer.Layer

type Props = {
  history: any,
  location: any
}

type State = {
  nonce: string | null,
  email: string | null,
  userId: string | null,
  password?: string | null,
  appId: string | null,
  identityProviderUrl?: string,
  cb?: Function,
  waiting: boolean,
  retryScheduled: boolean,
  isTrusted: boolean
}

class Login extends React.Component<Props, State> {
  constructor (props: Props) {
    super (props)
    this.state = {
      appId: config[0].app_id,
      identityProviderUrl: config[0].identity_provider_url + '/authenticate',
      userId: null,
      email: null,
      password: null,
      nonce: null,
      waiting: false,
      isTrusted: false
    }
  }

  componentDidMount () {
    if (!layerClient) return;

    /**
     * Calling client.connect() delivers the nonce to this challenge event handler.
     *
     * Store the nonce in state so that when the user clicks to login, the nonce is used.
     *
     * Note however that the nonce expires after 10 minutes; an alternate flow would be to wait to call client.connect()
     * only after the user clicks to Login, and then you'll have a fresh nonce.
     *
     * Additional work can be done here to detect if the nonce is old and if it is, a new nonce can be requested using client.connect() again.
     */
    layerClient.on('challenge', e => {
      this.setState({
        nonce: e.nonce,
        cb: e.callback
      })
    }, this)

    /**
     * If authentication fails, an authentication-error event is triggered.
     *
     * This happens when there is something invalid in the Identity Token (the nonce is missing perhaps?) or when
     * Layer's servers are experiencing issues.
     *
     * When authentication fails for these reasons, we keep retrying for a while, using exponential backoff so as to not flood the server.
     *
     * After 10 retries we give up.
     */
    let retryCount = 0;
    layerClient.on('authenticated-error', evt => {
      this.setState({ waiting: false });
      if (evt.error.data.nonce) {
        retryCount++;
        if (retryCount < 10) {
          this.setState({ retryScheduled: true });
          this.state.nonce = evt.error.data.nonce;
          const delay = Layer.Utils.getExponentialBackoffSeconds(90, retryCount + 3);
          this.timeoutId = setTimeout(() => this.getIdentityToken(), Math.floor(delay * 1000));
        } else {
          alert('Authentication is failing; either there is an Identity Token issue, or an issue reaching the servers/services');
          console.log('Error: ', evt.error);
        }
      }
    }, this);

    /**
     * When the client is ready/authenticated, navigate to the home screen
     */
    const previousPathname = this.props.location.previousLocation ? this.props.location.previousLocation.pathname : null
    layerClient.on('ready', e => {
      this.setState({
        waiting: false,
        retryScheduled: false,
      });
      if (previousPathname)
        this.props.history.push(previousPathname)
      else
        this.props.history.push('/conversations')
    }, this);

    /**
     * If the client is already ready/authenticated, navigate to the home screen
     */
    if (layerClient.isReady) {
      if (previousPathname)
        this.props.history.push(previousPathname)
      else
        this.props.history.push('/conversations')
    }


    layerClient.connect()

  }

  /**
   * When the component is unmounted, be sure to remove all event listeners
   */
  componentWillUnmount() {
    layerClient.off(null, null, this);
  }

  /**
   * Request an Identity Token from the Identity Service.
   *
   * This sends a request to the sample Identity Service that the Layer Dashboard helped you to setup on heroku.
   *
   * In practice, you will likely get the Identity Token from your own servers, and you might get this token while they log into your web application.
   */
  getIdentityToken () {
    const {
      email,
      password,
      nonce,
      waiting,
    } = this.state

    // If the user clicked to retry, cancel any scheduled retries
    clearTimeout(this.timeoutId);

    // Update our state to "waiting for a response"
    this.setState({
      waiting: true,
      retryScheduled: false
    });

    // Send the request to the Identity Service
    Layer.Utils.xhr({
      url: this.state.identityProviderUrl,
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'POST',
      data: {
        nonce: nonce,
        email: email,
        password: password
      }
    }, (res) => {
      // If the request to your Identity service was successful, you will have an identity token to use in the callback
      // that was provided by the 'challenge' event.  Otherwise your identity server has rejected this user's credentials
      if (res.success && res.data.identity_token && this.state.cb) {
        this.state.cb(res.data.identity_token)
      } else {
        alert('Login failed; please check your user id and password');
      }
    });
  }

  /**
   * If the user clicks the "is trusted device" checkbox set the client to trusted and update our state
   */
  setTrustedState = (isTrusted: boolean) => {
    layerClient.isTrustedDevice = isTrusted;
    this.setState({ isTrusted });
  }

  /**
   * If the user hits ENTER key, submit the currently entered credentials
   */
  handleKeyDown = (event: any) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.getIdentityToken();
    }
  }

  render() {
    return (<div id="identity">
      <form>
      <img alt="layer" src="http://static.layer.com/logo-only-blue.png" />
      <h1>Layer sample app</h1>
      <div className="login-group">
        <label htmlFor="email">Email</label>
        <input type="text" id="email" onKeyDown={this.handleKeyDown} onChange={e => this.setState({ email: e.target.value })}/>
      </div>
      <div className="login-group">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" onKeyDown={this.handleKeyDown} onChange={e => this.setState({ password: e.target.value })} />
      </div>
      <div className="login-group is-trusted">
        <input type="checkbox" id="trusted" onChange={e => this.setTrustedState(e.target.checked)} checked={layerClient.isTrustedDevice} />
        <label htmlFor="trusted">Is Trusted Device</label>
      </div>
      <button type="button" value="Submit" onClick={() => this.getIdentityToken()}>
        {this.state.waiting || this.state.retryScheduled ? <FontAwesomeIcon icon={faSpinner} spin/> : null}
        <span>Login</span>
      </button>
    </form>
  </div>)
  }
}

export default Login;
