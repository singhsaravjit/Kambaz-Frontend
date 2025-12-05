"use client"
import { AiOutlineDashboard } from "react-icons/ai";
import { FaCalendarAlt } from "react-icons/fa";
import { FaBook, FaFlask, FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

const ITEM_CLASS = "text-decoration-none d-inline-block w-100 text-center py-2";
const ICON_CLASS = "fs-1 d-block mx-auto";

export default function KambazNavigation() {
  const pathname = usePathname();
  const [activeButton, setActiveButton] = useState<string>("dashboard");
  
  const links = [
    { label: "Dashboard", path: "/Dashboard", icon: AiOutlineDashboard, id: "wd-dashboard-link", name: "dashboard" },
    { label: "Courses",   path: "/Dashboard", icon: FaBook, id: "wd-course-link", name: "courses" },
    { label: "Calendar",  path: "/Calendar",  icon: FaCalendarAlt, id: "wd-calendar-link", name: "calendar" },
    { label: "Inbox",     path: "/Inbox",     icon: FaInbox, id: "wd-inbox-link", name: "inbox" },
    { label: "Labs",      path: "/Labs/Lab1", icon: FaFlask, id: "wd-labs-link", name: "labs" },
  ];

 
  useEffect(() => {
    if (pathname === "/Dashboard" || pathname?.startsWith("/Dashboard/") || 
        pathname?.startsWith("/Courses/")) {
    } else if (pathname === "/Calendar" || pathname?.startsWith("/Calendar/")) {
      setActiveButton("calendar");
    } else if (pathname === "/Inbox" || pathname?.startsWith("/Inbox/")) {
      setActiveButton("inbox");
    } else if (pathname === "/Labs" || pathname?.startsWith("/Labs/")) {
      setActiveButton("labs");
    } else if (pathname === "/Account" || pathname?.startsWith("/Account/")) {
      setActiveButton("account");
    }
  }, [pathname]);

  
  const isActive = (buttonName: string) => {
    if ((buttonName === "dashboard" || buttonName === "courses") && 
        (pathname === "/Dashboard" || pathname?.startsWith("/Dashboard/") || pathname?.startsWith("/Courses/"))) {
      return activeButton === buttonName;
    }
    return activeButton === buttonName;
  };

 
  const itemClasses = (active: boolean) =>
    active ? "bg-white" : "bg-black";

  const linkTextClasses = (active: boolean) =>
    active ? "text-danger" : "text-white";

  const iconColorClasses = (active: boolean) =>
    active ? "text-danger" : "text-danger"; // Icons are always red as per original

  return (
    <ListGroup 
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2" 
      style={{ width: 110 }}
      id="wd-kambaz-navigation">
      
      <ListGroupItem 
        className="bg-black border-0 text-center" 
        as="a"
        target="_blank" 
        href="https://www.northeastern.edu/" 
        id="wd-neu-link">
        <img src="/images/NULOGO.png" width="75px" alt="Northeastern University" />
      </ListGroupItem>

      <ListGroupItem className="border-0 bg-black text-center">
        <Link 
          href="/Account" 
          id="wd-account-link" 
          className="text-white text-decoration-none"
          onClick={() => setActiveButton("account")}>
          <FaRegCircleUser className="fs-1 text-white" />
          <br />
          Account
        </Link>
      </ListGroupItem>
      
      {links.map((link) => {
        const active = isActive(link.name);
        return (
          <ListGroupItem 
            key={link.id}
            className={`border-0 ${itemClasses(active)} text-center`}>
            <Link 
              href={link.path} 
              id={link.id}
              className={`${ITEM_CLASS} ${linkTextClasses(active)}`}
              onClick={() => setActiveButton(link.name)}>
              {link.icon({ className: `${ICON_CLASS} ${iconColorClasses(active)}` })}
              {link.label}
            </Link>
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
}