import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

interface LoginType {
    email: string;
    password: string;
}
const LoginPage = () => {
    const methods = useForm<LoginType>({ mode: "onBlur" });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;

    const { logIn } = useAuth();
    const router = useRouter();

    const onSubmit = async (data: LoginType) => {
        try {
            await logIn(data.email, data.password);
            router.push("/accountpage");
        } catch (error: any) {
            console.log(error.message);
        }
    };

    return (
        <div className="container w-1/3 mx-auto mt-12 sign-up-form ">
            <h2 className="px-12 mt-8 text-4xl font-semibold text-center text-white font-HindSiliguri">Log In</h2>
            <FormProvider {...methods}>
                <form action="" className="px-4 pb-12 mx-auto font-IBMPlexSans" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-8">
                        <div className="flex items-center justify-between">
                            <label htmlFor="" className="block mb-3 text-xl font-semibold text-white font-IBMPlexSans">
                                Email
                            </label>
                        </div>

                        <input
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            className={`border border-solid ring:0 focus:ring-0 focus:outline-none  text-normal py-3 h-12 px-6 text-lg w-full flex items-center`}
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
                            className={`border border-solid  ring:0 focus:ring-0 focus:outline-none  text-normal py-3 h-12 px-6 text-lg w-full flex items-center`}
                        />
                        {errors.password && <p className="pt-1 pl-2 text-red-400">{errors.password.message}</p>}
                    </div>

                    <div className="flex justify-center pt-8">
                        <button
                            type="submit"
                            className={`h-12 text-center w-2/3 bg-white text-black hover:text-white border-2 hover:shadow-lg hover:bg-purple-600 text-lg transition`}
                        >
                            <p className="font-normal capitalize font-IBMPlexSans">submit</p>
                        </button>
                    </div>
                </form>
            </FormProvider>
            <Link href='/signup'><a className="underline">Need an account? Sign up here!</a ></Link>
        </div >
    );
};

export default LoginPage;