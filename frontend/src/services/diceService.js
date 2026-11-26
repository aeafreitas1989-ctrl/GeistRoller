import axios from 'axios';
const API = (process.env.REACT_APP_BACKEND_URL || '') + '/api';
// Return the original Axios response: existing callers intentionally modify response.data.
export const requestDiceRoll = payload => axios.post(API + '/dice/roll', payload);
