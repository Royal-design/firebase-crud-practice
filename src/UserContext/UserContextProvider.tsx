import { createContext, ReactElement, useEffect, useState } from "react";
import { auth } from "../Config/Firebase";
import { User } from "firebase/auth";
import { db } from "../Config/Firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query
} from "firebase/firestore";
import { toast } from "react-toastify";

type UserType = {
  email: string;
  firstName: string;
  lastName: string;
  photo?: string;
};

export type PropsType = {
  title: string;
  date: string;
  id: string;
  author: string;
  image: string;
  imagePath: string;
  images: string[];
  imagesPath: string[];
};
export type DataType = PropsType[];

type UseUserType = {
  user: User | null;
  userData: UserType | null;
  setBooks: React.Dispatch<React.SetStateAction<DataType>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
  books: DataType;
  dataLoading: boolean;
  getData: () => void;
};

const useUserState: any = {};

export const UserStateContext = createContext<UseUserType>(useUserState);
type ChildrenType = {
  children?: ReactElement;
};

export const UserContextProvider = ({ children }: ChildrenType) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [books, setBooks] = useState<DataType>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const getUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setUser(user);
          const docRef = doc(db, "users", user.uid);
          const data = await getDoc(docRef);
          setUserData(data.data() as UserType);
          setLoading(false);
        } catch (error: any) {
          console.error(error?.message);
        }
      } else {
        console.log("No user found!💥");
      }
    });
  };

  const getData = async () => {
    try {
      const docRef = query(
        collection(db, "books"),
        orderBy("createdAt", "desc")
      );
      // const unsubscribe = onSnapshot(docRef, (snapshot) => {
      //   const results = snapshot.docs.map((doc) => ({
      //     id: doc.id,
      //     ...doc.data()
      //   })) as DataType;
      //   setBooks(results);
      // });

      const data = await getDocs(docRef);

      const result = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      })) as DataType;
      setBooks(result);
      setDataLoading(false);
      // return () => unsubscribe();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.log("unknown error");
      }
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("User logged out successfully!");
      setUser(null);
      setLoading(true);
      toast.success("User logged out successfuly!");
    } catch (error) {}
  };
  return (
    <UserStateContext.Provider
      value={{
        user,
        userData,
        loading,
        handleLogout,
        setLoading,
        dataLoading,
        books,
        setBooks,
        getData
      }}
    >
      {children}
    </UserStateContext.Provider>
  );
};
