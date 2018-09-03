import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import CopyToClipboard from 'react-copy-to-clipboard';
import classNames from 'classnames';
import React, { Fragment } from 'react';
import TextInput from '../components/TextInput';
import Checkbox from '../components/Checkbox';
import Passphrase from '../components/Passphrase';
import Button from '../components/Button';
import dict from '../utils/dict';
import { getPassphrase, getTestPassphrase } from '../utils/passphrase';
import { checkAccountName, register } from '../api';
import { setUser } from '../actions';
import { saveToken } from '../utils/token';
import { getError } from '../utils/errors';

class SignUp extends React.PureComponent {
  constructor(props) {
    super(props);

    const passphrase = getPassphrase();
    const testPassphrase = getTestPassphrase(passphrase);

    this.state = {
      passphrase,
      testPassphrase,
      activeStep: 0,
      accountName: '',
      accountNameError: '',
      accountNameIsValid: false,
      passphraseIsValid: false,
      termsAccpeted: false,
      errors: [],
    };
  }

  setAccountName(accountName) {
    this.setState({ accountName }, () => {
      if (!this.state.accountName.match(/^[a-z1-5]{12}$/)) {
        this.setState({
          accountNameError: dict.accountNameValidationError,
          accountNameIsValid: false,
        });

        return;
      }

      checkAccountName(accountName)
        .then((data) => {
          if (data.errors) {
            this.setState({
              accountNameError: data.errors.account_name,
              accountNameIsValid: false,
            });

            return;
          }

          this.setState({
            accountNameError: null,
            accountNameIsValid: true,
          });
        });
    });
  }

  register() {
    register({
      accountName: this.state.accountName,
      brainkey: this.state.passphrase.join(' '),
    })
      .then((data) => {
        if (data.errors) {
          this.setState({
            errors: data.errors,
          });
          return;
        }

        if (data.user) {
          this.props.setUser(data.user);
        }

        if (data.token) {
          saveToken(data.token);
        }
      });
  }

  render() {
    if (this.props.user.id) {
      return <Redirect to="/profile/general-info" />;
    }

    return (
      <div className="content">
        <div className="content__inner">
          <div className="sign-up">
            <div className="sign-up__main-title">
              Account Creation
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.setState({ activeStep: 1 });
              }}
              className={classNames(
                'sign-up__section',
                { 'sign-up__section_active': this.state.activeStep >= 0 },
                { 'sign-up__section_passed': this.state.activeStep >= 1 },
              )}
            >
              <h3 className="sign-up__title">User Name</h3>
              <div className="sign-up__text">User name length must exactly 12 characters</div>
              <div className="sign-up__content sign-up__content_user-name">
                <div className="sign-up__username-input">
                  <TextInput
                    maxLength="12"
                    error={this.state.accountNameError || getError(this.state.errors, 'account_name')}
                    disabled={this.state.activeStep >= 1}
                    value={this.state.accountName}
                    placeholder="Account name"
                    onChange={accountName => this.setAccountName(accountName)}
                  />
                </div>
              </div>

              {!(this.state.activeStep >= 1) && (
                <div className="sign-up__submit-section">
                  <div className="sign-up__submit-section-button">
                    <Button
                      type="submit"
                      isStretched
                      text="PROCEED"
                      size="big"
                      theme="red"
                      isDisabled={!this.state.accountNameIsValid}
                    />
                  </div>
                </div>
              )}
            </form>

            <div
              className={classNames(
                'sign-up__section',
                { 'sign-up__section_active': this.state.activeStep >= 1 },
                { 'sign-up__section_passed': this.state.activeStep >= 2 },
              )}
            >
              <h3 className="sign-up__title">Passphrase</h3>
              <div className="sign-up__text">This 12 word is your passphrase. Write them down and remember</div>
              <div className="sign-up__content sign-up__content_passphrase">
                <div className="passphrase">
                  {this.state.passphrase.map(word => (
                    <span className="passphrase__word" key={word}>
                      <span className="passphrase__label">{word}</span>
                    </span>
                  ))}
                </div>
              </div>
              {!(this.state.activeStep >= 2) && (
                <div className="sign-up__submit-section">
                  <div className="sign-up__submit-section-button">
                    <CopyToClipboard text={this.state.passphrase.join(' ')}>
                      <Button
                        isStretched
                        text="COPY"
                        size="big"
                        theme="red"
                        onClick={() => this.setState({ activeStep: 2 })}
                      />
                    </CopyToClipboard>
                  </div>
                  <div className="sign-up__submit-section-description">Please, copy your passphrase to proceed</div>
                </div>
              )}
            </div>

            <div
              className={classNames(
                'sign-up__section',
                { 'sign-up__section_active': this.state.activeStep >= 2 },
              )}
            >
              <h3 className="sign-up__title">Verification</h3>
              <div className="sign-up__text">Cross out words number <b>2</b>, <b>4</b>, <b>8</b> and <b>12</b> from your passphrase out to validate the account creation</div>
              <div className="sign-up__content sign-up__content_verification">
                <Fragment>
                  <Passphrase
                    testWords={this.state.testPassphrase}
                    onChange={passphraseIsValid => this.setState({ passphraseIsValid })}
                  />

                  <div className="sign-up__agreement">
                    <Checkbox
                      isChecked={this.state.termsAccpeted}
                      onChange={termsAccpeted => this.setState({ termsAccpeted })}
                    />
                    <div className="sign-up__agreement-text">I accept the <a className="sign-up__agreement-conditions" href="#">General Terms and Conditions.</a></div>
                  </div>
                </Fragment>
              </div>
              <div className="sign-up__submit-section">
                <div className="sign-up__submit-section-button">
                  <Button
                    isStretched
                    size="big"
                    theme="red"
                    text="FINISH"
                    isDisabled={!this.state.passphraseIsValid || !this.state.termsAccpeted}
                    onClick={() => this.register()}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    user: state.user,
  }),
  dispatch => ({
    setUser: data => dispatch(setUser(data)),
  }),
)(SignUp);