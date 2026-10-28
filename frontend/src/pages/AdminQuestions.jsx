import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/client";

const getErrorMessage = (error) => {
  if (!error.response) {
    return (
      "Cannot connect to Spring Boot backend. " +
      "Make sure the backend service is running."
    );
  }

  if (error.response.data?.message) {
    return error.response.data.message;
  }

  if (error.response.data?.error) {
    return error.response.data.error;
  }

  if (typeof error.response.data === "string") {
    return error.response.data;
  }

  return `Request failed with status ${error.response.status}`;
};

const API_URL = `${API_BASE}/questions`;

function AdminQuestions() {

  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "java",
    topic: "",
    difficulty: "Easy",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    answer: 0,
    marks: 1,
    explanation: ""
  });


  // ==========================================
  // FETCH QUESTIONS
  // ==========================================

  const fetchQuestions = async () => {

    try {

      setError("");

      console.log("Fetching questions...");

      const response = await axios.get(API_URL);

      console.log("Questions response:");
      console.log(response.data);

      setQuestions(response.data);

    } catch (error) {

      console.error(
        "Error loading questions:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      setError(
        getErrorMessage(error)
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "answer" || name === "marks"
          ? Number(value)
          : value
    }));
  };


  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {

    setFormData({
      title: "",
      category: "java",
      topic: "",
      difficulty: "Easy",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      answer: 0,
      marks: 1,
      explanation: ""
    });

    setEditingId(null);

    setShowForm(false);

    setError("");
  };


  // ==========================================
  // ADD / UPDATE QUESTION
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");


    // ------------------------------
    // VALIDATION
    // ------------------------------

    if (!formData.title.trim()) {

      setError("Please enter the question title.");

      return;
    }

    if (!formData.topic.trim()) {

      setError("Please enter the topic.");

      return;
    }

    if (!formData.optionA.trim()) {

      setError("Please enter Option A.");

      return;
    }

    if (!formData.optionB.trim()) {

      setError("Please enter Option B.");

      return;
    }

    if (!formData.optionC.trim()) {

      setError("Please enter Option C.");

      return;
    }

    if (!formData.optionD.trim()) {

      setError("Please enter Option D.");

      return;
    }

    if (!formData.explanation.trim()) {

      setError("Please enter the explanation.");

      return;
    }


    // ------------------------------
    // REQUEST DATA
    // ------------------------------

    const questionData = {

      title: formData.title,

      category: formData.category,

      topic: formData.topic,

      difficulty: formData.difficulty,

      marks: Number(formData.marks) || 1,

      optionA: formData.optionA,

      optionB: formData.optionB,

      optionC: formData.optionC,

      optionD: formData.optionD,

      answer: Number(formData.answer),

      explanation: formData.explanation
    };


    console.log(
      "Sending question data:"
    );

    console.log(questionData);


    try {

      setSaving(true);


      let response;


      // =================================
      // UPDATE
      // =================================

      if (editingId) {

        response = await axios.put(
          `${API_URL}/${editingId}`,
          questionData
        );

        console.log(
          "Update response:",
          response.data
        );

        alert(
          "Question updated successfully."
        );

      }

      // =================================
      // ADD
      // =================================

      else {

        response = await axios.post(
          API_URL,
          questionData
        );

        console.log(
          "Add response:",
          response.data
        );

        alert(
          "Question added successfully."
        );
      }


      resetForm();

      await fetchQuestions();


    } catch (error) {

      console.error(
        "ERROR SAVING QUESTION"
      );

      console.error(error);

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      setError(
        getErrorMessage(error)
      );

    } finally {

      setSaving(false);
    }
  };


  // ==========================================
  // EDIT QUESTION
  // ==========================================

  const handleEdit = (question) => {

    setFormData({

      title: question.title || "",

      category:
        question.category || "java",

      topic:
        question.topic || "",

      difficulty:
        question.difficulty || "Easy",

      optionA:
        question.optionA || "",

      optionB:
        question.optionB || "",

      optionC:
        question.optionC || "",

      optionD:
        question.optionD || "",

      answer:
        question.answer ?? 0,

      marks:
        question.marks || 1,

      explanation:
        question.explanation || ""
    });


    setEditingId(question.id);

    setShowForm(true);

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // ==========================================
  // DELETE QUESTION
  // ==========================================

  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmed) {
      return;
    }


    try {

      setError("");

      await axios.delete(
        `${API_URL}/${id}`
      );

      alert(
        "Question deleted successfully."
      );

      await fetchQuestions();

    } catch (error) {

      console.error(
        "Error deleting question:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      setError(
        getErrorMessage(error)
      );
    }
  };


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredQuestions =
    questions.filter((question) => {

      const searchText =
        search.toLowerCase();

      return (

        question.title
          ?.toLowerCase()
          .includes(searchText)

        ||

        question.category
          ?.toLowerCase()
          .includes(searchText)

        ||

        question.topic
          ?.toLowerCase()
          .includes(searchText)
      );
    });


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="admin-questions-page">


      {/* =====================================
          HEADER
      ====================================== */}

      <div className="admin-page-header">

        <div>

          <p className="admin-page-label">
            QUESTION MANAGEMENT
          </p>

          <h1>
            Manage Questions
          </h1>

          <p>
            Add, edit and manage technical
            questions for SkillNest.
          </p>

        </div>


        <div className="admin-header-actions">

          <Link
            to="/admin"
            className="admin-secondary-btn"
          >
            ← Dashboard
          </Link>


          <button
            type="button"
            className="admin-primary-btn"
            onClick={() => {

              if (showForm) {

                resetForm();

              } else {

                setShowForm(true);

                setError("");
              }
            }}
          >

            {showForm
              ? "Cancel"
              : "+ Add Question"}

          </button>

        </div>

      </div>


      {/* =====================================
          ERROR
      ====================================== */}

      {error && (

        <div className="admin-question-error">

          <strong>
            Error:
          </strong>

          <span>
            {error}
          </span>

        </div>

      )}


      {/* =====================================
          FORM
      ====================================== */}

      {showForm && (

        <div className="admin-question-form-card">

          <div className="admin-form-header">

            <p className="admin-page-label">

              {editingId
                ? "EDIT QUESTION"
                : "NEW QUESTION"}

            </p>

            <h2>

              {editingId
                ? "Update Question"
                : "Add New Question"}

            </h2>

          </div>


          <form
            className="admin-question-form"
            onSubmit={handleSubmit}
          >


            {/* QUESTION */}

            <div className="admin-form-group full-width">

              <label>
                Question
              </label>

              <textarea
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter the question"
                rows="3"
              />

            </div>


            {/* CATEGORY */}

            <div className="admin-form-group">

              <label>
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >

                <option value="java">
                  Java
                </option>

                <option value="python">
                  Python
                </option>

                <option value="c++">
                  C++
                </option>

                <option value="javascript">
                  JavaScript
                </option>

                <option value="react">
                  React
                </option>

                <option value="html">
                  HTML
                </option>

                <option value="css">
                  CSS
                </option>

                <option value="node.js">
                  Node.js
                </option>

                <option value="sql">
                  SQL
                </option>

              </select>

            </div>


            {/* TOPIC */}

            <div className="admin-form-group">

              <label>
                Topic
              </label>

              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Example: OOP"
              />

            </div>


            {/* DIFFICULTY */}

            <div className="admin-form-group">

              <label>
                Difficulty
              </label>

              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >

                <option value="Easy">
                  Easy
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Hard">
                  Hard
                </option>

              </select>

            </div>


            {/* MARKS */}

            <div className="admin-form-group">

              <label>
                Marks (Points)
              </label>

              <input
                type="number"
                name="marks"
                min="1"
                max="20"
                value={formData.marks || 1}
                onChange={handleChange}
                placeholder="Marks for this question"
                required
              />

            </div>


            {/* ANSWER */}

            <div className="admin-form-group">

              <label>
                Correct Answer
              </label>

              <select
                name="answer"
                value={formData.answer}
                onChange={handleChange}
              >

                <option value="0">
                  A
                </option>

                <option value="1">
                  B
                </option>

                <option value="2">
                  C
                </option>

                <option value="3">
                  D
                </option>

              </select>

            </div>


            {/* OPTION A */}

            <div className="admin-form-group">

              <label>
                Option A
              </label>

              <input
                type="text"
                name="optionA"
                value={formData.optionA}
                onChange={handleChange}
                placeholder="Enter option A"
              />

            </div>


            {/* OPTION B */}

            <div className="admin-form-group">

              <label>
                Option B
              </label>

              <input
                type="text"
                name="optionB"
                value={formData.optionB}
                onChange={handleChange}
                placeholder="Enter option B"
              />

            </div>


            {/* OPTION C */}

            <div className="admin-form-group">

              <label>
                Option C
              </label>

              <input
                type="text"
                name="optionC"
                value={formData.optionC}
                onChange={handleChange}
                placeholder="Enter option C"
              />

            </div>


            {/* OPTION D */}

            <div className="admin-form-group">

              <label>
                Option D
              </label>

              <input
                type="text"
                name="optionD"
                value={formData.optionD}
                onChange={handleChange}
                placeholder="Enter option D"
              />

            </div>


            {/* EXPLANATION */}

            <div className="admin-form-group full-width">

              <label>
                Explanation
              </label>

              <textarea
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                placeholder="Explain why the answer is correct"
                rows="4"
              />

            </div>


            {/* ACTIONS */}

            <div className="admin-form-actions">

              <button
                type="button"
                className="admin-secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="admin-primary-btn"
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Question"
                  : "Add Question"}

              </button>

            </div>

          </form>

        </div>

      )}


      {/* =====================================
          QUESTIONS LIST
      ====================================== */}

      <div className="admin-question-list-section">


        {/* TOOLBAR */}

        <div className="admin-questions-toolbar">

          <div>

            <h2>
              All Questions
            </h2>

            <span>
              {questions.length} total questions
            </span>

          </div>


          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="admin-question-search"
          />

        </div>


        {/* LOADING */}

        {loading && (

          <div className="admin-loading">

            Loading questions...

          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          filteredQuestions.length === 0 && (

            <div className="admin-empty">

              <h3>
                No questions found
              </h3>

              <p>
                Add your first question using
                the button above.
              </p>

            </div>

          )}


        {/* QUESTIONS */}

        {!loading &&
          filteredQuestions.length > 0 && (

            <div className="admin-question-list">

              {filteredQuestions.map(
                (question) => (

                  <div
                    className="admin-question-card"
                    key={question.id}
                  >


                    <div className="admin-question-card-number">

                      #{question.id}

                    </div>


                    <div className="admin-question-card-content">

                      <div className="admin-question-card-top">

                        <span className="admin-category-badge">

                          {question.category}

                        </span>

                        <span className="admin-topic">

                          {question.topic}

                        </span>

                        <span
                          className={`admin-difficulty ${
                            question.difficulty
                              ?.toLowerCase()
                          }`}
                        >

                          {question.difficulty}

                        </span>

                      </div>


                      <h3>
                        {question.title}
                      </h3>


                      <p>

                        A. {question.optionA}

                        <br />

                        B. {question.optionB}

                        <br />

                        C. {question.optionC}

                        <br />

                        D. {question.optionD}

                      </p>


                      <div className="admin-question-answer">

                        Correct Answer:

                        {" "}

                        {
                          ["A", "B", "C", "D"][
                            question.answer
                          ]
                        }

                      </div>

                    </div>


                    <div className="admin-question-actions">

                      <button
                        type="button"
                        className="admin-edit-btn"
                        onClick={() =>
                          handleEdit(question)
                        }
                      >
                        Edit
                      </button>


                      <button
                        type="button"
                        className="admin-delete-btn"
                        onClick={() =>
                          handleDelete(
                            question.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

      </div>

    </div>
  );
}

export default AdminQuestions;