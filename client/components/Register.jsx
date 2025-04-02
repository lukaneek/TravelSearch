import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    function submit(e) {
        e.preventDefault();

        axios.post("http://localhost:8080/register", {
            email: email,
            password: password,
            confirm: confirmPassword
        })
        .then((res) => {
            console.log(res);
            alert("A verification email has been sent to " + email);
            navigate("/");
        })
        .catch((e) => {
            if (e.status == 422) {
                const messages = e.response.data.details.map((error, index) => {
                    return error + "\n";
                })
                alert(messages);
            }
            else if (e.status == 502) {
                alert("An error occured while sending a verification email.  Please try again later.");
            }
            else {
                alert("Couldn't register this user.");
            }
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
                    <h1 class="text-center">Register</h1>
                    <form action="POST">

                        <div data-mdb-input-init class="form-outline mb-4">
                            <input type="email" id="form2Example1" onChange={(e) => { setEmail(e.target.value) }} class="form-control" />
                            <label class="form-label" for="form2Example1">Email address</label>
                        </div>

                        <div data-mdb-input-init class="form-outline mb-4">
                            <input type="password" id="form2Example2" onChange={(e) => { setPassword(e.target.value) }} class="form-control" />
                            <label class="form-label" for="form2Example2">Password</label>
                        </div>

                        <div data-mdb-input-init class="form-outline mb-4">
                            <input type="password" id="form2Example2" onChange={(e) => { setConfirmPassword(e.target.value) }} class="form-control" />
                            <label class="form-label" for="form2Example2">Confirm Password</label>
                        </div>

                        <div class=" d-flex justify-content-center align-items-center">
                            <   button type="submit" onClick={submit} data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-block mb-4">Sign in</button>
                        </div>

                        <div class="text-center">
                            <p>Already a member? <a href="./login">Login</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;