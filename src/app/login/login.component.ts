import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from '../dashboard.service';
import { AdapptAuthServiceService } from '../adappt-auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  show: boolean; 
  constructor(private router: Router, private formBuilder: FormBuilder,public snackBar: MatSnackBar, private loginService : DashboardService, private adapptAuth: AdapptAuthServiceService) { 
    this.loginFormGroup = this.formBuilder.group({
      email: ["", Validators.required],
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
    this.show = false;
  }
  otherTheme;
   
  ngOnInit() {
    
  }

  get loginForm() {
    return this.loginFormGroup.controls;
  }

  login() {
    if (this.loginFormGroup.invalid) {
      let snackBarRef = this.snackBar.open(
        ' Login is invalid'
      );
    } else {
      console.log( this.loginFormGroup.value);  
      this.loginService.getauthUser(this.loginFormGroup.value).subscribe( data => {
        if(data.myToken){
          this.adapptAuth.saveSession(data);
          this.router.navigate(['/']);
        } else {
          let snackBarRef = this.snackBar.open(
            ' Login is invalid',"Close",
            {
              verticalPosition: "top",
              horizontalPosition:"right"
            }
          );
        }
      })
    }
  }

}
