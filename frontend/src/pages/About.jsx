import React from "react";
import missionImg from "../assets/mission.jpg";
import storyImg from "../assets/story.jpg";
import team1 from "../assets/team.jpg";
import sartaj from "../assets/sartaj-2.jpeg";

const About = () => {
  return (
    <div className="bg-white text-gray-800 dark:bg-slate-950 dark:text-gray-100 transition-colors duration-300">

      {/* Hero Section */}
      <section
        className="min-h-[60vh] flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${storyImg})` }}
      >
        <div className="bg-white/70 dark:bg-black/60 backdrop-blur-md p-10 rounded-2xl text-center max-w-3xl shadow-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About MyBlog
          </h1>

          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200">
            A platform built with passion to share knowledge, tutorials,
            and real-world development experience with developers.
          </p>
        </div>
      </section>
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto bg">

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Photo */}
          <div className="flex justify-center">
            <img
              src={sartaj}
              alt="Developer"
              className="w-[400px] h-[400px] object-cover rounded-2xl shadow-xl"
            />
          </div>

          {/* About + Skills */}
          <div className="space-y-6">

            <h2 className="text-3xl md:text-4xl font-bold">
              Hi 👋 I'm a Full Stack Developer
            </h2>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              I'm the developer behind this blog platform. I built this application
              from scratch using modern technologies with a focus on performance,
              clean UI, and a smooth user experience.
            </p>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              I enjoy building full-stack applications, solving real-world problems,
              and creating modern web experiences that are fast, scalable, and easy
              to use.
            </p>

            {/* Skills */}
            <div>

              <h3 className="text-xl font-semibold mb-4">
                My Skills
              </h3>

              <div className="flex flex-wrap gap-3">

                {[
                  "React.js",
                  "Node.js",
                  "Express.js",
                  "MongoDB",
                  "JavaScript",
                  "Tailwind CSS",
                  "REST APIs",
                  "JWT Authentication",
                  "Full Stack Development",
                ].map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-slate-800"
                  >
                    {skill}
                  </span>
                ))}

              </div>

            </div>

          </div>

        </div>

      </section>
      {/* Founder Section */}


      {/* Mission */}
      <section className="py-20 px-6 md:px-12 bg-gray-50 dark:bg-slate-900">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">

          <div className="md:w-1/2 space-y-6">

            <h2 className="text-3xl md:text-4xl font-bold">
              My Mission
            </h2>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              My mission is simple — to share practical knowledge and help
              developers understand modern technologies through real-world
              examples and tutorials.
            </p>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Many developers struggle to find clear and practical explanations.
              This platform focuses on making complex concepts simple,
              understandable, and easy to implement.
            </p>

          </div>

          <div className="md:w-1/2">
            <img
              src={missionImg}
              alt="Mission"
              className="rounded-2xl shadow-xl w-full object-cover"
            />
          </div>

        </div>

      </section>

      {/* Story */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">

        <div className="md:w-1/2">
          <img
            src={storyImg}
            alt="Story"
            className="rounded-2xl shadow-xl w-full object-cover"
          />
        </div>

        <div className="md:w-1/2 space-y-6">

          <h2 className="text-3xl md:text-4xl font-bold">
            The Journey
          </h2>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            This platform started as a personal idea — a place to write,
            share knowledge, and document development experiences.
          </p>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            While learning and building projects, I realized that documenting
            solutions and sharing insights could help many other developers
            facing the same challenges.
          </p>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Today, this project represents my passion for development,
            learning, and building tools that help others grow in their
            programming journey.
          </p>

        </div>

      </section>

    </div>
  );
};

export default About;