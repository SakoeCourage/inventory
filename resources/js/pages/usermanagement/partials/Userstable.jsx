import { Icon } from '@iconify/react';
import { TablePagination, Tooltip, Zoom } from '@mui/material'
import React, { useState, useEffect } from 'react'
import Api from '../../../api/Api';
import { NavLink } from 'react-router-dom';
import { dateReformat, formatnumber } from '../../../api/Util';
import { motion } from 'framer-motion';
import Button from '../../../components/inputs/Button';
import { SlideUpAndDownAnimation } from '../../../api/Util';
import { AnimatePresence } from 'framer-motion';
import { SnackbarProvider, useSnackbar } from 'notistack'
import Loadingwheel from '../../../components/Loaders/Loadingwheel';

const Userstable = ({ data, setData, isLoading, setIsLoading, setFilters, fetchUsersData, setShowUserForm }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [deleteUserByID, setDeleteUserByID] = useState(null)
  const [resetPasswordById, setResetPasswordById] = useState(null)

  const handleChangePage = (event, newPage) => {
    if ((newPage + 1) > data.current_page) {
      fetchUsersData(data.next_page_url)
    } else {
      fetchUsersData(data.prev_page_url)
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
  };

  const handleUserDelete = () => {
    Api.post('/user/delete/' + deleteUserByID)
      .then(res => {
        fetchUsersData()
        setDeleteUserByID(null)
        enqueueSnackbar('User data deleted', { variant: 'success' })
      })
      .catch(err => {
        console.log(err)
        enqueueSnackbar(err?.response?.data?.message, { variant: 'error' })
        setDeleteUserByID(null)
      })
  };

  const handlePasswordReset = () => {
    Api.post('/user/password/reset/' + resetPasswordById)
      .then(res => {
        fetchUsersData()
        setResetPasswordById(null)
        enqueueSnackbar('User password is set to the default password', { variant: 'success' })
      })
      .catch(err => {
        console.log(err)
        setResetPasswordById(null)
      })
  };

  useEffect(() => {
    fetchUsersData()
  }, [])



  return (
    <div className="flex flex-col w-full min-h-[36rem] h-max relative ">
      <div className="flex flex-col  overflow-hidden w-full">
        <div className="flex-auto p-0">
          <div className="overflow-x-auto">
            <table className="w-full overflow-hidden">
              <thead className="bg-secondary-200 ">
                <tr>
                  <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                    #
                  </th>

                  <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                    Date modified
                  </th>
                  <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left rtl:text-right  whitespace-nowrap font-semibold ">
                    Action
                  </th>

                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 ">
                {data?.data && data?.data.map((x, i) => {
                  return (
                    <tr
                      key={i}
                      className={`${i % 2 !== 0 && 'bg-secondary-100 '
                        }`}
                    >
                      <td className="px-6 py-2 !text-xs whitespace-nowrap">
                        <div className="flex items-center">
                          <h6 className="mb-0 ">

                          </h6>
                        </div>
                      </td>
                      <td className="px-6 py-2 !text-xs whitespace-nowrap">
                        <div className="flex items-center">
                          <h6 className="mb-0  ">
                            {dateReformat(x.created_at)}
                          </h6>
                        </div>
                      </td>
                      <td className="px-6 py-2 !text-xs whitespace-nowrap">
                        <div className="flex items-center">
                          <h6 className="mb-0  ">
                            {x.name}
                          </h6>
                        </div>
                      </td>

                      <td className="px-6 py-2 !text-xs whitespace-nowrap">
                        <div className="flex items-center">
                          <h6 className="mb-0  ">
                            {x.email}
                          </h6>
                        </div>
                      </td>

                      <td className="px-6 py-2 !text-xs flex items-center gap-2 whitespace-nowrap">
                        <Tooltip title="reset user password" arrow TransitionComponent={Zoom}>
                          <span
                            onClick={() => setResetPasswordById(x.id)}
                            className=" p-1 rounded-full border border-gray-400/70 active:border-gray-400/40 text-blue-900   text-sm font-semibold leading-5  hover:cursor-pointer"
                          >
                            <Icon className='' icon="mdi:lock-reset" fontSize={20} />
                          </span>
                        </Tooltip>
                        <Tooltip title="Update user data" arrow TransitionComponent={Zoom}>
                          <span
                            onClick={() => setShowUserForm({
                              mode: 'Update UserData',
                              id: x.id,
                            })}
                            className=" p-1 rounded-full border border-gray-400/70 active:border-gray-400/40 text-blue-900   text-sm font-semibold leading-5  hover:cursor-pointer"
                          >
                            <Icon className='' icon="mdi:database-edit-outline" fontSize={20} />
                          </span>
                        </Tooltip>
                        <Tooltip title="Delete User" arrow TransitionComponent={Zoom}>
                          <button onClick={() => setDeleteUserByID(x.id)}
                            className=" p-1 rounded-full border border-gray-400/70 active:border-gray-400/40  text-red-900 text-sm font-semibold leading-5  hover:cursor-pointer"
                          >
                            <Icon className='' icon="ph:trash" fontSize={20} />
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {isLoading && <Loadingwheel />
            }
          </div>
        </div>
      </div>
      <TablePagination className=" !mt-auto "
        rowsPerPageOptions={[10]}
        component="div"
        count={data?.total ?? 0}
        rowsPerPage={data?.per_page ?? 0}
        page={(data?.current_page - 1) ?? 0}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* pop on reset delete user */}
      <AnimatePresence>
        {deleteUserByID && <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className=' fixed inset-0 z-30 flex h-full items-end bg-black/30'>
          <motion.div
            variants={SlideUpAndDownAnimation}
            initial='initial'
            animate='animate'
            exit='exit'
            className=' max-w-2xl bg-white w-full mx-auto min-h-[18rem] rounded-t-md flex flex-col'>
            <nav className='flex flex-col items-center justify-center grow'>
              <nav className=' text-gray-400 p-2 bg-gray-100 rounded-full my-3'><Icon icon="ph:warning-circle-light" fontSize={70} /></nav>
              <nav className=''>This action is irreversible </nav>
              <nav className=' mt-2 text-sm'>Do want to continue? </nav>
            </nav>
            <nav className="mt-auto flex items-center w-full pb-1 px-2 gap-1 flex-col lg:flex-row">
              <Button onClick={() => handleUserDelete()} otherClasses="w-full basis-[100%] lg:basis-[50%]" info text="Yes Remove" />
              <Button onClick={() => setDeleteUserByID(null)} otherClasses="w-full basis-[100%] lg:basis-[50%]" neutral text="No Cancel" />
            </nav>
          </motion.div>
        </motion.div>}
      </AnimatePresence>

      {/* pop on reset password */}
      <AnimatePresence>
        {resetPasswordById && <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className=' fixed inset-0 z-30 flex h-full items-end bg-black/30'>
          <motion.div
            variants={SlideUpAndDownAnimation}
            initial='initial'
            animate='animate'
            exit='exit'
            className=' max-w-2xl bg-white w-full mx-auto min-h-[18rem] rounded-t-md flex flex-col'>
            <nav className='flex flex-col items-center justify-center grow'>
              <nav className=' text-gray-400 p-2 bg-gray-100 rounded-full my-3'><Icon icon="ph:warning-circle-light" fontSize={70} /></nav>
              <nav className=''>Users password will be reset to default </nav>
              <nav className=' mt-2 text-sm'>Do want to continue? </nav>
            </nav>
            <nav className="mt-auto flex items-center w-full pb-1 px-2 gap-1 flex-col lg:flex-row">
              <Button onClick={() => handlePasswordReset()} otherClasses="w-full basis-[100%] lg:basis-[50%]" info text="Yes Reset" />
              <Button onClick={() => setResetPasswordById(null)} otherClasses="w-full basis-[100%] lg:basis-[50%]" neutral text="No Cancel" />
            </nav>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </div>
  )
}

export default Userstable
