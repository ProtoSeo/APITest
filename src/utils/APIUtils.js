import { API_BASE_URL, ACCESS_TOKEN } from '../constants';
import axios from 'axios';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export const login = async ({ email, password }) => {
  try {
    const response = await axios({
      method: 'POST',
      url: API_BASE_URL + '/api/v1/login',
      data: {
        email,
        password,
      },
    });
    return response.data;
  } catch (error) {
    window.alert(error.response.data.error_msg);
    return null;
  }
};

export const getProfile = async ({ userId }) => {
  try {
    const response = await axios({
      method: 'GET',
      url: API_BASE_URL + `/api/v1/users/${userId}/profile`,
      headers: {
        Authorization: localStorage.getItem("access_token"),
      },
    });
    return response.data;
  } catch (error) {
    window.alert(error.response.data.error_msg);
    return null;
  }
};