import { Navigate } from "react-router-dom";

interface Props {
    children: React.ReactNode;
}

export default function AdminRoute({children}: Props){
    const user = JSON.parse(localStorage.getItem('user')|| 'null');

    if(!user){
        return <Navigate to={"/login"} />
    }

    if (user.role !== "admin"){
        return <Navigate to={"/"} />
    }

    return <>{children}</>
}