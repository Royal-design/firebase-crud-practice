import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Heading,
  Image,
  Text
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { Spinner } from "@chakra-ui/react";
import UseUserContext from "../UserContext/UseUserContext";

const Home = () => {
  const { books, dataLoading } = UseUserContext();
  const navigate = useNavigate();

  console.log(books);
  console.log(dataLoading);
  if (dataLoading)
    return (
      <Box className="flex mt-4 justify-center">
        <Spinner />
      </Box>
    );
  return (
    <Box className="mt-4">
      <Grid gap={"1rem"} templateColumns="repeat(auto-fit, minmax(400px, 1fr))">
        {books &&
          books.map((book) => (
            <Card
              className="relative"
              key={book.id}
              onClick={() => navigate(`/book/${book.id}`)}
              width={"20rem"}
              height={"20rem"}
            >
              <Image
                className=""
                zIndex={"0"}
                src={book.image}
                height={"100%"}
                width={"100%"}
              />
              <Box
                backdropFilter="blur(2px)"
                width={"100%"}
                position={"absolute"}
                zIndex={"1"}
                height={"100%"}
              >
                <CardHeader>
                  <Heading size={"md"}>{book.title}</Heading>
                </CardHeader>
                <CardBody>
                  <Text className="z-1">{book.author}</Text>
                </CardBody>
                <CardFooter>{book.date}</CardFooter>
              </Box>
            </Card>
          ))}
      </Grid>
    </Box>
  );
};

export default Home;
