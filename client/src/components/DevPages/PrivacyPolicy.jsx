import MiniDrawer from "../Home/Minidrawer";
import { useEffect } from "react";
import { motion } from "framer-motion";

function PrivacyPolicy() {
    // Animation variants
    const sectionVariant = {
        hidden: { opacity: 0, y: 40 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.13, duration: 0.7, type: "spring", stiffness: 60 }
        })
    };
    const headingUnderline = "after:content-[''] after:block after:h-1 after:w-16 after:bg-gradient-to-r after:from-blue-400 after:to-blue-700 after:rounded-full after:mt-1 after:mx-0";

    useEffect(() => {
        // Animate sections on mount
        const sections = document.querySelectorAll('.privacy-animate');
        sections.forEach((section, i) => {
            section.style.opacity = 0;
            section.style.transform = 'translateY(40px)';
            setTimeout(() => {
                section.style.transition = 'opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)';
                section.style.opacity = 1;
                section.style.transform = 'translateY(0)';
            }, 200 + i * 120);
        });
    }, []);

    return (
        <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen w-full flex flex-row text-white overflow-hidden">
            {/* Floating background shapes */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-700 opacity-30 rounded-full blur-3xl z-0 animate-pulse" />
            <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-2xl z-0 animate-pulse" />
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-white opacity-10 rounded-full blur-2xl z-0 animate-pulse" />
            <MiniDrawer />
            <div className="flex flex-col w-full px-2 sm:px-6 md:px-20 py-8 sm:py-12 md:py-20 gap-6 sm:gap-10 z-10">
                <motion.header
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 60 }}
                    className="sticky top-0 bg-gradient-to-br from-gray-900 to-blue-900 z-10 pb-4 border-b border-gray-700"
                >
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-100 drop-shadow mt-10 lg:mt-0 mb-2">
                        Privacy Policy
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full mb-2 animate-pulse" />
                    <p className="text-sm sm:text-md text-blue-200 mt-2">Effective Date: {new Date().toLocaleDateString()}</p>
                </motion.header>

                <motion.article
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, type: "spring", stiffness: 60 }}
                    className="max-w-4xl mx-auto bg-[#232b3b]/90 rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 space-y-8 border border-gray-700 backdrop-blur-md"
                >
                    {[
                        // Section 0
                        <section key={0} className="border-b border-gray-700 pb-6">
                            <motion.p
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={sectionVariant}
                                custom={0}
                                className="text-gray-300 text-sm sm:text-base leading-relaxed"
                            >
                                This Privacy Policy describes how PawnHub.com ("Website", "we", "us", or "our") collects, uses, and discloses your personal information when you visit or use our website.
                            </motion.p>
                        </section>,
                        // Section 1
                        <motion.section key={1} className="border-b border-gray-700 pb-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariant} custom={1}>
                            <h2 className={`text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-4 ${headingUnderline} animate-fade-in`}>1. Information We Collect</h2>
                            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                                We collect the following types of information from you:
                            </p>
                            <ul className="list-disc list-inside pl-4 space-y-2 text-gray-300 text-sm sm:text-base">
                                <li><strong>Personal Information:</strong> Includes your name, email address, username, password, phone number, country, and IP address.</li>
                                <li><strong>Game Data:</strong> Includes data like opponent usernames, match results, move history, and timestamps.</li>
                                <li><strong>Tracking Data:</strong> Uses cookies and technologies to monitor your activity on the Website.</li>
                            </ul>
                        </motion.section>,
                        // Section 2
                        <motion.section key={2} className="border-b border-gray-700 pb-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariant} custom={2}>
                            <h2 className={`text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-4 ${headingUnderline}`}>2. How We Use Your Information</h2>
                            <ul className="list-disc list-inside pl-4 space-y-2 text-gray-300 text-sm sm:text-base">
                                <li>To operate and deliver Website services (e.g., chess games, leaderboards).</li>
                                <li>To personalize user experience and preferences.</li>
                                <li>To notify users of important updates, invitations, and support messages.</li>
                                <li>To improve our features and services.</li>
                                <li>For analytics to better understand our user base.</li>
                                <li>To comply with legal obligations and enforce policies.</li>
                            </ul>
                        </motion.section>,
                        // Section 3
                        <motion.section key={3} className="border-b border-gray-700 pb-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariant} custom={3}>
                            <h2 className={`text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-4 ${headingUnderline}`}>3. Sharing Your Information</h2>
                            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                                We do not share your personal information with third-party companies for marketing without consent.
                                We may share it with trusted third-party service providers for hosting, analytics, and customer support,
                                under strict confidentiality.
                            </p>
                            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-4">
                                We may disclose your data if required by law or to protect rights, safety, or property.
                            </p>
                        </motion.section>,
                        // Section 4
                        <motion.section key={4} className="border-b border-gray-700 pb-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariant} custom={4}>
                            <h2 className={`text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-4 ${headingUnderline}`}>4. Data Retention</h2>
                            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                                We retain your Personal Information as long as your account is active and afterward for compliance and legal reasons.
                            </p>
                        </motion.section>,
                        // Section 5
                        <motion.section key={5} className="border-b border-gray-700 pb-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariant} custom={5}>
                            <h2 className={`text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-4 ${headingUnderline}`}>5. Your Choices</h2>
                            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                                You can request to access, correct, delete, or restrict processing of your data at any time. To exercise these rights,
                                contact us at <a href="mailto:onlycoding70@gmail.com" className="text-blue-400 hover:underline hover:text-blue-300 transition-colors duration-200">onlycoding70@gmail.com</a>.
                            </p>
                        </motion.section>,
                        // Section 6
                        <motion.section key={6} className="border-b border-gray-700 pb-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariant} custom={6}>
                            <h2 className={`text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-4 ${headingUnderline}`}>6. Children's Privacy</h2>
                            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                                The Website is not intended for children under 13. If you believe a child has provided us personal data, please contact us.
                            </p>
                        </motion.section>,
                        // Section 7
                        <motion.section key={7} className="border-b border-gray-700 pb-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariant} custom={7}>
                            <h2 className={`text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-4 ${headingUnderline}`}>7. Security</h2>
                            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                                We take reasonable security steps, but cannot guarantee 100% protection due to the nature of internet transmission.
                            </p>
                        </motion.section>,
                        // Section 8
                        <motion.section key={8} className="border-b border-gray-700 pb-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariant} custom={8}>
                            <h2 className={`text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-4 ${headingUnderline}`}>8. International Transfers</h2>
                            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                                Your information may be transferred internationally. We take steps to ensure it is handled securely.
                            </p>
                        </motion.section>,
                        // Section 9
                        <motion.section key={9} className="border-b border-gray-700 pb-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariant} custom={9}>
                            <h2 className={`text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-4 ${headingUnderline}`}>9. Changes to this Privacy Policy</h2>
                            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                                We may update this policy and will notify users via the Website. Please review it periodically.
                            </p>
                        </motion.section>,
                        // Section 10
                        <motion.section key={10} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariant} custom={10}>
                            <h2 className={`text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-4 ${headingUnderline}`}>10. Contact Us</h2>
                            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                                For any questions regarding this Privacy Policy, please reach out to us at:
                                <br />
                                <motion.a
                                    href="mailto:onlycoding70@gmail.com"
                                    className="inline-block text-blue-400 hover:text-blue-200 hover:underline transition-colors duration-200 font-semibold mt-2"
                                    whileHover={{ scale: 1.08, color: "#60a5fa" }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    onlycoding70@gmail.com
                                </motion.a>
                            </p>
                        </motion.section>
                    ]}
                </motion.article>
            </div>
        </div>
    );
}

export default PrivacyPolicy;