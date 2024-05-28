import express from "express";
import Mongoose from "mongoose";
import * as http from "http";
import * as path from "path";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import apiErrorHandler from '../helper/apiErrorHandler';
const app = new express();
const server = http.createServer(app);
const root = path.normalize(`${__dirname}/../..`);
import socket from 'socket.io';
const cron = require('node-cron');


import cronForUserList from "../helper/util";
// import chatController from '../api/v1/controllers/socket/controller';
// import userModel from '../models/user';

cron.schedule('0 0 * * *', cronForUserList.sendUserListToAdmin);

import WebSocket from 'websocket';
import config from 'config';

const WebSocketServer = WebSocket.server;
const WebSocketClient = WebSocket.client;
const client = new WebSocketClient();
const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
  maxReceivedFrameSize: 64 * 1024 * 1024,   // 64MiB
  maxReceivedMessageSize: 64 * 1024 * 1024, // 64MiB
  fragmentOutgoingMessages: false,
  keepalive: false,
  disableNagleAlgorithm: false
}); 
const io = socket(server);


class ExpressServer {
  constructor() {
    app.use(express.json({ limit: '1000mb' }));

    app.use(express.urlencoded({ extended: true, limit: '1000mb' }))

    app.use(morgan('dev'))

    app.use(
      cors({
        allowedHeaders: ["Content-Type", "token", "authorization"],
        exposedHeaders: ["token", "authorization"],
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
      })
    );
  } 
  router(routes) {
    routes(app);
    return this;
  }

  configureSwagger(swaggerDefinition) {
    const options = {
      // swaggerOptions : { authAction :{JWT :{name:"JWT", schema :{ type:"apiKey", in:"header", name:"Authorization", description:""}, value:"Bearer <JWT>"}}},
      swaggerDefinition,
      apis: [
        path.resolve(`${root}/server/api/v1/controllers/**/*.js`),
        path.resolve(`${root}/api.yaml`),
      ],
    };

    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerJSDoc(options))
    );
    return this;
  }

  handleError() {
    app.use(apiErrorHandler);

    return this;
  }

  configureDb(dbUrl) {
    return new Promise((resolve, reject) => {
      Mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, (err) => {
        if (err) {
          console.log(`Error in mongodb connection ${err.message}`);
          return reject(err);
        }
        console.log("Mongodb connection established");
        return resolve(this);
      });
    });
  }

  // })

  listen(port) {
    server.listen(port, () => {
      console.log(`secure app is listening @port ${port}`, new Date().toLocaleString());
    });
    return app;
  }
}

var userCount = 0,
  users = {},
  keys = {},
  sockets = {},
  onlineUsers = [];
io.sockets.on("connection", (socket) => {
  userCount++;
  console.log("my socket id is >>>>>", socket.id, userCount);


  //************************ online user************** */

  function OnlineUser(data, socketId) {
    console.log("231=========>", data)
    console.log("232=========>", data.userId)
    return new Promise(async (resolve, reject) => {
      try {
        var userResult = await userModel.findOne({ _id: data.userId });
        if (onlineUsers.length > 0) {
          let check = onlineUsers.findIndex((x) => x.userId === data.userId);
          console.log("check=====264====", check);
          if (check >= 0) {
            console.log("previous record", onlineUsers[check]);
            data.status = "ONLINE";
            data.socketId = socketId;
            data.userName = userResult.userName;
            data.firstName = userResult.firstName;
            data.lastName = userResult.lastName;
            data.profilePic = userResult.profilePic;
            onlineUsers[check] = data;
          } else {
            console.log("new record", check, data);
            data.status = "ONLINE";
            data.socketId = socketId;
            data.userName = userResult.userName,
            data.firstName = userResult.firstName;
            data.lastName = userResult.lastName;
            data.profilePic = userResult.profilePic;
            onlineUsers.push(data);
            console.log("after insert record", onlineUsers);
          }
          resolve();
        } else {
          var userResult = await userModel.findOne({ _id: data.userId });
          let newUser = {
            userId: data.userId,
            status: "ONLINE",
            socketId: socketId,
            userName: userResult.userName,
            firstName: userResult.firstName,
            lastName: userResult.lastName,
            profilePic: userResult.profilePic,
          };
          console.log("data", data);
          console.log(" new userId===>", data, newUser);
          onlineUsers.push(newUser);

          resolve();
        }
      } catch (error) {
        console.log("Line no 290===>>", error)
        throw error;
      }
    });
  }
})

wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }
  const connection = request.accept('', request.origin);
  connection.on('message', function (message) {
    var type = JSON.parse(message.utf8Data);
    if (type.requestType === "NotificationList") {
      getNotification(type.token);

    }

    if (type.user_token) {
      connection.sendUTF(messageReceiveUserCount(type.user_token));
    }

    if (type.type === "ChatHistory") {
      connection.sendUTF(chatHistory(type));
    }

  });

  async function getNotification(token) {
    if (connection.connected) {
      let result = await userController.getNotificationList(token);
      if (result) {
        var data = JSON.stringify(result);
        connection.sendUTF(data);
      }
      setTimeout(() => {
        getNotification(token)
      }, 5000);
    }
  }

  async function messageReceiveUserCount(token) {
    if (connection.connected) {
      let result = await chatController.messageReceiveUserCount(token);
      if (result) {
        var data = JSON.stringify(result.responseResult);
        connection.sendUTF(data);
      }
      setTimeout(() => {
        messageReceiveUserCount(token)
      }, 3000);
    }
  }
  
//******************************************************************************************** */
  async function chatHistory(requestData) {
    if (connection.connected) {
      let result = await chatController.chatHistoryWebSocket(requestData);
      if (result) {
        var data = JSON.stringify(result);
        connection.sendUTF(data);
      }
      setTimeout(() => {
        chatHistory(requestData)
      }, 3000);
    }
  }

  // //******************************************************************************************/
  connection.on('close', function (reasonCode, description) {
    console.log(new Date() + ' Peer ' + connection.remoteAddress + ' Client has disconnected.');
  });
  connection.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
  });
});

client.on('connect', function (connection) {
  console.log(new Date() + ' WebSocket Client Connected');
  connection.on('error', function (error) {
    console.log("Connection Error: " + error.toString());
  });
  connection.on('close', function () {
    console.log('echo-protocol Connection Closed');
  });

});
// nodepune-experienced.mobiloitte.io/
// client.connect('ws://localhost:2020/',);

client.connect(config.get("webSocketUrl"), '');

export default ExpressServer;
function originIsAllowed(origin) {
  return true;
}



