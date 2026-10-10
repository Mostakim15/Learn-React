import React from 'react'
import { Container, PostForm } from '../components'
function AddPost() {
  return (
    <div className = 'py-14 sm:py-20'>
      <Container>
        <div className="mb-10 border-b border-[#e9e2d7] pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b77945]">New story</p>
          <h1 className="editorial-serif mt-3 text-5xl font-bold text-[#172b3a]">Write something lasting.</h1>
          <p className="mt-3 text-[#686b70]">Shape an idea and share it with the journal.</p>
        </div>
        <PostForm />
      </Container>
    </div>
  )
}

export default AddPost