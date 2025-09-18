import { useEffect, useRef, useState } from "react";

interface Message {
  type: string;
  payload: {
    username?: string;
    message: string;
    timestamp?: string;
    userCount?: number;
  };
}

interface ChatProps {
  roomId: string;
  username: string;
  onLeaveRoom: () => void;
}

const Chat: React.FC<ChatProps> = ({ roomId, username, onLeaveRoom }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [userCount, setUserCount] = useState(1);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: roomId,
            username: username,
          },
        })
      );
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);

      if (data.payload.userCount) {
        setUserCount(data.payload.userCount);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [roomId, username]);

  const sendMessage = () => {
    if (currentMessage.trim() && wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message: currentMessage.trim(),
          },
        })
      );
      setCurrentMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg h-[600px] bg-black border-4 border-gray-800 shadow-2xl rounded-xl shadow-2xl flex flex-col">

        <div className="bg-black text-white px-6 py-4 rounded-t-lg border-b-2 border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">Room Code: {roomId}</h2>
              <p className="text-sm text-gray-300">Users: {userCount}</p>
            </div>
            <button
              onClick={onLeaveRoom}
              className="bg-white text-black px-3 py-1 rounded font-semibold hover:bg-gray-200 transition-colors text-sm"
            >
              Leave
            </button>
          </div>
        </div>


        <div className="flex-1 overflow-y-auto p-4 bg-black">
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div key={index}>
                {msg.type === "message" && (
                  <div
                    className={`flex ${
                      msg.payload.username === username
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-md ${
                        msg.payload.username === username
                          ? "bg-white text-black rounded-br-none"
                          : "bg-gray-700 text-white rounded-bl-none"
                      }`}
                    >
                      <p className="font-medium text-xs opacity-70 mb-1">
                        {msg.payload.username}
                      </p>
                      <p className="break-words text-md">{msg.payload.message}</p>
                    </div>
                  </div>
                )}

                {(msg.type === "userJoined" || msg.type === "userLeft") && (
                  <div className="text-center">
                    <p className="text-gray-400 text-xs bg-gray-900 rounded-full px-3 py-1 inline-block">
                      {msg.payload.message}
                    </p>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>


        <div className="bg-black p-4 rounded-b-lg border-t-2 border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-white bg-black
               text-sm"
              maxLength={500}
            />
            <button
              onClick={sendMessage}
              disabled={!currentMessage.trim()}
              className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
