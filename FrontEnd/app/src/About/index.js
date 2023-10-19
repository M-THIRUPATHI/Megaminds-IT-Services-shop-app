import Header from "../Header";
import "./index.css";

const About = () => {
  return (
    <>
      <Header />
      <div className="about-container">
        <div className="about-content">
          <h1 className="about-heading">About us</h1>
          <p className="about-description">
            Nuturemite is a website that offers credible information, which
            helps you in making healthy eating choices. It serves as a gateway
            and provides reliable information on nutrition, healthy eating,
            physical activity and food safety for consumers. Our website
            receives guidance from professionals like doctors, nutritionist,
            dietitians, fitness gurus and the best nutrition counsellors, who
            work as a team for making the healthy society
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
