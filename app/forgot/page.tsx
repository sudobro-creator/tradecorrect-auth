"use client"

import React, { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth, actionCodeSettings } from "../lib/firebaseClient"


export default function ForgotPage() {
  const [email, setEmail] = useState("")
  const [msg, setMsg] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr("")
    setMsg("")

    try {
      setLoading(true)
      await sendPasswordResetEmail(auth, email, actionCodeSettings)
      setMsg("Reset email sent.")
    } catch (error: any) {
      setErr(error?.message || "Error sending reset email.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={wrap}>
      <div style={card}>
        <h2>Reset Password</h2>

        {err && <div style={errorStyle}>{err}</div>}
        {msg && <div style={successStyle}>{msg}</div>}

        <form onSubmit={onSubmit}>
          <input style={input} placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <button style={button} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div style={{ marginTop: 15 }}>
          <a href="/login">Back to login</a>
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
