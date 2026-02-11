"use client"

import React, { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth, actionCodeSettings } from "@/lib/firebaseClient"

export default function ForgotPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [err, setErr] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr("")
    setMsg("")

    try {
      setLoading(true)
      await sendPasswordResetEmail(auth, email, actionCodeSettings)
      setMsg("Reset email sent. Check your inbox/spam.")
    } catch (error: any) {
      setErr(error?.message || "Could not send reset email.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={wrap}>
      <div style={card}>
        <h2>Reset password</h2>
        <p style={{ color: "#666" }}>Enter your email to receive a reset link.</p>

        {err && <div style={{ color: "crimson", fontSize: 14 }}>{err}</div>}
        {msg && <div style={{ color: "green", fontSize: 14 }}>{msg}</div>}

        <form onSubmit={onSubmit}>
          <label>Email</label>
          <input style={input} value={email} onChange={(e) => setEmail(e.target.value)} />

          <button style={btn} disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div style={{ marginTop: 12 }}>
          <a href="/login">Back to login</a>
        </div>
      </div>
    </div>
  )
}

const wrap: React.CSSProperties = { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: 24, background: "#0b0b0b" }
const card: React.CSSProperties = { width: "100%", maxWidth: 420, background: "#fff", borderRadius: 16, padding: 20 }
const input: React.CSSProperties = { width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd", display: "block" }
const btn: React.CSSProperties = { width: "100%", marginTop: 14, padding: 10, borderRadius: 10, border: "none", background: "#111", color: "#fff" }
