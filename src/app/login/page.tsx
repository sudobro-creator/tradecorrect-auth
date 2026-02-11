"use client"

import React, { useState } from "react"
import { signInWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth"
import { auth, actionCodeSettings } from "@/lib/firebaseClient"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [err, setErr] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr("")
    setMsg("")

    try {
      setLoading(true)
      const cred = await signInWithEmailAndPassword(auth, email, password)

      if (!cred.user.emailVerified) {
        await sendEmailVerification(cred.user, actionCodeSettings)
        await signOut(auth)
        setErr("Email not verified. We resent verification email. Verify and login again.")
        return
      }

      setMsg("Login successful ✅")
    } catch (error: any) {
      setErr(error?.message || "Login failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={wrap}>
      <div style={card}>
        <h2>Login</h2>
        <p style={{ color: "#666" }}>Welcome back.</p>

        {err && <div style={{ color: "crimson", fontSize: 14 }}>{err}</div>}
        {msg && <div style={{ color: "green", fontSize: 14 }}>{msg}</div>}

        <form onSubmit={onSubmit}>
          <label>Email</label>
          <input style={input} value={email} onChange={(e) => setEmail(e.target.value)} />

          <label style={{ marginTop: 10 }}>Password</label>
          <input style={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button style={btn} disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between" }}>
          <a href="/forgot">Forgot?</a>
          <a href="/signup">Sign up</a>
        </div>
      </div>
    </div>
  )
}

const wrap: React.CSSProperties = { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: 24, background: "#0b0b0b" }
const card: React.CSSProperties = { width: "100%", maxWidth: 420, background: "#fff", borderRadius: 16, padding: 20 }
const input: React.CSSProperties = { width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd", display: "block" }
const btn: React.CSSProperties = { width: "100%", marginTop: 14, padding: 10, borderRadius: 10, border: "none", background: "#111", color: "#fff" }
