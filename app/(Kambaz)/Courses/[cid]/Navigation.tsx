'use client';
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

export default function CourseNavigation() {
  const pathname = usePathname();
  const params = useParams();
  

  const cid = params.cid as string;
  
 
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];
  

  const isActive = (linkName: string) => {
    
    if (linkName === "People") {
      return pathname?.includes(`/Courses/${cid}/People`);
    }
   
    return pathname?.includes(`/Courses/${cid}/${linkName}`);
  };
  

  const getLinkHref = (linkName: string) => {
  
    if (linkName === "People") {
      return `/Courses/${cid}/People/Table`;
    }
    return `/Courses/${cid}/${linkName}`;
  };
  

  const getLinkClass = (linkName: string) => {
    const baseClass = "list-group-item border-0";
    return isActive(linkName) ? `${baseClass} active` : `${baseClass} text-danger`;
  };
  

  const getLinkId = (linkName: string) => {
    return `wd-course-${linkName.toLowerCase()}-link`;
  };

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => (
        <Link 
          key={link}
          href={getLinkHref(link)}
          id={getLinkId(link)}
          className={getLinkClass(link)}
        >
          {link}
        </Link>
      ))}
    </div>
  );
}