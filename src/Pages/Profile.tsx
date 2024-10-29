import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Image,
  Text
} from "@chakra-ui/react";
import UseUserContext from "../UserContext/UseUserContext";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { loading, userData, handleLogout } = UseUserContext();
  const navigate = useNavigate();

  return (
    <Box>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Flex className="items-center justify-center h-screen">
          <Card className="w-[30rem]">
            <CardHeader className="flex  flex-col items-center">
              {userData?.photo && (
                <Image
                  src={userData?.photo}
                  borderRadius={"100%"}
                  boxSize={"5rem"}
                />
              )}

              <Heading size={"md"}>Welcome {userData?.firstName}</Heading>
            </CardHeader>
            <CardBody>
              <Text>Email: {userData?.email}</Text>
              <Text>First Name: {userData?.firstName}</Text>
              <Text>Last Name: {userData?.lastName}</Text>
            </CardBody>
            <CardFooter>
              <Button
                type="submit"
                onClick={() => {
                  handleLogout();
                  navigate("/login");
                }}
              >
                Logout
              </Button>
            </CardFooter>
          </Card>
        </Flex>
      )}
    </Box>
  );
};
