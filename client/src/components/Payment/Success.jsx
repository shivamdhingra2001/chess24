import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/course-content'); // Navigate to the page that shows purchased content
    }, 3000); // Optional delay to show message first

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="mt-4 text-lg">Redirecting you to your course...</p>
    </div>
  );
};

export default SuccessPage;
