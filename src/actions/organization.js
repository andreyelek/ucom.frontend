import humps from 'lodash-humps';
import api from '../api';
import snakes from '../utils/snakes';

export const setOrganizationActiveTab = payload => ({ type: 'SET_ORGANIZATION_ACTIVE_TAB', payload });
export const setOrganizationData = payload => ({ type: 'SET_ORGANIZATION_DATA', payload });
export const setOrganizationErrors = payload => ({ type: 'SET_ORGANIZATION_ERRORS', payload });
export const setOrganizationSaved = payload => ({ type: 'SET_ORGANIZATION_SAVED', payload });
export const setOrganizationLoading = payload => ({ type: 'SET_ORGANIZATION_LOADING', payload });
export const setOrganizationEntitySources = payload => ({ type: 'SET_ORGANIZATION_ENTITY_SOURCES', payload });
export const setOrganizationEntitySource = payload => ({ type: 'SET_ORGANIZATION_ENTITY_SOURCE', payload });
export const resetOrganizationData = () => ({ type: 'RESET_ORGANIZATION' });

export const saveOrganization = payload => (dispatch) => {
  dispatch(setOrganizationLoading(true));
  (payload.id ? api.updateOrganization : api.createOrganization)(snakes(payload))
    .then((data) => {
      dispatch(setOrganizationData(data));
      dispatch(setOrganizationSaved(true));
      dispatch(setOrganizationLoading(false));
    });
};

export const fetchOrganization = payload => (dispatch) => {
  dispatch(setOrganizationLoading(true));
  api.getOrganization(payload)
    .then((data) => {
      dispatch(setOrganizationData(humps(data.data)));
      dispatch(setOrganizationEntitySources(humps(data.data.entity_sources)));
      dispatch(setOrganizationLoading(false));
    });
};
