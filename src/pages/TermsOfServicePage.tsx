// <== IMPORTS ==>
import {
  FileText,
  Shield,
  Lock,
  Users,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { JSX } from "react";
import { Link } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import PURPLE_LOGO from "../assets/images/LOGO-PURPLE.png";

// <== TERMS OF SERVICE PAGE COMPONENT ==>
const TermsOfServicePage = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Terms of Service");
  // RETURNING THE TERMS OF SERVICE PAGE COMPONENT
  return (
    // TERMS OF SERVICE PAGE MAIN CONTAINER
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
            <FileText
              className="text-violet-600"
              size={28}
              style={{ width: "28px", height: "28px" }}
            />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Terms of Service
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
            Welcome to PlanOra! These Terms of Service ("Terms") govern your
            access to and use of PlanOra's website, mobile application, and
            services (collectively, the "Service"). By accessing or using our
            Service, you agree to be bound by these Terms. If you disagree with
            any part of these Terms, you may not access the Service.
          </p>
        </section>
        {/* TERMS SECTIONS */}
        <div className="space-y-8">
          {/* SECTION 1: ACCEPTANCE OF TERMS */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <CheckCircle
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  By creating an account, accessing, or using PlanOra, you
                  acknowledge that you have read, understood, and agree to be
                  bound by these Terms and our Privacy Policy. If you are using
                  PlanOra on behalf of an organization, you represent that you
                  have the authority to bind that organization to these Terms.
                </p>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  You must be at least 13 years old to use PlanOra. If you are
                  under 18, you represent that you have your parent's or
                  guardian's permission to use the Service.
                </p>
              </div>
            </div>
          </section>
          {/* SECTION 2: DESCRIPTION OF SERVICE */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <Users
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  2. Description of Service
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  PlanOra is a project management and task organization platform
                  that allows users to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base ml-2 sm:ml-4">
                  <li>Create and manage projects and tasks</li>
                  <li>Track progress and set priorities</li>
                  <li>Collaborate with team members</li>
                  <li>Access analytics and insights</li>
                  <li>Customize their workspace with themes and settings</li>
                </ul>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mt-3 sm:mt-4">
                  We reserve the right to modify, suspend, or discontinue any
                  part of the Service at any time with or without notice.
                </p>
              </div>
            </div>
          </section>
          {/* SECTION 3: USER ACCOUNTS */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <Shield
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  3. User Accounts
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  To use PlanOra, you must create an account by providing:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base ml-2 sm:ml-4 mb-3 sm:mb-4">
                  <li>A valid email address</li>
                  <li>A secure password that meets our requirements</li>
                  <li>Accurate and complete information</li>
                </ul>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  You are responsible for:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base ml-2 sm:ml-4">
                  <li>
                    Maintaining the confidentiality of your account credentials
                  </li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized access</li>
                  <li>Ensuring your account information remains accurate</li>
                </ul>
              </div>
            </div>
          </section>
          {/* SECTION 4: ACCEPTABLE USE */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <AlertCircle
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  4. Acceptable Use
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  You agree not to use PlanOra to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base ml-2 sm:ml-4 mb-3 sm:mb-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Transmit harmful, offensive, or illegal content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>
                    Use automated systems to access the Service without
                    permission
                  </li>
                  <li>Impersonate any person or entity</li>
                  <li>Collect or harvest user information</li>
                </ul>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  We reserve the right to suspend or terminate accounts that
                  violate these terms.
                </p>
              </div>
            </div>
          </section>
          {/* SECTION 5: USER CONTENT */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <FileText
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  5. User Content
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  You retain ownership of all content you create, upload, or
                  store on PlanOra ("User Content"). By using the Service, you
                  grant PlanOra a worldwide, non-exclusive, royalty-free license
                  to use, store, and display your User Content solely for the
                  purpose of providing and improving the Service.
                </p>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  You represent and warrant that:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base ml-2 sm:ml-4">
                  <li>You own or have the right to use all User Content</li>
                  <li>
                    Your User Content does not violate any third-party rights
                  </li>
                  <li>Your User Content complies with these Terms</li>
                </ul>
              </div>
            </div>
          </section>
          {/* SECTION 6: INTELLECTUAL PROPERTY */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <Lock
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  6. Intellectual Property
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  The Service, including its original content, features, and
                  functionality, is owned by PlanOra and protected by
                  international copyright, trademark, patent, trade secret, and
                  other intellectual property laws.
                </p>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  You may not copy, modify, distribute, sell, or lease any part
                  of our Service or included software, nor may you reverse
                  engineer or attempt to extract the source code of that
                  software, unless laws prohibit those restrictions or you have
                  our written permission.
                </p>
              </div>
            </div>
          </section>
          {/* SECTION 7: PAYMENT AND SUBSCRIPTIONS */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <CheckCircle
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  7. Payment and Subscriptions
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  PlanOra may offer both free and paid subscription plans. If
                  you choose a paid plan:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base ml-2 sm:ml-4 mb-3 sm:mb-4">
                  <li>
                    You agree to pay all fees associated with your subscription
                  </li>
                  <li>Fees are billed in advance on a recurring basis</li>
                  <li>All fees are non-refundable unless required by law</li>
                  <li>
                    We reserve the right to change our pricing with notice
                  </li>
                  <li>You may cancel your subscription at any time</li>
                </ul>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Failure to pay may result in suspension or termination of your
                  account.
                </p>
              </div>
            </div>
          </section>
          {/* SECTION 8: TERMINATION */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <AlertCircle
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  8. Termination
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  You may terminate your account at any time by contacting us or
                  using the account deletion feature in Settings.
                </p>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  We may suspend or terminate your account immediately if you:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base ml-2 sm:ml-4 mb-3 sm:mb-4">
                  <li>Violate these Terms or our Privacy Policy</li>
                  <li>Engage in fraudulent or illegal activity</li>
                  <li>Fail to pay required fees</li>
                  <li>
                    Use the Service in a manner that harms us or other users
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Upon termination, your right to use the Service will cease
                  immediately. We may delete your account and User Content after
                  a reasonable period, as outlined in our Privacy Policy.
                </p>
              </div>
            </div>
          </section>
          {/* SECTION 9: DISCLAIMERS */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <Shield
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  9. Disclaimers
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  The Service is provided "as is" and "as available" without
                  warranties of any kind, either express or implied, including,
                  but not limited to, implied warranties of merchantability,
                  fitness for a particular purpose, or non-infringement.
                </p>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  We do not guarantee that the Service will be uninterrupted,
                  secure, or error-free, or that defects will be corrected.
                </p>
              </div>
            </div>
          </section>
          {/* SECTION 10: LIMITATION OF LIABILITY */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <AlertCircle
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  10. Limitation of Liability
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  To the maximum extent permitted by law, PlanOra shall not be
                  liable for any indirect, incidental, special, consequential,
                  or punitive damages, or any loss of profits or revenues,
                  whether incurred directly or indirectly, or any loss of data,
                  use, goodwill, or other intangible losses.
                </p>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Our total liability for any claims arising from or related to
                  the Service shall not exceed the amount you paid us in the 12
                  months preceding the claim.
                </p>
              </div>
            </div>
          </section>
          {/* SECTION 11: CHANGES TO TERMS */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <FileText
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  11. Changes to Terms
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  We reserve the right to modify these Terms at any time. We
                  will notify you of any material changes by posting the new
                  Terms on this page and updating the "Last updated" date. Your
                  continued use of the Service after such changes constitutes
                  your acceptance of the new Terms.
                </p>
              </div>
            </div>
          </section>
          {/* SECTION 12: CONTACT INFORMATION */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
              <CheckCircle
                className="text-violet-600 flex-shrink-0 mt-0.5 sm:mt-1"
                size={20}
                style={{ width: "20px", height: "20px", minWidth: "20px" }}
              />
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  12. Contact Information
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-2 sm:mb-3">
                  If you have any questions about these Terms, please contact
                  us:
                </p>
                <ul className="list-none text-gray-700 space-y-2">
                  <li className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 text-sm sm:text-base">
                    <span className="font-semibold">Email:</span>
                    <a
                      href="mailto:legal@planora.com"
                      className="text-violet-600 hover:underline break-all"
                    >
                      legal@planora.com
                    </a>
                  </li>
                  <li className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 text-sm sm:text-base">
                    <span className="font-semibold">Support:</span>
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
            By using PlanOra, you acknowledge that you have read and understood
            these Terms of Service.
          </p>
        </div>
      </main>
    </div>
  );
};

export default TermsOfServicePage;
