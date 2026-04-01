import Link from 'next/link';
import { Terminal, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 mb-6">
          <Terminal className="w-8 h-8 text-green-400" />
        </div>

        <div className="font-mono text-green-400 text-sm mb-3">
          Error 404
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">
          Page not found
        </h1>

        <p className="text-gray-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/blog"
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200 text-sm"
          >
            Browse Blog
          </Link>
        </div>

        {/* Terminal-style suggestion */}
        <div className="mt-10 p-4 bg-gray-900 border border-gray-800 rounded-xl text-left">
          <div className="text-xs text-gray-500 font-mono mb-2">suggestion:</div>
          <div className="font-mono text-sm text-green-400">
            <span className="text-gray-500">$ </span>
            <Link href="/blog" className="hover:underline">
              cd /blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
