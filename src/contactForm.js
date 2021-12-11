import { analytics } from './firebase';
import { logEvent } from "firebase/analytics";

import emailjs from "emailjs-com";
import React from 'react';
import Swal from 'sweetalert2'


export default function ContactUs() {
    function sendEmail(e) {
        console.log(e);

        e.preventDefault();

        emailjs.sendForm('service_taxedjj', 'temp1', e.target, 'API_KEY')
            .then((result) => {
                console.log(result.text);
                // analytics event
                logEvent(analytics, 'contact_form_submit', {
                    name: e.target.name.value,
                    email: e.target.email.value,
                    message: e.target.message.value
                });
                Swal.fire(
                    'Thank you!',
                    'We will email you soon!',
                    'success'
                  )
            }, (error) => {
                console.log(error.text);
                Swal.fire(
                    'Oops...',
                    'Something went wrong!',
                    'error'
                    )
            });
            
        e.target.reset()
    }


// Function that executes sendEmail function only if all the fields of the form are filled
    function validateForm(e) {
        e.preventDefault();
        if (e.target.name.value.length > 0 && e.target.email.value.length > 0 && e.target.message.value.length > 0) {
            sendEmail(e);
        } else {
            Swal.fire(
                'Oops...',
                'Please fill in all the fields!',
                'error'
                )
        }
    }

    return (
        <div id="contact">
            <div className="lg:w-3/5 2xl:w-1/2 w-5/6 mx-auto py-48" >
                <h1 className="text-center text-3xl font-bold mb-5">WATCH ASSISTANT SERVICE</h1>
                <p className="text-xl text-black opacity-50 w-4/6 mx-auto text-center mb-10">Get personalized quality counceling about your next watch purchase</p>

                <form className="" onSubmit={validateForm}>
                    <div className="">
                        <div>
                            <span className="uppercase text-sm text-gray-600 font-bold">Full Name</span>
                            <input className="w-full bg-gray-300 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                type="text" placeholder="" name="name"/>
                        </div>
                        <div className="mt-8">
                            <span className="uppercase text-sm text-gray-600 font-bold">Email</span>
                            <input 
                            name="email"
                            className="w-full bg-gray-300 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                type="email"/>
                        </div>
                        <div className="mt-8">
                            <span className="uppercase text-sm text-gray-600 font-bold">Message</span>
                            <textarea name="message"
                                className="w-full h-32 bg-gray-300 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"></textarea>
                        </div>
                        <div className="mt-8">
                            <button
                                className="text-grayish uppercase text-sm font-bold tracking-wide bg-blueish hover:bg-blueish-dark ntext-gray-100 p-3 rounded-lg w-full focus:outline-none focus:shadow-outline">
                                Send Message
                            </button>
                        </div>
                    </div>
                
                </form>
            </div>
            </div>
    )
}