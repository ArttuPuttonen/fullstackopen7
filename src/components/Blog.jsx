import React, { useState } from 'react'
import blogService from '../services/blogs'


const Blog = ({ blog, updateBlog, setSuccessMessage, setErrorMessage }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const handleLike = async () => {
    try {

      const userId = blog.user ? blog.user.id : null
      const updatedBlog = {
        ...blog,
        votes: blog.votes + 1,
        user: blog.user 
      }
      console.log('Updating blog:', updatedBlog)
      
  
      const blogToSend = {
        ...updatedBlog,
        user: userId
      }
  
      const response = await blogService.updateBlog(blogToSend)
      updateBlog({
        ...response,
        user: blog.user 
      })
      setSuccessMessage(`Liked blog "${updatedBlog.title}"`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error) {
      console.error('Error updating blog:', error)
      setErrorMessage('Failed to update blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      try {
        await blogService.removeBlog(blog.id)
        setSuccessMessage(`Removed blog "${blog.title}" by ${blog.author}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      } catch (error) {
        console.error('Error removing blog:', error)
        setErrorMessage('Failed to remove blog')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  const removeButton = () => (
    <button onClick={handleRemove}>remove</button>
  )

  const loggedUser = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))

  return (
    <div style={{ border: '1px solid black', marginBottom: '10px', padding: '10px' }}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <p>URL: {blog.url}</p>
          <p>Likes: {blog.votes} <button onClick={handleLike}>like</button></p>
          {blog.user && <p>User: {blog.user.name}</p>}
          {blog.user && (loggedUser.username === blog.user.username) && removeButton()}
        </div>
      )}
    </div>
  )
}

export default Blog
