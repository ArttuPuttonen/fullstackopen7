
import Notification from './Notifications'
import propTypes from 'prop-types'

const LoginForm = ({ handleLogin, username, setUsername, password, setPassword, errorMessage }) => {
  const error = 'error'

  LoginForm.propTypes = {
    handleLogin: propTypes.func.isRequired,
    username: propTypes.string.isRequired,
    setUsername: propTypes.func.isRequired,
    password: propTypes.string.isRequired,
    setPassword: propTypes.func.isRequired,
    errorMessage: propTypes.string
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <h2>Log in to blogs application</h2>
        <Notification message={errorMessage} type={error}/>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm