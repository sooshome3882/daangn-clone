import { CreateChatRoomDto } from './dto/createChatRoom.dto';
import { ChatRoom } from 'src/chats/chatRoom.entity';
import { CreateChatDto } from './dto/createChat.dto';
import { Chat } from 'src/chats/chat.entity';
import { ChatService } from './chat.service';
import { UseGuards, ParseIntPipe } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/users/guards/jwtAuth.guard';
import { GetUser } from 'src/users/validations/getUser.decorator';
import { User } from 'src/users/user.entity';

@Resolver()
@UseGuards(JwtAuthGuard)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  // 채팅방 생성 ✔︎
  @Mutation(() => ChatRoom)
  createChatRoom(@GetUser() user: User, @Args('createChatRoomDto') createChatRoomDto: CreateChatRoomDto): Promise<ChatRoom> {
    return this.chatService.createChatRoom(user, createChatRoomDto);
  }

  // 채팅 작성 ✔︎
  @Mutation(() => Chat)
  createChat(@GetUser() user: User, @Args('createChatDto') createChatDto: CreateChatDto): Promise<Chat> {
    return this.chatService.createChat(user, createChatDto);
  }

  // 채팅방 리스트 조회 ✔︎
  @Query(() => [ChatRoom])
  getChatRoomList(@GetUser() user: User, @Args('postId', ParseIntPipe) postId: number) {
    return this.chatService.getChatRoomList(user, postId);
  }

  // 특정 채팅방의 채팅 조회 ✔︎
  @Query(() => [Chat])
  getChatListOfChatRoom(@GetUser() user: User, @Args('chatRoomId') chatRoomId: number): Promise<Chat[]> {
    return this.chatService.getChatListOfChatRoom(user, chatRoomId);
  }
}
