import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, duration = 5000) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, duration)
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      showNotification(`Welcome, ${user.name || user.username}!`)
    } catch (error) {
      showNotification('Wrong username or password')
    }
  }

  const handleCreateBlog = async (blogData) => {
    try {
      const newBlog = await blogService.create(blogData)
      setBlogs(blogs.concat(newBlog))
      showNotification(`Blog "${newBlog.title}" by ${newBlog.author} added`)
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      showNotification('Failed to create blog')
    }
  }

  const handleLike = async (updatedBlog) => {
    try {
      const savedBlog = await blogService.update(updatedBlog)
      setBlogs(blogs.map(b => b.id === savedBlog.id ? savedBlog : b))
    } catch (error) {
      showNotification('Failed to like blog')
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
      showNotification('Blog deleted')
    } catch (error) {
      showNotification('Failed to delete blog')
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />

      {!user
        ? <LoginForm handleSubmit={handleLogin} />
        : <div>
          <p>{user.name || user.username} logged in</p>

          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm onCreate={handleCreateBlog} />
          </Togglable>

          {blogs
            .slice()
            .sort((a, b) => b.likes - a.likes)
            .map(blog => (
              <Blog
                key={blog.id}
                blog={blog}
                onLike={handleLike}
                onDelete={handleDelete}
                currentUser={user}
              />
            ))}
        </div>
      }
    </div>
  )
}

export default App
