import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for howtoselfhost.com',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Introduction</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Welcome to howtoselfhost.com. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you as to how we look after your personal data when you visit our website 
            and tell you about your privacy rights.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. The Data We Collect</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. How We Use Your Data</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Data Security</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            If you have any questions about this privacy policy or our privacy practices, please contact us at admin@howtoselfhost.com.
          </p>
        </div>
      </div>
    </div>
  );
}
