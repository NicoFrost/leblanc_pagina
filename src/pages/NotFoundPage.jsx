import React from 'react'
import { Link, Navigate } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <>
        <Navigate to="/404" />
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/login">Go back to Login</Link>
    </>
  )
}
