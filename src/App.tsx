import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout"
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import TopicPage from "./pages/TopicPage";
import Register from "./pages/Register";
import AuthProvider from "./components/AuthContext";
import Login from "./pages/Login";
import { ForumService } from "./services/forumService";
import { useEffect } from "react";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/category/:id/topic/:topic_id" element={<TopicPage />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}