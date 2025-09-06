import React from 'react';

import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2 text-gray-600">Page not found.</p>
      <Link to="/" className="mt-4 inline-block px-4 py-2 rounded-xl border text-sm">Go Home</Link>
    </div>
  );
}
