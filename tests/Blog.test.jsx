// tests/Blog.test.jsx
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import Blog from '../src/components/Blog'
import BlogForm from '../src/components/BlogForm'
import { vi } from 'vitest'

describe('<Blog />', () => {
  const blog = {
    id: 'abc123',
    title: 'The React Journey',
    author: 'Dan Abramov',
    url: 'https://reactjs.org/blog',
    likes: 42,
    user: {
      username: 'dandan',
      name: 'Dan Abramov',
      id: '12345',
    },
  }

  const currentUser = {
    username: 'dandan',
    name: 'Dan Abramov',
    id: '12345',
  }

  const mockLike = vi.fn()
  const mockDelete = vi.fn()

  beforeEach(() => {
    render(
      <Blog
        blog={blog}
        currentUser={currentUser}
        onLike={mockLike}
        onDelete={mockDelete}
      />
    )
  })

  test('renders title and author by default, but not url or likes', () => {
    expect(screen.getByText('The React Journey Dan Abramov')).toBeInTheDocument()
    expect(screen.queryByText('https://reactjs.org/blog')).not.toBeInTheDocument()
    expect(screen.queryByText('likes 42')).not.toBeInTheDocument()
  })

  test('shows url and likes when view button is clicked', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    expect(screen.getByText('https://reactjs.org/blog')).toBeInTheDocument()
    expect(screen.getByText('likes 42')).toBeInTheDocument()
  })

  test('calls like handler twice when like button is clicked twice', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByText('view'))
    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLike).toHaveBeenCalledTimes(2)
  })
})

describe('<BlogForm />', () => {
  test('calls onCreate with the correct details', async () => {
    const mockCreate = vi.fn()
    const { container } = render(<BlogForm onCreate={mockCreate} />)

    const user = userEvent.setup()

    const titleInput = container.querySelector('input[name="Title"]')
    const authorInput = container.querySelector('input[name="Author"]')
    const urlInput = container.querySelector('input[name="Url"]')
    const createButton = screen.getByRole('button', { name: /create/i })

    await user.type(titleInput, 'Testing Blog Title')
    await user.type(authorInput, 'Tester')
    await user.type(urlInput, 'http://test.com')
    await user.click(createButton)

    expect(mockCreate).toHaveBeenCalledTimes(1)
    expect(mockCreate).toHaveBeenCalledWith({
      title: 'Testing Blog Title',
      author: 'Tester',
      url: 'http://test.com',
    })
  })
})
