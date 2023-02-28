/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import emailjs from "emailjs-com"
import logo from './images/logo.png'
import { Link, animateScroll as scroll } from 'react-scroll'
import Swal from 'sweetalert2'
import { Popover, Transition } from '@headlessui/react'
import {
  BookmarkAltIcon,
  ExclamationCircleIcon,
  MenuIcon,
  ChatAltIcon,
  CalculatorIcon,
  XIcon,
} from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { analytics } from './firebase';
import { logEvent } from "firebase/analytics";
import { getDatabase, ref, push } from "firebase/database";





const resources = [
  {
    name: 'Watch size calculator',
    description: 'Get all the information you need to make an informed watch purchase.',
    href: 'calc',
    icon: CalculatorIcon,
  },
  {
    name: 'Guides',
    description: 'Learn how to take the necesary measurements and understand your wrist size.',
    href: 'help',
    icon: BookmarkAltIcon,
  },
  {
    name: 'Important info',
    description: 'See what you must know to make sure your watch fits perfectly.',
    href: 'important',
    icon: ExclamationCircleIcon,
  },
  {
    name: 'Watch Assistant Service',
    description: 'Get personalized advice about your next watch purchase and the best options for your wrist and lifestyle.',
    href: 'contact',
    icon: ChatAltIcon
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function HeaderBar() {
  return (

    <Popover className="fixed bg-white w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 font-myfont" id="head">
        <div className="flex justify-between items-center  py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <img
              onClick={() => scroll.scrollToTop()}
              className="h-7"
              src={logo}
              alt="Logo"
            />
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-darkish hover:text-darkish hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blueish">
              <span className="sr-only">Open menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          <Popover.Group as="nav" className="hidden md:flex space-x-10">

            <Link onClick={() => scroll.scrollToTop()} className="text-base font-medium text-darkish hover:text-darkish cursor-pointer"> Home </Link>
            <Link to="about" smooth={true} duration={1000}                               offset={-150}

              className="text-base font-medium text-darkish hover:text-darkish cursor-pointer"> About </Link>

            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={classNames(
                      open ? 'text-darkish' : 'text-darkish',
                      'group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-darkish focus:outline-none'
                    )}
                  >
                    <span>Structure</span>
                    <ChevronDownIcon
                      className={classNames(
                        open ? 'text-darkish' : 'text-darkish',
                        'ml-2 h-5 w-5 group-hover:text-darkish'
                      )}
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-md sm:px-0">
                      <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          {resources.map((item) => (
                            <Link
                              to={item.href} smooth={true} duration={1000}
                              key={item.name}
                              offset={-150}

                              className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
                            >
                              <item.icon className="flex-shrink-0 h-6 w-6 text-blueish" aria-hidden="true" />
                              <div className="ml-4">
                                <p className="text-base font-medium text-darkish">{item.name}</p>
                                <p className="mt-1 text-sm text-darkish">{item.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>

                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </Popover.Group>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <Link onClick={() => {
              Swal.fire({
                title: "Coming soon!",
                text: "Send us your email to get on our list",
                input: 'text',
                showCancelButton: true
              }).then((result) => {
                if (result.value) {
                  // send the result.value by email 
                  logEvent(analytics, 'email_subscription', { email: result.value })
                  console.log("Sign in request",result.value)
                  const db = getDatabase();
                  const emailRef = ref(db, 'emails');
                  push(emailRef, {
                    email: result.value
                  }).then(() => {
                    console.log("Email added to database")
                    Swal.fire(
                      'Thank you!',
                      'We will email you soon!',
                      'success'
                    )
                  }).catch((error) => {
                    console.log("Error adding email to database", error)
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Something went wrong!',
                    })
                  })
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'See you next time.',
                    text: 'We would love you to join!',
                  })
                }

              })
            }
            } className="whitespace-nowrap cursor-pointer text-base font-medium text-darkish hover:text-darkish">
              Sign in
            </Link>
            <Link onClick={() => {
              Swal.fire({
                title: "Coming soon!",
                text: "Send us your email to get on our list",
                input: 'text',
                showCancelButton: true
              }).then((result) => {
                if (result.value) {
                  // send the result.value by email 
                  logEvent(analytics, 'email_subscription', { email: result.value })
                  console.log("Sign in request",result.value)
                  const db = getDatabase();
                  const emailRef = ref(db, 'emails');
                  push(emailRef, {
                    email: result.value
                  }).then(() => {
                    console.log("Email added to database")
                    Swal.fire(
                      'Thank you!',
                      'We will email you soon!',
                      'success'
                    )
                  }).catch((error) => {
                    console.log("Error adding email to database", error)
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Something went wrong!',
                    })
                  })
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'See you next time.',
                    text: 'We would love you to join!',
                  })
                }

              })
            }
            }
              className="ml-8 whitespace-nowrap cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blueish hover:bg-blueish_dark"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel focus className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <img
                    className="h-7 w-auto"
                    src={logo}
                    alt="Workflow"
                  />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-darkish hover:text-darkish hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blueish">
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>

            </div>
            <div className="py-6 px-5 space-y-6">
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <Link onClick={() => scroll.scrollToTop()} className="text-base font-medium text-darkish hover:text-darkish cursor-pointer">
                  Home
                </Link>
                <Link to="about" smooth={true} duration={1000}                              offset={-150}

                  className="text-base font-medium text-darkish hover:text-darkish cursor-pointer"> About </Link>


              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  {resources.map((item) => (
                    <Link
                      smooth={true} duration={1000}
                      key={item.name}
                      to={item.href}
                      offset={-150}
                      className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      <item.icon className="flex-shrink-0 h-6 w-6 text-blueish" aria-hidden="true" />
                      <span className="ml-3 text-base font-medium text-darkish cursor-pointer">{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
              <div>
                <Link
                  onClick={() => {
                    Swal.fire({
                      title: "Coming soon!",
                      text: "Send us your email to get on our list",
                      input: 'text',
                      showCancelButton: true
                    }).then((result) => {
                      if (result.value) {
                        // send the result.value by email 
                        emailjs.send('service_taxedjj', 'temp2', { email: result.value }, 'API_KEY')
                        logEvent(analytics, 'email_subscription', { email: result.value })

                        Swal.fire(
                          'Thank you!',
                          'We will email you soon!',
                          'success'
                        )
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'See you next time.',
                          text: 'We would love you to join!',
                        })
                      }

                    })
                  }
                  }
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blueish hover:bg-blueish_dark"
                >
                  Sign up
                </Link>
                <p className="mt-6 text-center text-base font-medium text-darkish">
                  Existing customer?{' '}
                  <Link onClick={() => {
                    Swal.fire({
                      title: "Coming soon!",
                      text: "Send us your email to get on our list",
                      input: 'text',
                      showCancelButton: true
                    }).then((result) => {
                      if (result.value) {
                        // send the result.value by email 
                        emailjs.send('service_taxedjj', 'temp2', { email: result.value }, 'API_KEY')
                        logEvent(analytics, 'email_subscription', { email: result.value })

                        Swal.fire(
                          'Thank you!',
                          'We will email you soon!',
                          'success'
                        )
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'See you next time.',
                          text: 'We would love you to join!',
                        })
                      }

                    })
                  }
                  } className="text-blueish hover:text-blueish">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover >
  )
}




