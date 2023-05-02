import LoginForm from "./LoginForm"
import Info from "./info"
function Login() {
  return <div class=" h-screen w-screen loginscreen overflow-x-hidden overflow-y-scroll isolate p-1  
      ">
      <div class="lg:flex flex items-center justify-center w-full container mx-auto   lg:flex-row h-full ">
        <Info />
        <LoginForm/>
      </div>
    </div>
  
}

export default Login