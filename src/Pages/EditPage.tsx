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
  Input
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { ChangeEvent, FormEvent, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UseUserContext from "../UserContext/UseUserContext";
import { getDoc, serverTimestamp } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../Config/Firebase";
import { DataType } from "../UserContext/UserContextProvider";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const EditPage = () => {
  const { books, setBooks, getData } = UseUserContext();
  const { id } = useParams();
  const book = books.find((book) => book.id === id);

  const navigate = useNavigate();
  const [newData, setNewData] = useState({
    author: book?.author,
    title: book?.title,
    date: book?.date,
    createdAt: serverTimestamp(),
    image: "" as unknown as File,
    images: [] as unknown as File[]
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imagesPreview, setImgesPreview] = useState<string[]>([]);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    id: string | undefined
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        //delete old multiple images
        if (book?.imagesPath) {
          for (const imagePath of book.imagesPath) {
            const oldMultipleImageRef = ref(storage, imagePath);
            await deleteObject(oldMultipleImageRef);
          }
        }
        //upload new multiple images
        const imagesUrl: string[] = [];
        const imagesPath: string[] = [];

        for (const image of newData.images) {
          const imageFile = image as File;
          const imagePath = `multipleimages/${uuidv4()}.jpg`;
          const imageRef = ref(storage, imagePath);
          await uploadBytes(imageRef, imageFile);
          const url = await getDownloadURL(imageRef);
          imagesUrl.push(url);
          imagesPath.push(imagePath);
        }

        //delete old image
        if (book?.imagePath) {
          const oldImageRef = ref(storage, book.imagePath);
          await deleteObject(oldImageRef);
        }
        //upload new Image
        const imageFile = newData.image as File;
        const newImagePath = `images/${uuidv4()}.jpg`;
        const newImageRef = ref(storage, newImagePath);
        await uploadBytes(newImageRef, imageFile);
        const newUrl = await getDownloadURL(newImageRef);

        //update doc
        const docRef = doc(db, "books", id);
        await updateDoc(docRef, {
          ...newData,
          imagePath: newImagePath,
          image: newUrl,
          images: imagesUrl,
          imagesPath: imagesPath,
          updatedAt: serverTimestamp()
        });
        const updatedDoc = await getDoc(docRef);
        const updatedData = updatedDoc.data();

        setBooks(
          (prevBooks) =>
            prevBooks.map((book) =>
              book.id === id ? { id, ...updatedData } : book
            ) as DataType
        );
        getData();
        setLoading(false);
        toast.success("Book updated successfully!");
        navigate("/");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unknown error");
      }
    }

    setNewData({
      author: "",
      title: "",
      date: "",
      createdAt: serverTimestamp(),
      image: "" as unknown as File,
      images: [] as unknown as File[]
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    const file = files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    setNewData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleMultipleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewData((prev) => ({ ...prev, images: files }));
    if (files) {
      const previews: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === files.length) {
            setImgesPreview(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  return (
    <Box className="flex justify-center mt-4">
      <form onSubmit={(e) => handleSubmit(e, book?.id)}>
        <Card className="max-w-lg w-[30rem]">
          <CardHeader>
            <Heading size={"md"}>Edit Page</Heading>
          </CardHeader>
          <CardBody>
            <Box className="grid gap-2">
              <Input
                type="text"
                name="title"
                value={newData.title}
                onChange={handleChange}
                placeholder="title"
              />
              <Input
                type="text"
                name="author"
                value={newData.author}
                onChange={handleChange}
                placeholder="author..."
              />
              <Input
                type="date"
                name="date"
                value={newData.date}
                onChange={handleChange}
              />
              <Input type="file" name="image" onChange={handleChange} />
              {preview ? (
                <Image src={preview} boxSize={"5rem"} />
              ) : (
                <Image src={book?.image} boxSize={"5rem"} />
              )}
              <Input
                type="file"
                multiple
                name="images"
                onChange={handleMultipleImageChange}
              />

              {imagesPreview.length > 0 ? (
                <Flex gap="1rem">
                  {imagesPreview.map((image, i) => (
                    <Image src={image} key={i} boxSize={"5rem"} />
                  ))}
                </Flex>
              ) : (
                book?.images && (
                  <Flex gap="1rem">
                    {book.images.map((image, i) => (
                      <Image
                        src={image}
                        key={i}
                        boxSize={"5rem"}
                        alt="preview"
                      />
                    ))}
                  </Flex>
                )
              )}
            </Box>
          </CardBody>
          <CardFooter>
            <Button disabled={loading} type="submit">
              {loading ? "Updating" : "Update"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Box>
  );
};

export default EditPage;
