/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as client from "../client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setCurrentUser } from "../reducer";
import {
  Form,
  Button,
  Container,
  Card,
  Alert,
} from "react-bootstrap";

export default function Signin() {
  const dispatch = useDispatch();
  const router = useRouter();

  
  const [credentials, setCredentials] = useState<any>({
    username: "",
    password: "",
  });

 
  const [error, setError] = useState<string>("");

  const signin = async () => {
    try {
      const user = await client.signin(credentials);

      if (!user) {
        setError("Invalid username or password.");
        return;
      }

      dispatch(setCurrentUser(user));

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "kanbas-current-user",
          JSON.stringify(user)
        );
      }

      setError("");
      router.push("/Dashboard");
    } catch (error: any) {
      // Handle 401 or other errors
      const errorMessage = error.response?.data?.message || "Unable to login. Please check your credentials.";
      setError(errorMessage);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "60vh" }}
    >
      <Card style={{ width: "400px" }} className="p-4 shadow-sm border-0">
        <div id="wd-signin-screen">
          <h2 className="mb-4">Signin</h2>

          <Form
            onSubmit={(e) => {
              e.preventDefault(); 
              signin();
            }}
          >
           
            <div className="mb-3">
              <Form.Control
                id="wd-username"
                type="text"
                placeholder="username"
                className="form-control-lg"
                style={{
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                }}
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    username: e.target.value,
                  })
                }
              />
            </div>

           
            <div className="mb-3">
              <Form.Control
                id="wd-password"
                type="password"
                placeholder="password"
                className="form-control-lg"
                style={{
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                }}
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    password: e.target.value,
                  })
                }
              />
            </div>

           
            <Button
              id="wd-signin-btn"
              className="btn btn-primary w-100 btn-lg mb-3"
              style={{ backgroundColor: "#0d6efd", border: "none" }}
              type="submit"
            >
              Signin
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

          <div className="text-start mt-3">
            <Link
              id="wd-signup-link"
              href="/Account/Signup"
              className="text-primary text-decoration-underline"
            >
              Signup
            </Link>
          </div>
        </div>
      </Card>
    </Container>
  );
}
