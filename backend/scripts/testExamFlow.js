require("dotenv").config();

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const PASSWORD = process.env.TEST_RECRUITER_PASSWORD || "Test@123456";
const SMTP_REQUIRED = String(process.env.TEST_REQUIRE_SMTP || "true").toLowerCase() === "true";

const now = Date.now();
const recruiterEmail = process.env.TEST_RECRUITER_EMAIL || `qa.recruiter.${now}@example.com`;
const candidateEmail = process.env.TEST_CANDIDATE_EMAIL || `qa.candidate.${now}@example.com`;

const state = {
  token: "",
  assessmentId: "",
  primaryExamLink: "",
  primaryToken: "",
  cancelExamLink: "",
  cancelToken: "",
  ranEmailLifecycle: false,
  ranCancellationLifecycle: false,
};

const log = (message) => console.log(`[test-exam-flow] ${message}`);

const api = async (path, options = {}) => {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    throw new Error(`Network error on ${path}: ${error.message}`);
  }

  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  return { response, json };
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const extractTokenFromLink = (examLink) => {
  const parts = String(examLink || "").split("/exam/");
  return parts[1] || "";
};

const authHeader = () => ({ Authorization: `Bearer ${state.token}` });

const signupAndSigninRecruiter = async () => {
  log("1) Creating recruiter user for test run...");
  const signup = await api("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      firstname: "QA",
      lastname: "Recruiter",
      companyname: "Velocity QA",
      email: recruiterEmail,
      password: PASSWORD,
    }),
  });

  assert(signup.response.status === 201, `Signup failed: ${JSON.stringify(signup.json)}`);

  log("2) Signing in recruiter...");
  const signin = await api("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email: recruiterEmail, password: PASSWORD }),
  });

  assert(signin.response.status === 200, `Signin failed: ${JSON.stringify(signin.json)}`);
  state.token = signin.json?.data?.token || "";
  assert(state.token, "No auth token returned from signin");
};

const generateAssessment = async () => {
  log("3) Generating assessment with Gemini...");
  const generated = await api("/api/assessments/generate", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({
      jobTitle: "Senior Backend Engineer",
      location: "Lahore, Pakistan",
      seniority: ["senior"],
      industry: "information_technology",
      companySize: ["51-200"],
      skills: "Node.js, Express.js, MongoDB, REST APIs",
      keywords: "AWS, Docker, system design",
      minExperience: 4,
      education: "Bachelor in CS",
      resultsPerPage: 25,
    }),
  });

  assert(generated.response.status === 200, `Generate failed: ${JSON.stringify(generated.json)}`);
  state.assessmentId = generated.json?.data?._id || "";
  const totalQuestions = generated.json?.data?.totalQuestions;

  assert(state.assessmentId, "Assessment ID missing in generate response");
  assert(totalQuestions === 40, `Expected 40 questions, got ${totalQuestions}`);
};

const sendPrimaryExam = async () => {
  log("4) Sending exam email invite (primary attempt)...");
  const sent = await api("/api/assessments/send", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({
      assessmentId: state.assessmentId,
      candidateEmail,
      candidateName: "QA Candidate",
    }),
  });

  if (sent.response.status !== 200) {
    const message = sent.json?.message || "Unknown send error";
    if (!SMTP_REQUIRED) {
      log(`Send step skipped (SMTP optional): ${message}`);
      return false;
    }
    throw new Error(`Send failed: ${JSON.stringify(sent.json)}`);
  }

  state.primaryExamLink = sent.json?.data?.examLink || "";
  state.primaryToken = extractTokenFromLink(state.primaryExamLink);

  assert(state.primaryExamLink && state.primaryToken, "Missing exam link/token in send response");
  state.ranEmailLifecycle = true;
  return true;
};

const loadPublicExam = async () => {
  log("5) Opening public exam link and validating payload shape...");
  const exam = await api(`/api/assessments/exam/${state.primaryToken}`);
  assert(exam.response.status === 200, `Exam load failed: ${JSON.stringify(exam.json)}`);

  const questions = exam.json?.data?.questions || [];
  assert(Array.isArray(questions) && questions.length === 40, "Expected 40 candidate-facing questions");
  assert(!("answer" in (questions[0] || {})), "Candidate exam response should not expose answers");
};

const submitExam = async () => {
  log("6) Submitting exam answers...");
  const answers = {};
  for (let i = 0; i < 40; i += 1) {
    answers[i] = "A";
  }

  const submitted = await api(`/api/assessments/exam/${state.primaryToken}/submit`, {
    method: "POST",
    body: JSON.stringify({
      answers,
      antiCheat: {
        tabSwitchCount: 0,
        fullScreenExitCount: 0,
        visibilityHiddenCount: 0,
        micPermissionGranted: true,
        cameraPermissionGranted: true,
        micTrackActive: true,
        cameraTrackActive: true,
        integrityNotes: "Automated QA submission",
      },
    }),
  });

  assert(submitted.response.status === 200, `Submit failed: ${JSON.stringify(submitted.json)}`);
  const score = submitted.json?.data?.score;
  const total = submitted.json?.data?.totalQuestions;
  assert(typeof score === "number" && total === 40, "Submission response missing score or totalQuestions");
};

const sendAndCancelSecondAttempt = async () => {
  log("7) Sending second exam invite for cancellation policy test...");
  const sent = await api("/api/assessments/send", {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({
      assessmentId: state.assessmentId,
      candidateEmail: `cancel.${candidateEmail}`,
      candidateName: "QA Cancel Candidate",
    }),
  });

  if (sent.response.status !== 200) {
    const message = sent.json?.message || "Unknown send error";
    if (!SMTP_REQUIRED) {
      log(`Cancellation flow skipped (SMTP optional): ${message}`);
      return false;
    }
    throw new Error(`Second send failed: ${JSON.stringify(sent.json)}`);
  }

  state.cancelExamLink = sent.json?.data?.examLink || "";
  state.cancelToken = extractTokenFromLink(state.cancelExamLink);
  assert(state.cancelToken, "Missing cancellation token from second send");

  log("8) Cancelling second exam attempt via policy endpoint...");
  const cancel = await api(`/api/assessments/exam/${state.cancelToken}/cancel`, {
    method: "POST",
    body: JSON.stringify({
      reason: "Browser focus lost for over 2 minutes",
      antiCheat: {
        tabSwitchCount: 2,
        fullScreenExitCount: 1,
        visibilityHiddenCount: 2,
        micPermissionGranted: true,
        cameraPermissionGranted: true,
        micTrackActive: false,
        cameraTrackActive: false,
        integrityNotes: "Auto cancel test",
      },
    }),
  });

  assert(cancel.response.status === 200, `Cancel failed: ${JSON.stringify(cancel.json)}`);

  const cancelledExamAccess = await api(`/api/assessments/exam/${state.cancelToken}`);
  assert(
    cancelledExamAccess.response.status === 400,
    `Cancelled exam should not open. Got: ${cancelledExamAccess.response.status}`,
  );
  state.ranCancellationLifecycle = true;
  return true;
};

const verifyRecruiterSubmissions = async () => {
  log("9) Verifying recruiter submissions list includes latest attempts...");
  if (!state.ranEmailLifecycle) {
    log("9) Submissions verification skipped because SMTP/email lifecycle was not executed.");
    return;
  }

  const submissions = await api("/api/assessments/submissions", {
    headers: authHeader(),
  });

  assert(submissions.response.status === 200, `Submissions fetch failed: ${JSON.stringify(submissions.json)}`);
  const rows = submissions.json?.data || [];
  assert(Array.isArray(rows) && rows.length > 0, "Expected at least one submission row");

  const submittedRow = rows.find((item) => item.candidateEmail === candidateEmail.toLowerCase() && item.status === "submitted");
  assert(submittedRow, "Could not find submitted attempt in recruiter submissions");

  const cancelledRow = rows.find(
    (item) => item.candidateEmail === `cancel.${candidateEmail}`.toLowerCase() && item.status === "cancelled",
  );
  if (state.ranCancellationLifecycle) {
    assert(cancelledRow, "Could not find cancelled attempt in recruiter submissions");
  }
};

const run = async () => {
  log(`Running against ${BASE_URL}`);
  log(`SMTP required: ${SMTP_REQUIRED}`);

  await signupAndSigninRecruiter();
  await generateAssessment();

  const canContinueExamLifecycle = await sendPrimaryExam();
  if (canContinueExamLifecycle) {
    await loadPublicExam();
    await submitExam();
    await sendAndCancelSecondAttempt();
  }

  await verifyRecruiterSubmissions();
  log("PASS: end-to-end assessment/exam flow validated successfully.");
};

run().catch((error) => {
  console.error("\n[test-exam-flow] FAIL:", error.message);
  process.exit(1);
});
