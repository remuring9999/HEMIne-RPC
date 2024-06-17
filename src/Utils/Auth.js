require("dotenv").config();
const { shell } = require("electron");
const axios = require("axios");
const express = require("express");

class AuthClient {
  constructor() {
    this.expressApp = express();

    this._server = this.expressApp.listen(
      process.env.REACT_APP_DISCORD_LISTEN_PORT
    );

    this.expressApp.get("/auth", async (req, _res) => {
      const data = {
        code: String(req.query.code),
      };

      const request = await axios.post(
        "https://discordapp.com/api/oauth2/token",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },

          responseType: "json",
        }
      );

      console.log(request.data);
    });
  }

  stopListening = () => {
    this._server.close();
  };
}

module.exports = { AuthClient };
