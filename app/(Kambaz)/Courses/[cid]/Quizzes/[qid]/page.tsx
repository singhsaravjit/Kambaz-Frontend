/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Form, Row, Col, Button, Nav, Tab } from "react-bootstrap";
import { updateQuiz } from "../reducer";
import * as coursesClient from "../../../client";
import QuizDetailsEditor from "./QuizDetailsEditor";
import QuizQuestionsEditor from "./QuizQuestionsEditor";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const role = currentUser?.role;
  const canEdit = role === "FACULTY" || role === "ADMIN";
  const isStudent = role === "STUDENT";

  const existing = quizzes.find((q: any) => q._id === qid && q.course === cid);

  const [quiz, setQuiz] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid && qid !== "new") {
        try {
          const fetchedQuiz = await coursesClient.findQuizById(qid as string);
          setQuiz(fetchedQuiz);
        } catch (error) {
          console.error("Error fetching quiz:", error);
          router.push(`/Courses/${cid}/Quizzes`);
        }
      } else if (existing) {
        setQuiz(existing);
      } else if (qid === "new") {
        // New quiz - create default quiz object
        setQuiz({
          _id: undefined,
          title: "New Quiz",
          description: "",
          quizType: "Graded Quiz",
          points: 0,
          assignmentGroup: "Quizzes",
          shuffleAnswers: true,
          timeLimit: 20,
          multipleAttempts: false,
          attemptsAllowed: 1,
          showCorrectAnswers: "After submission",
          accessCode: "",
          oneQuestionAtATime: true,
          webcamRequired: false,
          lockQuestionsAfterAnswering: false,
          dueDate: "",
          dueDateInput: "",
          availableDate: "",
          availableDateInput: "",
          untilDate: "",
          untilDateInput: "",
          published: false,
          questions: [],
          course: cid,
        });
      }
      setLoading(false);
    };

    fetchQuiz();
  }, [qid, cid, existing, router]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!quiz && qid !== "new") {
    return <div className="p-4">Quiz not found</div>;
  }

  // For students, show quiz details and start button
  if (isStudent && quiz) {
    return (
      <div className="p-4">
        <h2>{quiz.title}</h2>
        <div className="mb-3">
          <strong>Points:</strong> {quiz.points || 0}
        </div>
        <div className="mb-3">
          <strong>Questions:</strong> {quiz.questions?.length || 0}
        </div>
        {quiz.description && (
          <div className="mb-3">
            <strong>Description:</strong>
            <div dangerouslySetInnerHTML={{ __html: quiz.description }} />
          </div>
        )}
        <Button
          variant="primary"
          onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Take`)}
        >
          Start Quiz
        </Button>
      </div>
    );
  }

  // For faculty, show editor
  if (!canEdit) {
    return <div className="p-4">You don't have permission to edit this quiz.</div>;
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{quiz?.title || "New Quiz"}</h2>
        <div>
          <Button
            variant="secondary"
            className="me-2"
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)}
          >
            Preview
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
          >
            Cancel
          </Button>
        </div>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || "details")}>
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="details">Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="questions">Questions</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-3">
          <Tab.Pane eventKey="details">
            <QuizDetailsEditor
              quiz={quiz}
              onQuizChange={setQuiz}
              onSave={async (updatedQuiz: any) => {
                try {
                  const saved = await coursesClient.updateQuiz(updatedQuiz);
                  dispatch(updateQuiz(saved));
                  setQuiz(saved);
                } catch (error) {
                  console.error("Error saving quiz:", error);
                }
              }}
              onSaveAndPublish={async (updatedQuiz: any) => {
                try {
                  const saved = await coursesClient.updateQuiz({
                    ...updatedQuiz,
                    published: true,
                  });
                  dispatch(updateQuiz(saved));
                  router.push(`/Courses/${cid}/Quizzes`);
                } catch (error) {
                  console.error("Error saving quiz:", error);
                }
              }}
              onCancel={() => router.push(`/Courses/${cid}/Quizzes`)}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="questions">
            <QuizQuestionsEditor
              quiz={quiz}
              onQuizChange={setQuiz}
              onSave={async (updatedQuiz: any) => {
                try {
                  const saved = await coursesClient.updateQuiz(updatedQuiz);
                  dispatch(updateQuiz(saved));
                  setQuiz(saved);
                } catch (error) {
                  console.error("Error saving quiz:", error);
                }
              }}
            />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}

