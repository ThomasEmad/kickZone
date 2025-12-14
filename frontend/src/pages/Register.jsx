import React, { useState } from "react";
import api from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const nav = useNavigate();
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setMsg("Submitting...");
    try {
      await api.post("/account/register/", form);
      setMsg("Registered");
      setTimeout(() => nav("/login"), 600);
    } catch (err) {
      setMsg(
        "Failed: " +
          (err.response?.data ? JSON.stringify(err.response.data) : err.message)
      );
    }
  };
  return (
    <div className="auth">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handle}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handle}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handle}
        />
        <button type="submit">Register</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
