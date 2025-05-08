import React from "react";
import { Link, NavLink } from "react-router";
import { User, ShoppingCart } from "lucide-react";

const Header = () => {
  const links = [
    { label: "HOME", path: "/" },
    { label: "COLLECTION", path: "/products" },
    { label: "ABOUT", path: "/about" },
    { label: "CONTACT US", path: "/contact" },
  ];


  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links.map((link, idx) => (
              <li key={idx}>
                {/* Use NavLink to handle active class */}

                <NavLink
                  to={link.path}
                  className={`font-semibold
                ${({ isActive }) => (isActive ? "text-primary" : "")}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <NavLink to={"/"} className="text-xl">
          SuperMall
        </NavLink>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {links.map((link, idx) => (
            <li key={idx} className="rounded-lg px-2">
              {/* Use NavLink to handle active class */}

              <NavLink
                to={link.path}
                className={`font-semibold
                ${({ isActive }) =>
                  isActive
                    ? "text-primary border-b-accent"
                    : "text-secondary"}`}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end flex gap-2">
        <Link to="/cart" className="btn btn-circle btn-ghost">
          <ShoppingCart size={20} />
        </Link>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-circle btn-ghost">
            <User size={20} />
          </label>
          <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52 mt-4">
            <li><Link to="/profile" className="font-medium">Profile</Link></li>
            <li><Link to="/auth/login" className="font-medium">Login</Link></li>
            <li><Link to="/auth/register" className="font-medium">Register</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
