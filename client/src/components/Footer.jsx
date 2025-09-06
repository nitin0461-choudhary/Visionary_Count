import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
        <nav className="flex flex-wrap gap-4 text-sm">
          <Link to="/">Home</Link>
          <Link to="/upload">Upload Video</Link>
          <Link to="/about">About</Link>
          <Link to="/profile">Profile/Login</Link>
          <a href="/#contact" className="ml-auto">Contact Us</a>
        </nav>
        <div className="text-xs text-gray-500 mt-3">
          © {new Date().getFullYear()} Visionary Count. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
