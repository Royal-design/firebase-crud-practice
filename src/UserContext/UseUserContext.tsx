import { useContext } from "react";
import { UserStateContext } from "./UserContextProvider";

const UseUserContext = () => {
  return useContext(UserStateContext);
};

export default UseUserContext;
