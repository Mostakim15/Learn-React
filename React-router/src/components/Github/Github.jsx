import React from 'react'
import {useLoaderData} from 'react-router-dom'

function Github() {
  const userData = useLoaderData()
  return (
    <div className="p-4 bg-amber-50">
      <h3 className="text-xl font-bold">{userData.name}</h3>
      <img src={userData.avatar_url} alt="user avatar" className="w-32 h-32 rounded-full" />
      <p>Followers: {userData.followers}</p>
      <p>{userData.bio}</p>
    </div>
  )
}

export default Github
export const githubLoader = async () => {
  const response = await fetch('https://api.github.com/users/mostakim15')
    if (!response.ok) {
      throw new Error('Failed to fetch GitHub user')
    }
    const userData = await response.json()
    return userData
}