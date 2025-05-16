import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseDetail = () => {
  const { title } = useParams(); // from URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/courses/all`);
        const matched = res.data.find(c => c.title === title);
        if (!matched) {
          navigate('/courses');
        } else {
          setCourse(matched);
        }
      } catch (err) {
        console.error('Failed to fetch course:', err);
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [title, navigate]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400 border-solid mx-auto" />
    </div>
  );

  if (!course) return <p className="p-6 text-center text-xl text-blue-400">Course not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex flex-col items-center py-10 px-4 animate-fade-in">
      <div className="w-full max-w-3xl bg-white bg-opacity-10 rounded-3xl shadow-2xl p-8 backdrop-blur-md border border-blue-200 animate-pop-in">
        <h1 className="text-4xl font-extrabold text-blue-100 mb-6 text-center drop-shadow-lg tracking-tight animate-fade-in">
          {course.title}
        </h1>
        <img
          src={course.image}
          alt={course.title}
          className="w-full max-w-2xl h-64 object-cover rounded-2xl mb-6 shadow-lg border-2 border-blue-400/40 mx-auto animate-fade-in"
        />
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <p className="text-lg text-blue-200 font-semibold">
            <span className="font-bold">Instructor:</span> {course.instructor}
          </p>
          <button
            onClick={() => navigate('/course-content')}
            className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl px-6 py-2 font-semibold shadow hover:scale-105 transition-transform border border-blue-300/40"
          >
            Back to Courses
          </button>
        </div>
        <p className="text-blue-100 mb-8 text-lg text-center max-w-2xl mx-auto animate-fade-in delay-100">
          {course.description}
        </p>
        <div className="bg-blue-900/40 p-6 rounded-2xl shadow-inner border border-blue-400/20 animate-pop-in">
          <h2 className="text-2xl font-bold text-blue-200 mb-4 text-center">Course Content</h2>
          {/* You can replace this section with real lessons/videos later */}
          <ul className="list-disc pl-8 text-blue-100 space-y-2">
            <li>Lesson 1: Introduction to Openings</li>
            <li>Lesson 2: Strategy Basics</li>
            <li>Lesson 3: Classic Games Analysis</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
