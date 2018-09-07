import { connect } from 'react-redux';
import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import InfoBlock from '../../components/InfoBlock';
import VerticalMenu from '../../components/VerticalMenu';
import DropZone from '../../components/DropZone';
import Avatar from '../../components/Avatar';
import Textarea from '../../components/Textarea';
import DateInput from '../../components/DateInput';
import Loading from '../../components/Loading';
import { setUser } from '../../actions';
import { patchMyself, patchMyselfFormData } from '../../api';
import { getToken } from '../../utils/token';
import { getFileUrl } from '../../utils/upload';

class ProfileGeneralInfoPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      firstName: this.props.user.firstName || '',
      lastName: this.props.user.lastName || '',
      nickname: this.props.user.nickname || '',
      about: this.props.user.about || '',
      birthday: this.props.user.birthday || '',
      country: this.props.user.country || '',
      city: this.props.user.city || '',
      address: this.props.user.address || '',
      currencyToShow: this.props.user.currencyToShow || '',
      loading: false,
      avatarLoading: false,
    };
  }

  save() {
    const token = getToken();
    const data = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      nickname: this.state.nickname,
      about: this.state.about,
      birthday: this.state.birthday,
      country: this.state.country,
      city: this.state.city,
      address: this.state.address,
      currencyToShow: this.state.currencyToShow,
    };

    this.setState({ loading: true });

    patchMyself(data, token)
      .then((data) => {
        this.props.setUser(data);
        this.setState({ loading: false });
      });
  }

  uploadAvatar(file) {
    this.setState({ avatarLoading: true });

    const data = new FormData();

    data.append('avatarFilename', file);

    patchMyselfFormData(data, getToken())
      .then((data) => {
        this.props.setUser(data);
        this.setState({ avatarLoading: false });
      });
  }

  render() {
    return (
      <Fragment>
        <div className="grid grid_profile">
          <div className="grid__item">
            <VerticalMenu
              sections={[{ type: 'personal info', percents: '25' }, { type: 'location', percents: '0' }]}
            />
          </div>
          <div className="grid__item">
            <form
              className="person-form"
              onSubmit={(e) => {
                e.preventDefault();
                this.save();
              }}
            >
              <Loading loading={this.state.loading} className="loading_block" />

              <div className="profile__info-block">
                <InfoBlock title="Personal info">
                  <div className="profile__text-block">
                    Userpic Preview
                  </div>
                  <div className="profile__block profile__block_avatar">
                    <Avatar
                      src={getFileUrl(this.props.user.avatarFilename)}
                      size="big"
                      alt="Avatar"
                    />

                    <div className="profile__drop-zone">
                      <DropZone
                        text="add or drag img"
                        accept="image/jpeg, image/png"
                        onDrop={files => this.uploadAvatar(files[0])}
                        loading={this.state.avatarLoading}
                      />

                      <div className="profile__text-block">
                        You can upload an image  in JPG or PNG format.
                        Size is not more than 10 mb.
                      </div>
                    </div>
                  </div>

                  <div className="profile__block">
                    <TextInput
                      label="First name"
                      value={this.state.firstName}
                      onChange={firstName => this.setState({ firstName })}
                    />
                  </div>

                  <div className="profile__block">
                    <TextInput
                      label="Second name"
                      value={this.state.lastName}
                      onChange={lastName => this.setState({ lastName })}
                    />
                  </div>

                  <div className="profile__block">
                    <TextInput
                      label="Nickname"
                      placeholder="@nickname"
                      value={this.state.nickname}
                      onChange={nickname => this.setState({ nickname })}
                    />
                  </div>

                  <div className="profile__block">
                    <TextInput
                      label="Asset to show"
                      placeholder="Example Kickcoin"
                      value={this.state.currencyToShow}
                      onChange={currencyToShow => this.setState({ currencyToShow })}
                    />
                  </div>

                  <div className="profile__block">
                    <DateInput
                      label="Birthday"
                      value={this.state.birthday}
                      onChange={birthday => this.setState({ birthday })}
                    />
                  </div>

                  <div className={classNames('profile__block', 'profile__block_textarea')}>
                    <Textarea
                      rows={6}
                      label="About me"
                      placeholder="Type something..."
                      value={this.state.about}
                      onChange={about => this.setState({ about })}
                    />
                  </div>
                </InfoBlock>
              </div>

              <div className="profile__info-block">
                <InfoBlock title="Location">
                  <div className="profile__block">
                    <TextInput
                      label="Country"
                      value={this.state.country}
                      onChange={country => this.setState({ country })}
                    />
                  </div>

                  <div className="profile__block">
                    <TextInput
                      label="City"
                      value={this.state.city}
                      onChange={city => this.setState({ city })}
                    />
                  </div>

                  <div className="profile__block">
                    <TextInput
                      label="Address"
                      subtext="Actual address. Example: One Apple Park Way, Cupertino"
                      value={this.state.address}
                      onChange={address => this.setState({ address })}
                    />
                  </div>
                </InfoBlock>

                <div className="profile__block">
                  <Button type="submit" text="PROCEED" theme="red" size="big" isStretched />
                </div>
              </div>
            </form>
          </div>
        </div>
      </Fragment>
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
)(ProfileGeneralInfoPage);
