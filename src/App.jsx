import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notifications'
import './services/index.css'
import LoginForm from './components/LoginForm'
import AddBlogForm from './components/AddBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const [addBlogVisible, setAddBlogVisible] = useState(false)
  const error = 'error'
  const success = 'success'
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll()
      .then(initialBlogs => {
        initialBlogs.sort((a, b) => b.votes - a.votes)
        setBlogs(initialBlogs)
      })
      .catch(error => {
        console.error('Error fetching blogs:', error)
        setErrorMessage('Failed to fetch blogs')
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlogForm = () => {
    const hideWhenVisible = { display: addBlogVisible ? 'none' : '' }
    const showWhenVisible = { display: addBlogVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setAddBlogVisible(true)}>create new blog</button>
        </div>
        <div style={showWhenVisible}>
          <AddBlogForm
            setBlogs={setBlogs}
            blogs={blogs}
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
          />
          <button onClick={() => setAddBlogVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            errorMessage={errorMessage}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('wrong username or password')
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const updateBlog = (updatedBlog) => {
    const updatedBlogs = blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
    updatedBlogs.sort((a, b) => b.votes - a.votes)
    setBlogs(updatedBlogs)
  }

  const blogForm = () => (
    <div>
      <h2>Blogs</h2>
      <Notification message={successMessage} type={success} />
      <Notification message={errorMessage} type={error} />
      <p>{user.name} logged-in</p>
      <button onClick={handleLogout}>logout</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />
      )}
    </div>
  )


  return (
    <div>
      <h1>Blogs</h1>
      {!user && loginForm()}
      {user && addBlogForm()}
      {user && blogForm()}
    </div>
  )
}

export default App
