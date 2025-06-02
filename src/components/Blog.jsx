import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, onLike, onDelete, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    if (!blog.id) {
      console.error('Blog ID is missing')
      return
    }

    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
  }

    onLike(updatedBlog)
  }

  const handleDelete = () => {
    const confirmDelete = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
    if (confirmDelete) {
      onDelete(blog.id)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const isAuthor =
    blog.user &&
    (blog.user.username === currentUser.username || blog.user.id === currentUser.id)

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user?.name || blog.user?.username || 'unknown'}</div>
          {isAuthor && <button onClick={handleDelete}>remove</button>}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired
}

export default Blog
