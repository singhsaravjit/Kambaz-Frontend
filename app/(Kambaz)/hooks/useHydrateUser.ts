/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../Account/reducer";


export default function useHydrateUser() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  useEffect(() => {
 
    if (currentUser && currentUser._id) {
      window.localStorage.setItem(
        "kanbas-current-user",
        JSON.stringify(currentUser)
      );
      return;
    }

   
    try {
      const raw = window.localStorage.getItem("kanbas-current-user");
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (parsed && parsed._id) {
        dispatch(setCurrentUser(parsed));
      }
    } catch (err) {
      console.error("Error hydrating user from localStorage", err);
    }
  }, [currentUser, dispatch]);

  return currentUser;
}
