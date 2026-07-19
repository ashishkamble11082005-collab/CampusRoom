import { Router, Response } from 'express';
import { ChatRoom } from '../models/Chat';
import { Message } from '../models/Chat';
import { User } from '../models/User';
import { protect, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// ================= GET CONVERSATIONS LIST =================
router.get('/rooms', protect, async (req: AuthRequest, res: Response) => {
  try {
    const rooms = await ChatRoom.find({
      participants: req.user?.id
    })
      .populate('participants', 'name email role')
      .sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, count: rooms.length, rooms });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= START OR GET CONVERSATION ROOM =================
router.post('/rooms', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ success: false, message: 'Target user ID is required' });
    }

    // Verify target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Target user not found' });
    }

    const currentUserId = req.user?.id;

    // Check if room already exists
    let room = await ChatRoom.findOne({
      participants: { $all: [currentUserId, targetUserId] }
    }).populate('participants', 'name email role');

    if (!room) {
      room = new ChatRoom({
        participants: [currentUserId, targetUserId]
      });
      await room.save();
      room = await ChatRoom.findById(room._id).populate('participants', 'name email role');
    }

    return res.status(200).json({ success: true, room });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= GET ROOM MESSAGES =================
router.get('/rooms/:roomId/messages', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { roomId } = req.params;

    // Verify user is participant in this room
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Chat room not found' });
    }

    const isParticipant = room.participants.some(p => p.toString() === req.user?.id);
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Access denied. You are not a participant in this conversation.' });
    }

    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
    return res.status(200).json({ success: true, count: messages.length, messages });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= SEND MESSAGE =================
router.post('/rooms/:roomId/messages', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { roomId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    // Verify room and participant
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Chat room not found' });
    }

    const isParticipant = room.participants.some(p => p.toString() === req.user?.id);
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Access denied. Cannot send message.' });
    }

    const newMessage = new Message({
      roomId: room._id,
      senderId: req.user?.id,
      senderName: req.user?.name || 'User',
      text
    });

    await newMessage.save();

    // Update lastMessage on ChatRoom document to push it to the top of the user inbox list
    room.lastMessage = {
      text,
      senderId: req.user?.id as any,
      senderName: req.user?.name || 'User',
      timestamp: new Date()
    };
    await room.save();

    return res.status(201).json({ success: true, message: newMessage });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
