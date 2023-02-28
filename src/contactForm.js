import { analytics } from './firebase';
import { logEvent } from "firebase/analytics";
import { useForm } from 'react-hook-form';

import { getDatabase, ref, push } from "firebase/database";


import React from 'react';
import Swal from 'sweetalert2'


export default function ContactUs() {

    const { register, handleSubmit, formState: { errors }, reset } = useForm();



    return (
        <div id="contact">
            <div className="lg:w-3/5 2xl:w-1/2 w-5/6 mx-auto py-48" >
                <h1 className="text-center text-3xl font-bold mb-5">WATCH ASSISTANT SERVICE</h1>
                <p className="text-xl text-black opacity-50 w-4/6 mx-auto text-center mb-10">Get personalized quality counceling about your next watch purchase</p>

                <form className="" onSubmit={
                    handleSubmit((data) => {    
                        console.log(data)
                        logEvent(analytics, 'submit_form', {
                            name: data.name,
                            email: data.email,
                            message: data.message
                        });
                        const db = getDatabase();
                        const contactRef = ref(db, 'contact');
                        push(contactRef, data).then(() => {
                            console.log('Data saved')
                            Swal.fire({
                                title: 'Thank you for your message!',
                                text: 'We will get back to you as soon as possible',
                                icon: 'success',
                            });
                        })
                        .catch((error) => {
                            console.log('Data not saved')
                            Swal.fire({
                                title: 'Oops!',
                                text: 'Something went wrong. Please try again later',
                                icon: 'error',
                            });
                        })
                        reset()
                    })
                }>
                    <div className="">
                        <div>
                            <span className="uppercase text-sm text-gray-600 font-bold">Full Name <span className='text-sm font-normal text-red-500'>{errors.name?.message}</span> </span>
                            <input className="w-full bg-gray-300 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                {...register("name", { required: "This field is mandatory" })}
                                type="text" placeholder="" name="name"/>
                        </div>
                        <div className="mt-8">
                            <span className="uppercase text-sm text-gray-600 font-bold">Email <span className='text-sm font-normal text-red-500'>{errors.email?.message}</span></span>
                            <input 
                            name="email"
                            className="w-full bg-gray-300 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                            {...register("email", { required: "This field is mandatory" })}
                                type="email"/>
                        </div>
                        <div className="mt-8">
                            <span className="uppercase text-sm text-gray-600 font-bold">Message <span className='text-sm font-normal text-red-500'>{errors.message?.message}</span></span>
                            <textarea name="message"
                                className="w-full h-32 bg-gray-300 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                {...register("message", { required: "This field is mandatory" })}
                                ></textarea>
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