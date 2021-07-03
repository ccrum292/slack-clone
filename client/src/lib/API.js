import axios from "axios";

const API = {
  Users: {
    login: function (email, password) {
      return axios.post("/api/users/login", { email, password });
    },

    create: function (name, email, password) {
      return axios.post("/api/users", { name, email, password });
    },

    getMe: function () {
      return axios.get("/api/users/me");
    }, 

    logout: function () {
      return axios.post('/api/users/logout', {});
    }
  },
  Chats: {
    getAll: function () {
      return axios.get('/api/chats/all');
    },
    // bodyObj = {
    //   socketRoomName: "",
    //   users: [
    //     {
    //       userId: "",
    //       name: ""
    //     }
    //   ]
    // }
    createNewChat: function (bodyObj) {
      return axios.post('/api/chats/', bodyObj);
    }
  }
};

export default API;