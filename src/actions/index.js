export const setUser = payload => ({ payload, type: 'SET_USER' });
export const removeUser = () => ({ type: 'REMOVE_USER' });
export const setPostData = payload => ({ type: 'SET_POST_DATA', payload });
export const resetPost = () => ({ type: 'RESET_POST' });
export const validatePost = () => ({ type: 'VALIDATE_POST' });
export const validatePostField = payload => ({ type: 'VALIDATE_POST_FIELD', payload });
export const postSetSaved = payload => ({ type: 'POST_SET_SAVED', payload });
