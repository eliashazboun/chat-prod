import { useLocation, useNavigate } from 'react-router-dom'
import UserInfo from '../components/UserInfo'

const UserCreated = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const {user, autoUsers} = location.state

  const handleClick = () => {
    if(user.admin){
      navigate('/selection', {state:{user:user,admin:user.admin, autoUsers:autoUsers}})
    }else{
      navigate('/main', {state:{user:user, collectionDB:'otherPosts', autoUsers:autoUsers}})
    }
  }
  return (
    <div>
      <h1 className='text-center'>User succesfully created!</h1>
      <div className='text-center'>

        <UserInfo name={user.name}/>
      </div>
      <div className='text-center mt-3'>
        <button onClick={handleClick}>Start Chatting now!</button>
      </div>
    </div>
  )
}

export default UserCreated