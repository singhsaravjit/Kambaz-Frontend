/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";
export default function Account() {
 const { currentUser } = useSelector((state: any) => state.accountReducer);
 if (!currentUser) {
    return redirect("/Account/Signin");
    } else {
   redirect("/Account/Profile");
 }

}