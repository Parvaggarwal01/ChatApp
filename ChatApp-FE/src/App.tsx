import { useState } from "react";
import WelcomePage from "./components/WelcomePage";
import Chat from "./components/Chat";

function App() {
  const [currentView, setCurrentView] = useState<"welcome" | "chat">("welcome");
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const handleJoinRoom = (newRoomId: string, newUsername: string) => {
    setRoomId(newRoomId);
    setUsername(newUsername);
    setCurrentView("chat");
  };

  const handleLeaveRoom = () => {
    setCurrentView("welcome");
    setRoomId("");
    setUsername("");
  };

  return (
    <div className="font-pixelify">
      {currentView === "welcome" ? (
        <WelcomePage onJoinRoom={handleJoinRoom} />
      ) : (
        <Chat
          roomId={roomId}
          username={username}
          onLeaveRoom={handleLeaveRoom}
        />
      )}
    </div>
  );
}

export default App;
