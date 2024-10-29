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
import { db, storage } from "../Config/Firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UseUserContext from "../UserContext/UseUserContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const CreatePage = () => {
  const { setBooks, getData } = UseUserContext();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imagesPreview, setImgesPreview] = useState<string[]>([]);
  const navigate = useNavigate();
  const [data, setData] = useState({
    title: "" as string,
    author: "" as string,
    date: "" as string,
    image: "" as unknown as File,
    images: [] as unknown as File[]
  });
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      //handle multiple image upload
      const imagesUrl: string[] = [];
      const imagesPath: string[] = [];

      for (const image of data.images) {
        const imageFile = image as File;
        const imagePath = `multipleimages/${uuidv4()}.jpg`;
        const imageRef = ref(storage, imagePath);
        await uploadBytes(imageRef, imageFile);
        const url = await getDownloadURL(imageRef);
        imagesUrl.push(url);
        imagesPath.push(imagePath);
      }
      //handle image upload
      const imageFile = data.image as File;
      const imagePath = `images/${uuidv4()}.jpg`;
      const imageRef = ref(storage, imagePath);
      await uploadBytes(imageRef, imageFile);
      const url = await getDownloadURL(imageRef);

      //handle book data storage
      const docRef = collection(db, "books");
      await addDoc(docRef, {
        title: data.title,
        author: data.author,
        date: data.date,
        createdAt: serverTimestamp(),
        image: url,
        imagePath: imagePath,
        images: imagesUrl,
        imagesPath: imagesPath
      });
      setBooks((prevBooks) => [
        ...prevBooks,
        {
          id: docRef.id,
          ...data,
          createdAt: serverTimestamp(),
          image: url,
          images: imagesUrl,
          imagePath: imagePath,
          imagesPath: imagesPath
        }
      ]);
      getData();
      setLoading(false);
      toast.success("New book added successfully!");
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occured");
      }
    }
    console.log(data);
    console.log(imagesPreview);

    setData({
      title: "",
      author: "",
      date: "",
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

    setData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };
  const handleMultipleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setData((prev) => ({ ...prev, images: files }));
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
      <form onSubmit={handleSubmit}>
        <Card className="max-w-lg w-[30rem]">
          <CardHeader>
            <Heading size={"md"}>Create Page</Heading>
          </CardHeader>
          <CardBody>
            <Box className="grid gap-2">
              <Input
                type="text"
                name="title"
                value={data.title}
                onChange={handleChange}
                placeholder="title"
              />
              <Input
                type="text"
                name="author"
                value={data.author}
                onChange={handleChange}
                placeholder="author..."
              />
              <Input
                type="date"
                name="date"
                value={data.date}
                onChange={handleChange}
              />
              <Input type="file" name="image" onChange={handleChange} />
              {preview && <Image src={preview} boxSize={"5rem"} />}
              <Input
                type="file"
                multiple
                name="images"
                onChange={handleMultipleImageChange}
              />
              {imagesPreview && (
                <Flex gap="1rem">
                  {imagesPreview.map((image, i) => (
                    <Image src={image} key={i} boxSize={"5rem"} />
                  ))}
                </Flex>
              )}
            </Box>
          </CardBody>
          <CardFooter>
            <Button disabled={loading} type="submit">
              {loading ? "Creating" : "Create"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Box>
  );
};

export default CreatePage;
