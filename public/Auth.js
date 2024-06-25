require("dotenv").config();
const axios = require("axios");
const express = require("express");

class AuthClient {
  constructor(
    handleAuthTokens,
    client_id,
    client_secret,
    redirect_uri,
    listen_port
  ) {
    this.expressApp = express();
    this.handleAuthTokens = handleAuthTokens;
    this._server = this.expressApp.listen(listen_port);
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.redirect_uri = redirect_uri;
    this.result = false;

    this.expressApp.get("/auth/discord/callback", async (req, res) => {
      const data = {
        client_id: client_id,
        client_secret: client_secret,
        grant_type: "authorization_code",
        redirect_uri: redirect_uri,
        code: String(req.query.code),
      };

      try {
        const request = await axios.post(
          "https://discord.com/api/oauth2/token",
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

        this.result = true;
        this.handleAuthTokens(this, { accessToken, refreshToken });
        await this.stopListening();
        return res.send("Authentication successful! Redirecting ..");
      } catch (error) {
        await this.stopListening();
        return res.send("An error occurred while trying to authenticate.");
      }
    });
  }

  getIdentify = async (accessToken) => {
    try {
      const request = await axios.get("https://discord.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "json",
      });

      return request.data;
    } catch {
      return null;
    }
  };

  refreshToken = async (refreshToken) => {
    const data = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    };

    try {
      const request = await axios.post(
        "https://discord.com/api/oauth2/token",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          responseType: "json",
        }
      );

      return request.data;
    } catch (error) {
      return null;
    }
  };

  stopListening = () => {
    this._server.close();
  };

  getAuthURL = () => {
    return `
      https://discord.com/api/oauth2/authorize?client_id=${
        this.client_id
      }&redirect_uri=${encodeURI(
      this.redirect_uri
    )}&response_type=code&scope=identify+rpc+rpc.voice.read+email`;
  };
}

module.exports = { AuthClient };
