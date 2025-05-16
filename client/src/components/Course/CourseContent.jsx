import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MiniDrawer from "../Home/Minidrawer";

const CourseContent = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [purchasedTitles, setPurchasedTitles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [allRes, purchasedRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_SERVER_URL}/api/courses/all`),
          axios.get(`${process.env.REACT_APP_SERVER_URL}/api/courses/purchased`, {
            withCredentials: true,
          }),
        ]);

        setAllCourses(allRes.data);
        setPurchasedTitles(purchasedRes.data); // array of course titles (strings)
      } catch (error) {
        console.error("Error fetching courses:", error);
        navigate('/');
      }
    };

    fetchCourses();
  }, [navigate]);

  // Filter only the purchased courses
  const purchasedCourses = allCourses.filter(course =>
    purchasedTitles.includes(course.title)
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen flex flex-row">
      <MiniDrawer />
      <div className="p-6 w-full flex flex-col">
        <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-blue-100 drop-shadow tracking-tight animate-fade-in z-20 relative">
          Your Courses
        </h1>
        {purchasedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 z-10">
            {purchasedCourses.map((course) => (
              <div
                key={course._id}
                className="bg-gradient-to-br from-[#232b3b] to-[#1e293b] rounded-3xl shadow-2xl border border-blue-700/40 hover:border-blue-500 transition-all duration-200 flex flex-col overflow-hidden group hover:scale-[1.025]"
              >
                <img
                  src={
                    course.image ||
                    "https://img.freepik.com/premium-vector/chess-pieces-isolated-white-background_102902-2631.jpg"
                  }
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-3xl mb-4 border-b-2 border-blue-800 group-hover:brightness-110 transition duration-200"
                />
                <div className="flex flex-col flex-1 px-5 pb-5 gap-1">
                  <h2 className="text-xl font-bold text-blue-200 mb-1 truncate drop-shadow animate-fade-in delay-100">{course.title}</h2>
                  <p className="text-sm text-blue-300 mb-1">{course.instructor || "Anonymous"}</p>
                  <p className="text-blue-100 mb-2 flex-1 line-clamp-3">{course.description}</p>
                  <p className="font-bold text-green-400 mb-2 text-lg">₹{course.price}</p>
                  <button
                    onClick={() => navigate(`/course/${encodeURIComponent(course.title)}`)}
                    className="mt-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-xl font-semibold shadow hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
                  >
                    View Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-blue-100/80 text-lg mt-8 text-center">You have not purchased any courses yet.</p>
        )}
      </div>
    </div>
  );
};

export default CourseContent;
