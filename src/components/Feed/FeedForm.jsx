import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import Avatar from '../Avatar';
import Button from '../Button';
import { selectUser } from '../../store/selectors/user';
import { getUserById } from '../../store/users';
import { getFileUrl, getBase64FromFile } from '../../utils/upload';
import { setPostData, validatePostField } from '../../actions';
import { escapeQuotes } from '../../utils/text';
import IconClip from '../Icons/Clip';
import IconClose from '../Icons/Close';
import DropZone from '../DropZone';
import { updatePost } from '../../actions/posts';

class FeedForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      message: escapeQuotes(this.props.message) || '',
      base64Cover: '',
      fileImg: '',
      fileUrl: getFileUrl(this.props.mainImageFilename) || '',
    };
  }

  sumbitForm = (message, fileImg) => {
    if (typeof this.props.onSubmit === 'function' && (message.trim().length !== 0 || (fileImg || this.state.fileUrl))) {
      if (fileImg !== '') {
        this.props.onSubmit(message, fileImg);
      } else if (fileImg === '' && this.state.fileUrl === '') {
        this.props.onSubmit(message, fileImg);
      } else if (fileImg === '' && this.state.fileUrl !== '') {
        this.props.onSubmit(message);
      }
    }
  }

  render() {
    const user = getUserById(this.props.users, this.props.user.id);

    if (!user) {
      return null;
    }

    return (
      <form
        className="feed-form"
        onSubmit={(e) => {
          e.preventDefault();
          this.sumbitForm(this.state.message, this.state.fileImg);
        }}
      >
        <div className="feed-form__field">
          <div className="feed-form__avatar">
            <Avatar src={getFileUrl(user.avatarFilename)} />
          </div>

          <div className="feed-form__message">
            <textarea
              autoFocus
              rows="4"
              className="feed-form__textarea"
              placeholder="Leave a comment"
              value={this.state.message}
              onChange={e => this.setState({ message: e.target.value })}
              onKeyDown={(e) => {
                if ((e.ctrlKey && e.keyCode === 13) || (e.metaKey && e.keyCode === 13)) {
                  e.preventDefault();
                  this.sumbitForm(this.state.message, this.state.fileImg);
                }
              }}
            />
          </div>

          <div>
            <label name="img" className="feed-form__clip">
              <IconClip />
            </label>

            {(this.state.base64Cover || this.state.fileUrl) ? (
              <div className="cover cover_small">
                <div className="cover__inner">
                  <div className="cover__remove">
                    <button
                      type="button"
                      className="button-clean button-clean_close"
                      onClick={() => {
                        this.props.updatePost({
                            data: {
                              mainImageFilename: '',
                            },
                            postId: this.props.postId,
                          });
                        this.setState({ base64Cover: '', fileUrl: '', fileImg: '' });
                      }}
                    >
                      <IconClose />
                    </button>
                  </div>

                  <img className="cover__img" src={this.state.base64Cover || this.state.fileUrl} alt="" />
                </div>
              </div>
            ) : (
              <DropZone
                className="drop-zone_clip"
                accept="image/jpeg, image/png"
                maxSize={1000000}
                onDrop={(files) => {
                  getBase64FromFile(files[0]).then((base64Cover) => {
                    this.setState({
                      base64Cover,
                      fileImg: files[0],
                    });
                  });
                }}
              />
            )}
          </div>
        </div>

        <div className="feed-form__actions">
          <div className="inline">
            <div className="inline__item">
              <Button
                text="Cancel"
                size="small"
                theme="light"
                onClick={() => {
                  if (typeof this.props.onCancel === 'function') {
                    this.props.onCancel();
                  }
                }}
              />
            </div>
            <div className="inline__item">
              <Button
                text={this.props.message || this.props.mainImageFilename ? 'Save' : 'Post'}
                type="submit"
                size="small"
                theme="red"
                isDisabled={(this.state.message.trim().length === 0 && this.state.base64Cover === '' && this.state.fileUrl === '') ||
                ((this.state.message.trim().length === 0 && this.state.base64Cover !== '') &&
                (this.state.message.trim().length === 0 && this.props.mainImageFilename !== '') &&
                (this.state.message.trim().length === 0 && this.state.fileUrl !== ''))}
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

FeedForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  users: PropTypes.objectOf(PropTypes.object),
  message: PropTypes.string,
};

export default connect(
  state => ({
    users: state.users,
    posts: state.posts,
    user: selectUser(state),
  }),
  dispatch => ({
    updatePost,
    setPostData: data => dispatch(setPostData(data)),
    validatePostField: data => dispatch(validatePostField(data)),
  }),
)(FeedForm);
