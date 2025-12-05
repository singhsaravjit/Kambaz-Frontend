/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaUserCircle, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import * as client from "../../../Account/client";
import PeopleDetails from "./Details";

export default function PeopleTable({ users = [], fetchUsers, showAddButton = true }: { users?: any[]; fetchUsers: () => void; showAddButton?: boolean; }) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<any>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showUserId, setShowUserId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<any>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    section: "S101",
    role: "STUDENT",
    loginId: "",
    lastActivity: new Date().toISOString().split('T')[0],
    totalActivity: "00:00:00"
  });

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
  const isAdmin = currentUser?.role === "ADMIN";

  const handleEdit = (user: any) => {
    setEditingUserId(user._id);
    setEditedUser({ ...user });
  };

  const handleSave = async () => {
    if (!editingUserId) return;
    try {
      await client.updateUser(editedUser);
      await fetchUsers();
      setEditingUserId(null);
      setEditedUser({});
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setEditedUser({});
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await client.deleteUser(userId);
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditedUser({ ...editedUser, [field]: value });
  };

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewUser({
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      email: "",
      section: "S101",
      role: "STUDENT",
      loginId: "",
      lastActivity: new Date().toISOString().split('T')[0],
      totalActivity: "00:00:00"
    });
  };

  const handleNewUserChange = (field: string, value: string) => {
    setNewUser({ ...newUser, [field]: value });
  };

  const handleCreateUser = async () => {
    try {
      await client.createUser(newUser);
      await fetchUsers();
      handleCloseAddModal();
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating user. Please try again.");
    }
  };

  return (
    <div id="wd-people-table">
      {showDetails && (
        <PeopleDetails
          uid={showUserId}
          onClose={() => {
            setShowDetails(false);
            fetchUsers();
          }}
        />
      )}
      {isFaculty && showAddButton && (
        <div className="mb-3">
          <Button variant="primary" onClick={handleAddUser}>
            <FaPlus className="me-2" />
            Add User
          </Button>
        </div>
      )}
      
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
            {isFaculty && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => {
            const isEditing = editingUserId === user._id;
            
            return (
              <tr key={user._id}>
                <td className="wd-full-name text-nowrap">
                  <span
                    className="text-decoration-none"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setShowDetails(true);
                      setShowUserId(user._id);
                    }}
                  >
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={editedUser.firstName || ""}
                          onChange={(e) => handleFieldChange("firstName", e.target.value)}
                          className="form-control d-inline-block w-auto me-1"
                          style={{ width: "100px" }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <input
                          type="text"
                          value={editedUser.lastName || ""}
                          onChange={(e) => handleFieldChange("lastName", e.target.value)}
                          className="form-control d-inline-block w-auto"
                          style={{ width: "100px" }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </>
                    ) : (
                      <>
                        <span className="wd-first-name">{user.firstName}</span>{" "}
                        <span className="wd-last-name">{user.lastName}</span>
                      </>
                    )}
                  </span>
                </td>
                <td className="wd-login-id">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.loginId || ""}
                      onChange={(e) => handleFieldChange("loginId", e.target.value)}
                      className="form-control"
                    />
                  ) : (
                    user.loginId
                  )}
                </td>
                <td className="wd-section">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.section || ""}
                      onChange={(e) => handleFieldChange("section", e.target.value)}
                      className="form-control"
                    />
                  ) : (
                    user.section
                  )}
                </td>
                <td className="wd-role">
                  {isEditing ? (
                    <select
                      value={editedUser.role || ""}
                      onChange={(e) => handleFieldChange("role", e.target.value)}
                      className="form-control"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="TA">TA</option>
                      <option value="FACULTY">Faculty</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="wd-last-activity">{user.lastActivity}</td>
                <td className="wd-total-activity">{user.totalActivity}</td>
                {isFaculty && (
                  <td>
                    {isEditing ? (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={handleSave}
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(user)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(user._id)}
                        >
                          <FaTrash />
                        </Button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Add User Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={newUser.firstName}
                onChange={(e) => handleNewUserChange("firstName", e.target.value)}
                placeholder="Enter first name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={newUser.lastName}
                onChange={(e) => handleNewUserChange("lastName", e.target.value)}
                placeholder="Enter last name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={newUser.username}
                onChange={(e) => handleNewUserChange("username", e.target.value)}
                placeholder="Enter username"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={newUser.password}
                onChange={(e) => handleNewUserChange("password", e.target.value)}
                placeholder="Enter password"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newUser.email}
                onChange={(e) => handleNewUserChange("email", e.target.value)}
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Login ID</Form.Label>
              <Form.Control
                type="text"
                value={newUser.loginId}
                onChange={(e) => handleNewUserChange("loginId", e.target.value)}
                placeholder="Enter login ID"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Section</Form.Label>
              <Form.Control
                type="text"
                value={newUser.section}
                onChange={(e) => handleNewUserChange("section", e.target.value)}
                placeholder="Enter section"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={newUser.role}
                onChange={(e) => handleNewUserChange("role", e.target.value)}
              >
                <option value="STUDENT">Student</option>
                <option value="TA">TA</option>
                <option value="FACULTY">Faculty</option>
                <option value="ADMIN">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateUser}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
