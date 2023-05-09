import LoginForm from "./LoginForm"
import Info from "./info"
function Login() {
  return <div className="relative h-screen w-screen loginscreen overflow-hidden isolate p-1  
      ">
      <div className="lg:flex flex items-center justify-center w-full container mx-auto   lg:flex-row h-full ">
        <Info />
        <LoginForm/>
      </div>
    </div>
  
}

export default Login