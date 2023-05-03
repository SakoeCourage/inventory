import LoginForm from "./LoginForm"
import Info from "./info"
function Login() {
  return <div class="relative h-screen w-screen loginscreen overflow-hidden isolate p-1  
      ">
        {/* <nav className=" text-white  mx-auto max-w-6xl">
          Inventory Lite
        </nav> */}
      <div class="lg:flex flex items-center justify-center w-full container mx-auto   lg:flex-row h-full ">
        <Info />
        <LoginForm/>
      </div>
    </div>
  
}

export default Login