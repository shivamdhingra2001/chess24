import MiniDrawer from "../Home/Minidrawer";
import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { contactUsSchema } from "../../schemas"; // Yup schema assumed

function ContactUs() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const initialValues = {
        name: '',
        email: '',
        subject: 'Inquiry',
        message: ''
    };

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        setLoading(true);
        const templateParams = {
            user_name: values.name,
            user_email: values.email,
            subject: values.subject,
            message: values.message,
        };

        emailjs
            .send(
                process.env.REACT_APP_EMAILJS_SERVICE_ID,
                process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
                templateParams,
                process.env.REACT_APP_EMAILJS_PUBLIC_KEY
            )
            .then(() => {
                setSubmitted(true);
                setLoading(false);
                setSubmitting(false);
                resetForm();
            })
            .catch((error) => {
                console.error("EmailJS error:", error);
                setLoading(false);
                setSubmitting(false);
            });
    };

    return (
        <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen w-full flex flex-col text-white overflow-hidden">
            {/* Floating background shapes - Adjusted for smaller screens */}
            <div className="absolute -top-16 -left-16 w-64 h-64 sm:w-96 sm:h-96 bg-blue-700 opacity-30 rounded-full blur-3xl z-0 animate-pulse" />
            <div className="absolute top-1/2 right-0 w-56 h-56 sm:w-80 sm:h-80 bg-blue-400 opacity-20 rounded-full blur-2xl z-0 animate-pulse" />
            <div className="absolute bottom-0 left-1/2 w-48 h-48 sm:w-72 sm:h-72 bg-white opacity-10 rounded-full blur-2xl z-0 animate-pulse" />
            
            <MiniDrawer />
            {/* Responsive top margin for content below navbar - minimal space */}
            <div
                className="flex flex-col w-full px-4 xs:px-6 sm:px-8 md:px-12 lg:px-20 py-6 xs:py-8 sm:py-10 md:py-16 z-10 mt-12 xs:mt-16 sm:mt-12 md:mt-5 lg:mt-10"
            >
                {/* Heading - Adjusted font size for smaller screens */}
                <motion.h1
                    className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-100 text-center mb-2 leading-snug"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
                >
                    Contact Us
                </motion.h1>
                <div className="h-1 w-16 xs:w-20 sm:w-24 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full mb-4 xs:mb-6 mx-auto animate-pulse" />

                {/* Contact Info + Form - Stacked on smaller screens */}
                <div className="flex flex-col md:flex-row items-start justify-center w-full gap-4 xs:gap-6 sm:gap-8 md:gap-10">
                    {/* Contact Info Box */}
                    <motion.div
                        className="w-full bg-[#232b3b]/90 rounded-2xl p-4 xs:p-5 sm:p-6 border border-gray-700 shadow-xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.7, type: 'spring', stiffness: 60 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-base xs:text-lg font-light text-blue-100 mb-2">Get in touch with us</p>
                        <p className="text-blue-200 mb-2 text-sm xs:text-base">
                            Email: <motion.a
                                href="mailto:abc@gmail.com"
                                className="text-blue-400 hover:text-blue-300 underline font-semibold transition-colors duration-200"
                                whileHover={{ scale: 1.08, color: "#60a5fa" }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >abc@gmail.com</motion.a>
                        </p>
                        <p className="text-blue-200 text-sm xs:text-base">
                            Socials:
                            <div className="flex flex-row gap-3 xs:gap-4 mt-2">
                                <motion.a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline font-semibold transition-colors duration-200" whileHover={{ scale: 1.08 }}>LinkedIn</motion.a>
                                <motion.a href="https://www.github.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline font-semibold transition-colors duration-200" whileHover={{ scale: 1.08 }}>GitHub</motion.a>
                            </div>
                        </p>
                    </motion.div>

                    {/* Form Box */}
                    <motion.div
                        className="w-full bg-[#232b3b]/90 rounded-2xl p-4 xs:p-5 sm:p-6 border border-gray-700 shadow-xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.7, type: 'spring', stiffness: 60 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-base xs:text-lg font-light text-blue-100 mb-2">Or write to us directly from here:</p>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={contactUsSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form className="flex flex-col gap-2 xs:gap-3">
                                    <Field 
                                        type="text" 
                                        name="name" 
                                        placeholder="Your Name" 
                                        className="p-2 border-2 rounded bg-[#1e293b] border-blue-700 text-blue-100 placeholder:text-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-700 transition-all duration-200 text-sm xs:text-base" 
                                    />
                                    <ErrorMessage name="name" component="div" className="text-red-400 text-xs" />

                                    <Field 
                                        type="email" 
                                        name="email" 
                                        placeholder="Your Email" 
                                        className="p-2 border-2 rounded bg-[#1e293b] border-blue-700 text-blue-100 placeholder:text-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-700 transition-all duration-200 text-sm xs:text-base" 
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-400 text-xs" />

                                    <Field 
                                        type="text" 
                                        name="subject" 
                                        placeholder="Subject" 
                                        className="p-2 border-2 rounded bg-[#1e293b] border-blue-700 text-blue-100 placeholder:text-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-700 transition-all duration-200 text-sm xs:text-base" 
                                    />
                                    <ErrorMessage name="subject" component="div" className="text-red-400 text-xs" />

                                    <Field 
                                        as="textarea" 
                                        name="message" 
                                        placeholder="Your Message" 
                                        className="p-2 border-2 rounded bg-[#1e293b] border-blue-700 text-blue-100 placeholder:text-gray-500 h-24 xs:h-28 sm:h-36 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-700 transition-all duration-200 text-sm xs:text-base" 
                                    />
                                    <ErrorMessage name="message" component="div" className="text-red-400 text-xs" />

                                    <motion.button
                                        type="submit"
                                        disabled={submitted || loading}
                                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold p-2 rounded shadow hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm xs:text-base"
                                        whileHover={!loading && !submitted ? { scale: 1.04 } : {}}
                                        whileTap={!loading && !submitted ? { scale: 0.98 } : {}}
                                        animate={loading ? { opacity: 0.7 } : { opacity: 1 }}
                                    >
                                        {loading ? 'Sending...' : 'Send Message'}
                                    </motion.button>

                                    {submitted && (
                                        <motion.p
                                            className="text-green-400 text-xs xs:text-sm mt-2 text-center"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            Thank you for contacting us!
                                        </motion.p>
                                    )}
                                </Form>
                            )}
                        </Formik>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;