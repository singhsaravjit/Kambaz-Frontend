/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Form, Card, Alert, ProgressBar } from "react-bootstrap";
import * as coursesClient from "../../../../client";

export default function TakeQuiz() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [previousAttempts, setPreviousAttempts] = useState<any[]>([]);
  const [accessCode, setAccessCode] = useState("");
  const [accessCodeVerified, setAccessCodeVerified] = useState(false);
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Locked questions state (for lockQuestionsAfterAnswering feature)
  const [lockedQuestions, setLockedQuestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const fetchedQuiz = await coursesClient.findQuizById(qid as string);
        setQuiz(fetchedQuiz);
        
        if (fetchedQuiz.accessCode) {
          setAccessCodeVerified(false);
        } else {
          setAccessCodeVerified(true);
        }

        // Initialize timer if time limit is set
        if (fetchedQuiz.hasTimeLimit !== false && fetchedQuiz.timeLimit) {
          setTimeRemaining(fetchedQuiz.timeLimit * 60); // Convert minutes to seconds
        }

        if (currentUser?._id) {
          const attempts = await coursesClient.getQuizAttempts(qid as string, currentUser._id);
          setPreviousAttempts(attempts);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [qid, currentUser]);

  // Timer effect
  useEffect(() => {
    if (timerStarted && timeRemaining !== null && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            // Time's up - auto submit
            clearInterval(timerRef.current!);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerStarted]);

  const startTimer = () => {
    setTimerStarted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAccessCodeSubmit = () => {
    if (quiz?.accessCode && accessCode === quiz.accessCode) {
      setAccessCodeVerified(true);
      startTimer();
    } else {
      alert("Invalid access code");
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev: any) => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    // Lock current question if setting is enabled
    if (quiz?.lockQuestionsAfterAnswering && answers[questions[currentQuestionIndex]?._id]) {
      setLockedQuestions((prev) => new Set([...prev, currentQuestionIndex]));
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePreviousQuestion = () => {
    // Only allow going back if questions aren't locked
    if (!quiz?.lockQuestionsAfterAnswering || !lockedQuestions.has(currentQuestionIndex - 1)) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionNavigation = (idx: number) => {
    // Check if navigation is allowed
    if (quiz?.lockQuestionsAfterAnswering && lockedQuestions.has(idx)) {
      return; // Don't allow navigation to locked questions
    }
    setCurrentQuestionIndex(idx);
  };

  const handleSubmit = useCallback(async () => {
    if (!quiz || !currentUser?._id) return;

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const answersArray = Object.keys(answers).map((questionId) => ({
      questionId,
      answer: answers[questionId],
    }));

    try {
      const attempt = await coursesClient.submitQuizAttempt(
        qid as string,
        currentUser._id,
        answersArray
      );
      setResult(attempt);
      setSubmitted(true);
      
      // Refresh attempts
      const attempts = await coursesClient.getQuizAttempts(qid as string, currentUser._id);
      setPreviousAttempts(attempts);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Error submitting quiz. Please try again.");
    }
  }, [quiz, currentUser, answers, qid]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeRemaining, submitted, handleSubmit]);

  // Helper function to check if correct answers should be shown
  const shouldShowCorrectAnswers = () => {
    if (!quiz) return false;
    
    const setting = quiz.showCorrectAnswers;
    
    if (setting === "Never") {
      return false;
    }
    
    if (setting === "After submission") {
      return true;
    }
    
    if (setting === "After due date") {
      if (!quiz.dueDateInput) return false;
      const dueDate = new Date(quiz.dueDateInput);
      const now = new Date();
      return now > dueDate;
    }
    
    // Default to showing after submission
    return true;
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!quiz) {
    return <div className="p-4">Quiz not found</div>;
  }

  if (!quiz.published) {
    return (
      <div className="p-4">
        <Alert variant="warning">This quiz is not published yet.</Alert>
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  // Check if quiz is available (not in the future)
  if (quiz.availableDateInput) {
    const availableDate = new Date(quiz.availableDateInput);
    const now = new Date();
    if (now < availableDate) {
      return (
        <div className="p-4">
          <Alert variant="warning">
            This quiz is not available yet. It will be available on{" "}
            <strong>{availableDate.toLocaleString()}</strong>
          </Alert>
          <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
            Back to Quizzes
          </Button>
        </div>
      );
    }
  }

  // Check if quiz has passed until date
  if (quiz.untilDateInput) {
    const untilDate = new Date(quiz.untilDateInput);
    const now = new Date();
    if (now > untilDate) {
      return (
        <div className="p-4">
          <Alert variant="danger">
            This quiz is no longer available. It closed on{" "}
            <strong>{untilDate.toLocaleString()}</strong>
          </Alert>
          <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
            Back to Quizzes
          </Button>
        </div>
      );
    }
  }

  // Check if student has exceeded attempts
  const maxAttempts = quiz.multipleAttempts ? quiz.attemptsAllowed : 1;
  if (previousAttempts.length >= maxAttempts) {
    const lastAttempt = previousAttempts[0];
    return (
      <div className="p-4">
        <Alert variant="info">
          You have already taken this quiz {previousAttempts.length} time(s). Maximum attempts: {maxAttempts}
        </Alert>
        <h2>Your Last Attempt Results</h2>
        <div className="mb-4">
          <h3>
            Score: {lastAttempt.score} / {lastAttempt.totalPoints} ({lastAttempt.percentage}%)
          </h3>
        </div>
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  // Access code verification
  if (quiz.accessCode && !accessCodeVerified) {
    return (
      <div className="p-4">
        <Card>
          <Card.Body>
            <h3>Access Code Required</h3>
            <Form.Group className="mb-3">
              <Form.Label>Enter Access Code</Form.Label>
              <Form.Control
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter access code"
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAccessCodeSubmit}>
              Submit
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const oneQuestionAtATime = quiz.oneQuestionAtATime === true;

  if (submitted && result) {
    const showAnswers = shouldShowCorrectAnswers();
    
    return (
      <div className="p-4">
        <h2>Quiz Results</h2>
        <div className="mb-4">
          <h3>
            Score: {result.score} / {result.totalPoints} ({result.percentage}%)
          </h3>
        </div>
        
        {!showAnswers && (
          <Alert variant="info" className="mb-4">
            {quiz.showCorrectAnswers === "Never" 
              ? "Correct answers are not available for this quiz."
              : `Correct answers will be available after the due date (${new Date(quiz.dueDateInput).toLocaleString()}).`
            }
          </Alert>
        )}
        
        {questions.map((question: any, index: number) => {
          const answer = result.answers.find((a: any) => a.questionId === question._id);
          return (
            <Card key={question._id} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5>
                    Question {index + 1} ({question.points} pts)
                  </h5>
                  {showAnswers && (
                    answer?.isCorrect ? (
                      <span className="text-success">✓ Correct</span>
                    ) : (
                      <span className="text-danger">✗ Incorrect</span>
                    )
                  )}
                </div>
                <div dangerouslySetInnerHTML={{ __html: question.question }} />
                <div className="mt-2">
                  <strong>Your Answer:</strong> {answer?.answer || "No answer"}
                </div>
                {showAnswers && (
                  <>
                    {question.type === "Multiple Choice" && (
                      <div className="mt-2">
                        <strong>Correct Answer:</strong>{" "}
                        {question.choices?.find((c: any) => c.isCorrect)?.text}
                      </div>
                    )}
                    {question.type === "True/False" && (
                      <div className="mt-2">
                        <strong>Correct Answer:</strong> {question.correctAnswer}
                      </div>
                    )}
                    {question.type === "Fill in the Blank" && (
                      <div className="mt-2">
                        <strong>Correct Answers:</strong> {question.correctAnswers?.join(", ")}
                      </div>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          );
        })}
        <div className="mt-4">
          <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
            Back to Quizzes
          </Button>
        </div>
      </div>
    );
  }

  // Start quiz screen (if timer not started and has time limit)
  if (!timerStarted && quiz.hasTimeLimit !== false && quiz.timeLimit && !quiz.accessCode) {
    return (
      <div className="p-4">
        <Card>
          <Card.Body>
            <h2>{quiz.title}</h2>
            {quiz.description && (
              <div className="mb-4" dangerouslySetInnerHTML={{ __html: quiz.description }} />
            )}
            <Alert variant="info">
              <strong>Time Limit:</strong> {quiz.timeLimit} minutes
              <br />
              <strong>Questions:</strong> {questions.length}
              <br />
              <strong>Total Points:</strong> {questions.reduce((sum: number, q: any) => sum + (q.points || 0), 0)}
            </Alert>
            <p className="text-muted">
              Once you start the quiz, the timer will begin. Make sure you have enough time to complete all questions.
            </p>
            <Button variant="primary" size="lg" onClick={startTimer}>
              Start Quiz
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // Auto-start timer if no time limit
  if (!timerStarted && (quiz.hasTimeLimit === false || !quiz.timeLimit)) {
    startTimer();
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{quiz.title}</h2>
        <div className="d-flex align-items-center gap-3">
          {previousAttempts.length > 0 && (
            <Alert variant="info" className="mb-0 py-1 px-2">
              Attempt {previousAttempts.length + 1} of {maxAttempts}
            </Alert>
          )}
          {/* Timer Display */}
          {quiz.hasTimeLimit !== false && quiz.timeLimit && timeRemaining !== null && (
            <div className="d-flex flex-column align-items-end">
              <Alert 
                variant={timeRemaining < 60 ? "danger" : timeRemaining < 300 ? "warning" : "info"} 
                className="mb-0 py-1 px-3"
              >
                <strong>⏱ Time Remaining: {formatTime(timeRemaining)}</strong>
              </Alert>
              <ProgressBar 
                now={(timeRemaining / (quiz.timeLimit * 60)) * 100} 
                variant={timeRemaining < 60 ? "danger" : timeRemaining < 300 ? "warning" : "info"}
                style={{ width: '200px', height: '5px', marginTop: '5px' }}
              />
            </div>
          )}
        </div>
      </div>

      {quiz.description && (
        <div className="mb-4">
          <div dangerouslySetInnerHTML={{ __html: quiz.description }} />
        </div>
      )}

      {oneQuestionAtATime ? (
        <div>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <p className="mb-0">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            {/* Question Navigation */}
            <div className="d-flex flex-wrap gap-2">
              {questions.map((_: any, idx: number) => {
                const isLocked = quiz.lockQuestionsAfterAnswering && lockedQuestions.has(idx);
                const isAnswered = answers[questions[idx]._id];
                const isCurrent = idx === currentQuestionIndex;
                
                return (
                  <Button
                    key={`nav-btn-${idx}`}
                    variant={isCurrent ? "primary" : isAnswered ? "success" : "outline-secondary"}
                    size="sm"
                    onClick={() => handleQuestionNavigation(idx)}
                    disabled={isLocked && !isCurrent}
                    style={{ 
                      minWidth: "40px",
                      opacity: isLocked && !isCurrent ? 0.5 : 1
                    }}
                    title={isLocked ? "Question locked" : `Go to question ${idx + 1}`}
                  >
                    {isLocked && !isCurrent ? "🔒" : idx + 1}
                  </Button>
                );
              })}
            </div>
          </div>
          {currentQuestion && (
            <Card className="mb-3">
              <Card.Body>
                <h5>
                  {currentQuestion.title} ({currentQuestion.points} pts)
                </h5>
                <div
                  className="mb-3"
                  dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
                />
                {currentQuestion.type === "Multiple Choice" && (
                  <div>
                    {currentQuestion.choices?.map((choice: any, idx: number) => (
                      <div key={`mc-${currentQuestion._id}-${idx}`} className="mb-2">
                        <Form.Check
                          type="radio"
                          id={`mc-${currentQuestion._id}-choice-${idx}`}
                          name={`question-mc-${currentQuestion._id}`}
                          label={choice.text}
                          checked={answers[currentQuestion._id] === choice.text}
                          onChange={() => handleAnswerChange(currentQuestion._id, choice.text)}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {currentQuestion.type === "True/False" && (
                  <div>
                    <div className="mb-2">
                      <Form.Check
                        type="radio"
                        id={`tf-${currentQuestion._id}-true`}
                        name={`question-tf-${currentQuestion._id}`}
                        label="True"
                        checked={answers[currentQuestion._id] === "True"}
                        onChange={() => handleAnswerChange(currentQuestion._id, "True")}
                      />
                    </div>
                    <div className="mb-2">
                      <Form.Check
                        type="radio"
                        id={`tf-${currentQuestion._id}-false`}
                        name={`question-tf-${currentQuestion._id}`}
                        label="False"
                        checked={answers[currentQuestion._id] === "False"}
                        onChange={() => handleAnswerChange(currentQuestion._id, "False")}
                      />
                    </div>
                  </div>
                )}
                {currentQuestion.type === "Fill in the Blank" && (
                  <Form.Control
                    type="text"
                    id={`fib-${currentQuestion._id}`}
                    value={answers[currentQuestion._id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                    placeholder="Enter your answer"
                  />
                )}
              </Card.Body>
            </Card>
          )}
          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              disabled={currentQuestionIndex === 0 || (quiz.lockQuestionsAfterAnswering && lockedQuestions.has(currentQuestionIndex - 1))}
              onClick={handlePreviousQuestion}
            >
              Previous
            </Button>
            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                onClick={handleNextQuestion}
              >
                Next
              </Button>
            ) : (
              <Button variant="success" onClick={handleSubmit}>
                Submit Quiz
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div>
          {questions.map((question: any, index: number) => (
            <Card key={question._id} className="mb-3">
              <Card.Body>
                <h5>
                  Question {index + 1}: {question.title} ({question.points} pts)
                </h5>
                <div
                  className="mb-3"
                  dangerouslySetInnerHTML={{ __html: question.question }}
                />
                {question.type === "Multiple Choice" && (
                  <div>
                    {question.choices?.map((choice: any, idx: number) => (
                      <div key={`mc-all-${question._id}-${idx}`} className="mb-2">
                        <Form.Check
                          type="radio"
                          id={`mc-all-${question._id}-choice-${idx}`}
                          name={`question-all-mc-${question._id}`}
                          label={choice.text}
                          checked={answers[question._id] === choice.text}
                          onChange={() => handleAnswerChange(question._id, choice.text)}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {question.type === "True/False" && (
                  <div>
                    <div className="mb-2">
                      <Form.Check
                        type="radio"
                        id={`tf-all-${question._id}-true`}
                        name={`question-all-tf-${question._id}`}
                        label="True"
                        checked={answers[question._id] === "True"}
                        onChange={() => handleAnswerChange(question._id, "True")}
                      />
                    </div>
                    <div className="mb-2">
                      <Form.Check
                        type="radio"
                        id={`tf-all-${question._id}-false`}
                        name={`question-all-tf-${question._id}`}
                        label="False"
                        checked={answers[question._id] === "False"}
                        onChange={() => handleAnswerChange(question._id, "False")}
                      />
                    </div>
                  </div>
                )}
                {question.type === "Fill in the Blank" && (
                  <Form.Control
                    type="text"
                    id={`fib-all-${question._id}`}
                    value={answers[question._id] || ""}
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    placeholder="Enter your answer"
                  />
                )}
              </Card.Body>
            </Card>
          ))}
          <div className="mt-4">
            <Button variant="success" onClick={handleSubmit}>
              Submit Quiz
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
