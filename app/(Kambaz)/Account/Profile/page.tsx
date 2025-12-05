/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as client from "../client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";


function normalizeDobToInput(rawDob: any): string {
  if (!rawDob) return "";

 
  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDob)) {
    return rawDob;
  }


  if (/^\d{2}\/\d{2}\/\d{4}$/.test(rawDob)) {
    const [mm, dd, yyyy] = rawDob.split("/");
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }

 
  const d = new Date(rawDob);
  if (!isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // months 0-11
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }


  return "";
}

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [successMessage, setSuccessMessage] = useState<string>("");
  
  const updateProfile = async () => {
    try {
      const updatedProfile = await client.updateUser(profile);
      dispatch(setCurrentUser(updatedProfile));
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };


  const [profile, setProfile] = useState<any>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    role: "USER",
  });

  
  useEffect(() => {
    if (!currentUser) {
      router.replace("/Account/Signin");
      return;
    }

    setProfile({
      ...currentUser,
      dob: normalizeDobToInput(currentUser.dob),
    });
  }, [currentUser, router]);

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    router.replace("/Account/Signin");
  };

  const inputStyle = {
    backgroundColor: "#f8f9fa",
    border: "1px solid #dee2e6",
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "70vh" }}
    >
      <Card style={{ width: "400px" }} className="p-4 shadow-sm border-0">
        <div id="wd-profile-screen">
          <h2 className="mb-4">Profile</h2>

          {profile && (
            <Form>
           
              <div className="mb-3">
                <Form.Control
                  id="wd-username"
                  className="wd-username form-control-lg"
                  placeholder="username"
                  style={inputStyle}
                  value={profile.username ?? ""}
                  onChange={(e) =>
                    setProfile({ ...profile, username: e.target.value })
                  }
                />
              </div>

            
              <div className="mb-3">
                <Form.Control
                  id="wd-password"
                  className="wd-password form-control-lg"
                  type="password"
                  placeholder="password"
                  style={inputStyle}
                  value={profile.password ?? ""}
                  onChange={(e) =>
                    setProfile({ ...profile, password: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <Form.Control
                  id="wd-firstname"
                  className="form-control-lg"
                  placeholder="First Name"
                  style={inputStyle}
                  value={profile.firstName ?? ""}
                  onChange={(e) =>
                    setProfile({ ...profile, firstName: e.target.value })
                  }
                />
              </div>

             
              <div className="mb-3">
                <Form.Control
                  id="wd-lastname"
                  className="form-control-lg"
                  placeholder="Last Name"
                  style={inputStyle}
                  value={profile.lastName ?? ""}
                  onChange={(e) =>
                    setProfile({ ...profile, lastName: e.target.value })
                  }
                />
              </div>

          
              <div className="mb-3">
                <Form.Control
                  id="wd-dob"
                  className="form-control-lg"
                  type="date"
                  placeholder="Date of Birth"
                  style={inputStyle}
                  value={profile.dob ?? ""}
                  onChange={(e) =>
                    setProfile({ ...profile, dob: e.target.value })
                  }
                />
              </div>

             
              <div className="mb-3">
                <Form.Control
                  id="wd-email"
                  className="form-control-lg"
                  type="email"
                  placeholder="Email"
                  style={inputStyle}
                  value={profile.email ?? ""}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <Form.Select
                  id="wd-role"
                  className="form-control-lg"
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={profile.role ?? "USER"}
                  onChange={(e) =>
                    setProfile({ ...profile, role: e.target.value })
                  }
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="FACULTY">Faculty</option>
                  <option value="STUDENT">Student</option>
                </Form.Select>
              </div>

              <Button onClick={updateProfile} className="btn btn-primary w-100 mb-2"> Update </Button>

              {successMessage && (
                <Alert
                  variant="success"
                  className="py-2 text-center mb-2"
                  style={{ fontSize: "0.9rem" }}
                >
                  {successMessage}
                </Alert>
              )}

              <Button
                id="wd-signout-btn"
                onClick={signout}
                className="btn btn-danger w-100 btn-lg"
                style={{ backgroundColor: "#dc3545", border: "none" }}
              >
                Signout
              </Button>
            </Form>
          )}
        </div>
      </Card>
    </Container>
  );
}
