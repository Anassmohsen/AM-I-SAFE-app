import EmailBreachSearch from "@/components/EmailBreachSearch";
import FileAnalysis from "@/components/FileAnalysis";
import IPAddressDisplay from "@/components/IPAddressDisplay";
import URLAnalysis from "@/components/URLAnalysis";
import SecurityRecommendations from "@/components/SecurityRecommendations";

export default async function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-black">
              Am I <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg">Safe</span>?
            </h1>
            <p className="mt-3 sm:mt-5 max-w-xl mx-auto text-lg sm:text-xl text-black px-4">
              Check your online security status with our comprehensive safety tools
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {/* IP Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-2 sm:p-3">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="ml-3 text-xl sm:text-2xl font-bold text-black">Your IP Information</h2>
              <SecurityRecommendations
                title="IP Information"
                recommendations={[
                  "Use a VPN to mask your real IP address",
                  "Regularly check your IP reputation",
                  "Be cautious when sharing your IP address",
                  "Consider using a proxy server for sensitive activities",
                ]}
              />
            </div>
            <IPAddressDisplay />
          </div>

          {/* Email Breach Search Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 bg-red-500 rounded-md p-2 sm:p-3">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="ml-3 text-xl sm:text-2xl font-bold text-black">Email Breach Search</h2>
              <SecurityRecommendations
                title="Email Security"
                recommendations={[
                  "Use strong, unique passwords for each account",
                  "Enable two-factor authentication",
                  "Regularly monitor your email for suspicious activity",
                  "Be cautious of phishing emails",
                  "Use a password manager to generate and store secure passwords"
                ]}
              />
            </div>
            <EmailBreachSearch />
          </div>

          {/* URL Analysis Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-2 sm:p-3">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h2 className="ml-3 text-xl sm:text-2xl font-bold text-black">URL Analysis</h2>
              <SecurityRecommendations
                title="URL Security"
                recommendations={[
                  "Always check URLs before clicking",
                  "Look for HTTPS in the URL",
                  "Be wary of shortened URLs",
                  "Check for misspellings in domain names",
                  "Use a browser extension for URL reputation checking"
                ]}
              />
            </div>
            <URLAnalysis />
          </div>

          {/* File Analysis Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-2 sm:p-3">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="ml-3 text-xl sm:text-2xl font-bold text-black">File Analysis</h2>
              <SecurityRecommendations
                title="File Security"
                recommendations={[
                  "Scan all downloaded files before opening",
                  "Be cautious with executable files",
                  "Keep your antivirus software updated",
                  "Don't open files from untrusted sources",
                  "Regularly backup important files"
                ]}
              />
            </div>
            <FileAnalysis />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-black text-sm">
            © {new Date().getFullYear()} AM I SAFE? All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
