import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import Button from '../Button';
import { selectUser } from '../../store/selectors/user';
import { followOrganization, unfollowOrganization } from '../../actions/organizations';
import { getUserById } from '../../store/users';
import { authShowPopup } from '../../actions/auth';

const OrganizationFollowButton = (props) => {
  if (!props.organizationId) {
    return null;
  }

  const owner = getUserById(props.users, props.user.id);
  const organization = getUserById(props.organizations, props.organizationId);

  if (!organization) {
    return null;
  }

  const userIsFollow = props.user.id ? (organization.followedBy || []).some(item => +item.id === +owner.id) : false;

  return (
    <Button
      isStretched
      size="medium"
      theme="transparent"
      withCheckedIcon={userIsFollow}
      text={userIsFollow ? 'Following' : 'Follow'}
      onClick={() => {
        if (!owner) {
          props.authShowPopup();
          return;
        }

        (userIsFollow ? props.unfollowOrganization : props.followOrganization)({ organization, owner });
      }}
    />
  );
};

OrganizationFollowButton.propTypes = {
  unfollowOrganization: PropTypes.func.isRequired,
  followOrganization: PropTypes.func.isRequired,
  authShowPopup: PropTypes.func.isRequired,
  organizationId: PropTypes.number.isRequired,
  users: PropTypes.objectOf(PropTypes.object).isRequired,
  organizations: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default connect(
  state => ({
    users: state.users,
    organizations: state.organizations,
    user: selectUser(state),
  }),
  dispatch => bindActionCreators({
    followOrganization,
    unfollowOrganization,
    authShowPopup,
  }, dispatch),
)(OrganizationFollowButton);
