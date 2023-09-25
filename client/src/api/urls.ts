//auth
export const POST_FAKE_LOGIN = "/api/auth/login";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";
export const JWT_REGISTER = "/post-jwt-register";
export const POST_FAKE_REGISTER = "/api/user/register";

export const USER_CHANGE_PASSWORD = "/user-change-password";
export const LOAD_CURRENT_USER = "/api/user/current-user"

// profile & settings
export const GET_PROFILE_DETAILS = "/api/profile/me";
export const GET_USER_SETTINGS = "/api/settings";
export const UPDATE_ETTINGS = "/api/profile/update";

// contacts
export const GET_CONTACTS = "/api/contact";
export const INVITE_CONTACT = "/api/contact/add-contact";

// calls
export const GET_CALLS_LIST = "/calls-list";
// bookmarks
export const GET_BOOKMARKS_LIST = "/bookmarks-list";
export const DELETE_BOOKMARK = "/bookmarks-delete";
export const UPDATE_BOOKMARK = "/bookmarks-update";

// chats
export const GET_FAVOURITES = "/get-favourites";
export const GET_DIRECT_MESSAGES = "/api/direct-message";
export const GET_CHANNELS = "/get-channles";
export const ADD_CONTACTS = "/api/direct-message/create-contact";
export const CREATE_CHANNEL = "/create-channel";
export const GET_CHAT_USER_DETAILS = "/api/message/details";
export const GET_CHAT_USER_CONVERSATIONS = "/api/message/conversation";
export const SEND_MESSAGE = "/api/message";
export const RECEIVE_MESSAGE = "/receive-message";
export const READ_MESSAGE = "/read-message";
export const RECEIVE_MESSAGE_FROM_USER = "/receive-message-from-user";
export const DELETE_MESSAGE = "/delete-message";
export const FORWARD_MESSAGE = "/forward-message";
export const DELETE_USER_MESSAGES = "/delete-user-messages";
export const TOGGLE_FAVOURITE_CONTACT = "/toggle-favourite-contact";
export const GET_ARCHIVE_CONTACT = "/get-archive-contacts";
export const TOGGLE_ARCHIVE_CONTACT = "/toggle-archive-contact";
export const READ_CONVERSATION = "/read-conversation";
export const DELETE_IMAGE = "/user-delete-img";

// groups
export const GET_CHANNEL_DETAILS = "/get-channel-details";
