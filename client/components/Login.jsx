import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Login(props) {
    const { saveToken } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const verifyUser = searchParams.get('verifyId');

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    useEffect(() => {
        saveToken("");
        if (verifyUser) {
            axios.post("http://localhost:8080/verify", {
                verifyId : verifyUser
            })
                .then(res => {
                    console.log(res);
                    alert(res.data + " Please log in.");
                })
                .catch(e => {
                    if (e.status == 404) {
                        alert(e.response.data);
                    }
                    else {
                        alert("Something went wrong verifying a user.  Please try again later.");
                    }
                    console.log(e);
                })
        }
    }, [])

    function submit(e) {
        e.preventDefault();
        if (!email || !password) {
            alert("Please enter an email and password!");
            return;
        }
        axios.post("http://localhost:8080/login", {
            email: email,
            password: password
        })
            .then((res) => {
                saveToken(res.data);
                alert("Successfully logged in!");
                navigate("./home");
        })
        .catch((e) => {
            console.log("this is the error " + e);
            if (e.status == 404) {
                alert("Incorrect email and password.");
            }
            else if(e.status == 401) {
                alert("Please verify before trying to log in.");
            }
            else {
                alert("Something went wrong.  Please try again later.");
            }
            console.log(e);
        })

    }

    return (
        <div>
            <div>
                <nav class="navbar fixed-top navbar-light bg-light justify-content-center p-3 mb-2 bg-primary text-white">
                    <a class="navbar-brand" style={{ padding: 10 }} href="#">Welcome to Luka's Travel Search!</a>
                </nav>
            </div>
            <div className="login template d-flex justify-content-center align-items-center 100-w 100-vh bg primary" >
                <div style={{ paddingTop: 200 }}>
                    <h1 class="text-center">Login</h1>
                    <form action="POST">

                        <div data-mdb-input-init class="form-outline mb-4">
                            <input type="email" id="form2Example1" onChange={(e) => { setEmail(e.target.value) }} class="form-control" />
                            <label class="form-label" for="form2Example1">Email address</label>
                        </div>


                        <div data-mdb-input-init class="form-outline mb-4">
                            <input type="password" id="form2Example2" onChange={(e) => { setPassword(e.target.value) }} class="form-control" />
                            <label class="form-label" for="form2Example2">Password</label>
                        </div>


                        <div class="row mb-4">
                            <div class="col d-flex justify-content-center">

                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="form2Example31" />
                                    <label class="form-check-label" for="form2Example31"> Remember me </label>
                                </div>
                            </div>

                        </div>

                        <div class=" d-flex justify-content-center align-items-center">
                            <   button type="submit" onClick={submit} data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-block mb-4">Sign in</button>
                        </div>
                        <div class="text-center">

                            <a href="#">Forgot password?</a>
                        </div>
                        <div class="text-center">
                            <p>Not a member? <a href="./register">Register</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;