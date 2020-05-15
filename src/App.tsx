import React, { FunctionComponent } from 'react';
import './App.css';

const mockAvatar = 'https://s.cn.bing.net/th?id=OJ.Fp4ZQH55LwfXFA&w=75&h=75&c=8&pid=MSNJVFeeds'
const currentUserId = 0


//消息类型 图片|文本
type MessageType = 'image' | 'text'
//消息来源 用户|系统
type MessageSource = 'user' | 'system'


type MessageRendererMap<T extends { [key in MessageType]?: Message }> = {
  [key in MessageType]?: FunctionComponent<T[key]>
}
interface MessageBase {
  id: number,
  type: MessageType,
  source: MessageSource
}
interface UserMessage extends MessageBase {
  type: 'image' | 'text',
  avatar: string,
  source: 'user',
  userId: number
}
interface UserImageMessage extends UserMessage {
  type: 'image',
  imageUrl: string
}
interface UserTextMessage extends UserMessage {
  type: 'text',
  text: string
}

interface SystemMessage extends MessageBase {
  source: 'system',
}
interface SystemTextMessage extends SystemMessage {
  type: 'text',
  text: string
}

type Message = UserImageMessage | UserTextMessage | SystemTextMessage

type UserMessageRendererMap = MessageRendererMap<{
  image: UserImageMessage,
  text: UserTextMessage,
}>

type SystemMessageRendererMap = MessageRendererMap<{
  text: SystemTextMessage
}>

const MessageContent: FunctionComponent<Message> = props => {
  return (
    <div className={`message__content --${props.source}-${props.type}`}>
      {props.children}
    </div>
  )
}


const UserMessageWrapper: FunctionComponent<UserImageMessage | UserTextMessage> = props => {
  const reverse = props.userId !== currentUserId
  return (
    <div className={`message --${props.source} ${reverse ? '--reverse' : ''}`}>
      <img className="message__user-avatar" src={props.avatar} alt="" />
      <MessageContent {...props}>
        {props.children}
      </MessageContent>
    </div>
  )
}


const SystemMessageWrapper: FunctionComponent<SystemTextMessage> = props => {
  return (
    <div className={`message --${props.source}`}>
      <MessageContent {...props}>
        {props.children}
      </MessageContent>
    </div>
  )
}


//用户消息

const userMessageRendererMap: UserMessageRendererMap = {
  image: props => {
    return (
      <UserMessageWrapper {...props}>
        <img src={props.imageUrl} alt="" />
      </UserMessageWrapper>
    )
  },
  text: props => {
    return (
      <UserMessageWrapper {...props}>
        {props.text}
      </UserMessageWrapper>
    )
  }
}

//系统消息

const systemMessageRendererMap: SystemMessageRendererMap = {
  text: props => {
    return (
      <SystemMessageWrapper {...props}>
        <p>
          {props.text}
        </p>
      </SystemMessageWrapper>
    )
  }
}

//不支持的类型
const UnknownMessageRenderer: FunctionComponent<Message> = props => {
  return (
    <div className="message --unknown">
      <p>
        不支持的类型
      </p>
    </div>
  )
}
const messageRendererMap = {
  system: systemMessageRendererMap,
  user: userMessageRendererMap
}
const MessageItem:FunctionComponent<Message>= props => {
  const Renderer = messageRendererMap[props.source] && messageRendererMap[props.source][props.type]
  if (Renderer) {
    return (
      <Renderer {...(props as any)}></Renderer>
    )
  }
  return <UnknownMessageRenderer {...props}></UnknownMessageRenderer>
}

const MessageList: FunctionComponent<{ messages: Message[] }> = props => {
  return (
    <ul className="message-list">
      {props.messages.map(m => {
        return (
          <li key={m.id} >
            <MessageItem  {...m}></MessageItem>
          </li>
        )
      })}
    </ul>
  );
}
const App = () => {
  const messageData: Message[] = [
    {
      type: 'image',
      source: 'user',
      imageUrl: 'https://tse1-mm.cn.bing.net/th?id=OIP.9YSUJy-HumgTQz8HsVtauwHaE5&w=247&h=160&c=8&rs=1&qlt=90&pid=3.1&rm=2',
      avatar: mockAvatar,
      userId: 0,
      id: 0
    },
    {
      type: 'text',
      source: 'user',
      text: 'user message user message user message user message user message user message user message user message user message user message ',
      avatar: mockAvatar,
      userId: 1,
      id: 1
    },
    {
      type: 'text',
      source: 'system',
      text: 'system message',
      id: 2
    },
    {
      type: 'text',
      source: 'system',
      text: 'system message',
      id: 3
    },
    {
      type: 'text',
      source: 'system',
      text: 'system message',
      id: 4
    },
    {
      type: 'image',
      source: 'user',
      imageUrl: 'https://tse1-mm.cn.bing.net/th?id=OIP.9YSUJy-HumgTQz8HsVtauwHaE5&w=247&h=160&c=8&rs=1&qlt=90&pid=3.1&rm=2',
      avatar: mockAvatar,
      userId: 0,
      id: 5
    },
    {
      type: 'text',
      source: 'user',
      text: 'user message user message user message user message user message user message user message user message user message user message ',
      avatar: mockAvatar,
      userId: 1,
      id: 6
    },
    {
      //@ts-ignore
      type: 'unknown',
      source: 'user',
      text: 'user message user message user message user message user message user message user message user message user message user message ',
      avatar: mockAvatar,
      userId: 1,
      id: 7
    },
  ]
  return (
    <MessageList messages={messageData}></MessageList>
  )
}
export default App;
