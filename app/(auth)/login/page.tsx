import {Suspense} from "react";
import LoginForm from "@/_components/loginForm";

export default function Login() {
    return <Suspense><LoginForm registerHref="/register"/></Suspense>;
}
