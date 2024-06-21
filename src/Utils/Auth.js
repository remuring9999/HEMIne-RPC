require("dotenv").config();
const { shell } = require("electron");
const axios = require("axios");
const { AxiosError } = require("axios");
const express = require("express");

class AuthClient {
  constructor() {
    this.expressApp = express();

    this._server = this.expressApp.listen(
      process.env.REACT_APP_DISCORD_LISTEN_PORT
    );

    this.expressApp.get("/auth/discord/callback", async (req, res) => {
      const data = {
        client_id: process.env.REACT_APP_DISCORD_CLIENT_ID,
        client_secret: process.env.REACT_APP_DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: process.env.REACT_APP_DISCORD_REDIRECT_URI,
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

      if (request instanceof AxiosError) {
        console.log(request.response?.data);
        return;
      }

      res.status(200).send(request.data);
    });
  }

  stopListening = () => {
    this._server.close();
  };

  getAuthURL = () => {
    return `
      https://discord.com/api/oauth2/authorize?client_id=${
        process.env.REACT_APP_DISCORD_CLIENT_ID
      }&redirect_uri=${encodeURI(
      process.env.REACT_APP_DISCORD_REDIRECT_URI
    )}&response_type=code&scope=identify+rpc+rpc.voice.read`;
  };
}

module.exports = { AuthClient };
