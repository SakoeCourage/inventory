import React from 'react'

export default function Profile({userData}) {
  return (
    <>
    <nav className=' bg-gray-50/40 border border-gray-400/70 rounded-md w-full gap-7 p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
      <nav className=' col-span-1 md:col-span-2 lg:col-span-3 border-b border-dotted border-blue-900'>Personal Information </nav>
      <nav className="flex flex-col gap-4 text-gray-600">
        <nav>First Name</nav>
        <nav className=' text-sm text-gray-500'>{userData?.firstname ?? <nav className=' text-gray-400'>Loading... &nbsp;</nav>}</nav>
      </nav>
      <nav className="flex flex-col gap-4 text-gray-600">
        <nav>Last Name</nav>
        <nav className=' text-sm text-gray-500'>{userData?.lastname ?? <nav className=' text-gray-400'>Loading... &nbsp;</nav>}</nav>
      </nav>
      <nav className="flex flex-col gap-4 text-gray-600">
        <nav>Gender</nav>
        <nav className=' text-sm text-gray-500'>{userData?.gender ?? <nav className=' text-gray-400'>Loading... &nbsp;</nav>}</nav>
      </nav>
      <nav className="flex flex-col gap-4 text-gray-600">
        <nav>Contact</nav>
        <nav className=' text-sm text-gray-500'>{userData?.contact ?? <nav className=' text-gray-400'>Loading... &nbsp;</nav>}</nav>
      </nav>
    </nav>
    <nav className=' my-5 bg-gray-50/40 border border-gray-400/70 rounded-md w-full gap-7 p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
      <nav className=' col-span-1 md:col-span-2 lg:col-span-3 border-b border-dotted border-blue-900'>System Credentials </nav>
      <nav className="flex flex-col gap-4 text-gray-600">
        <nav>Username</nav>
        <nav className=' text-sm text-gray-500'>{userData?.name ?? <nav className=' text-gray-400'>Loading... &nbsp;</nav>}</nav>
      </nav>
      <nav className="flex flex-col gap-4 text-gray-600">
        <nav>Email</nav>
        <nav className=' text-sm text-gray-500'>{userData?.email ?? <nav className=' text-gray-400'>Loading... &nbsp;</nav>}</nav>
      </nav>
      <nav className="flex flex-col gap-4 text-gray-600">
        <nav>Role</nav>
        <nav className=' text-sm text-gray-500'>{userData?.role ?? <nav className=' text-gray-400'>Loading... &nbsp;</nav>}</nav>
      </nav>
    </nav>
    </>
 
  )
}
