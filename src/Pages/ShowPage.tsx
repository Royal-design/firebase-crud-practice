import { Link, useParams } from "react-router-dom";
import UseUserContext from "../UserContext/UseUserContext";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Text
} from "@chakra-ui/react";
import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../Config/Firebase";
import { toast } from "react-toastify";
import { FormEvent } from "react";
import { deleteObject, ref } from "firebase/storage";
const ShowPage = () => {
  const navigate = useNavigate();
  const { books, setBooks } = UseUserContext();
  const { id } = useParams();
  const book = books.find((book) => book.id === id);
  console.log(id);
  console.log(book);

  const handleDelete = async (e: FormEvent, id: string | undefined) => {
    e.preventDefault();
    if (id) {
      if (book?.imagesPath) {
        for (const imagePath of book.imagesPath) {
          const imageRef = ref(storage, imagePath);
          await deleteObject(imageRef);
        }
      }
      if (book?.imagePath) {
        const imageRef = ref(storage, book.imagePath);
        await deleteObject(imageRef);
      }
      const docRef = doc(db, "books", id);
      await deleteDoc(docRef);
      const filteredBook = books.filter((book) => book.id !== id);
      setBooks(filteredBook);
      toast.success("Book deleted successfully!");
      navigate("/");
    }
  };

  return (
    <Card>
      <CardHeader>
        <Heading size={"md"}>{book?.title}</Heading>
      </CardHeader>
      <CardBody>
        <Text>{book?.author}</Text>
      </CardBody>
      <CardFooter className="flex justify-between">
        <Text>{book?.date}</Text>
        <Flex className="gap-4">
          <Link to={`/book/${book?.id}/edit`}>
            <Button>Edit</Button>
          </Link>
          <Button
            type="submit"
            onClick={(e) => handleDelete(e, book?.id)}
            colorScheme="red"
          >
            Delete
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default ShowPage;
