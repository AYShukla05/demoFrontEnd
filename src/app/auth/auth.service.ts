import { HttpClient } from "@angular/common/http";
import {  ElementRef, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { SubscriptionService } from "../subscriptions/subscriptions.service";
import { ModalService } from "../_modal/modal.service";



@Injectable({
    providedIn: 'root'
  })
export class AuthService{
    token:string | null=localStorage.getItem('token');
    isLoggedIn:boolean = false;
    loggedProfile:any
    message = ''

    constructor(private http: HttpClient,
        private router: Router,
        private subscriptionService: SubscriptionService, 
        public modalService: ModalService
        ){

    }

    login(body:{'username':string, 'password':string}){
        this.http.post<{"access":string, "refresh":string}>('http://127.0.0.1:8000/api/token',body)
        .subscribe(
            token=>{
                this.token = token.access;
                console.log(token)
                localStorage.setItem('token',this.token)
                this.isLoggedIn=true
                setTimeout(()=>{
                    localStorage.removeItem('token');
                    localStorage.removeItem('Profile');
                    this.router.navigate(['login']);
                }, 86400000 )
                this.http.get('http://127.0.0.1:8000/api/profile')
                .subscribe(
                    {
                    next: 
                    response=>{
                        console.log("Response",response)
                        localStorage.setItem('Profile',JSON.stringify(response))
                        this.loggedProfile = response
                        console.log(this.router)
                        this.router.navigate(['/my-profile'])
                        this.subscriptionService.getSubscribedUsers().subscribe(
                            (users:any[]) => {
                                this.subscriptionService.subscribedUsers = users
                              }, error =>{
                                //   console.log(error)
                                this.handleError(error)
                            }
                        )
                        
                    },     // nextHandler
                    error: 
                    error => { 

                        // console.log("After logging in Error")
                        this.handleError(error)
                    },    // errorHandler 
                }
                )
            },error=>{
                // console.log("Wrong credentials")
                this.handleError(error)
            }
            // (error:{'status':number, 'statusText':string}) => { 
            //     console.log("Error") 
            //     console.log(error)
            //     if(error.status==401){ console.log("Unauthorized")}
            // } // errorHandler
        )
        
}

    autoLogin() {
        this.token = localStorage.getItem('token')
        this.isLoggedIn = this.token !== null?true:false
        // this.LoginChanged.emit(this.isLoggedIn)
        // console.log(this.LoginChanged)

        const temp = localStorage.getItem('Profile')
        if (temp!=null){
            this.loggedProfile = JSON.parse(temp)
            this.subscriptionService.getSubscribedUsers().subscribe(
                (users:any[]) => {
                    this.subscriptionService.subscribedUsers = users
                  }, error =>{
                    // console.log(error)
                    this.handleError(error)
                }
            )
        }
    }

    logout() {
        localStorage.removeItem('token');
        this.isLoggedIn = false;
        // this.LoginChanged.emit(this.isLoggedIn)
        // console.log(this.LoginChanged)
        this.token = null;
        localStorage.removeItem('Profile');
        this.router.navigate(['login']);
    }


    handleError(error:{'status':number, 'message':string, 'statusText':string, 'error':{'detail':string}}) {
        switch(error.status)
        {case 0:
          console.log("Server is Down")
          this.message=error.error.detail
          console.log(error.error.detail)

          //   console.log(error.this.message)
          break;
          case 401: 
          console.log("Unauthorized")
          this.message=error.error.detail
          console.log(error.error.detail)

          break
          case 403: 
          console.log("User does not have Permission. Login with proper credentials")
          this.message=error.error.detail

          console.log(error.error.detail)
          break
          case 404:
            console.log("URL not found")
            this.message=error.error.detail
            console.log(error.error.detail)

            break
            case 500: 
            console.log("Internal Server Error")
            this.message=error.statusText
            console.log(error.error.detail)

        }
        this.modalService.open('error')
        
      }
}