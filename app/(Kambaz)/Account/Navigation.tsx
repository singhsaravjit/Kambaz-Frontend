/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
  const pathname = usePathname();
  
  const isActive = (link: string) => {
    return pathname?.includes(link);
  };

  return (
    <div id="wd-account-navigation" className="list-group rounded-0">
      {links.map((link) => (
        <Link 
          key={link}
          href={`/Account/${link}`}
          className={`list-group-item list-group-item-action border-0 ${
            isActive(link) ? 'active border-start border-dark border-4' : 'text-danger'
          }`}
          style={isActive(link) ? { backgroundColor: 'white', color: 'black' } : {}}
        >
          {link}
        </Link>
      ))}
      {currentUser && currentUser.role === "ADMIN" && (
        <Link 
          href={`/Account/Users`}
          className={`list-group-item list-group-item-action border-0 ${
            pathname?.endsWith('Users') ? 'active border-start border-dark border-4' : 'text-danger'
          }`}
          style={pathname?.endsWith('Users') ? { backgroundColor: 'white', color: 'black' } : {}}
        >
          Users
        </Link>
      )}
    </div>
  );
}