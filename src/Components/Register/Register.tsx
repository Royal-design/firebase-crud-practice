import { Box } from "@chakra-ui/react";
import "./register.scss";
import { Link } from "react-router-dom";
import { FormEventHandler, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Config/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../Config/Firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          firstName: firstName,
          lastName: lastName,
          email: user.email,
          photo: ""
        });
      }
      toast.success("User Registered Successfully!");
      console.log("user registered successfully!");
      navigate("/login");
    } catch (error: any) {
      console.error(error.message);
      toast.success(error.message, { position: "top-right" });
    }
  };

  return (
    <Box className="flex items-center h-screen justify-center">
      <form className="form" onSubmit={handleRegister}>
        <p className="title">Register </p>
        <p className="message">Signup now and get full access to our app. </p>

        <label>
          <input
            required
            placeholder=""
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            className="input"
          />
          <span>Firstname</span>
        </label>

        <label>
          <input
            required
            placeholder=""
            type="text"
            className="input"
            onChange={(e) => setLastName(e.target.value)}
          />
          <span>Lastname</span>
        </label>

        <label>
          <input
            required
            placeholder=""
            type="email"
            className="input"
            onChange={(e) => setEmail(e.target.value)}
          />
          <span>Email</span>
        </label>

        <label>
          <input
            required
            placeholder=""
            type="password"
            className="input"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>Password</span>
        </label>

        <button type="submit" className="submit">
          Submit
        </button>
        <p className="signin">
          Already have an acount ? <Link to="/login">Signin</Link>
        </p>
      </form>
    </Box>
  );
};
