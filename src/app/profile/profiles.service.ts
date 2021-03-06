import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { SubscriptionService } from '../subscriptions/subscriptions.service';

import { Profile } from "./profile.model";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { backEndURL } from "../config";

@Injectable( {providedIn: 'root'})
export class ProfilesService{
    profiles: Profile[] = []
    constructor(private http: HttpClient,
        private router: Router,
        private subscriptionService:SubscriptionService,
        private authService:AuthService){}

    url = backEndURL


    getProfiles(){
        return this.http.get<Profile[]>(this.url+'profiles')
    }

    getProfile(id:string){
        let profile = this.profiles.filter(p => p.id == id)
        return profile[0]
    }

    getProfileAsync(id:string){
        return this.http.get<{"Profile":{'name':string,'id':string, 'email':string| undefined, 'username':string},"Posts": any[],"Comments":any[]}>(this.url+'profiles/'+id)
    }

    createProfile(profile:any, username:string, password:string){
        this.http.post(this.url+'create-profile',profile).subscribe(
            response => {
                this.router.navigate(['verify'],{queryParams:{"username":username, "password":password}, skipLocationChange:true})
                this.authService.login(
                    {"username":username, "password":password}
                    )
            }, error =>{
                this.authService.handleError(error)
            }
        )
    }


    updateProfile(id:string,profile:any){
    this.http.put(this.url+'update-profile/'+id,profile)
    .subscribe(
        res=>
        this.router.navigate(['profiles'])
    )
    }

    changePassword(password:string,body:any){
        body.append('password',password)
        this.http.put(this.url+'change-password', body).subscribe(
        )
    }

    
    deleteProfile(id:string){
        this.http.delete(this.url+'delete-profile/'+id).subscribe(
            ()=>{
                this.authService.logout()
            }, err => {
                this.authService.handleError(err)

            },
        )
        this.router.navigate(['login'])
    }

    resendVerification(id:string){
        this.http.get(this.url+'resend-mail/'+id).subscribe()
    }


    subscribeProfile(profileId:string){
        const profId = {'id':profileId}
        this.subscriptionService.getSubscribedUsers()
        // this.router.navigate(['profiles'])
        return this.http.post(this.url+'subscribe',profId)
    }

    getMyProfile(){
        return this.http.get<{"Profile":{'id':string, 'email':string| undefined, 'username':string, 'is_verified':boolean},"Posts": any[],"Comments":any[]}>(this.url + 'get-my-profile')
    }


}
