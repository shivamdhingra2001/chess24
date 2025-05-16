import { useFormik } from "formik";
import MiniDrawer from "../Home/Minidrawer";
import { Chessboard } from "react-chessboard";
import TimeControls from "./TimeControls";
import { useContext, useState } from "react";
import FIndingGame from "./FIndingGame";
import SelectFriend from "./SelectFriend";
import { UserDetailsContext } from "../Authentication/AuthRoute";

const initialValues = {
  hours: 0,
  minutes: 3,
  seconds: 0,
  increment: 2,
};
function Play() {
  const { userDetails } = useContext(UserDetailsContext);
  const [searchingGame, setSearchingGame] = useState(false);
  const [playVS, setplayVS] = useState("Random");
  const [opponentId, setOpponentId] = useState(null);
  const handleCancelClick = () => {
    setSearchingGame(false);
    setOpponentId(null);
  };
  const { values, handleBlur, handleChange, handleSubmit, errors } = useFormik({
    initialValues: initialValues,
    // validationSchema: signInSchema,
    onSubmit: (values) => {
      setSearchingGame(true);
      console.log(values);
    },
  });
  return (
    <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#2563eb] w-full min-h-screen flex flex-col">
      <MiniDrawer />
      <div className="flex flex-col md:flex-row w-full items-center justify-center gap-6 px-4 py-8 sm:py-16 md:py-28">
        {/* Time Controls Card for Small Screens */}
        <div className="flex flex-col w-full sm:w-11/12 md:hidden max-w-md rounded-2xl border-2 border-blue-700 shadow-lg bg-gradient-to-br from-[#181f2a] to-[#232b3b] items-center justify-center p-4 mt-8">
          {searchingGame ? (
            playVS === "Friend" && !opponentId ? (
              <SelectFriend setOpponentId={setOpponentId} />
            ) : (
              <FIndingGame
                userDetails={userDetails}
                values={values}
                toggle={handleCancelClick}
              />
            )
          ) : (
            <TimeControls
              values={values}
              handleBlur={handleBlur}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              errors={errors}
              item={playVS}
              setItem={setplayVS}
            />
          )}
        </div>
        {/* Chessboard Card */}
        <div className="flex flex-col w-full sm:w-11/12 md:w-1/2 max-w-md md:max-w-2xl aspect-square rounded-2xl border-2 border-blue-700 shadow-lg bg-gradient-to-br from-[#181f2a] to-[#232b3b] p-4 items-center justify-center">
          <Chessboard
            customDarkSquareStyle={{ backgroundColor: "#202d29" }}
            customLightSquareStyle={{ backgroundColor: "#334155" }}
            boardStyle={{
              borderRadius: "1rem",
              boxShadow: "0 4px 24px 0 rgba(37,99,235,0.10)",
            }}
          />
        </div>
        {/* Time Controls Card for Medium and Larger Screens */}
        <div className="hidden md:flex flex-col w-full sm:w-11/12 md:w-1/2 max-w-md md:max-w-2xl aspect-square rounded-2xl border-2 border-blue-700 shadow-lg bg-gradient-to-br from-[#181f2a] to-[#232b3b] items-center justify-center p-4">
          {searchingGame ? (
            playVS === "Friend" && !opponentId ? (
              <SelectFriend setOpponentId={setOpponentId} />
            ) : (
              <FIndingGame
                userDetails={userDetails}
                values={values}
                toggle={handleCancelClick}
              />
            )
          ) : (
            <TimeControls
              values={values}
              handleBlur={handleBlur}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              errors={errors}
              item={playVS}
              setItem={setplayVS}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Play;
