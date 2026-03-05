import { Outlet } from "react-router-dom";

const AboutUs = () => {
  return (
    <div>
      <h1>About Us</h1>

      {/* This is VERY IMPORTANT */}
      <Outlet />
    </div>
  );
};

export default AboutUs;