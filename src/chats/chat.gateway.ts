import { AuthenticationError } from 'apollo-server-core';
import { CreateChatDto } from './dto/createChat.dto';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';
import { User } from 'src/users/user.entity';
import { CreateChatRoomDto } from './dto/createChatRoom.dto';
import jwt from 'jsonwebtoken';
import * as config from 'config';
import { ChatRoom } from './chatRoom.entity';

const jwtConfig: any = config.get('jwt');

// let createdChatRooms: string[] = [];
let createdChatRooms = ChatRoom.find().then(chatRoom => {
  return chatRoom;
});

@WebSocketGateway(3000, {
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  //   @WebSocketServer() server: Server;
  //   @WebSocketServer() nsp: Namespace;
  //   constructor(private readonly chatService: ChatService) {}
  //   @SubscribeMessage('checkAuth')
  //   checkAuth(socket: Socket, next: any) {
  //     const token = socket.handshake.auth.token;
  //     if (!token) {
  //       throw next(new AuthenticationError('로그인을 해주세요'));
  //     }
  //     jwt.verify(token, jwtConfig.secret, (err, decoded) => {
  //       if (err) {
  //         return next(new AuthenticationError('로그인을 해주세요'));
  //       }
  //       next();
  //     });
  //   }
  //   @SubscribeMessage('create-room')
  //   handleCreateRoom(
  //     @ConnectedSocket() socket: Socket,
  //     @MessageBody() roomName: string,
  //   ) {
  //   }
  //   afterInit() {
  //     console.log('웹소켓 서버 초기화 ✅');
  //   }
  //   handleConnection(@ConnectedSocket() socket: Socket) {
  //     console.log(`${socket.id} 소켓 연결`);
  //   }
  //   handleDisconnect(@ConnectedSocket() socket: Socket) {
  //     console.log(`${socket.id} 소켓 연결 ❌`);
  //   }
  //   @SubscribeMessage('chat')
  //   handleMessage(
  //     @ConnectedSocket() socket: Socket,
  //     @MessageBody() chat: string
  //   ) {
  //     socket.broadcast.emit('chat', { userName: socket.id, chat });
  //     return { userName: socket.id, chat };
  //   }
}
