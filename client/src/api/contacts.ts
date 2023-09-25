import { APIClient } from "./apiCore";
import * as url from "./urls";

const api = new APIClient();

const getContacts = (filters?: object) => {
  return api.get(url.GET_CONTACTS, filters);
};

const inviteContact = (data: object) => {
  return api.create("/api/contact/add-contact", data);
};
export { getContacts, inviteContact };
