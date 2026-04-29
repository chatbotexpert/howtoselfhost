import type { Metadata } from 'next';
import { Mail, MessageSquare, Twitter, Github } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with howtoselfhost.com',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Contact Us
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Have a question, suggestion, or just want to say hi? We'd love to hear from you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Email Support */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-6">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Email Support
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              For general inquiries, guide requests, or feedback, please email us directly.
            </p>
            <a 
              href="mailto:admin@howtoselfhost.com" 
              className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300 transition-colors"
            >
              admin@howtoselfhost.com
            </a>
          </div>

          {/* Social / Community */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Community
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Join our community or follow us on social media for the latest updates.
            </p>
            <div className="flex flex-col gap-3">
              <a href="#" className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                <Twitter className="w-5 h-5" /> @howtoselfhost
              </a>
              <a href="#" className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                <Github className="w-5 h-5" /> GitHub Organization
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
