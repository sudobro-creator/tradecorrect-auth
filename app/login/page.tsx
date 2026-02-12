"use client"

import React, { useState } from "react"
import { signInWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth"
import { auth, actionCodeSettings } from "../lib/firebaseClient"


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
        setErr("Email not verified. Verification email resent.")
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

        {err && <div style={errorStyle}>{err}</div>}
        {msg && <div style={successStyle}>{msg}</div>}

        <form onSubmit={onSubmit}>
          <input style={input} placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input style={input} type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />

          <button style={button} disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div style={{ marginTop: 15 }}>
          <a href="/forgot">Forgot password</a> | <a href="/signup">Sign up</a>
        </div>
      </div>
    </div>
  )
}

const wrap = { minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", background:"#f5f5f5" }
const card = { width:400, background:"#fff", padding:30, borderRadius:10 }
const input = { width:"100%", padding:10, marginTop:10, border:"1px solid #ccc", borderRadius:5 }
const button = { width:"100%", padding:10, marginTop:15, background:"#111", color:"#fff", border:"none", borderRadius:5 }
const errorStyle = { color:"crimson", marginTop:10 }
const successStyle = { color:"green", marginTop:10 }
