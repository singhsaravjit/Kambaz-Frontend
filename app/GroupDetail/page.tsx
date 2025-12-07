"use client"
import { Container, Card, ListGroup } from "react-bootstrap";
import { FaGithub, FaUserGroup } from "react-icons/fa6";

export default function GroupDetail() {
  const teamMembers = [
    { name: "Dinesh Bachchani" },
    { name: "Saravjit Singh" },
    { name: "Ratan Pyla" }
  ];

  const repositories = [
    {
      name: "Kambaz Frontend",
      url: "https://github.com/singhsaravjit/Kambaz-Frontend",
      description: "Frontend Repository (Next.js)"
    },
    {
      name: "Kambaz Backend",
      url: "https://github.com/singhsaravjit/Kambaz-Backend",
      description: "Backend Repository (Node.js)"
    }
  ];

  return (
    <div className="d-flex">
      <div style={{ marginLeft: "110px", width: "calc(100% - 110px)" }}>
        <Container className="py-5">
          <h1 className="mb-4">
            <FaUserGroup className="me-3" />
            Group Detail
          </h1>

          {/* Team Section */}
          <Card className="mb-4">
            <Card.Header className="bg-danger text-white">
              <h4 className="mb-0">Team: Section 05</h4>
            </Card.Header>
            <Card.Body>
              <h5 className="mb-3">Team Members</h5>
              <ListGroup variant="flush">
                {teamMembers.map((member, index) => (
                  <ListGroup.Item key={index} className="py-3">
                    <h6 className="mb-0">{member.name}</h6>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>

          {/* GitHub Repositories Section */}
          <Card>
            <Card.Header className="bg-dark text-white">
              <h4 className="mb-0">
                <FaGithub className="me-2" />
                GitHub Repositories
              </h4>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {repositories.map((repo, index) => (
                  <ListGroup.Item key={index} className="py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">{repo.name}</h5>
                        <p className="mb-0 text-muted">{repo.description}</p>
                      </div>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-dark"
                      >
                        <FaGithub className="me-2" />
                        View on GitHub
                      </a>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
}
