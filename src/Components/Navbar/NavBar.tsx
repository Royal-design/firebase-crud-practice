import { Box, Button, Flex } from "@chakra-ui/react";
import { Link, NavLink } from "react-router-dom";
import UseUserContext from "../../UserContext/UseUserContext";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { user, handleLogout } = UseUserContext();
  const navigate = useNavigate();
  return (
    <div className="h-[4rem] shadow-md">
      <Flex className="items-center h-full justify-between gap-2 px-4">
        <Box className="flex gap-4">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </Box>
        <Box>
          {user ? (
            <Flex className="gap-4">
              <Button
                rounded={"2rem"}
                onClick={() => {
                  handleLogout();
                  navigate("/login");
                }}
              >
                Sign Out
              </Button>
              <Link to="/create">
                <Button rounded={"2rem"}>Create</Button>
              </Link>
            </Flex>
          ) : (
            <Flex className="gap-4">
              <Link to="/login">
                <Button rounded={"2rem"}>Sign in</Button>
              </Link>
              <Link to="/register">
                <Button rounded={"2rem"}>Register</Button>
              </Link>
            </Flex>
          )}
        </Box>
      </Flex>
    </div>
  );
};

export default NavBar;
