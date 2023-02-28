import React from 'react'
import { useForm } from 'react-hook-form'
import { getDatabase, ref, push } from "firebase/database";
import Swal from 'sweetalert2';

export default function FeedbackBlock() {
    const { register, handleSubmit, formState: { errors } } = useForm();


  return (
    <div className='mt-10' onSubmit={
        handleSubmit((data) => {
            const db = getDatabase();
            const feedbackRef = ref(db, 'feedback');
            push(feedbackRef, data.feedback).then(() => {
                console.log('Data saved')
                Swal.fire({
                    title: 'Thank you for your feedback!',
                    text: 'We will use it to improve our service',
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
        })
    } >
        <form className='flex justify-center items-start flex-col'>
            <p className='text-xl font-bold text-left mb-4'>Tell us if this is what you expected?</p>
            <textarea rows={8} {...register("feedback", { required: "This field is mandatory" })} className='w-full rounded-xl px-2' />
            {errors.feedback && <span className='mt-2 text-sm text-red-500'>This field is required</span>}
            <input type='submit' className='mt-4 px-4 py-2 bg-grey-400 rounded hover:bg-grey-600 text-black' value="Submit" />
        </form>
    </div>
  )
}
