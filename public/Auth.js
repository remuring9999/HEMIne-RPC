require("dotenv").config();
const axios = require("axios");
const express = require("express");

class AuthClient {
  constructor(handleAuthTokens) {
    this.expressApp = express();
    this.handleAuthTokens = handleAuthTokens;

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

      try {
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

        const accessToken = request.data.access_token;
        const refreshToken = request.data.refresh_token;

        this.handleAuthTokens({ accessToken, refreshToken });
        await this.stopListening();
        return res.send("Authentication successful! Redirecting ..");
      } catch (error) {
        console.error(error);
        await this.stopListening();
        return res.send("An error occurred while trying to authenticate.");
      }
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
