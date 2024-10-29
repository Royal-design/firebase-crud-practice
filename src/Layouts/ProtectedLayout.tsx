import { Navigate, Outlet } from "react-router-dom";
import UseUserContext from "../UserContext/UseUserContext";
import { useEffect } from "react";

const ProtectedLayout = () => {
  const { user, loading, setLoading } = UseUserContext();
  useEffect(() => {
    setTimeout(() => {
      if (!user) {
        setLoading(false);
      }
    }, 1000);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedLayout;
