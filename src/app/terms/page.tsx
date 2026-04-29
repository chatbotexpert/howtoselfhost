import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for howtoselfhost.com',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Terms of Service
        </h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Terms</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            By accessing the website at howtoselfhost.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. Use License</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Permission is granted to temporarily download one copy of the materials (information or software) on howtoselfhost.com for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on howtoselfhost.com;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. Disclaimer</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The materials on howtoselfhost.com are provided on an 'as is' basis. howtoselfhost.com makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Limitations</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            In no event shall howtoselfhost.com or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on howtoselfhost.com.
          </p>
        </div>
      </div>
    </div>
  );
}
