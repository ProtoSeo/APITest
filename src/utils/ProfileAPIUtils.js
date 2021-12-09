import { API_BASE_URL, ACCESS_TOKEN } from '../constants';
import axios from 'axios';

export const getProfile = async (userId) => {
  try {
    const headers = new Headers({ "Content-Type": "application/json" });
  
    if(localStorage.getItem(ACCESS_TOKEN)) {
      headers.append(
        "Authorization",
        "Bearer " + localStorage.getItem(ACCESS_TOKEN)
      );
    }

    const response = await axios({
      method: 'GET',
      url: API_BASE_URL + `/api/v1/users/${userId}/profile`,
      headers
    });
    return response.data;
  } catch (error) {
    window.alert(error.response.data.error_msg);
    return null;
  }
};

export const addProject = async ({userId, project}) => {
  try {
    const headers = new Headers({ "Content-Type": "application/json" });
  
    if(localStorage.getItem(ACCESS_TOKEN)) {
      headers.append(
        "Authorization",
        "Bearer " + localStorage.getItem(ACCESS_TOKEN)
      );
    }

    const response = await axios({
      method: 'POST',
      url: API_BASE_URL + `/api/v1/users/${userId}/projects`,
      data:project,
      headers
    });
    return response.data;
  } catch (error) {
    console.log(error.response.data)
    window.alert(error.response.data.error_msg);
    return null;
  }
};