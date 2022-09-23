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

const jwtConfig: any = config.get('jwt');

@WebSocketGateway(3000, {
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  @WebSocketServer() nsp: Namespace;
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('checkAuth')
  checkAuth(socket: Socket, next: any) {
    const token = socket.handshake.auth.token;
    if (!token) {
      throw next(new AuthenticationError('로그인을 해주세요'));
    }
    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
      if (err) {
        return next(new AuthenticationError('로그인을 해주세요'));
      }
      next();
    });
  }

  afterInit() {
    this.nsp.adapter.on('create-room', room => {
      console.log(`"Room:${room}"이 생성되었습니다.`);
    });
    this.nsp.adapter.on('join-room', (room, id) => {
      console.log(`"Socket:${id}"이 "Room:${room}"에 참여하였습니다.`);
    });
    this.nsp.adapter.on('leave-room', (room, id) => {
      console.log(`"Socket:${id}"이 "Room:${room}"에서 나갔습니다.`);
    });
    this.nsp.adapter.on('delete-room', roomName => {
      console.log(`"Room:${roomName}"이 삭제되었습니다.`);
    });
    console.log('웹소켓 서버 초기화 ✅');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log(`${socket.id} 소켓 연결`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log(`${socket.id} 소켓 연결 ❌`);
  }
}
