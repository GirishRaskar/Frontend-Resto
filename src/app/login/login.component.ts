import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone : false

})

export class LoginComponent implements OnInit 
{
  loginForm!: FormGroup;
  constructor(private formbuilder: FormBuilder, private _http:HttpClient, private _router:Router, private http : HttpClient ) { }

  ngOnInit(): void 
  {
    this.loginForm = this.formbuilder.group({
      email: [''],
      password: ['']
    });
  }

  // logIn() 
  // {
  //   console.log(this.loginForm.value);
  //         alert("Marvellous" + ' logged in successfully');
  //         this._router.navigate(['/restaurent']);
  //         this.loginForm.reset();    
  // }

  logIn() {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:5200/login', this.loginForm.value).subscribe(
        (response: any) => {
          alert(`${response.name} logged in successfully`);
          this._router.navigate(['/restaurent']);
          this.loginForm.reset();
        },
        (error) => {
          alert('Invalid credentials. Please try again.');
          console.error('Login error:', error);
        }
      );
    } else {
      alert('Please fill in all required fields.');
    }
  }
  
}
