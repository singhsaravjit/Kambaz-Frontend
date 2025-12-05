/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as client from "../client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Button, Container, Card, FormControl, Alert } from "react-bootstrap";

export default function Signup() {
   const [user, setUser] = useState<any>({});
   const [error, setError] = useState<string>("");
  const dispatch = useDispatch();
  const router = useRouter();
  
  const signup = async () => {
    try {
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      router.push("/Account/Profile");
    } catch (error: any) {
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <Card style={{ width: "400px" }} className="p-4 shadow-sm border-0">
        <div id="wd-signup-screen">
          <h2 className="mb-4">Signup</h2>
          <Form>
            <div className="mb-3">
              <FormControl 
                value={user.username || ""} 
                onChange={(e) => {
                  setUser({ ...user, username: e.target.value });
                  setError("");
                }}
                className="wd-username form-control-lg"
                placeholder="username"
                style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}
              />
            </div>

            <div className="mb-3">
              <FormControl 
                value={user.password || ""} 
                onChange={(e) => {
                  setUser({ ...user, password: e.target.value });
                  setError("");
                }}
                className="wd-password form-control-lg"
                placeholder="password" 
                type="password"
                style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}
              />
            </div>

            <div className="mb-3">
              <FormControl
                type="password"
                placeholder="verify password"
                className="wd-password-verify form-control-lg"
                style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}
              />
            </div>

            <Button 
              onClick={signup}
              className="btn btn-primary w-100 btn-lg mb-3"
              style={{ backgroundColor: "#0d6efd", border: "none" }}
            >
              Signup
            </Button>

            {error && (
              <Alert
                variant="danger"
                className="py-2 text-center"
                style={{ fontSize: "0.9rem" }}
              >
                {error}
              </Alert>
            )}
          </Form>

          <div className="text-start">
            <Link href="Signin" className="text-primary text-decoration-underline">
              Signin
            </Link>
          </div>
        </div>
      </Card>
    </Container>
  );
}