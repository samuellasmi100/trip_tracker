import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  getAllClients(token) {
    return Api.get(`/${END_POINT.USER}/${END_POINT.CLIENTS}`, {
      headers: { Authorization: token },
    });
  },
  
getAllClientsUsers(token) {
    return Api.get(`/${END_POINT.USER}/${END_POINT.CLIENTS_USERS}`, {
      headers: { Authorization: token },
    });
  },
  getAllClientsUsers(token) {
    return Api.get(`/${END_POINT.USER}/${END_POINT.CLIENTS_USERS}`, {
      headers: { Authorization: token },
    });
  },
  getClientUserById(token, clientUserId) {
    return Api.get(
      `/${END_POINT.USER}/${END_POINT.CLIENT_USER}/${clientUserId}`,
      {
        headers: { Authorization: token },
      }
    );
  },
  updateClientUser(token, clientData) {
    return Api.post(
      `/${END_POINT.USER}/${END_POINT.CLIENT_USER}/${clientData.clientUserId}`,
      clientData,
      {
        headers: { Authorization: token },
      }
    );
  },
  updateClientUserRegions(token, regions, viewAsClientUserObject) {
    return Api.post(
      `/${END_POINT.USER}/${END_POINT.UPDATE_CLIENT_USER_REGIONS}`,
      { regions: regions, viewAsClientUserObject: viewAsClientUserObject  },
      {
        headers: { Authorization: token },
      }
    );
  },
  getClientById(token, clientId) {
    return Api.get(`/${END_POINT.USER}/${END_POINT.CLIENTS}/${clientId}`, {
      headers: { Authorization: token },
    });
  },
  updateClient(token, clientData) {
    return Api.post(
      `/${END_POINT.USER}/${END_POINT.CLIENTS}/${clientData.client_id}`,
      clientData,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  },
  createClient(token, clientData) {
    return Api.post(
      `/${END_POINT.USER}/${END_POINT.SIGN_UP_CLIENT}`,
      clientData,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  },
};
