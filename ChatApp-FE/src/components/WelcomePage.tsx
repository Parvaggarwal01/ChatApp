import { useState } from "react";

interface WelcomePageProps {
  onJoinRoom: (roomId: string, username: string) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onJoinRoom }) => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  const generateRoomId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateRoom = () => {
    if (!username.trim()) {
      alert("Please enter your name");
      return;
    }
    const newRoomId = generateRoomId();
    onJoinRoom(newRoomId, username.trim());
  };

  const handleJoinRoom = () => {
    if (!username.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!roomId.trim()) {
      alert("Please enter a room code");
      return;
    }
    onJoinRoom(roomId.trim().toUpperCase(), username.trim());
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-black text-white rounded-lg shadow-2xl p-8 w-full max-w-md border-4 border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">
            Real Time Chat
          </h1>
          <p className="text-white text-sm">
            temporary room that expires after both users exit
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-white mb-2"
            >
              Enter Your Name
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name..."
              className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 text-black bg-white font-medium"
              maxLength={20}
            />
          </div>

          <div className="space-y-4">
            <button
              onClick={handleCreateRoom}
              className="w-full bg-white text-black py-3 px-6 rounded-lg font-semibold border-2 border-black"
            >
              Create New Room
            </button>

            <div className="text-center">
              <span className="text-white text-sm">or</span>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="Enter Room Code"
                className="w-full px-4 py-3 border-2 border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 text-black bg-white font-medium text-center tracking-widest"
                maxLength={6}
              />
              <button
                onClick={handleJoinRoom}
                className="w-full bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 border-2 border-black"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
