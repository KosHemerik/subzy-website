"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Er ging iets mis</h2>
            <p className="text-gray-600 mb-4">Er is een kritieke fout opgetreden.</p>
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Probeer opnieuw
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
