export interface PrivateMessage {
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: string;
}

export interface SendPrivateMessage {
  recipientId: string;
  message: string;
}
