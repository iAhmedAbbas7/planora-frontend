// <== IMPORTS ==>
import {
  Shield,
  Lock,
  Eye,
  Database,
  Cookie,
  Mail,
  Users,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { JSX } from "react";
import { Link } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import PURPLE_LOGO from "../assets/images/LOGO-PURPLE.png";

// <== PRIVACY POLICY PAGE COMPONENT ==>
const PrivacyPolicyPage = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Privacy Policy");
  // RETURNING THE PRIVACY POLICY PAGE COMPONENT
  return (
    // PRIVACY POLICY PAGE MAIN CONTAINER
    <div className="min-h-screen bg-gray-50">
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* LOGO AND TITLE */}
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={PURPLE_LOGO}
                alt="PlanOra Logo"
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <h1 className="text-lg sm:text-2xl font-semibold text-violet-900">
                PlanOra
              </h1>
            </div>
            {/* BACK TO HOME LINK */}
            <Link
              to="/"
              className="text-sm sm:text-base text-violet-600 hover:text-violet-700 font-medium transition"
            >
              <span className="hidden sm:inline">← Back to Home</span>
              <span className="sm:hidden">← Home</span>
            </Link>
          </div>
        </div>
      </header>
      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* PAGE HEADER */}
        <div className="text-center mb-6 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Shield
              className="text-violet-600"
              size={28}
              style={{ width: "28px", height: "28px" }}
            />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Privacy Policy
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        {/* INTRODUCTION SECTION */}
        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-4 sm:mb-8 border border-gray-200">
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
            At PlanOra, we are committed to protecting your privacy and ensuring
            the security of your personal information. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you use our Service. Please read this policy
            carefully to understand our practices regarding your data.
          </p>
        </section>
        {/* POLICY SECTIONS */}
        <div className="space-y-8">
          {/* SECTION 1: INFORMATION WE COLLECT */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <Database
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  1. Information We Collect
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  We collect information that you provide directly to us and
                  information that is automatically collected when you use our
                  Service:
                </p>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-2 mt-3 sm:mt-4">
                  Personal Information
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base ml-2 sm:ml-4 mb-3 sm:mb-4">
                  <li>
                    Name and email address (required for account creation)
                  </li>
                  <li>
                    Profile information (optional, such as profile picture)
                  </li>
                  <li>Account preferences and settings</li>
                  <li>Payment information (if you subscribe to a paid plan)</li>
                </ul>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-2 mt-3 sm:mt-4">
                  Usage Information
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base ml-2 sm:ml-4">
                  <li>Projects, tasks, and content you create</li>
                  <li>Activity logs and interaction data</li>
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and location data</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>
          {/* SECTION 2: HOW WE USE YOUR INFORMATION */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <Eye
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base ml-2 sm:ml-4">
                  <li>Provide, maintain, and improve our Service</li>
                  <li>
                    Process your account registration and authenticate users
                  </li>
                  <li>Send you important updates, notifications, and emails</li>
                  <li>
                    Respond to your inquiries and provide customer support
                  </li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>
                    Detect, prevent, and address technical issues and security
                    threats
                  </li>
                  <li>
                    Comply with legal obligations and enforce our Terms of
                    Service
                  </li>
                  <li>
                    Personalize your experience and provide relevant content
                  </li>
                </ul>
              </div>
            </div>
          </section>
          {/* SECTION 3: INFORMATION SHARING AND DISCLOSURE */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <Users
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  3. Information Sharing and Disclosure
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  We do not sell your personal information. We may share your
                  information only in the following circumstances:
                </p>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-2 mt-3 sm:mt-4">
                  Service Providers
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  We may share information with third-party service providers
                  who perform services on our behalf, such as:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base ml-2 sm:ml-4 mb-3 sm:mb-4">
                  <li>
                    Email delivery services (for sending verification and
                    notification emails)
                  </li>
                  <li>Cloud hosting providers (for data storage)</li>
                  <li>Payment processors (for subscription billing)</li>
                  <li>Analytics services (for understanding usage patterns)</li>
                </ul>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-2 mt-3 sm:mt-4">
                  Legal Requirements
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  We may disclose your information if required by law or in
                  response to valid requests by public authorities.
                </p>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-2 mt-3 sm:mt-4">
                  Business Transfers
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  In the event of a merger, acquisition, or sale of assets, your
                  information may be transferred as part of that transaction.
                </p>
              </div>
            </div>
          </section>
          {/* SECTION 4: DATA SECURITY */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <Lock
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  4. Data Security
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  We implement appropriate technical and organizational measures
                  to protect your personal information, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base ml-2 sm:ml-4 mb-3 sm:mb-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>
                    Secure authentication mechanisms (password hashing, JWT
                    tokens)
                  </li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Secure backup and recovery procedures</li>
                </ul>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  However, no method of transmission over the Internet or
                  electronic storage is 100% secure. While we strive to use
                  commercially acceptable means to protect your information, we
                  cannot guarantee absolute security.
                </p>
              </div>
            </div>
          </section>
          {/* SECTION 5: COOKIES AND TRACKING */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <Cookie
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  5. Cookies and Tracking Technologies
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  We use cookies and similar tracking technologies to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base ml-2 sm:ml-4 mb-3 sm:mb-4">
                  <li>Maintain your session and authentication state</li>
                  <li>Remember your preferences and settings</li>
                  <li>Analyze how you use our Service</li>
                  <li>Improve our Service's functionality and performance</li>
                </ul>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  You can control cookies through your browser settings.
                  However, disabling cookies may affect your ability to use
                  certain features of our Service.
                </p>
              </div>
            </div>
          </section>
          {/* SECTION 6: YOUR RIGHTS */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <CheckCircle
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  6. Your Rights
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  Depending on your location, you may have the following rights
                  regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base ml-2 sm:ml-4 mb-3 sm:mb-4">
                  <li>
                    <strong>Access:</strong> Request a copy of the personal
                    information we hold about you
                  </li>
                  <li>
                    <strong>Correction:</strong> Request correction of
                    inaccurate or incomplete information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal
                    information (you can delete your account in Settings)
                  </li>
                  <li>
                    <strong>Portability:</strong> Request transfer of your data
                    in a structured format
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to processing of your
                    personal information
                  </li>
                  <li>
                    <strong>Withdrawal:</strong> Withdraw consent where
                    processing is based on consent
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  To exercise these rights, please contact us at{" "}
                  <a
                    href="mailto:privacy@planora.com"
                    className="text-violet-600 hover:underline"
                  >
                    privacy@planora.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>
          {/* SECTION 7: DATA RETENTION */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <Database
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  7. Data Retention
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  We retain your personal information for as long as necessary
                  to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base ml-2 sm:ml-4 mb-3 sm:mb-4">
                  <li>Provide our Service to you</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce our agreements</li>
                </ul>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  When you delete your account, we will delete or anonymize your
                  personal information within 30 days, except where we are
                  required to retain it for legal purposes.
                </p>
              </div>
            </div>
          </section>
          {/* SECTION 8: CHILDREN'S PRIVACY */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <AlertCircle
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  8. Children's Privacy
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  PlanOra is not intended for children under 13 years of age. We
                  do not knowingly collect personal information from children
                  under 13. If you are a parent or guardian and believe your
                  child has provided us with personal information, please
                  contact us immediately. If we become aware that we have
                  collected personal information from a child under 13, we will
                  take steps to delete such information.
                </p>
              </div>
            </div>
          </section>
          {/* SECTION 9: INTERNATIONAL DATA TRANSFERS */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <Shield
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  9. International Data Transfers
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Your information may be transferred to and processed in
                  countries other than your country of residence. These
                  countries may have data protection laws that differ from those
                  in your country. By using our Service, you consent to the
                  transfer of your information to these countries. We take
                  appropriate measures to ensure your information receives
                  adequate protection in accordance with this Privacy Policy.
                </p>
              </div>
            </div>
          </section>
          {/* SECTION 10: CHANGES TO THIS POLICY */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <FileText
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  10. Changes to This Privacy Policy
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any material changes by posting the new Privacy
                  Policy on this page and updating the "Last updated" date. We
                  may also notify you via email or through our Service. Your
                  continued use of the Service after such changes constitutes
                  your acceptance of the updated Privacy Policy.
                </p>
              </div>
            </div>
          </section>
          {/* SECTION 11: CONTACT US */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <Mail
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  11. Contact Us
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  If you have any questions, concerns, or requests regarding
                  this Privacy Policy or our data practices, please contact us:
                </p>
                <ul className="list-none text-gray-700 space-y-2">
                  <li className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 text-sm sm:text-base">
                    <span className="font-semibold">Privacy Officer:</span>
                    <a
                      href="mailto:privacy@planora.com"
                      className="text-violet-600 hover:underline break-all"
                    >
                      privacy@planora.com
                    </a>
                  </li>
                  <li className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 text-sm sm:text-base">
                    <span className="font-semibold">General Support:</span>
                    <a
                      href="mailto:connect@planora.com"
                      className="text-violet-600 hover:underline break-all"
                    >
                      connect@planora.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
        {/* FOOTER NOTE */}
        <div className="mt-6 sm:mt-12 p-4 sm:p-6 bg-violet-50 rounded-lg border border-violet-200 text-center">
          <p className="text-gray-700 text-sm sm:text-base">
            Your privacy is important to us. We are committed to protecting your
            personal information and being transparent about our practices.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
