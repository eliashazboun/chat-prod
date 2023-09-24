import { useLocation, useNavigate } from "react-router-dom";

const ChatroomSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, admin,autoUsers } = location.state;

  const handleClick = (roomName) => {
    navigate("/main", {
      state: { collectionDB: roomName, user: user, admin: admin, autoUsers:autoUsers },
    });
  };

  return (
    <div>
      <h1 className="text-center mb-5"> Select your room.</h1>
      <button
        onClick={() => handleClick(import.meta.env.VITE_POSTS)}
        className="w-full h-20 text-2xl mb-10 text-yellow-500 font-bold font-mono"
      >
        Primary Room
      </button>

      <button
        onClick={() => handleClick("otherPosts")}
        className="w-full h-20 text-2xl mb-10 text-blue-500 font-bold font-mono"
      >
        Fun Room
      </button>
    </div>
  );
};

export default ChatroomSelection;
