import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";
import { Profanity } from "@2toad/profanity";


interface SignupType {
    email: string;
    password: string;
    password_confirm: string;
    username: string;
}

const SignupPage = () => {
    const methods = useForm<SignupType>({ mode: "onBlur" });
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const profanity = new Profanity()


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;

    const { signUp } = useAuth();
    const router = useRouter();

    const onSubmit = async (data: SignupType) => {

        try {
            if (data.password != data.password_confirm) {
                throw { code: 'password/no-match' };
            }
            if (profanity.censor(data.username) != data.username) {
                throw { code: 'username/profanity-warning' };
            }
            await signUp(data.email, data.password, data.username);
            router.push("/accountpage");
        } catch (error: any) {
            if (error.code == "auth/email-already-in-use") { setAlertMessage("A user with this email already exists. Try to log in.") }
            else if (error.code == "auth/weak-password") { setAlertMessage("Password too weak. Strengthen it by increasing its length or complexity.") }
            else if (error.code == "password/no-match") { setAlertMessage("Both password fields must match!") }
            else if (error.code == "username/profanity-warning") { setAlertMessage("Warning! Profanity found in username.") }
            else { setAlertMessage(error.message) }
            setShowAlert(true)
        }
    };

    return (
        <div className="container w-1/3 mx-auto mt-12 sign-up-form">
            {showAlert && <Alert message={alertMessage} setShow={setShowAlert} />}
            <h2 className="px-12 mt-8 text-4xl font-semibold text-center text-white font-HindSiliguri">Sign Up</h2>
            <FormProvider {...methods}>
                <form action="" className="px-4 pb-12 mx-auto font-IBMPlexSans" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-8">
                        <div className="flex items-center justify-between">
                            <label htmlFor="" className="block mb-3 text-xl font-semibold text-white font-IBMPlexSans">
                                Username
                            </label>
                        </div>

                        <input
                            type="text"
                            {...register("username", { required: "Username is required" })}
                            className={`border border-solid  ring:0 focus:ring-0 focus:outline-none  text-normal py-3 h-12 px-6 text-lg w-full flex items-center`}
                        />
                        {errors.username && <p className="pt-1 pl-2 text-red-400">{errors.username.message}</p>}
                    </div>
                    <div className="mt-8">
                        <div className="flex items-center justify-between">
                            <label htmlFor="" className="block mb-3 text-xl font-semibold text-white font-IBMPlexSans">
                                Email
                            </label>
                        </div>

                        <input
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            className={`border border-solid  ring:0 focus:ring-0 focus:outline-none  text-normal py-3 h-12 px-6 text-lg w-full flex items-center`}
                        />
                        {errors.email && <p className="pt-1 pl-2 text-red-400">{errors.email.message}</p>}
                    </div>
                    <div className="mt-8">
                        <div className="flex items-center justify-between">
                            <label htmlFor="" className="block mb-3 text-xl font-semibold text-white font-IBMPlexSans">
                                Password
                            </label>
                        </div>

                        <input
                            type="password"
                            {...register("password", { required: "Password is required" })}
                            className={`border border-solid  ring:0 focus:ring-0 focus:outline-none   text-normal py-3 h-12 px-6 text-lg w-full flex items-center`}
                        />
                        {errors.password && <p className="pt-1 pl-2 text-red-400">{errors.password.message}</p>}
                    </div>
                    <div className="mt-8">
                        <div className="flex items-center justify-between">
                            <label htmlFor="" className="block mb-3 text-xl font-semibold text-white font-IBMPlexSans">
                                Confirm Password
                            </label>
                        </div>

                        <input
                            type="password"
                            {...register("password_confirm", {
                                required: "Verify your password",
                            })}
                            className={`border border-solid  ring:0 focus:ring-0 focus:outline-none  text-normal py-3 h-12 px-6 text-lg w-full flex items-center`}
                        />
                        {errors.password_confirm && (
                            <p className="pt-1 pl-2 text-red-400">{errors.password_confirm.message}</p>
                        )}
                    </div>
                    <div className="flex justify-center pt-8">
                        <button
                            type="submit"
                            className={`h-12 text-center w-2/3 bg-white text-black border-2  hover:shadow-lg hover:bg-purple-600 hover:text-white text-lg transition`}
                        >
                            <p className="p-0 m-0 font-normal capitalize font-IBMPlexSans">submit</p>
                        </button>
                    </div>
                </form>
            </FormProvider>
            <Link href='/login'><a className="underline">Already have an account? Login here!</a ></Link>
        </div>
    );
};

export default SignupPage;