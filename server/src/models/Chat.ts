import { Schema, model, Document, Types } from 'mongoose';

// ================= CHAT ROOM =================
export interface IChatRoom extends Document {
  participants: Types.ObjectId[];
  lastMessage?: {
    text: string;
    senderId: Types.ObjectId;
    senderName: string;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ChatRoomSchema = new Schema<IChatRoom>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }],
  lastMessage: {
    text: { type: String },
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    senderName: { type: String },
    timestamp: { type: Date }
  }
}, { timestamps: true });

export const ChatRoom = model<IChatRoom>('ChatRoom', ChatRoomSchema);

// ================= MESSAGE =================
export interface IMessage extends Document {
  roomId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderName: string;
  text: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  roomId: { type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true, index: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  text: { type: String, required: true, trim: true }
}, { timestamps: true });

export const Message = model<IMessage>('Message', MessageSchema);
