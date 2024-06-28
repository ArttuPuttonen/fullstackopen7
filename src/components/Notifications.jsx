const Notification = ({ message, type }) => {
  if (!message) {
    return null
  }
  if(type === 'success') {
    return <div className="successMessage">{message}</div>
  }
  if(type === 'error') {
    return <div className="errorMessage">{message}</div>
  }
}


export default Notification