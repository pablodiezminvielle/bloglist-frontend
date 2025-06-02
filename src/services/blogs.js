import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async updatedBlog => {
  if (!updatedBlog.id) throw new Error('Missing blog ID')

  const sanitizedBlog = {
    title: updatedBlog.title,
    author: updatedBlog.author,
    url: updatedBlog.url,
    likes: updatedBlog.likes,
    user: typeof updatedBlog.user === 'object' ? updatedBlog.user.id : updatedBlog.user
  }

  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, sanitizedBlog)
  return response.data
}

const remove = async id => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, create, update, remove, setToken }
