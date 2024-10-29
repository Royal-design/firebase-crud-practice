import "./login.scss";
import { auth, googleProvider } from "../../Config/Firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../Config/Firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User loged in successfully");
      toast.success("User logged in successfully!");
      navigate("/profile");
    } catch (error) {
      console.error(error);
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      const user = auth.currentUser;
      console.log(user);

      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          firstName: user.displayName,
          lastName: "",
          email: user.email,
          photo: user.photoURL
        });
        toast.success("User logged in successfully!");
        navigate("/profile");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="form_container">
        <div className="title_container">
          <p className="title">Login to your Account</p>
          <span className="subtitle">
            Get started with our app, just create an account and enjoy the
            experience.
          </span>
        </div>
        <br />
        <div className="input_container">
          <label className="input_label" htmlFor="email_field">
            Email
          </label>
          <Mail className="icon" strokeWidth={1} />
          <input
            placeholder="name@mail.com"
            title="Inpit title"
            name="input-name"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            className="input_field"
            id="email_field"
          />
        </div>
        <div className="input_container">
          <label className="input_label" htmlFor="password_field">
            Password
          </label>
          <Lock strokeWidth={1} className="icon" />
          <input
            placeholder="Password"
            title="Inpit title"
            name="input-name"
            type="password"
            className="input_field"
            id="password_field"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          onClick={handleSignIn}
          title="Sign In"
          type="submit"
          className="sign-in_btn"
        >
          <span>Sign In</span>
        </button>

        <div className="separator">
          <hr className="line" />
          <span>Or</span>
          <hr className="line" />
        </div>
        <button
          onClick={handleGoogleSignIn}
          title="Sign In"
          type="submit"
          className="sign-in_ggl"
        >
          <svg
            height="18"
            width="18"
            viewBox="0 0 32 32"
            // xlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <path
                d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                id="A"
              />
            </defs>
            <clipPath id="B"></clipPath>
            <g transform="matrix(.727273 0 0 .727273 -.954545 -1.45455)">
              <path fill="#fbbc05" clipPath="url(#B)" d="M0 37V11l17 13z" />
              <path
                fill="#ea4335"
                clipPath="url(#B)"
                d="M0 11l17 13 7-6.1L48 14V0H0z"
              />
              <path
                fill="#34a853"
                clipPath="url(#B)"
                d="M0 37l30-23 7.9 1L48 0v48H0z"
              />
              <path
                fill="#4285f4"
                clipPath="url(#B)"
                d="M48 48L17 24l-4-3 35-10z"
              />
            </g>
          </svg>
          <span>Sign In with Google</span>
        </button>

        <Text>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 text-sm hover:underline duration-100"
          >
            Sign up
          </Link>
        </Text>
      </div>
    </div>
  );
};

export default Login;
