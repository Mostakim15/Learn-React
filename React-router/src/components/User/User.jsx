import React from 'react'
import {useParams} from 'react-router-dom'

function User() {
    const {id} = useParams()
  return (
    <div className="p-4 bg-amber-50">
      <h4>User Profile</h4>
      <p>User ID: {id}</p>
    </div>
  )
}

export default User