import diver from './images/diver.png'
import dress from './images/dress.png'
import chrono from './images/chrono.png'
import smart from './images/smart.png'
import bg from './images/bg.png'
import dia from './images/dia.png'
import lug from './images/lug.png'
import splash from './images/splash.jpg'
import gears from './images/gears.jpg'
import magnet from './images/magnet.jpg'
import logow from './images/logo-white.png'

import _1 from './images/1.png' 
import _2 from './images/2.png' 
import _3 from './images/3.png' 
import _5 from './images/5.png' 
import _6 from './images/6.png' 

import { ErrorMessage } from '@hookform/error-message';
import { analytics } from './firebase';
import { logEvent } from "firebase/analytics";
import axios from 'axios';
import { getDatabase, ref, push } from "firebase/database";



import { useForm } from "react-hook-form"
import './css/index.css'
import React from 'react';
import { Link, animateScroll as scroll } from 'react-scroll'

import ContactUs from './contactForm'
import HeaderBar from './Headerbar.js'
import FeedbackBlock from './feedback'



function App() {
    return ( <div className = "mt-16">
        <HeaderBar />
        <Banner />
        <Jumbotron />
        <FormArea />
        <HelpOne />
        <HelpTwo />
        <Important />
        <About />
        <ContactUs />
        <Footer />
        </div>

    );
}



function Banner() {
    return ( <div className = "bg-blueish text-white mx-auto text-center text-xl font-myfont font-extralight py-3 pt-6 sm:pt-10">Only accurate online watch size calculator!</div>
    )
}

function Jumbotron() {
    return ( <div className = "bg-blend-darken">
        <div className = "bg-cover bg-center  text-center flex align-middle justify-center flex-col	 content-center"
        style = {
            {
                backgroundImage: `url(${bg})`,
                height: 900
            }
        } >
        <div className = "container mx-auto" >
        <h1 className = "text-white text-6xl md:text-7xl font-bold text-center" >Welcome</h1> 
        <h2 className = "text-3xl mt-4 text-grayish w-5/6 md:w-4/6 mx-auto" >Find your watch measurements with our calculator tool.< br />
        <span className = "hidden md:block" >All you have to know your wrist circumference and the width of your wrist. These will be used to tailor the watch size which suits you.</span> </h2 > <Link to = "calc"
        smooth = { true }
        duration = { 1000 }
        offset = {-150 } > < button className = "mt-5 mb-8 px-4 py-2 bg-grayish rounded hover:bg-grayish_dark text-xl" >Proceed</button></Link >
        </div> </div > </div>
    )
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function FormArea() {
    const [formStep, setFormStep] = React.useState(0);
    const [Loading, setLoading] = React.useState(false);


    const [typeName, setTypeName] = React.useState("");
    const [finalForm, setFinalForm] = React.useState({});

    const { watch, register, formState } = useForm({
        mode: "onChange"
    });

    const completeFormStep = () => {
        setFormStep(formStep + 1);
    };

    const unCompleteFormStep = () => {
        setFormStep(formStep - 1);
    };




    const submitForm = async(values, type) => {
        const url = "https://ipapi.co/json/";
        const response = await fetch(url);
        const data = await response.json();


        let weight = 0;
        let rolex_ratio = 0;
        if (type === "diver") {
            weight = 1.02;
            rolex_ratio = 1.174894184;
        } else if (type === "dress") {
            weight = 0.98;
            rolex_ratio = 1.198983322;
        } else if (type === "chrono") {
            weight = 1;
            rolex_ratio = 1.179375;
        } else if (type === "smart") {
            weight = 1.0526;
            rolex_ratio = 1.198983322;
        }

        let local_circumference = parseFloat(values.circ);
        let local_width = parseFloat(values.width);

        if (values.c_unit === "cm") {
            local_circumference = local_circumference * 10;
        } else if (values.c_unit === "inch") {
            local_circumference = local_circumference * 25.4;
        }

        if (values.w_unit === "cm") {
            local_width = local_width * 10;
        } else if (values.w_unit === "inch") {
            local_width = local_width * 25.4;
        }

        const diameter = 0.234 * local_circumference * weight;
        const lug_to_lug = 0.775 * local_width * weight;

        const diameter_with_rolex = lug_to_lug / rolex_ratio;
        const lug_to_lug_with_rolex = diameter * rolex_ratio;

        const final_diameter = (diameter + diameter_with_rolex) / 2;
        const final_lug_to_lug = (lug_to_lug + lug_to_lug_with_rolex) / 2;

        let final_smart = 0;
        if (type === "smart" && final_diameter < 38) {
            final_smart = 38;
        } else if (type === "smart" && final_diameter > 45) {
            final_smart = 45;
        } else if (type === "smart" && final_diameter >= 38 && final_diameter <= 45) {
            final_smart = final_diameter;
        }


        const completion = {
            user_data: data || "default",
            type_of_watch: type,
            calculated_weight: weight,
            passed_circumference: values.circ,
            circumference_unit: values.c_unit,
            passed_width: values.width,
            width_unit: values.w_unit,
            calculated_diameter: final_diameter.toFixed(1),
            calculated_lug_to_lug: final_lug_to_lug.toFixed(1),
            calculated_smart: final_smart.toFixed(1),
            plusminus_diameter: (final_diameter / 25 * weight).toFixed(1),
            plusminus_lug_to_lug: (final_lug_to_lug / 25 * weight).toFixed(1),
            plusminus_smart: (final_smart / 25 * weight).toFixed(1),
            current_date_time: Date().toLocaleString()
        }

        const db = getDatabase();
        console.log("hello");

        const writeCompletion = (completion) => {
            const reference = ref(db, 'completions');
            push(reference, completion);
        }

        writeCompletion(completion);
        logEvent(analytics, 'calculation_completion', completion);

        setFinalForm(completion);
        await sleep(1500);
        setLoading(true);
    }
    return ( <div id = "calc" >


            {
                formStep >= 0 && ( < section className = { formStep === 0 ? "block" : "hidden" } >
                    <div className = " mx-auto my-20 w-1/2 2xl:w-1/3" >
                    <div className = "text-center " >
                    <h1 className = "md:text-5xl text-2xl font-bold text-lg pt-10" >Select the type of watch you are interested in</h1>
                    <div className = "grid grid-cols-1 lg:grid-cols-2 gap-4 my-10 text-center" >


                    <Link to = "calc"
                    smooth = { true }
                    duration = { 1000 }
                    offset = {-120 } >
                    <div className = "p-3 "
                    onClick = {
                        () => {
                            setTypeName("diver");
                            completeFormStep();
                        }
                    } >
                    <img src = { diver }
                    className = "mx-auto mb-3 w-full opacity-70 hover:opacity-100"
                    alt = "" />

                    <span className = "text-xl" > Sports watch </span>                  
                    </div >
                    </Link> <Link to = "calc"
                    smooth = { true }
                    duration = { 1000 }
                    offset = {-120 } >

                    <div className = "p-3 "
                    onClick = {
                        () => {
                            setTypeName("dress");
                            completeFormStep();
                        }
                    } > < img src = { dress }
                    className = "mx-auto mb-3 w-full opacity-70 hover:opacity-100"
                    alt = "" /> <span className = "text-xl" > Elegant watch </span></div >
                    </Link> <Link to = "calc"
                    smooth = { true }
                    duration = { 1000 }
                    offset = {-120 } >

                    <div className = "p-3 "
                    onClick = {
                        () => {
                            setTypeName("chrono");
                            completeFormStep();
                        }
                    } > < img src = { chrono }
                    className = "mx-auto mb-3 w-full opacity-70 hover:opacity-100"
                    alt = "" /> <span className = "text-xl" > Chronograph watch </span></div >
                    </Link>

                    <Link to = "calc"
                    smooth = { true }
                    duration = { 1000 }
                    offset = {-120 } >

                    <div className = "p-3 "
                    onClick = {
                        () => {
                            setTypeName("smart");
                            completeFormStep();
                        }
                    } > < img src = { smart }
                    className = "mx-auto mb-3 w-full opacity-70 hover:opacity-100"
                    alt = "" /> < span className = "text-xl" > Smart watch </span></div >
                    </Link>

                    </div> 
                    </div > 
                    </div> 
                    </section> )
            }

            {
                formStep >= 1 && ( <section className = { formStep === 1 ? "block" : "hidden" }>
                    <div className = "mx-auto my-20 sm:w-2/3 2xl:w-1/3" >

                    <div className = "text-center " >
                    <div className = "mt-52" >
                    <h1 className = "md:text-5xl text-2xl font-bold mb-3 mx-5" > <span className = "text-blueish" > 1. </span>Give us your wrist circumference</h1>
                    <Link to = "help"
                    smooth = { true }
                    duration = { 1000 }
                    offset = {-150 } > <span className = "text-grayish_dark hover:text-black text-xl cursor-pointer" > How to measure? </span></Link >
                    </div> 
                    <div className = " relative rounded-full shadow-sm mt-12 mx-5" >
                    <input type = "text"
                    name = "circ"
                    id = "circ"
                    className = " block w-full py-3 pl-5 pr-28 sm:text-xl border-gray-300 rounded-full focus:outline-none"
                    placeholder = "00.0" {...register("circ", {
                            required: "This is required.",
                            pattern: {
                                value: /^\d+\.?\d{0,2}$/,
                                message: "This input is number only and up to two decimal places (eg. 18.25)"
                            },
                            maxLength: {
                                value: 10,
                                message: "10 characters max."
                            }
                        })
                    }
                    /> <div className = "absolute inset-y-0 right-5 rounded-full flex items-center"> <label
                    for = "circ"
                    className = "sr-only" > </label><select id="unit" name="unit" {...register("c_unit", {})
                }
                className = " h-full py-0 pl-2 pr-2 border-transparent bg-transparent text-gray-500 text-sm sm:text-xl rounded-md" >
                    <option > cm </option> <option > mm </option> <option > inch </option> </select > </div >

                </div> <ErrorMessage errors = { formState.errors }
                name = "circ"
                render = {
                    ({ message }) => < p className = "text-red-600 mt-2 text-sm w-5/6 text-left ml-10" > { message } </p>} />

                    </div> <
                    div className = "text-center mx-10" >
                    <Link to = "calc"
                    smooth = { true }
                    duration = { 1000 }
                    offset = {-250 } >

                    <button
                    onClick = { unCompleteFormStep }
                    className = "mt-12 mb-40  py-2 mr-3 rounded hover:text-black text-grayish text-xl" > 
                    <svg className = "w-6 inline h-6"
                    fill = "none"
                    stroke = "currentColor"
                    viewBox = "0 0 24 24"
                    xmlns = "http://www.w3.org/2000/svg" > 
                    <path stroke-linecap = "round"
                    stroke-linejoin = "round"
                    stroke-width = "2"
                    d = "M15 19l-7-7 7-7" > </path></svg > Back </button> </Link> 
                    <Link to = "calc"
                    smooth = { true }
                    duration = { 1000 }
                    offset = {-250 } >
                    <button
                    disabled = {!formState.isValid }
                    onClick = { completeFormStep }
                    className = "disabled:opacity-50 ml-3 disabled:bg-blueish mt-12  px-4 py-2 bg-blueish rounded hover:bg-blueish_dark text-grayish text-xl" > Next </button> </Link > </div> </div >

                    </section>)}

                    {
                        formStep >= 2 && ( <section className = { formStep === 2 ? "block" : "hidden" } >
                            <div className = "mx-auto my-20 sm:w-2/3 2xl:w-1/3" >

                            <div className = "text-center " >
                            <div className = "mt-52" >
                            <h1 className = "md:text-5xl text-2xl font-bold mb-3 mx-5" > <span className = "text-blueish" > 2. </span>Give us your wrist width</h1 >
                            <Link to = "help2"
                            smooth = { true }
                            duration = { 1000 }
                            offset = {-150 } > < span className = "text-grayish_dark hover:text-black text-xl cursor-pointer" > How to measure? </span></Link >
                            </div> <div className = " relative rounded-full shadow-sm mt-12 mx-5" >
                            <input type = "text"
                            name = "width"
                            id = "width"
                            className = " block w-full py-3 pl-5 pr-28 sm:text-xl border-gray-300 rounded-full focus:outline-none"
                            placeholder = "00.0"

                            {...register("width", {
                                    required: "This is required.",
                                    pattern: {
                                        value: /^\d+\.?\d{0,2}$/,
                                        message: "This input is number only and up to two decimal places (eg. 12.44)"
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: "10 characters max."
                                    }
                                })
                            }
                            /> <div className = "absolute inset-y-0 right-5 rounded-full flex items-center" > <label
                            for = "width"
                            className = "sr-only" > </label><select id="unit" name="unit" {...register("w_unit", {})
                        }
                        className = " h-full py-0 pl-2 pr-2 border-transparent bg-transparent text-gray-500 text-sm sm:text-xl rounded-md" >
                            <option > cm </option> <option > mm </option> <option> inch </option> </select > </div >

                        </div> 
                        <ErrorMessage errors = { formState.errors }
                        name = "width"
                        render = {
                            ({ message }) => <p className = "text-red-600 mt-2 text-sm w-5/6 text-left ml-10" > { message } </p>} />
                            <div className = "text-center mx-10" >
                            <Link to = "calc"
                            smooth = { true }
                            duration = { 1000 }
                            offset = {-250 } >

                            <button
                            onClick = { unCompleteFormStep }
                            className = "mt-12 mb-40 py-2  rounded -backdrop-hue-rotate-15 mr-3 text-grayish hover:text-black text-xl" > < svg className = "w-6 inline h-6"
                            fill = "none"
                            stroke = "currentColor"
                            viewBox = "0 0 24 24"
                            xmlns = "http://www.w3.org/2000/svg" > < path stroke-linecap = "round"
                            stroke-linejoin = "round"
                            stroke-width = "2"
                            d = "M15 19l-7-7 7-7" > </path></svg > Back </button> 
                            </Link > 
                            <Link to = "calc"
                            smooth = { true }
                            duration = { 1000 }
                            offset = {-250 } >
                            <button
                            onClick = {
                                () => {
                                    completeFormStep();
                                    submitForm(watch(), typeName);
                                    console.log(finalForm, watch())
                                }
                            }
                            disabled = {!formState.isValid }
                            className = "disabled:opacity-50 ml-3 disabled:bg-blueish mt-12  px-4 py-2 bg-blueish rounded hover:bg-blueish_dark text-grayish text-xl" > Next 
                            </button>
                            </Link > 
                            </div> 
                            </div >
                            </div> 
                            </section > )
                    }

                    {
                        formStep === 3 && (Loading ? (

                                (typeName === "smart" ?
                                    ( < section >
                                        <div className = "mx-auto py-20 w-5/6 sm:w-1/2 2xl:w-1/3" >
                                        <div className = "text-center mt-20" >
                                        <h1 className = "md:text-5xl text-2xl font-bold mb-3" > Optimal size for you. </h1> 
                                        <span className = "text-grayish_dark text-md md:text-xl" > Using our standardized metrics, we have determined your watch fit. </span> 
                                        <div className = "mt-20" >
                                        <span className = "md:text-4xl text-3xl font-bold mb-5" > Top to bottom: </span> 
                                        <div className = "flex flex-col md:flex-row justify-center items-center flex-nowrap mt-10 md:mt-5 " >
                                        <img className = "h-20 md:mr-10"
                                        src = { lug }
                                        alt = "" />


                                        <p className = "mt-10 md:mt-0" > < span className = "text-4xl md:text-5xl font-bold text-blueish " > { finalForm.calculated_smart }
                                        mm </span><span className="text-4xl md:text-5xl font-bold text-green-700 ">&#177;{finalForm.plusminus_smart}mm</span >
                                        </p> 
                                        </div> 
                                        <p className = "text-justify mt-12 text-md sm:text-xl" >
                                        The distance between the top and the bottom of the watch (including the bars where the strap is attached) is a metric you can not and should not buy a watch without. Too long top to bottom distance can make your watch overhang from the top of your wrist seeming disproportionate, and as we all know only Ben10 can pull that off. We suggest you read the watch specifications carefully and stay within the proposed range. </p>
                                        </div>
                                        <Link to = "calc"
                                        smooth = { true }
                                        duration = { 1000 }
                                        offset = {-40 } >
                                        <button onClick = {
                                            () => {
                                                setFormStep(0);
                                                setFinalForm(null);
                                                setLoading(false);
                                            }
                                        }
                                        className = " mt-20 px-4 py-2 bg-blueish rounded hover:bg-blueish_dark text-grayish text-xl" >Re-calculate</button></Link >
                                        </div> 
                                        </div >

                                        </section>) : (<section> 
                                        <div className = "mx-auto py-20 w-5/6 sm:w-1/2 2xl:w-1/3" >
                                        <div className = "text-center mt-20" >
                                        <h1 className = "md:text-5xl text-2xl font-bold mb-3" > Optimal size for you. </h1> 
                                        <span className = "text-grayish_dark text-md md:text-xl" > Using our standardized metrics, we have determined your watch fit. </span> 
                                        <div className = "mt-20" >
                                        <span className = "md:text-4xl text-3xl font-bold mb-5" > Diameter: </span>
                                        <div className = "flex flex-col md:flex-row justify-center items-center flex-nowrap mt-10 md:mt-5 " >
                                        <img className = "h-20 md:mr-10"
                                        src = { dia }
                                        alt = "" />

                                        <p className = "mt-10 md:mt-0" >
                                        <span className = "text-4xl md:text-5xl font-bold text-blueish " > { finalForm.calculated_diameter }
                                        mm </span><span className="text-4xl md:text-5xl font-bold text-green-700 ">&#177;{finalForm.plusminus_diameter}mm</span >
                                        </p> 
                                        </div > 
                                        <p className = "text-justify mt-12 text-md sm:text-xl" >
                                        The most important watch metric is the diameter. This is the distance stretching from one end of the watch face to the other (excluding the crown or chronograph pushers).This is the standardized way of measuring watch size and every watch you will come across should have its diameter listed. An easy way to be sure in your watch purchase is to ask the salesman for watches in this diameter or Google search for watches in this diameter. 
                                        </p>
                                        </div> 
                                        <div className = "mt-20" >
                                        <span className = "md:text-4xl text-3xl font-bold mb-5" > Lug-to-lug distance: 
                                        </span> 
                                        <div className = "flex flex-col md:flex-row justify-center items-center flex-nowrap mt-10 md:mt-5 " >
                                        <img className = "h-20 md:mr-10"
                                        src = { lug }
                                        alt = "" />


                                        <p className = "mt-10 md:mt-0" > < span className = "text-4xl md:text-5xl font-bold text-blueish " > { finalForm.calculated_lug_to_lug }
                                        mm </span><span className="text-4xl md:text-5xl font-bold text-green-700 ">&#177;{finalForm.plusminus_lug_to_lug}mm</span >
                                        </p>
                                        </div>
                                        <p className = "text-justify mt-12 text-md sm:text-xl" >
                                        The distance between the top and the bottom of the watch (including the bars where the strap is attached) is a metric you can not and should not buy a watch without. Too long lug-to-lug can make your watch overhang from the top of your wrist seeming disproportionate, and as we all know only Ben10 can pull that off. Smaller lug-to-lug is truly not that bad if the diameter is correct. In any case, we suggest you read the watch specifications carefully and stay within the proposed range. </p>
                                        </div>
                                        <FeedbackBlock />
                                        <Link to = "calc"
                                        smooth = { true }
                                        duration = { 1000 }
                                        offset = {-40 } >
                                        <button onClick = {
                                            () => {
                                                setFormStep(0);
                                                setFinalForm(null);
                                                setLoading(false);
                                            }
                                        }
                                        className = " mt-20 px-4 py-2 bg-blueish rounded hover:bg-blueish_dark text-grayish text-xl" > Re-calculate </button></Link >
                                        </div> </div >

                                        </section>) 
                                    )



                                ): ( <section className = "mt-32 mb-28" >
                                    <div className = "clock-loader mx-auto" > </div> 
                                    <div className = "w-full text-center text-4xl tracking-widest mt-5 mb-10" > Loading </div> 
                                    </section >
                                )
                            )
                        }

                        </div >
                    )
                }

                function HelpOne() {
                    return ( <div id = "help" >
                        <div className = "text-center" >
                        <div className = " mx-auto text-left mt-28 mb-2 w-5/6 items-center border-b-4 border-b-blueish " >
                        <span className = "text-2xl font-bold" > WRIST CIRCUMFERENCE? </span> </div > 
                        <h1 className = "mx-auto mt-8 mb-5 text-lg w-5/6" > Understand your wrist circumference in 3 easy steps. </h1> 
                        <div className = "grid grid-flow-col justify-between grid-cols-1 grid-rows-3 lg:grid-cols-3 lg:grid-rows-1 gap-4 w-5/6 mx-auto auto-rows-max" >

                        <div className = "mx-auto text-justify text-md " >
                        <img src = {_1}
                        className = "mx-auto"
                        alt = "" />
                        <p className = "m-5 my-8" >
                        Download the wrist mesuring tool we have created for you and save it localy to your computer. Print the document in A4 format without any borders or additional print decoration 
                        </p> 
                        </div >

                        <div className = "mx-auto text-justify text-md " >
                        <img src = {_2}
                        className = "mx-auto"
                        alt = "" />
                        <p className = "m-5 my-8" >
                        Cut out the <span className = " text-blueish " > C.TOOL </span> correctly and evenly. Make sure to cut the hole in the center which alows the tool to go through itself. Keep this tool for later use. 
                        </p> </div >

                        <div className = "mx-auto text-justify text-md " >
                        <img src = {_3}
                        className = "mx-auto "
                        alt = "" />
                        <p className = "m-5 my-8" >
                        Place the tool on the top of your wrist and wrap the long end around your wrist. Lead the long end through the cut-out hole. Congradulations, your wrist circumference is indicated on the top. </p> 
                        </div > 
                        </div> 
                        <button onClick = {
                            () => {
                                window.open("/SWEEPING.TOOL.pdf", "_blank");
                                logEvent(analytics, 'download_sweeping.tool_1', 'help1_free_sweeping_tool');
                            }
                        }
                        className = "px-4 py-3 bg-blueish rounded hover:bg-blueish_dark text-grayish" > FREE SWEEPING.TOOL </button>

                        </div> 
                        </div >
                    )
                }

                function HelpTwo() {
                    return ( <div id = "help2" >

                        <div className = "text-center" >
                        <div className = " mx-auto mt-28 mb-2 w-5/6 items-center border-b-4 border-b-blueish text-left" >
                        <span className = "text-2xl font-bold" > WRIST WIDTH? </span> 
                        </div > 
                        <h1 className = "mx-auto mt-8 mb-5 text-lg w-5/6" > Understand your wrist width in 3 easy steps. </h1> 
                        <div className = "grid grid-flow-col justify-between grid-cols-1 grid-rows-3 lg:grid-cols-3 lg:grid-rows-1 gap-4 w-5/6 mx-auto auto-rows-max" >

                        <div className = "mx-auto text-justify text-md " >
                        <img src = {_1}
                        className = "mx-auto "
                        alt = "" />
                        <p className = "m-5 my-8" >
                        Download the wrist mesuring tool we have created for you and save it localy to your computer. Print the document in A4 format without any borders or additional print decoration 
                        </p> 
                        </div >

                        <div className = "mx-auto text-justify text-md " >
                        <img src = {_5}
                        className = "mx-auto "
                        alt = "" />
                        <p className = "m-5 my-8" >
                        Place the paper on a flat surface and observe it from above. Place your wrist flat on the paper perpendiclar to the < span className = " text-blueish " > W.TOOL </span> starting at 0 centimeters or inches. Make sure you can see the number 0 and it is not covered. 
                        </p > 
                        </div>

                        <div className = "mx-auto text-justify text-md " >
                        <img src = {_6}
                        className = "mx-auto "
                        alt = "" />
                        <p className = "m-5 my-8" >
                        Notice the two numbers numbers indicated above and below your wrist. Make sure to mark them with a pen. Remove your wrist from the paper and subtract the higher number from the lower number. This is your wrist width. </p> </div >

                        </div>

                        <button onClick = {
                            () => {
                                window.open("/SWEEPING.TOOL.pdf", "_blank");
                                logEvent(analytics, 'download_sweeping.tool_2', 'help2_free_sweeping_tool');
                            }
                        }
                        className = "px-4 py-3 bg-blueish rounded hover:bg-blueish_dark text-grayish" > FREE SWEEPING.TOOL </button>
                        </div > 
                        </div>

                    )
                }

                function Important() {
                    return ( <div id = "important" >
                        <div className = "mt-32 w-5/6 mx-auto" >
                        <h1 className = "text-center text-3xl font-bold" >
                        IMPORTANT </h1> <div className = "my-20 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl" >
                        <div className = "md:flex" >
                        <div className = "md:flex-shrink-0" >
                        <img className = "h-full w-full object-cover md:w-48"
                        src = { gears }
                        alt = "Watch gears" />
                        </div> 
                        <div className = "p-8" >
                        <div className = "uppercase tracking-wide text-sm text-blueishd font-semibold" > Movement type </div> 
                        <p href = "#"
                        className = "block mt-1 text-lg leading-tight font-medium text-black" > Chemical or mechanical energy? </p> 
                        <p className = "mt-2 text-gray-500" > Most watches you will see nowadays are batery powered (Quartz watches). There are also mechanical watches which are powered by human interaction. 
                        <a href = "https://www.brinkersjewelers.com/blog/mechanical-automatic-quartz-understanding-type-watch-movement/"
                        className = " underline hover:text-black text-blueish " > Great article </a></p >
                        </div> 
                        </div > 
                        </div> 
                        <div className = "my-20 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl" >
                        <div className = "md:flex" >
                        <div className = "md:flex-shrink-0" >
                        <img className = "h-full w-full object-cover md:w-48"
                        src = { splash }
                        alt = "Water dropplet" />
                        </div> 
                        <div className = "p-8" >
                        <div className = "uppercase tracking-wide text-sm text-blueishd font-semibold" > Water resistance </div> 
                        <p href = "#"
                        className = "block mt-1 text-lg leading-tight font-medium text-black " > Swimming with a 30 meters water resistant watch? </p> 
                        <p className = "mt-2 text-gray-500" > Never, because watches are tested at static conditions and therefore the displayed water resistance has little real world implications. <a href = "https://thewatchmaker.com/water-resistance-101/"
                        className = " underline hover:text-black text-blueish " > See table </a></p >
                        </div> 
                        </div > 
                        </div>

                        <div className = "my-20 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl" >
                        <div className = "md:flex" >
                        <div className = "md:flex-shrink-0" >
                        <img className = "h-full w-full object-cover md:w-48"
                        src = { magnet }
                        alt = "Magnetic field" />
                        </div> 
                        <div className = "p-8" >
                        <div className = "uppercase tracking-wide text-sm text-blueishd font-semibold" > Magnetism </div> 
                        <p href = "#"
                        className = "block mt-1 text-lg leading-tight font-medium text-black" > Silent killer of mechanical watches </p> 
                        <p className = "mt-2 text-gray-500" > Mechanical watches often start telling inaccurate time when left near a magnetic field (smartphones, computers, etc..). For batery watches this does not apply. </p> </div > 
                        </div> 
                        </div > 
                        </div>
                        </div >
                    )
                }

                function About() {
                    return ( <div id = "about" >
                        <div className = "lg:w-3/5 2xl:w-2/3 w-5/6 mx-auto mt-32" >
                        <h1 className = "text-center text-3xl font-bold mb-10" > ABOUT OUR CALCULATOR </h1> 
                        <p className = "text-xl text-black opacity-50 text-justify mb-8" >
                        If in need of a shirt, you will already have the size you need in mind. With wristwatches, it is the same story. Stylistically correct watch size has a little to do with personal preference, and more to do with your body type, like any other fashion accessory. Ensuring perfect fit is important when it comes to highlighting your individuality and personal style. So, we suggest you try to stay within the presented boundaries, but in case the watch you truly want is not within these boundaries, we say go for it. 
                        </p>
                        <p className = "text-xl text-black opacity-50 text-justify mb-8" >
                        Metrics are derived from measurements taken from well-known watch manufacturers such as Rolex, Omega, Seiko, and many others. These were examined and compiled with several adjustments to ensure the correct calculation and the best possible fit. We also present you with a lug-to-lug distance which is, in our opinion, the most accurate and the most overlooked watch size metric. These were compiled in an easy-to-operate calculator with the inclusion of our printable measurement guides which are yours to keep. </p>
                        <p className = "text-xl text-black opacity-50  text-justify" >
                        We are trying to create a new movement of conscious watch buyers that understand what watches fit their wrist and their lifestyle. By doing so, we inspire them to buy the best watches and be confident in wearing them. 
                        </p>


                        </div> 
                        </div >
                    )
                }

                function Footer() {
                    return ( <div className = "bg-blueish_dark py-20" >
                        <div className = "text-center mt-2 text-lightish" >
                        <img className = "h-7 mx-auto"
                        src = { logow }
                        alt = "" />
                        <p className = "m-5" >
                        &copy; Copyright 2021, Sweeping Seconds.All Rights Reserved </p> 
                        <button onClick = {
                            () => scroll.scrollToTop()
                        }
                        className = "px-4 py-2 text-grayish border-2 border-grayish rounded hover:border-grayish-dark">Home</button>

                        </div>


                        </div>

                    )
                }

                export default App;